'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    key: String, // 节点标识
    address: String, // 节点地址
    desc: String,// 节点描述
    time: Number, // 失败时间
    error: String, //异常描述
    errorDetail: {} // 异常详情
});

schema.index({ key: 1 });
schema.index({ address: 1 });
schema.index({ time: 1 });

class AppLog {
    constructor() {
    }
}

schema.loadClass(AppLog);
module.exports = mongoose.model('app_log', schema);
