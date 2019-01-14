'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type: Number, //小时、天、月
    year: Number,
    month: Number,
    day: Number, //日 按照月统计是为空
    hour: Number, //小时按照天或者月统计时为空
    starttime: Number, //开始的时间戳
    endtime: Number, //结束的时间戳
    tx_count: Number //交易历史数量
});

schema.index({ type: 1 });
schema.index({ year: 1 });
schema.index({ month: 1 });
schema.index({ day: 1 });
schema.index({ hour: 1 });
schema.index({ starttime: 1 });
schema.index({ endtime: 1 });
schema.index({ tx_count: 1 });

class LedgerClass {
    constructor() {
    }
}

schema.loadClass(LedgerClass);
module.exports = mongoose.model('h_ledger', schema);
