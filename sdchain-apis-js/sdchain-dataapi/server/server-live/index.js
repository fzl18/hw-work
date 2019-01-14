const tools = require('../lib/tools/tools');
const LedgerModel = require('../lib/models/ledger');
const ErrorLedgerModel = require('../lib/models/error_ledger');
const TransactionModel = require('../lib/models/transaction');
const TxHourModel = require('../lib/models/tx_hour');
const OrderClinchModel = require('../lib/models/order_clinch');
const OrderTxModel = require('../lib/models/order_tx');
const request = require('../lib/tools/request');
const txUtil = require('./transaction');
const parseOrder = require('./order');
const notice = require('../lib/tools/notice');
const _ = require('lodash');
const moment = require('moment');
const Bignumber = require('bignumber.js');
const account = require('./account');

// 区块起始时间UTC：2000-01-01 00:00:00
const EPOCH_START = 946684800;
const monitor = {
    isLedgerError: false,
    ledgerEqualTime: 0,
    syncTime: 0,
    failLedgers: []
};
let errorTime = 0;
let accountTime = 0;
const subjects = {
    1: '节点请求异常',
    2: '节点响应异常',
    3: '节点区块高度增长异常'
};

class Server {
    constructor() {
    }

    async start() {
        gLog.info('Live sync ledger... ');
        if (gConfig.mailEnable) {
            monitor.syncTime = moment().unix();
            // this.loopNodes();
        }
        if(gConfig.tokenPers.tokens.length>0){
            this.syncTokenPers()
        }
        while (true) {
            let nowTime = new Date().getTime()
            try {
                await this.syncLedger()
            } catch (error) {

               if(nowTime-errorTime>gConfig.errorLogInterval){
                gLog.error(error)
               }
                errorTime = nowTime
            }
            if (!monitor.isLedgerError) {
                // 正常同间隔
                await tools.sleep(gConfig.ledgerInterval);
            } else {
                // 异常同步间隔
                await tools.sleep(gConfig.ledgerFailInterval);
            }
        }
    }

    /**
     * 同步节点数据
     * @returns {Promise<void>}
     */
    async loopNodes() {
        if (gConfig.nodes.length <= 0 || !gConfig.nodes) {
            return;
        }

        while (true) {
            gLog.info('syncNodes');
            await this.syncNodes();
            await tools.sleep(gConfig.nodeInterval);
        }
    }

    /**
     * 同步区块列表
     * @returns {Promise<void>}
     */
    async syncLedger() {
        tools.freshNodeServer();

        // validated校验
        const validatedInfo = await request.getLedgerValidated();
        if (validatedInfo.error === 1) {
            this.sendException(1, 'validated请求-' + validatedInfo.message);
            return;
        }
        const validatedData = validatedInfo.data;
        if (!(_.has(validatedData, 'result') && _.has(validatedData.result, 'status') &&
            validatedData.result.status === 'success')) {
            this.sendException(2, 'validated返回-' + validatedData.result.error);
            return;
        }
        const validatedLedger = Number(validatedData.result.ledger_index);

        // closed校验
        const closeInfo = await request.getLedgerClosed();
        if (closeInfo.error === 1) {
            this.sendException(1, 'closed请求-' + closeInfo.message);
            return;
        }
        const closeData = closeInfo.data;
        if (!(_.has(closeData, 'result') && _.has(closeData.result, 'status') &&
            closeData.result.status === 'success')) {
            this.sendException(2, 'closed返回-' + closeData.result.error);
            return;
        }
        const closedLedger = Number(closeData.result.ledger_index);

        // 查询数据库当前最大高度
        const ledgerInfo = await LedgerModel.aggregate([
            {$match: {sync_status: 1}},
            {$group: {_id: null, ledger:{$max: "$ledger_index"}}}
        ]);
        let dbLedger = 1;
        if (ledgerInfo.length > 0) {
            dbLedger = ledgerInfo[0].ledger;
        }

        if (dbLedger <= gConfig.ledger_index) {
            dbLedger = gConfig.ledger_index;
        }
        dbLedger = Number(dbLedger);

        if (validatedLedger <= dbLedger) {
            const curTime = moment().unix();
            // 节点增长异常判断
            if (monitor.ledgerEqualTime > 0) {
                const duration = curTime - monitor.ledgerEqualTime;
                if (duration >= gConfig.ledgerEqualDuration) {
                    monitor.ledgerEqualTime = 0;
                    const message = `同步区块[${validatedLedger}]，持续时间[${duration}]秒，高度尚未增长`;
                    this.sendException(3, message);
                }
            } else {
                monitor.ledgerEqualTime = curTime;
            }
            return;
        }
        monitor.ledgerEqualTime = 0;

        gLog.info('同步区块：', dbLedger, 'validated：', validatedLedger, 'closed：', closedLedger);

        for (let i = dbLedger; i <= validatedLedger; i++) {
            gLog.info('开始同步区块', i);
            await this.syncLedgerDetail(i, validatedLedger, closedLedger);
            await this.ledgerMonitor();
            gLog.info('完成同步区块', i);
        }
        monitor.isLedgerError = false;
    }

