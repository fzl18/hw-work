'use strict';
const Router = require('koa-router');
const _ = require('lodash');
const request = require('../lib/tools/request');
const tools = require('../lib/tools/tools');
const moment = require('moment');
const transactionModel = require('../lib/models/transaction');
const errorLedgerModel = require('../lib/models/error_ledger');
const ledgerModel = require('../lib/models/ledger');
const txHourModel = require('../lib/models/tx_hour');
const OrderClinchModel = require('../lib/models/order_clinch');
const httpOrder = require('./order');
const OrderTxModel = require('../lib/models/order_tx');
const packageJSON = require('../../package');
const live = require('../server-live/');
const httpTransaction = require('./transaction');

class Routes {
    constructor() {
    }

    router() {
        const router = new Router();
        const syncServer = new live();

        /**
         * 根目录
         */
        router.get('/', async (ctx, next) => {
            const url = ctx.protocol + '://' + ctx.get('host') + '/v2';
            ctx.body = generateMap(url);
        });

        function generateMap(url) {
            return {
                'name': 'dataapi-js',
                'version': packageJSON.version,
                'endpoints': [
                    {
                        action: 'Get Account Balances',
                        route: '/v2/accounts/{:address}/balances',
                        example: url + '/accounts/' +
                        'bZH5pa1emVa3etgd3wzS3AwrZmykQh6q8/balances'
                    },
                    {
                        action: 'Get Account Payments',
                        route: '/v2/accounts/{:address}/payments',
                        example: url + '/accounts/' +
                        'bZH5pa1emVa3etgd3wzS3AwrZmykQh6q8/payments'
                    },
                    {
                        action: 'Get Account Transactions',
                        route: '/v2/accounts/{:address}/transactions',
                        example: url + '/accounts/' +
                        'bZH5pa1emVa3etgd3wzS3AwrZmykQh6q8/transactions'
                    },
                    {
                        action: 'Get Ledgers',
                        route: '/v2/ledgers/{:ledger_index}',
                        example: url + '/ledgers'
                    },
                    {
                        action: 'Get Payments',
                        route: '/v2/payments/{:currency}',
                        example: url + '/payments/' + gConfig.currency
                    },
                    {
                        action: 'Get Reports',
                        route: '/v2/reports',
                        example: url + '/payments'
                    },
                    {
                        action: 'Get Transaction',
                        route: '/v2/transactions/{:tx_hash}',
                        example: url + '/transactions/' +
                        '9A0AD2E3E54C2EFAA1743CE41679BAFFA6BC7F04EA52D9CCB8DCB02866E9A6AA'
                    },
                ]
            }
        }

        /**
         * 获取区块信息
         */
        router.get('/v2/ledgers/:ledger?', async (ctx, next) => {
            const params = ctx.params;
            let info;
            if (params.ledger === undefined) {
                info = await request.apiLedgerInfo();
            } else {
                info = await request.apiLedgerDetail(Number(params.ledger));
            }
            const rst = {
                result: 'error',
                ledger: {}
            };

            if (info.error === 1) {
                ctx.body = rst;
                return;
            }

            info = info.data;
            if (_.has(info, 'result') && _.has(info.result, 'status') &&
                info.result.status === 'success') {
                rst.result = 'success';
                rst.ledger = info.result.ledger;
                rst.ledger.close_time = tools.toTimestamp(rst.ledger.close_time);
                rst.ledger.parent_close_time = tools.toTimestamp(rst.ledger.parent_close_time);
            }
            ctx.body = rst;
        });

        /**
         * 获取交易信息
         */
        router.get('/v2/transactions/:hash?', async(ctx, next) => {
            const params = ctx.params;
            if (params.hash) {
                await transactionsInfo(ctx, params);
                return;
            }

            const querys = ctx.query;
            await transactionList(ctx, querys);
        });

        /**
         * 交易详情
         * @param ctx
         * @param hash
         * @returns {Promise<void>}
         */
        async function transactionsInfo(ctx, params) {
            const hexMatch = new RegExp('^(0x)?[0-9A-Fa-f]+$');
            if (!hexMatch.test(params.hash) ||
                params.hash.length % 2 !== 0) {
                ctx.body = {
                    result: 'error',
                    msg: 'invalid hash'
                };
                return;
            }

            const rst = {
                result: 'error'
            };
            const info = await transactionModel.findOne({
                hash: params.hash
            }, {
                tx: 1,
                time: 1,
                ledger_index: 1
            });
            if (info) {
                rst.result = 'success';
                info.tx.closeTime = info.time;
                info.tx.ledger_index = info.ledger_index
                rst.transaction = tools.formatTransaction(info.tx);
            }
            ctx.body = rst;
        }

        /**
         * 获取交易列表
         * @param ctx
         * @param querys
         * @returns {Promise<void>}
         */
        async function transactionList(ctx, querys) {
            const rst = {
                result: 'success',
                count: 0,
                total: 0
            };

            let limit = querys.limit || 10;
            let descending = querys.descending || 'true';
            let page = querys.page || 1;
            let type = querys.type || '';
            let start = querys.start || 0;
            let end = querys.end || 0;
            let result = querys.result || '';
            let marker = querys.marker || '';
            let address = querys.address || '';
            let currency = querys.currency || '';
            let issuer = querys.issuer || '';
            let ledger = querys.ledger || '';
            let rstKey = querys.rstKey || 'transactions';
            rst[rstKey] = [];
            limit = Number(limit);
            if (limit >= 1000) {
                limit = 1000;
            }

            if (start && start.indexOf('T') >= 0) {
                start = moment(start).unix();
            }
            if (end && end.indexOf('T') >= 0) {
                end = moment(end).unix();
            }
            start = Number(start);
            end = Number(end);

            page = Number(page);

            const filter = {};

            if (type.length > 0) {
                filter.type = {
                    $in: type.split(',')
                };
            }
            if (start > 0) {
                filter.time = {
                    $gte: start
                };
            }
            if (end > 0) {
                if (_.has(filter, 'time')) {
                    filter.time.$lt = end;
                } else {
                    filter.time = {
                        $lt: end
                    };
                }
            }
            if (result.length > 0) {
                filter.result = result;
            }
            if (ledger.length > 0) {
                const _filter = {}
                if(!isNaN(ledger)){
                }else{
                    _filter.ledger_hash = ledger
                    const info = await ledgerModel.findOne(_filter);
                    if(info){
                        ledger = info.ledger_index
                    }else{
                        ctx.body =  rst
                        return;
                    }
                }

                filter.ledger_index = ledger;
            }
            const filterAnd = [];
            if (currency.length > 0) {
                // filter.currency = currency
                filterAnd.push({$or : [{
                    currency: currency
                }, {
                    currencyP: currency
                }, {
                    currencyG: currency
                }, {
                    payees:{$elemMatch:{currency:currency}}
                }]});
            }
            if (issuer.length > 0) {
                filterAnd.push({$or : [{
                    issuer: issuer
                }, {
                    payees:{$elemMatch:{issuer:issuer}}
                }]});
            }
            if (address.length > 0) {
                filterAnd.push({$or : [{
                    account: address
                }, {
                    source: address
                }, {
                    destination: address
                }, {
                    issuer: address
                }, {
                    payees:{$elemMatch:{destination:address}}
                }, {
                    payees:{$elemMatch:{issuer:address}}
                }]});
            }
            if(filterAnd.length>0){
                filter.$and = filterAnd;
            }
            const  total = await transactionModel.count(filter);
        
            rst.total = total;
            if (total <= 0) {
                ctx.body = rst;
                return;
            }

            if (marker) {
                filter._id = descending=='true'?{
                    $lte: marker
                }:{
                    $gte: marker
                };
            }   

            let skip = (page - 1) * limit;
            if (skip <= 0) {
                skip = 0;
            }
            let sort = 1;
            if (descending === 'true') {
                sort = -1;
            }
            let lists = []
            try {
                lists = await transactionModel.find(filter, {time: 1, tx: 1, ledger_index: 1})
                    .skip(skip)
                    .limit(limit+1)
                    .sort({_id: sort})
                    .exec();
            } catch (error) {
                if(error.kind == 'ObjectId'&&error.path=='_id'){
                    throw new Error("Invalid marker:"+marker)
                }else{
                    throw new Error(error)
                }
            }
            if(lists.length == limit+1){
                rst.marker = lists[limit]._id;
            }
            lists.forEach((item,index) => {
                item.tx.closeTime = item.time;
                item.tx.ledger_index = item.ledger_index;
                if(index<limit){
                    if (rstKey === 'transactions') {
                        rst[rstKey].push(tools.formatTransaction(item.tx));
                    }
                    if (rstKey === 'payments') {
                        rst[rstKey].push(tools.formatPayment(item.tx));
                    }
                }
            });
            rst.count = rst[rstKey].length;

            // ctx.respond = false;
            // ctx.status = 200;
            // ctx.set('Content-Type', 'application/json; charset=utf-8');
            // const stringifyStream = bigJson.createStringifyStream({
            //     body: rst
            // });
            // stringifyStream.pipe(PassThrough()).pipe(ctx.res);
            ctx.body = rst;
        }

        /**
         * 获取账户资产余额
         */
        router.get('/v2/accounts/:account/balances', async (ctx, next) => {
            const rst = {
                result: 'error'
            };
            const params = ctx.params;
            if (_.isEmpty(params) || _.isEmpty(params.account)) {
                rst.message = 'invalid '+gConfig.chain+' address';
                ctx.body = rst;
                return;
            }

            const account = params.account;
            let accountInfo = await request.apiAccountInfo({account:account});
            accountInfo = accountInfo.data;
            if (!(_.has(accountInfo, 'result') && _.has(accountInfo.result, 'status') &&
                accountInfo.result.status === 'success')) {
                rst.message = 'invalid '+gConfig.chain+' address';
                ctx.body = rst;
                return;
            }
            rst.result = 'success';
            const balances = [];
            rst.ledger_index = accountInfo.result.ledger_current_index;
            const baseAmount = tools.parseAmount(accountInfo.result.account_data.Balance, true);
            balances.push({
                currency: baseAmount.currency,
                counterparty: baseAmount.issuer,
                value: baseAmount.value
            });
            let accountLines = await request.apiAccountLines({account:account});
            accountLines = accountLines.data;
            if (_.has(accountLines, 'result') && _.has(accountLines.result, 'status') &&
                accountLines.result.status === 'success') {
                const lines = accountLines.result.lines;
                lines.forEach((line) => {
                    balances.push({
                        currency: line.currency,
                        counterparty: line.account,
                        value: line.balance
                    });
                });
            }

            rst.balances = [];
            const querys = ctx.query;
            if (_.has(querys, 'currency') && _.has(querys, 'counterparty')) {
                const currency = querys.currency;
                const counterparty = querys.counterparty;
                balances.forEach((item) => {
                    if (currency === item.currency && counterparty === item.counterparty) {
                        rst.balances.push(item);
                    }
                });
            } else {
                rst.balances = balances;
            }

            ctx.body = rst;
        });

        /**
         * 获取交易类型为Payment的交易列表
         */
        router.get('/v2/payments/:currency?', async (ctx, next) => {
            const querys = ctx.query;
            const params = ctx.params;
            if (_.has(params, 'currency') && !_.isEmpty(params.currency)) {
                const currencyArr = params.currency.split('+');
                if (currencyArr.length === 1) {
                    querys.currency = currencyArr[0];
                }
                if (currencyArr.length === 2) {
                    querys.currency = currencyArr[0];
                    querys.issuer = currencyArr[1];
                }
            }
            querys.type = 'Payment';
            querys.rstKey = 'payments';

            await transactionList(ctx, querys);
        });

        /**
         * 获取指定账户的交易列表
         */
        router.get('/v2/accounts/:account/transactions', async (ctx, next) => {
            const params = ctx.params;
            const querys = ctx.query;

            if (_.has(params, 'account') && _.isEmpty(params.account)) {
                ctx.body = {
                    result: 'error',
                    message: 'unkown account'
                }
                return;
            }

            querys.address = params.account;
            await transactionList(ctx, querys);
        });

        /**
         * 获取指定账户交易类型为Payment的交易列表
         */
        router.get('/v2/accounts/:account/payments', async (ctx, netxt) => {
            const params = ctx.params;
            const querys = ctx.query;

            if (_.has(params, 'account') && _.isEmpty(params.account)) {
                ctx.body = {
                    result: 'error',
                    message: 'unkown account'
                }
                return;
            }

            querys.address = params.account;
            querys.type = 'Payment';
            querys.rstKey = 'payments';
            await transactionList(ctx, querys);
        });

        /**
         * 统计交易条目
         */
        router.get('/v2/reports', async(ctx, next) => {
            const querys = ctx.query;
            let zone = querys.zone || 0;
            const start = querys.start || moment.utc().format('YYYY-MM-DD');
            const end = querys.end || moment.utc().format('YYYY-MM-DD');
            let type = querys.type || 'day';
            if (type != 'day') {
                type = 'hour';
            }

            zone = Number(zone);
            const zoneOffset = zone * 60;
            const zoneSecs = zoneOffset * 60;
            const oneDay = 86400;

            let zoneStart = moment.utc(start).unix() - zoneSecs;
            let zoneEnd = moment.utc(end).unix() - zoneSecs + oneDay;
            if (type === 'hour') {
                zoneEnd = moment.utc(end).unix() - zoneSecs;
            }
            if (zoneStart >= zoneEnd) {
                ctx.body = {
                    result: 'success',
                    message: 'start time greater than end time'
                };
                return
            }

            const rst = {
                result: 'success',
                reports: {
                    type: type,
                    zone: zone,
                    data: []
                }
            };

            if (type === 'day') {
                for (let i = zoneStart; i < zoneEnd; i += oneDay) {
                    const iStart = i;
                    const iEnd = i + oneDay;
                    const countRst = await txHourModel.aggregate([
                        {
                            $match: {
                                hour: {
                                    $gte: iStart,
                                    $lt: iEnd
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: "$tx_count"
                                }
                            }
                        }
                    ]);

                    let count = 0;
                    if (countRst.length > 0) {
                        count = countRst[0].count;
                    }

                    rst.reports.data.push({
                        date: moment.utc(iStart * 1000).utcOffset(zoneOffset).format('YYYY-MM-DD'),
                        zone: moment.utc(iStart * 1000).utcOffset(zoneOffset).format(),
                        count: count
                    });
                }
            } else {
                const limit = parseInt((zoneEnd - zoneStart) / 3600);
                const lists = await txHourModel.find({
                    hour: {
                        $gte: zoneStart,
                        $lt: zoneEnd
                    }
                }).sort({hour: 1}).limit(limit);
                lists.forEach(item => {
                    rst.reports.data.push({
                        date: moment.utc(item.hour * 1000).utcOffset(zoneOffset).format('YYYY-MM-DD HH:00:00'),
                        zone: moment.utc(item.hour * 1000).utcOffset(zoneOffset).format(),
                        count: item.tx_count
                    });
                });
            }

            ctx.body = rst;
        });

        /**
         * 获取错误区块信息
         */
        router.get('/v2/system/errorLedgers', async (ctx, next) => {
            const querys = ctx.query;
            const page = querys.page || 1;
            const size = 100;

            if (querys.token != gConfig.token) {
                ctx.body = {
                    result: 'error',
                    message: 'token error'
                };
                return;
            }

            const rst = {
                result: 'success',
                total: 0,
                page: page,
                size: size,
                data: []
            };

            const total = await errorLedgerModel.count();
            const skip = (page - 1) * size;
            const list =  await errorLedgerModel.find({}, {ledger_index: 1}).sort({ledger_index: 1}).skip(skip).limit(size);
            list.forEach((item) => {
                rst.data.push(item.ledger_index);
            });
            rst.total = total;
            rst.size = rst.data.length;

            ctx.body = rst;
        });

        /**
         * 更新节点信息
         */
        router.get('/v2/system/replaceNode', async (ctx, next) => {
            const querys = ctx.query;
            if (querys.token != gConfig.token) {
                ctx.body = {
                    result: 'error',
                    message: 'token error'
                };
                return;
            }

            const key = querys.key || '';
            const address = querys.address;
            const desc = querys.desc || '';
            if (!address) {
                ctx.body = {
                    result: 'error',
                    message: 'params address error'
                };
                return;
            }

            tools.writeNodeServer({
                key: key,
                address: address,
                desc: desc
            });
            tools.freshNodeServer();
            ctx.body = {
                result: 'success'
            };
        });

        // /**
        //  * 获取所有节点数据
        //  */
        // router.get('/v2/system/nodes', async (ctx, next) => {
        //     const querys = ctx.query;
        //     if (querys.token != gConfig.token) {
        //         ctx.body = {
        //             result: 'error',
        //             message: 'token error'
        //         };
        //         return;
        //     }
        //
        //     const rst = await request.requestAllNodes();
        //     ctx.body = {
        //         result: 'success',
        //         nodes: rst
        //     };
        // });
        //
        //
        // /**
        //  * 获取所有节点数据
        //  */
        // router.get('/v2/system/nodes_info', async (ctx, next) => {
        //     const querys = ctx.query;
        //     if (querys.token != gConfig.token) {
        //         ctx.body = {
        //             result: 'error',
        //             message: 'token error'
        //         };
        //         return;
        //     }
        //
        //     const rst = await request.requestAllInfo();
        //     const nodes = [];
        //     rst.forEach((item) => {
        //         let build_version = '';
        //         let complete_ledgers = '';
        //         if (_.has(item, 'result') && _.has(item.result, 'status') && item.result.status === 'success') {
        //             build_version = item.result.info.build_version;
        //             complete_ledgers = item.result.info.complete_ledgers;
        //         }
        //
        //         nodes.push({
        //             nodeAddress: item.nodeAddress,
        //             build_version: build_version,
        //             complete_ledgers: complete_ledgers
        //         });
        //     });
        //
        //     ctx.body = {
        //         result: 'success',
        //         nodes: nodes
        //     };
        // });
        //
        /**
         * 同步底层区块
         */
        router.get('/v2/system/syncLedgers', async(ctx, next) => {
            const querys = ctx.query;
            let start = querys.start || 0;
            let end = querys.end || 0;
            start = Number(start);
            end = Number(end);

            if (querys.token != gConfig.token) {
                ctx.body = {
                    result: 'error',
                    message: 'token error'
                };
                return;
            }

            if (end <= 0) {
                ctx.body = {
                    result: 'error',
                    message: '结束区块必须大于0'
                };
                return;
            }

            if (start > end) {
                ctx.body = {
                    result: 'error',
                    message: '请求参数错误'
                };
                return;
            }

            ctx.body = {
                result: 'success',
                message: `正在同步${start}至${end}区块数据`
            };

            syncLedger(start, end);
        });


        async function syncLedger(start, end) {
            tools.freshNodeServer();
            for (let i = start; i <= end; i++) {
                gLog.info('开始同步区块', i);
                await syncServer.syncLedgerDetail(i);
                gLog.info('完成同步区块', i);
            }
        }

         /**
         * 获取区块高度列表
         */
        router.get('/v2/ledgerList/:ledger?', async(ctx, next) => {
            const params = ctx.params;
            if (params.ledger) {
                await ledgerInfo(ctx, params);
                return;
            }

            const querys = ctx.query;
            await ledgerList(ctx, querys);
        });

        /**
         * 获取区块列表
         * @param ctx
         * @param querys
         * @returns {Promise<void>}
         */
        async function ledgerList(ctx, querys) {
            let limit = querys.limit || 10;
            let descending = querys.descending || 'true';
            let page = querys.page || 1;
            let start = querys.start || 0;
            let end = querys.end || 0;
            let marker = querys.marker || '';
            const rstKey = 'ledgers';
            const rem = {

            }
            limit = Number(limit);
            if (limit >= 1000) {
                limit = 1000;
            }

            if (start && start.indexOf('T') >= 0) {
                start = moment(start).unix();
            }
            if (end && end.indexOf('T') >= 0) {
                end = moment(end).unix();
            }
            start = Number(start);
            end = Number(end);
            page = Number(page);

            const filter = {};
            if (start > 0) {
                filter.close_time = {
                    $gte: start
                };
            }
            if (end > 0) {
                if (_.has(filter, 'close_time')) {
                    filter.close_time.$lt = end;
                } else {
                    filter.close_time = {
                        $lt: end
                    };
                }
            }
            const rst = {
                result: 'success',
                count: 0,
                total: 0
            };
            rst[rstKey] = [];
            const total = await ledgerModel.count(filter);
            rst.total = total;
            if (total <= 0) {
                ctx.body = rst;
                return;
            }

            let skip = (page - 1) * limit;
            if (skip <= 0) {
                skip = 0;
            }
            let sort = 1;
            if (descending === 'true') {
                sort = -1;
            }
            if (marker) {
                filter._id = descending=='true'?{
                    $lte: marker
                }:{
                    $gte: marker
                };
            }  
            let lists = [];
            try{
                lists = await ledgerModel.find(filter)
                    .skip(skip)
                    .limit(limit+1)
                    .sort({_id: sort})
                    .exec();
            } catch (error) {
                if(error.kind == 'ObjectId'&&error.path=='_id'){
                    throw new Error("Invalid marker:"+marker)
                }else{
                    throw new Error(error)
                }
            }
            lists.forEach((item,index) => {
                if(index<limit){
                    rst[rstKey].push(item);
                }
            });
            rst.count = rst[rstKey].length;

            if(lists.length == limit+1){
                rst.marker = lists[limit]._id;
            }

            ctx.body = rst;
        }

        /**
         * 区块详情
         * @param ctx
         * @param hash
         * @returns {Promise<void>}
         */
        async function ledgerInfo(ctx, params) {
            const rst = {
                result: 'error'
            };
            const filter = {}
            if(!isNaN(params.ledger)){
                filter.ledger_index = params.ledger
            }else{
                filter.ledger_hash = params.ledger
            }
            const info = await ledgerModel.findOne(filter);
            // const lists = await transactionModel.find({ledger_index:params.ledger}, {_id:0,hash: 1})
            if (info) {
                const ledgerInfo = JSON.parse(JSON.stringify(info));
                // ledgerInfo.transactions=lists;
                rst.result = 'success';
                rst.ledger =ledgerInfo;
            }
            ctx.body = rst;
        }

         /**
         * 健康检查
         */
        router.get('/v2/health', async(ctx, next) => {
            const querys = ctx.query;
            if (querys.token != gConfig.token) {
                ctx.body = {
                    result: 'error',
                    message: 'token error'
                };
                return;
            }
            const health = {
                status: "UP",
                rpc: {
                    status: "UP",
                    url:gConfig.nodes,
                    change:"/v2/system/replaceNode?key=xxx&address=xxx&token=xxx"
                }
            }
            const info = await request.apiLedgerInfo();
            if(info.error!==0){
                health.rpc.status = 'DOWN';
            }
            if(health.rpc.status!='UP'){
                health.status = 'DOWN';
            }
            const rst = {
                result: 'success',
                health:health
            };
            ctx.body = rst
        });

        /**
         * 获取挂单记录
         */
        router.get('/v2/accounts/orders/:address?', async(ctx, next) => {
            const params = ctx.params;
            const querys = ctx.query;
            await orderList(ctx, Object.assign({},querys, params));
        });

        /**
         * 获取订单列表
         * @param ctx
         * @param querys
         * @returns {Promise<void>}
         */
        async function orderList(ctx, querys) {
            let limit = querys.limit || 10;
            let descending = querys.descending || 'true';
            let page = querys.page || 1;
            let start = querys.start || 0;
            let end = querys.end || 0;
            let type = querys.type || '';
            let offerType = querys.offerType || '';
            let pair = querys.pair || '';
            let address = querys.address || '';
            const rstKey = 'orders';
            const rem = {

            }
            limit = Number(limit);
            if (limit >= 1000) {
                limit = 1000;
            }

            if (start && start.indexOf('T') >= 0) {
                start = moment(start).unix();
            }
            if (end && end.indexOf('T') >= 0) {
                end = moment(end).unix();
            }
            start = Number(start);
            end = Number(end);
            page = Number(page);

            const filter = {};
            if (start > 0) {
                filter.time = {
                    $gte: start
                };
            }
            if (end > 0) {
                if (_.has(filter, 'time')) {
                    filter.time.$lt = end;
                } else {
                    filter.close_time = {
                        $lt: end
                    };
                }
            }
            if (address.length > 0) {
                filter._account = address;
            }
            if (offerType.length > 0) {
                filter.offerType = offerType;
            }
            if (pair.length > 0) {
                filter.pair = pair;
            }
            if (type.length > 0) {
                filter.type = type;
            }
            const rst = {
                result: 'success',
                count: 0,
                total: 0
            };
            rst[rstKey] = [];
            const total = await OrderTxModel.count(filter);
            rst.total = total;
            if (total <= 0) {
                ctx.body = rst;
                return;
            }

            let skip = (page - 1) * limit;
            if (skip <= 0) {
                skip = 0;
            }
            let sort = 1;
            if (descending === 'true') {
                sort = -1;
            }
            const lists = await OrderTxModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({time: sort})
                .exec();
            lists.forEach((item) => {
                rst[rstKey].push(item);
            });
            rst.count = rst[rstKey].length;

            ctx.body = rst;
        }

        /**
         * 获取成交记录
         */
        router.get('/v2/orders/clinchs', async(ctx, next) => {
            const querys = ctx.query;
            await httpOrder.clinchList(ctx, querys);
        });

        router.get('/v2/orders/klines', async(ctx, next) => {
            const querys = ctx.query;
            await httpOrder.klineList(ctx, querys);
        });
        
        

        router.get('/v2/transactionsCount', async(ctx, next) => {
            const count = await httpTransaction.countTransactions();
            const total =  {
                count:count,
                time:new Date().getTime()
            }
            ctx.body = {
                total:total,
                result:"success"
            }
        });
        return router;

        router.get('/v2/orders/kline', async(ctx, next) => {
            const count = await httpTransaction.countTransactions();
            const total =  {
                count:count,
                time:new Date().getTime()
            }
            ctx.body = {
                total:total,
                result:"success"
            }
        });
        return router;
    }
    
}

module.exports = Routes;