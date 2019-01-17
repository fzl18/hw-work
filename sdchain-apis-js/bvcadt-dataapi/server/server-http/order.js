const OrderClinchModel = require('../lib/models/order_clinch');
const OrderKlineModel = require('../lib/models/order_kline')

/**
 * 获取成交列表
 * @param ctx
 * @param querys
 * @returns {Promise<void>}
 */
async function clinchList(ctx, querys) {
    let limit = querys.limit || 10;
    let descending = querys.descending || 'true';
    let page = querys.page || 1;
    let start = querys.start || 0;
    let end = querys.end || 0;
    let type = querys.type || '';
    let pair = querys.pair || '';
    let account = querys.account || '';
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
    if (account.length > 0) {
        filter.account = account;
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
    const total = await OrderClinchModel.count(filter);
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
    const lists = await OrderClinchModel.find(filter)
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
 * 获取kline列表
 * @param ctx
 * @param querys
 * @returns {Promise<void>}
 */
async function klineList(ctx, querys) {
    let limit = querys.limit || 10;
    let descending = querys.descending || 'true';
    let page = querys.page || 1;
    let start = querys.start || 0;
    let end = querys.end || 0;
    let type = querys.type || '';
    let pair = querys.pair || '';
    let account = querys.account || '';
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
    const total = await OrderKlineModel.count(filter);
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
    const lists = await OrderKlineModel.find(filter)
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

module.exports = {
    clinchList,
    klineList
}