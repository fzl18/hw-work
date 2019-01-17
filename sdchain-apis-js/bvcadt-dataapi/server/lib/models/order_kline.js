'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    time: Number,
    type: Number,//类型，hour/60
    pair: String, //交易对
    price_begin: Number, //开盘价
    price_end: Number, //收盘价
    price_max: Number, //最高价
    price_min: Number, //最低价
    amount_count: Number,//交易历史数量
    order_count: Number //交易历史数量
});

schema.index({ time: 1 });
schema.index({ type: 1 });
schema.index({ pair: 1 });

class OrderKlineClass {
    constructor() {
    }
}

schema.loadClass(OrderKlineClass);
module.exports = mongoose.model('h_order_kline', schema);
