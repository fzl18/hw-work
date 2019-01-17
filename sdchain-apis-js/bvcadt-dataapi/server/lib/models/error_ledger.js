'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    ledger_index: Number, // 区块高度
    ledger_hash: String, // 区块Hash
    close_time: Number, // 区块关闭时间
    sync_start_time: Number, // 数据同步开始时间
    sync_status: Number, // 数据同步状态
    sync_end_time: Number, // 数据同步结束时间
});

schema.index({ ledger_index: 1 });
schema.index({ ledger_hash: 1 });
schema.index({ close_time: 1 });

class ErrorLedgerClass {
    constructor() {
    }
}

schema.loadClass(ErrorLedgerClass);
module.exports = mongoose.model('h_error_ledger', schema);