    /**
     * 同步指定区块数据
     * @param ledger
     * @returns {Promise<void>}
     */
    async syncLedgerDetail(ledger, validatedLedger = 0, closedLedger = 0) {
        // 重置数据
        await ErrorLedgerModel.deleteOne({
            ledger_index: ledger
        });
        await LedgerModel.deleteOne({
            ledger_index: ledger
        });
        await TransactionModel.deleteMany({
            ledger_index: ledger
        });

        const curTime = tools.getTime();
        const info = await request.getLedgerInfo(ledger);
        if (info.error === 1) {
            if (validatedLedger > 0) {
                this.sendException(1, '请求区块[' + ledger + ']-' + info.message);
            }
            return;
        }
        const infoData = info.data;
        // 区块不存在，通知底层同步数据
        if (_.has(infoData, 'result') && _.has(infoData.result, 'status') && _.has(infoData.result, 'error')) {
            gLog.warn('current:' + ledger, 'validated:' + validatedLedger, 'closed:' + closedLedger, infoData.result.error, 'do ledger_request');
            if (validatedLedger > 0) {
                this.sendException(2, '返回区块[' + ledger + ']-' + infoData.result.error);
            }
            await request.getLedgerRequest(ledger);
        }

        // 区块状态有误，记录错误
        if (!(_.has(infoData, 'result') && _.has(infoData.result, 'status') && _.has(infoData.result, 'validated') &&
            infoData.result.validated === true && infoData.result.status === 'success')) {
            await ErrorLedgerModel.update({
                ledger_index: ledger
            }, {
                ledger_index: ledger,
                ledger_hash: '',
                close_time: 0,
                sync_start_time: curTime,
                sync_status: -1,
                sync_end_time: 0
            }, {
                upsert: true
            });
            if (gConfig.mailEnable) {
                monitor.failLedgers.push(ledger);
            }
            return;
        }

        const infoRst = infoData.result;
        const closeTime = infoRst.ledger.close_time + EPOCH_START;
        const parentCloseTime = infoRst.ledger.parent_close_time + EPOCH_START;
        const saveRst = await LedgerModel.update({
            ledger_index: infoRst.ledger_index
        }, {
            ledger_index: infoRst.ledger_index,
            ledger_hash: infoRst.ledger_hash,
            close_time: closeTime,
            parent_ledger_index: infoRst.ledger_index-1,
            parent_ledger_hash: infoRst.ledger.parent_hash,
            parent_close_time: parentCloseTime,
            transaction_hash:infoRst.ledger.transaction_hash,
            sync_start_time: curTime,
            sync_status: 0,
            sync_end_time: 0
        }, {
            upsert: true
        });
        if (!saveRst) {
            gLog.error('区块：' + ledger + '数据保存失败');
            return;
        }

        // const lastLedger = await LedgerModel.findOne({
        //     ledger_index: ledger - 1
        // });
        // if (lastLedger) {
        //     if (closeTime - lastLedger.close_time >= gConfig.ledgerSecsDiff) {
        //         this.ledgerDiffMonitor(lastLedger.ledger_index, lastLedger.close_time, ledger, closeTime);
        //     }
        // }


        const transactions = infoRst.ledger.transactions;
        const transactionsRst = await this.syncTransactions(transactions, ledger, closeTime);
        if (transactionsRst === false) {
            gLog.error('区块：' + ledger + '交易数据保存失败');
            return;
        }

        const endTime = tools.getTime();
        const updateRst = await LedgerModel.update({
            ledger_index: infoRst.ledger_index
        }, {
            transactions_count: transactionsRst,
            sync_status: 1,
            sync_end_time: endTime
        });
        if (!updateRst) {
            gLog.error('区块：' + ledger + '数据更新失败');
            return;
        }

        // 统计交易数据
        await this.calTransactions(closeTime);
    }

