"use strict";
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const BaseDrops = 1000000.0;
const BigNumber = require('bignumber.js');
const _ = require('lodash');
const parseBalanceChanges = require('./balancechanges').parseBalanceChanges;
var config = require('../../../config/config');

module.exports.BaseDrops = BaseDrops;

module.exports.mkdir = function(dir) {
    let p = path.dirname(path.normalize(dir));
    let isAbs = path.isAbsolute(p);
    let current_path = '';
    p = p.split(path.sep);
    if(isAbs) {
        current_path = p[0];
        if((current_path.length <= 0) && (path.sep == '/')) {
            current_path = "/";
        }
        p.shift();
    }

    for(let i = 0; i < p.length; ++i) {
        current_path = path.join(current_path, p[i]);
        if (!fs.existsSync(current_path))
        {
            fs.mkdirSync(current_path);
        }
    }
};

module.exports.sleep = async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
};

module.exports.getTime = function () {
    return new Date().getTime();
};

module.exports.toTimestamp = function(rpepoch) {
    return (rpepoch + 0x386D4380)
};

/**
 * 格式化交易记录
 * @param data
 * @returns {{}}
 */
module.exports.formatTransaction = function (data) {
    const transaction = {};
    transaction.hash = data.hash;
    transaction.ledger_index = data.ledger_index;
    let closeTime = 0;
    if (_.has(data, 'date')) {
        closeTime = this.toTimestamp(data.date);
    } else {
        closeTime = data.closeTime || 0;
    }
    transaction.date = moment.unix(closeTime).utc()
        .format('YYYY-MM-DDTHH:mm:ssZ');
    transaction.tx = _.clone(data);
    if (_.has(transaction.tx, 'metaData')) {
        delete transaction.tx.metaData;
    }
    if (_.has(data, 'Memos')) {
        transaction.tx.Memos = data.Memos;
    }
    if (data.Amount) {
        transaction.tx.Amount = typeof data.Amount === 'string' ? data.Amount : this.parseAmount(data.Amount, true);
    }

    transaction.meta = data.meta || data.metaData;

    if (data.TransactionType === 'Payment' && transaction.meta.TransactionResult === 'tesSUCCESS') {
        transaction.tx.Destination = data.Destination;
        // DeliveredAmount is present
        if (_.has(transaction.meta, 'DeliveredAmount')) {
            transaction.meta.delivered_amount = transaction.meta.DeliveredAmount
        } else if (!this.isPartialPayment(data.Flags)) {
            transaction.meta.delivered_amount = transaction.tx.Amount;
        } else {
            transaction.meta.delivered_amount = 'unavailable'
        }
        transaction.tx.Amount = transaction.meta.delivered_amount;
        if(Math.round(transaction.tx.Amount) === transaction.tx.Amount){
            transaction.tx.Amount = transaction.tx.Amount.toString();
        }
    }

    return transaction;
};

module.exports.parseAmount = function (chaindAmount, useIssuer) {
    let amount = {};

    if (typeof chaindAmount === 'string') {
        amount.currency = gConfig.currency;
        amount.value = this.dropsToBase(chaindAmount);
        if (useIssuer) {
            amount.issuer = '';
        } else {
            amount.counterparty = '';
        }
    } else {
        amount.currency = chaindAmount.currency;
        amount.value = chaindAmount.value;
        if (useIssuer) {
            amount.issuer = chaindAmount.issuer;
        } else {
            amount.counterparty = chaindAmount.issuer;
        }
    }

    return amount;
};

module.exports.dropsToBase = function (drops) {
    return (new BigNumber(drops)).dividedBy(BaseDrops).toString()
};

module.exports.isPartialPayment = function (flags) {
    return 0x00020000 & flags
};

/**
 * 格式化交易数据
 * @param data
 */
module.exports.formatPayment = function (data) {
    const payment = {};

    const balanceChanges = parseBalanceChanges(data.metaData);
    payment.source = data.Account;
    payment.destination = data.Destination;
    payment.source_balance_changes      = [];
    payment.destination_balance_changes = balanceChanges[data.Destination];

    if(balanceChanges[data.Account]) {
        balanceChanges[data.Account].forEach((change) => {
            if (change.currency === gConfig.currency) {
                const fee = new BigNumber(data.Fee).dividedBy(BaseDrops).negated();
                change.value = new BigNumber(change.value).minus(fee).toString();
            }

            if (change.value !== '0') {
                payment.source_balance_changes.push(change);
            }
        });
    }
    if (data.DestinationTag) {
        payment.destination_tag = data.DestinationTag;
    }

    if (data.SourceTag) {
        payment.source_tag = data.SourceTag;
    }

    if (data.InvoiceID) {
        payment.invoice_id = data.InvoiceID;
    }

    //destination amount and currency
    if (typeof data.Amount === 'object') {
        payment.currency = data.Amount.currency;
        payment.amount   = data.Amount.value;
    } else {
        payment.currency = gConfig.currency;
        payment.amount   = this.dropsToBase(data.Amount);
    }

    //delivered amount fields
    const amount = data.metaData.DeliveredAmount || data.Amount;
    if (typeof amount === 'object') {
        payment.delivered_amount = amount.value;
    } else {
        payment.delivered_amount = this.dropsToBase(amount);
    }

    //max amount
    if (typeof data.SendMax === 'object') {
        payment.max_amount = data.SendMax.value;
        payment.source_currency = data.SendMax.currency;
    } else if (data.SendMax) {
        payment.max_amount = this.dropsToBase(data.SendMax);
        payment.source_currency = gConfig.currency;
    }

    if (!payment.source_currency && payment.source_balance_changes.length) {
        payment.source_currency = payment.source_balance_changes[0].currency;
    }

    // setIssuer(payment, tx);

    payment.fee = this.dropsToBase(data.Fee);
    payment.tx_index = data.tx_index || 0;
    payment.tx_hash = data.hash;
    payment.date = data.closeTime;
    if (_.has(data, 'date')) {
        payment.date = this.toTimestamp(data.date);
    }
    payment.executed_time = moment.unix(payment.date).utc()
        .format();
    payment.ledger_index = data.ledger_index;
    payment.transaction_cost = this.dropsToBase(data.Fee);
    payment.txnFee = data.TxnFee
    return payment;
};

/**
 * 格式邮件标题
 * @param subject
 * @returns {string}
 */
module.exports.mailSubject = function (subject) {
    return gConfig.mailPrefix + '-' + subject;
};

/**
 * 加载节点信息
 * @returns {*}
 */
module.exports.loadNodeServer = function () {
    const chainFile = config.chainFile;
    let node = {};
    try {
        const data = fs.readFileSync(chainFile);
        node = JSON.parse(data);
    } catch (e) {
        if (config.nodes.length > 0) {
            node = config.nodes[0];
        }
        this.writeNodeServer(node);
    }
    return node;
};

/**
 * 刷新节点信息
 */
module.exports.freshNodeServer = function () {
    const node = this.loadNodeServer();
    if (_.has(node, 'address')) {
        config.chainServer = node.address;
    }
};

/**
 * 写入节点信息
 * @param data
 */
module.exports.writeNodeServer = function (data) {
    const chainFile = config.chainFile;
    fs.writeFileSync(chainFile, JSON.stringify(data));
};

module.exports.parseFlags = function (responseFlags, flags) {
	var parsedFlags = {};
	for ( var flagName in flags) {
		var flag = flags[flagName];
		parsedFlags[flag.name] = Boolean(responseFlags & flag.value);
	}
	return parsedFlags;
}