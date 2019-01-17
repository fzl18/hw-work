'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    hash: String, //交易hash
    ledger_index: Number, //区块高度
    type: String, //交易类型
    time: Number, //交易时间
    fee: mongoose.Types.Decimal128, // 交易手续费
    amount: mongoose.Types.Decimal128, // 交易金额
    account: String,  // 交易地址
    source: String,   // 交易源地址
    destination: String, // 交易目的地址
    currency: String,//币种类型
    issuer: String,//币种发行商
    currencyP: String,//币种类型
    issuerP: String,//币种发行商
    currencyG: String,//币种类型
    issuerG: String,//币种发行商
    result: String, // 交易结果
    tx: {}
});

schema.index({ hash: 1 });
schema.index({ ledger_index: 1 });
schema.index({ type: 1 });
schema.index({ time: 1 });
schema.index({ account: 1 });
schema.index({ source: 1 });
schema.index({ destination: 1 });
schema.index({ currency: 1 });
schema.index({ issuer: 1 });

class TransactionClass {
    constructor() {
    }
}

schema.loadClass(TransactionClass);
module.exports = mongoose.model('h_transaction', schema);