    /**
     * 同步交易数据
     * @param transactions
     * @returns {Promise<void>}
     */
    async syncTransactions(transactions, ledger, closeTime) {
        let transactionsCount = 0;
        if (transactions.length <= 0) {
            return 0;
        }
        try {
            const bulkOps = [];
            const orderClinchs = [];
            const orderTxs = [];
            transactions.forEach(transaction => {
                const tx = txUtil.parseTransaction(transaction, ledger, closeTime);
                const txType = tx.type;
                let isOfferPair = false
                if (gConfig.exceptTypes.indexOf(txType) < 0) {
                    bulkOps.push({
                        updateOne: {
                            filter: {
                                ledger_index: tx.ledger_index,
                                hash: tx.hash
                            },
                            update: tx,
                            upsert: true
                        }
                    });
                }
                if (gConfig.orderTypes.indexOf(txType) != -1&&Array.isArray(tx.pairs)) {
                    if(gConfig.orderPairs.indexOf(tx.pairs[0]) != -1){
                        isOfferPair = true
                        transaction.pair = tx.pairs[0]
                    }
                    if(gConfig.orderPairs.indexOf(tx.pairs[1]) != -1){
                        isOfferPair = true
                        transaction.pair = tx.pairs[1]
                    }
                    const orderTx = parseOrder(transaction,ledger,closeTime,transaction.Account,transaction.Sequence);
                    if(isOfferPair){
                        orderTxs.push({
                            updateOne: {
                                filter: {
                                    _hash: orderTx._hash
                                },
                                update: orderTx,
                                upsert: true
                            }
                        });
                    }
                    
                }
                if (gConfig.orderClinchTypes.indexOf(txType) != -1) {
                    const _tx = tx.tx;
                    if(_tx.metaData&&Array.isArray(_tx.metaData.AffectedNodes)){
                        for (let i in _tx.metaData.AffectedNodes) {
                             let affectedNode = _tx.metaData.AffectedNodes[i];
                             let offer;
                             let order;
                             if (affectedNode.ModifiedNode && affectedNode.ModifiedNode.LedgerEntryType == 'Offer' && affectedNode.ModifiedNode.FinalFields) {
                                offer = this.countGetsPays(tx.hash,affectedNode,'ModifiedNode',ledger,tx.time);
                                if(affectedNode['ModifiedNode'].PreviousFields&&isOfferPair){
                                    order=parseOrder(transaction,ledger,closeTime,affectedNode['ModifiedNode'].FinalFields.Account,affectedNode['ModifiedNode'].FinalFields.Sequence);
                                }
                            }
                            if (affectedNode.DeletedNode && affectedNode.DeletedNode.LedgerEntryType == 'Offer' && affectedNode.DeletedNode.FinalFields) {
                                offer = this.countGetsPays(tx.hash,affectedNode,'DeletedNode',ledger,tx.time);
                                if(affectedNode['DeletedNode'].PreviousFields&&isOfferPair){
                                    order=parseOrder(transaction,ledger,closeTime,affectedNode['DeletedNode'].FinalFields.Account,affectedNode['DeletedNode'].FinalFields.Sequence);
                                }
                            }
                            if (offer&&offer.price){
                                offer.pair = transaction.pair 
                                orderClinchs.push({
                                    updateOne: {
                                        filter: {
                                            _hash: tx.hash
                                        },
                                        update: offer,
                                        upsert: true
                                    }
                                });
                            }
                            if (order){
                                orderTxs.push({
                                    updateOne: {
                                        filter: {
                                            _hash: order._hash
                                        },
                                        update: order,
                                        upsert: true
                                    }
                                });
                            }
                         }
                    }
                }
            });
            const promises = []
            if (bulkOps.length > 0) {
                promises.push(TransactionModel.bulkWrite(bulkOps))
                transactionsCount = bulkOps.length;
            }
            if (orderClinchs.length > 0) {
                promises.push( OrderClinchModel.bulkWrite(orderClinchs))
            }
            if(orderTxs.length>0){
                promises.push( OrderTxModel.bulkWrite(orderTxs))
            }
            if(promises.length>0){
                await Promise.all(promises);
            }
            
        } catch (e) {
            gLog.error(e);
            return false;
        }
        return transactionsCount;
    }

