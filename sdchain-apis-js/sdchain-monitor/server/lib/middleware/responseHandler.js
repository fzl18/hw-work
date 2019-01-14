"use strict";

const errorCodes = require('../tools/errorCode')
module.exports = function (config) {
    const logger = config.gLogger;
    return async function (ctx, next) {
        ctx.responseError = (err, code = errorCodes.REQUEST_ERROR) => {
            ctx.body = { code: code, message: err.message ? err.message : err.toString() };
            return false;
        }

        ctx.responseData = (data) => {
            ctx.body = { code: errorCodes.SUCCESS, data: data };
        }

        try {
            await next();
        } catch (err) {
            ctx.body = { code: errorCodes.UNKNOW_ERROR, message: err.toString() };
            logger.error(err.toString());
        }
    };
};
