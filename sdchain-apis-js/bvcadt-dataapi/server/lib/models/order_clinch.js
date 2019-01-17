'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _hash:String,
    pair:String,//交易对
    type:String,//交易类型sell,buy
    takerGetsValue: Number,
    takerGetsCurrency: String,
    takerGetsIssuer: String,
    takerPaysValue: Number,
    takerPaysCurrency: String,
    takerPaysIssuer: String,
    price:Number,
    account:String,
    sequence:Number,
    flags:Number,
    time: Number
});
schema.index({ _hash: 1 });
schema.index({ pair: 1 });
schema.index({ price: 1 });
schema.index({ account: 1 });
schema.index({ type: 1 });
schema.index({ time: 1 });

class OrderClinchClass {
    constructor() {
    }
}

schema.loadClass(OrderClinchClass);
module.exports = mongoose.model('h_order_clinch', schema);