    /**
     * 统计交易条数
     * @param closeTime
     * @returns {Promise<void>}
     */
    async calTransactions(closeTime) {
        const date = moment.utc(closeTime * 1000);

        const yearFormat = date.format('YYYY-01-01T00:00:00Z');
        const monthFormat = date.format('YYYY-MM-01T00:00:00Z');
        const dayFormat = date.format('YYYY-MM-DDT00:00:00Z');
        const hourFormat = date.format('YYYY-MM-DDTHH:00:00Z');

        const yearTime = moment.utc(yearFormat).unix();
        const monthTime = moment.utc(monthFormat).unix();
        const dayTime = moment.utc(dayFormat).unix();
        const hourTime = moment.utc(hourFormat).unix();
        const endHour = hourTime + 3600;

        const count = await TransactionModel.count({
            time: {
                $gte: hourTime,
                $lt: endHour
            }
        });
        await TxHourModel.update({
            hour: hourTime
        }, {
            year: yearTime,
            month: monthTime,
            day: dayTime,
            hour: hourTime,
            tx_count: count
        }, {
            upsert: true
        });
    }

    /**
     * 处理节点数据
     * @returns {Promise<void>}
     */
    async syncNodes() {
        if (!gConfig.mailEnable) {
            return;
        }

        let minLedger = -1;
        let maxLedger = -1;
        let hasError = false;

        const results = [];
        const nodes = await request.requestAllNodes();
        nodes.forEach((node) => {
            let error = '';
            let ledger_index = '';
            if (_.has(node, 'result') && _.has(node.result, 'status') && node.result.status === 'success') {
                ledger_index = node.result.ledger_index;
                if (minLedger < 0) {
                    minLedger = ledger_index;
                } else if (minLedger > ledger_index) {
                    minLedger = ledger_index
                }

                if (maxLedger < 0) {
                    maxLedger = ledger_index;
                } else if (maxLedger < ledger_index) {
                    maxLedger = ledger_index;
                }
            }

            if (_.has(node, 'result') && _.has(node.result, 'status') && node.result.status === 'error') {
                hasError = true;
                error = node.result.error;
            }

            if (_.has(node, 'error')) {
                hasError = true;
                error = node.error;
            }

            results.push({
                address: node.nodeAddress,
                error: error,
                ledger_index: ledger_index
            });
        });

        if (maxLedger - minLedger >= gConfig.nodeLedgerDiff) {
            hasError = true;
        }

        if (!hasError) {
            return;
        }

        const subject = tools.mailSubject('节点状态异常');
        let content = '<div>当前区块同步具体情况如下：</div><div><table border="1px" style="color:#000;margin:0;font-size:14px;line-height:24px;font-family:\'微软雅黑\',Helvetica,Arial,sans-serif;text-align: left;margin:40px auto;border-collapse:collapse;">';
        content += '<tr><td>节点</td><td>区块高度</td><td>节点错误</td></tr>';
        results.forEach((result) => {
            const address = result.address;
            const ledger_index = result.ledger_index;
            const error = result.error;
            content += `<tr><td>${address}</td><td>${ledger_index}</td><td>${error}</td></tr>`;
        });
        content += '</table></div>';
        if (gConfig.mailList && gConfig.mailList.length > 0) {
            notice.mail(gConfig.mailList, subject, content);
        }
    }

    /**
     * 区块同步监控
     * @returns {Promise<void>}
     */
    async ledgerMonitor() {
        if (!gConfig.mailEnable) {
            return;
        }
        const lastTime = monitor.syncTime;
        const curTime = moment().unix();
        if (curTime - lastTime < 3600) {
            return;
        }
        monitor.syncTime = curTime;
        if (monitor.failLedgers.length <= 0) {
            return;
        }
        const startStr = moment(lastTime * 1000).format();
        const endStr = moment(curTime * 1000).format();
        const total = monitor.failLedgers.length;
        const ledgers = monitor.failLedgers.join('，');
        monitor.failLedgers = [];
        const subject = tools.mailSubject('Ledger同步异常');
        const content = `<div>时间从${startStr}至${endStr}累计同步失败区块${total}个。具体如下：</div><div>${ledgers}</div>`;
        if (gConfig.mailList && gConfig.mailList.length > 0) {
            notice.mail(gConfig.mailList, subject, content);
        }
    }

