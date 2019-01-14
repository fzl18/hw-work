'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    year: Number,
    month: Number,
    day: Number, //日 按照月统计是为空
    hour: Number, //小时按照天或者月统计时为空
    tx_count: Number //交易历史数量
});

schema.index({ year: 1 });
schema.index({ month: 1 });
schema.index({ day: 1 });
schema.index({ hour: 1 });

class TxHourClass {
    constructor() {
    }
}

schema.loadClass(TxHourClass);
module.exports = mongoose.model('h_tx_hour', schema);
