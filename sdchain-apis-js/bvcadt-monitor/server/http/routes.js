'use strict';
const Router = require('koa-router');
const nodeMonitor = require('../lib/core/nodeMonitor')
const appMonitor = require('../lib/core/appMonitor')
let logger;
class Routes {
    constructor(config) {
        this.gConfig = config;
        this.apiRoot = config.http.apiRoot;
        logger = config.gLogger;
    }

    router() {
        const options = {};
        if (this.apiRoot) {
            options.prefix = this.apiRoot;
        }
        const router = new Router(options);

        router.get('/core/listStatus', async (ctx, next) => {
            const nodeList = await nodeMonitor.findNodeStatusList();
            ctx.responseData(nodeList);
        });
        router.get('/core/listInfo', async (ctx, next) => {
            const nodesInfo = await nodeMonitor.requestAllInfo();
            ctx.responseData(nodesInfo);
        });

        router.get('/core/detailErrors', async (ctx, next) => {
            const querys = ctx.query;
            const nodeErrors = await nodeMonitor.findNodeErrorList(querys.key,querys.page);
            ctx.responseData(nodeErrors);
        });

        router.get('/core/errorDetail', async (ctx, next) => {
            const querys = ctx.query;
            const nodeErrorDetail = await nodeMonitor.findNodeError(querys.id);
            ctx.responseData(nodeErrorDetail);
        });

        router.post('/core/remove', async (ctx, next) => {
            const querys = ctx.query;
            const params = ctx.request.body;
            if(params.token!=gConfig.token){
                ctx.responseError("Token error!");
                return
            }
            if(!params.date){
                ctx.responseError("Date is empty!");
                return
            }
            const res = await nodeMonitor.removeEarlyLog(params.date);
            ctx.responseData(res);
        });

        router.post('/app/remove', async (ctx, next) => {
            const querys = ctx.query;
            const params = ctx.request.body;
            if(params.token!=gConfig.token){
                ctx.responseError("Token error!");
                return
            }
            if(!params.date){
                ctx.responseError("Date is empty!");
                return
            }
            const res = await appMonitor.removeEarlyLog(params.date);
            ctx.responseData(res);
        });

        router.get('/app/listStatus', async (ctx, next) => {
            const list = await appMonitor.findAppStatusList();
            ctx.responseData(list);
        });
        router.get('/app/listInfo', async (ctx, next) => {
            const infos = await appMonitor.requestAllAppsInfo();
            ctx.responseData(infos);
        });

        router.get('/app/detailErrors', async (ctx, next) => {
            const querys = ctx.query;
            const errors = await appMonitor.findAppErrorList(querys.key);
            ctx.responseData(errors);
        });

        router.get('/app/errorDetail', async (ctx, next) => {
            const querys = ctx.query;
            const errorDetail = await appMonitor.findAppError(querys.id);
            ctx.responseData(errorDetail);
        });

        router.get('/health', async (ctx, next) => {
            const querys = ctx.query;
            if(querys.token!=this.gConfig.token){
                ctx.responseError('token error');
                return;
            }
            const health = await nodeMonitor.inspect();
            ctx.responseData(health);
        });

        logger.debug('init router success...');
        return router;
    }
}

module.exports = Routes;