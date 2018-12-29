'use strict';
const Router = require('koa-router');
const service = require('./service');

class Routes {
    constructor() {
    }

    router() {
        const self = this;
        const options = {};
        if (gConfig.apiRoot) {
            options.prefix = gConfig.apiRoot;
        }
        const router = new Router(options);

        router.get('/cable/server', async (ctx, next) => {
           await service.server(ctx, next);
        });
        router.get('/cable/accounts/balances/:account', async (ctx, next) => {
            await service.balances(ctx, next);
        });
        // router.get('/data/ledgers', async (ctx, next) => {
        //     await service.ledgers(ctx, next);
        // });
        // router.get('/data/cLedgers', async (ctx, next) => {
        //     await service.cLedgers(ctx, next);
        // });
        router.get('/data/cTransactions', async (ctx, next) => {
            await service.cTransactions(ctx, next);
        });
        router.get('/data/payments', async (ctx, next) => {
            await service.payments(ctx, next);
        });

        router.get('/data/accounts/:account/transactions', async (ctx, next) => {
            await service.transactionsAccount(ctx, next);
        });
        router.get('/data/payments/:currency', async (ctx, next) => {
            await service.paymentsCurrency(ctx, next);
        });

        /* add */

        router.get('/data/txCharts', async (ctx, next) => {
            await service.txCharts(ctx, next);
        });

        router.get('/data/transactionsTotal', async (ctx, next) => {
            await service.transactionsTotal(ctx, next);
        });

        router.get('/data/ledgers', async (ctx, next) => {
            await service.ledgerList(ctx, next);
        });

        router.get('/data/ledgers/:ledger', async (ctx, next) => {
            await service.ledgerDetail(ctx, next);
        });
        router.get('/data/transactions', async (ctx, next) => {
            await service.transactions(ctx, next);
        });
        router.get('/data/transactions/:hash', async (ctx, next) => {
            await service.transaction(ctx, next);
        });
        router.get('/health', async (ctx, next) => {
            await service.health(ctx, next);
        });
        router.get('/cache/tokenDetail', async (ctx, next) => {
            await service.tokenDetail(ctx, next);
        });
        return router;


    }
}

module.exports = Routes;