    /**
     * 相邻区块关闭时间差异
     * @param last
     * @param lastTime
     * @param cur
     * @param curTime
     * @returns {Promise<void>}
     */
    async ledgerDiffMonitor(last, lastTime, cur, curTime) {
        if (!gConfig.mailEnable) {
            return;
        }
        const lastStr = moment(lastTime * 1000).utc().format();
        const curStr = moment(curTime * 1000).utc().format();
        const diff = curTime - lastTime;
        const subject = tools.mailSubject('Ledger关闭时间异常');
        const content = `<div>区块${last}，关闭时间为：${lastStr}；区块${cur}，关闭时间为：${curStr}；相差${diff}秒。</div>`;
        if (gConfig.mailList && gConfig.mailList.length > 0) {
            notice.mail(gConfig.mailList, subject, content);
        }
    }

    /**
     * 发送异常通知
     * @param type
     * @param message
     * @returns {Promise<void>}
     */
    async sendException(type, message) {
        if (!gConfig.mailEnable) {
            return;
        }

        if (!_.has(subjects, type)) {
            return;
        }
        monitor.isLedgerError = true;
        const subject = tools.mailSubject(subjects[type]);
        const chainServer = gConfig.chainServer;
        const content = `<div>节点：${chainServer}</div><div>异常：${message}</div>`;
        if (gConfig.mailList && gConfig.mailList.length > 0) {
            notice.mail(gConfig.mailList, subject, content);
        }
    }

    countGetsPays(hash,affectedNode,node,cLedger,time) {
        const offerd = affectedNode[node].FinalFields
        const preOfferd = affectedNode[node].PreviousFields
        const offer = {
            _hash:hash+'|'+offerd.Account+'|'+offerd.Sequence,
            flags: offerd.Flags,
            type: offerd.Flags == 131072 ? 'sell' : 'buy',
            account: offerd.Account,
            sequence: offerd.Sequence,
            ledger:cLedger,
            time:time
        }
        const _takerGets = offerd.TakerGets;
        const _takerPays = offerd.TakerPays;
        if (preOfferd) {
            const preTakerGets = preOfferd.TakerGets;
            const preTakerPays = preOfferd.TakerPays;
            offer.takerGetsValue = typeof preTakerGets === 'object' ? new Bignumber(preTakerGets.value).minus(new Bignumber(_takerGets.value)) : (new Bignumber(preTakerGets).minus(new Bignumber(_takerGets)).dividedBy(gConfig.chainDrops))
            offer.takerGetsCurrency = typeof preTakerGets === 'object' ? preTakerGets.currency : gConfig.currency,
            offer.takerGetsIssuer = typeof preTakerGets === 'object' ? preTakerGets.issuer : ''
            offer.takerPaysValue = typeof preTakerPays === 'object' ? new Bignumber(preTakerPays.value).minus(new Bignumber(_takerPays.value)) : (new Bignumber(preTakerPays).minus(new Bignumber(_takerPays)).dividedBy(gConfig.chainDrops))
            offer.takerPaysCurrency = typeof preTakerPays === 'object' ? preTakerPays.currency : gConfig.currency,
            offer.takerPaysIssuer = typeof preTakerPays === 'object' ? preTakerPays.issuer : ''
            offer.price = offerd.Flags == 131072 ? new Bignumber(offer.takerPaysValue).dividedBy(new Bignumber(offer.takerGetsValue)) : new Bignumber(offer.takerGetsValue).dividedBy(new Bignumber(offer.takerPaysValue))
            offer.price= offer.price.toString();
        }
        return offer
    }

    async syncTokenPers(){
        while(true){
            await account.syncAllTokenPers();
            await tools.sleep(gConfig.tokenPers.interval);
        }
    }

    async syncTransactionTotal(){
        while(true){
            await txUtil.syncTransactionTotal();
            await tools.sleep(gConfig.tokenPers.interval);
        }
    }


}

module.exports = Server;