"use strict";

module.exports = function () {
    return async function (ctx, next) {
        const path = ctx.path;
        const rootUrl = path.substring(0, gConfig.apiRoot.length)
        if (rootUrl != gConfig.apiRoot) {
            ctx.set('Cache-Control', 'max-age=86400');
        } else {
            ctx.set('Cache-Control', 'max-age=0');
        }
        await next();
    };
};
