'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _hash:String,
    hash:String,
    pair:String,
    account:String,
    _account:String,
    passiveness:Boolean,
    type:String,
    date:Number,
    time:String,
    fee:String,
    ledger:String,
    flags:Number,
    sequence:Number,
    offerSequence:Number,
    result:String,
    offerType:String,
    takerGetsValue: String,
    takerGetsCurrency: String,
    takerGetsIssuer: String,
    takerPaysValue: String,
    takerPaysCurrency: String,
    takerPaysIssuer: String,
    price:String,
    tx:{}
});

schema.index({ _hash: 1 });
schema.index({ _account: 1 });
schema.index({ pair: 1 });
schema.index({ type: 1 });
schema.index({ time: 1 });

class OrderTxClass {
    constructor() {
    }
}

schema.loadClass(OrderTxClass);
module.exports = mongoose.model('h_order_tx', schema);
