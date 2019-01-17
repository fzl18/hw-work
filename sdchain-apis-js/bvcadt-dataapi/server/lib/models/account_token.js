'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    account: String,
    token:String,
    balance: Number,
    percent: Number,
    time: Number
});

schema.index({ account: 1 });
schema.index({ token: 1 });
schema.index({ balance: 1 });
schema.index({ time: 1 });

class AccountTokenClass {
    constructor() {
    }
}

schema.loadClass(AccountTokenClass);
module.exports = mongoose.model('h_account_token', schema);
