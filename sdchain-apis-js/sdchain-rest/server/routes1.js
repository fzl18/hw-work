'use strict';
const Router = require('koa-router');
const Offline = require('./service/offline');
const Server = require('./service/server');
const Account = require('./service/account');
const Ledger = require('./service/ledger');
const Transaction = require('./service/v1/transaction');
const OrderBook = require('./service/orderBook');
const SmartContract = require('./service/smartContract');

class Routes {
    constructor(config = {}) {
        this._prefix = config.prefix;
    }

    router() {
        const options = {};
        if (this._prefix) {
            options.prefix = this._prefix;
        }
        const router = new Router(options);

        /**
         * 新建钱包
         */
        router.get('/wallet/new', async (ctx, next) => {
            const info =  Offline.generateAddress(ctx.query.secret);
            ctx.responseData(info);
        });

        router.get('/server', async (ctx, next) => {
            const info = await Server.getServerInfo({isV1:true});
            ctx.responseData(info);
        });

        /**
         * 支付请求
         */
        router.post('/accounts/payments/:account', async (ctx, next) => {
            const urlBase = ctx.protocol + '://' + ctx.get('host');
            const options = Object.assign({}, ctx.query, ctx.request.body);
            const info = await Transaction.submitPayment(ctx.params.account, options);
            if (info.result && info.result.hash) {
                info.result.status_url = urlBase + '/v1/accounts/payments/'
                    + options.payment.source_account + '/' + info.result.hash;
            }
            ctx.responseData(info);
        });

        /**
         * 获取支付信息
         */
        router.get('/accounts/payments/:address/:hash', async (ctx, next) => {
            const address = ctx.params.address;
            const hash = ctx.params.hash;

            const info = await Transaction.getTransaction(hash,{isV1:true});
                const transaction = info.transaction;
                delete info.transaction;
                info.hash = transaction.hash;
                info.ledger = transaction.ledger + '';
                info.state = transaction.state;
                info.source_account = transaction.account || '';
                info.destination_account = transaction.destination || '';
                info.destination_tag = transaction.destinationTag || '';
                info.amount = transaction.amount || {};
                info.currency = info.amount.currency || '';
                info.issuer = info.amount.issuer || '';
                info.direction = (address === info.source_account ? 'outgoing'
                    : (address === info.destination_account ? 'incoming' : 'passthrough'));
                info.timestamp = (transaction.date ? new Date(transaction.date * 1000).toISOString(): '');
                info.date = transaction.date;
                info.fee = transaction.fee;
                info.memos = transaction.memos;
                info.simple_memos = transaction.simple_memos;
                info.txnFee = transaction.txnFee;
            ctx.responseData(info);
        });

        /**
         * 查询交易详情
         */
        router.get('/transactions/:hash', async (ctx, next) => {
            const hash = ctx.params.hash;
            const info = await Transaction.getTransaction(hash,{isV1:true});
            ctx.responseData(info);
        });

        /**
         * 授信
         */
        router.post('/accounts/trustlines/:account', async (ctx, next) => {
            const info = await Transaction.submitTrustline(ctx.params.account, Object.assign({}, ctx.query, ctx.request.body));
            ctx.responseData(info);
        });

        /**
         * 账户历史交易
         */
        router.get('/accounts/transactions/:account', async (ctx, next) => {
            const info = await Account.getTransactions(ctx.params.account, Object.assign({isV1:true},ctx.query));
            ctx.responseData(info);
        });

        /**
         * 账户转账交易
         */
        router.get('/accounts/payments/:account', async (ctx, next) => {
            const info = await Account.getPayments(ctx.params.account, Object.assign({isV1:true},ctx.query));
            ctx.responseData(info);
        });
        
        /**
         * 提交订单
         */
        router.post('/accounts/orders/:account', async (ctx, next) => {
            const info = await Transaction.submitOrder(ctx.params.account,Object.assign({},ctx.query,ctx.request.body));
            ctx.responseData(info);
        });


        /**
         * 订单列表
         */
        router.get('/accounts/orders/:account', async (ctx, next) => {
            const info = await Account.getOrders(ctx.params.account,Object.assign({isV1:true},ctx.query));
            ctx.responseData(info);
        });

        /**
         * 删除订单
         */
        router.delete('/accounts/orders/:account/:sequence', async (ctx, next) => {
            const sequence = ctx.params.sequence;
            const info = await Transaction.submitOrderCancellation(ctx.params.account,Object.assign({offerSequence: sequence
            },ctx.query,ctx.request.body));
            ctx.responseData(info);
        });

        /**
         * 获取当前订单列表?
         */
        router.get('/order_book/:base/:counter', async (ctx, next) => {
            const info = await OrderBook.getOrderBook(ctx.params.base, ctx.params.counter, ctx.query);
            ctx.responseData(info);
        });

        /**
         * 查询账户余额
         */
        router.get('/accounts/balances/:account', async (ctx, next) => {
            const info = await Account.balances(ctx.params.account,ctx.query);
            ctx.responseData(info);
        });

        /**
         * 获取交易详情
         */
        router.get('/accounts/transactions/:address/:hash', async (ctx, next) => {
            const info = await Account.getTransaction(ctx.params.address, ctx.params.hash,{isV1:true});
            ctx.responseData(info);
        });
        
        /**
         * 获取授信列表
         */
        router.get('/accounts/trustlines/:account', async (ctx, next) => {
            const info = await Account.getTrustlines(ctx.params.account,Object.assign({isV1:true,convert:false},ctx.query));
            ctx.responseData(info);
        });

        /**
         * 提交交易?
         */
        router.post('/transaction/submit', async (ctx, next) => {
            const info = await Transaction.submit(ctx.request.body.tx_blob,ctx.query);
            ctx.responseData(info);
        });

        /**
         * 交易签名
         */
        router.post('/transaction/sign', async (ctx, next) => {
            const info = Offline.sign(ctx.request.body.tx_json,ctx.request.body.secret);
            if (info.hash) {
                info.tx_blob = info.signedTransaction;
                delete info.signedTransaction;
            }
            ctx.responseData(info);
        });

        /**
         * 获取默认手续费
         */
        router.get('/transaction-fee', async (ctx, next) => {
            const info = await Transaction.getFee();
            ctx.responseData(info);
        });

        /**
         * 获取账户设置信息
         */
        router.get('/accounts/settings/:account', async (ctx, next) => {
            const info = await Account.getSettings(ctx.params.account,ctx.query);
            if (info.settings) {
                info.settings.default_spread = false;
                if (info.settings.hasOwnProperty('defaultSpread')) {
                    info.settings.default_spread = info.settings.defaultSpread;
                    delete info.settings.defaultSpread;
                }
            }
            ctx.responseData(info);
        });

        /**
         * 设置账户信息
         */
        router.post('/accounts/settings/:account', async (ctx, next) => {
            const body = ctx.request.body;
            let orgSettings = {};
            if (body.settings && body.settings.hasOwnProperty('default_spread')) {
                orgSettings = JSON.parse(JSON.stringify(body.settings));
                body.settings.defaultSpread = body.settings.default_spread;
            }
            const info = await Transaction.submitSettings(ctx.params.account,Object.assign({},ctx.query, body));
            if (info.result && info.result.resultType && info.result.resultType === 'tesSUCCESS') {
                info.result.settings = orgSettings;
            }
            ctx.responseData(info);
        });

        /**
         * 部署智能合约
         */
        router.post('/accounts/smartContract/:account', async (ctx, next) => {
            const info = await SmartContract.submit(ctx.params.account,Object.assign({},ctx.query,ctx.request.body));
            if (info.result && info.result.resultType && info.result.resultType === 'tesSUCCESS') {
                info.result.smartContract = ctx.request.body.smartContract;
                info.result.ledger = info.ledger || 0;
                info.result.state = info.state || 'pending';
            }
            ctx.responseData(info);
        });

        /**
         * 调用智能合约
         */
        router.post('/smartContract/:hash', async (ctx, next) => {
            const info = await SmartContract.run(ctx.params.hash,Object.assign({},ctx.query,ctx.request.body));
            if (info.hasOwnProperty('smartContract')) {
                info.smart_contract = info.smartContract;
                delete info.smartContract;
            }
            ctx.responseData(info);
        });

        router.get('/health', async(ctx, next) => {
            const querys = ctx.query;
            // if (querys.token != gConfig.token) {
            //     ctx.body = {
            //         result: 'error',
            //         message: 'token error'
            //     };
            //     return;
            // }
            const health = {
                status: "UP",
                rpc: {
                    status: "UP",
                    url:gConfig.coredUrl,
                    change:""
                }
            }
            try {
                const info = await Server.getServerInfo({});
            } catch (error) {
                health.rpc.status = 'DOWN';
            }
            if(health.rpc.status!='UP'){
                health.status = 'DOWN';
            }
            ctx.responseData({ health:health});
        });

        router.get('/accounts/gatewayBalances/:account', async (ctx, next) => {
            const body = ctx.request.body;
            const info = await Account.getGatewayBalances(ctx.params.account,Object.assign({},ctx.query, body));
            ctx.responseData(info);
        });

        /**
         * 批量支付请求
         */
        router.post('/accounts/multiPayments/:account', async (ctx, next) => {
            const options = Object.assign({}, ctx.query, ctx.request.body);
            const info = await Transaction.submitMultiPayment(ctx.params.account, options);
            ctx.responseData(info);
        });

        return router;
    }
}

module.exports = Routes;