"use strict";

module.exports = function () {
    return async function (ctx, next) {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        await next();
    }
};
