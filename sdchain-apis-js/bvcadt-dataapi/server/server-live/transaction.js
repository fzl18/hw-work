const BaseDrops = 1000000.0;
const BigNumber = require('bignumber.js');
const _ = require('lodash');
const TransactionModel = require('../lib/models/transaction');

function parseTransaction (tx, ledger, closeTime) {
    let transaction = {
        hash: tx.hash || '',
        account: tx.Account || '',
        type: tx.TransactionType || '',
        time: tx.date ? toTimestamp(tx.date) : closeTime,
        fee: dropsToBase(tx.Fee) || '0',
        source: '',
        destination: '',
        amount: '0',
        ledger_index: tx.ledger_index || ledger,
        currency: '',
        issuer: '',
        result: tx.metaData.TransactionResult || '',
        tx: tx
    }

    let effect = {}
    if (tx.TransactionType === 'Payment') {
        transaction.source = tx.Account
        transaction.destination = tx.Destination
        effect.amount = parseAmount(tx.Amount, true)
    } else if (tx.TransactionType === 'OfferCreate') {
        const _takerPays = parseAmount(tx.TakerPays)
        const _takerGets = parseAmount(tx.TakerGets)
        const _takerGetsStr = _takerGets.counterparty == '' ? _takerGets.currency : _takerGets.currency + ':' + _takerGets.counterparty
        const _takerPaysStr = _takerPays.counterparty == '' ? _takerPays.currency : _takerPays.currency + ':' + _takerPays.counterparty
        transaction.currencyP = _takerPays.currency
        transaction.issuerP = _takerPays.counterparty
        transaction.currencyG = _takerGets.currency
        transaction.issuerG = _takerGets.counterparty
        effect.amount = _takerPays
        transaction.pairs = [_takerGetsStr + '/' + _takerPaysStr,_takerPaysStr + '/' + _takerGetsStr]
    } else if (tx.TransactionType === 'OfferCancel') {
        for (let i = 0; i < tx.metaData.AffectedNodes.length; i++) {
            if (tx.metaData.AffectedNodes[i].DeletedNode && tx.metaData.AffectedNodes[i].DeletedNode.LedgerEntryType == 'Offer') {
                const _takerPays = parseAmount(tx.metaData.AffectedNodes[i].DeletedNode.FinalFields.TakerPays, true)
                const _takerGets = parseAmount(tx.metaData.AffectedNodes[i].DeletedNode.FinalFields.TakerGets, true)
                
                const _takerGetsStr = _takerGets.counterparty == '' ? _takerGets.currency : _takerGets.currency + ':' + _takerGets.counterparty
                const _takerPaysStr = _takerPays.counterparty == '' ? _takerPays.currency : _takerPays.currency + ':' + _takerPays.counterparty
                effect.amount = _takerPays
                transaction.pairs = [_takerGetsStr + '/' + _takerPaysStr,_takerPaysStr + '/' + _takerGetsStr]
            }
        }
    } else if (tx.TransactionType === 'TrustSet') {
        effect.amount = parseAmount(tx.LimitAmount, true)
    } else if (tx.TransactionType === 'MultiPayment') {
        transaction.payees = []
        tx.Payees.forEach( payeeo => {
            const amountO = parseAmount(payeeo.Payee.Amount,true)
            const p = {
                currency:amountO.currency,
                amount:amountO.value,
                issuer:amountO.issuer,
                destination:payeeo.Payee.Destination
            }
            transaction.payees.push(p)
        });
    }

    if (_.has(effect, 'amount')) {
        transaction.currency = effect.amount.currency
        transaction.issuer = effect.amount.issuer
        transaction.amount = effect.amount.value
    }

    return transaction
}

function parseAmount(chaindAmount, useIssuer) {
    let amount = {};

    if (typeof chaindAmount === 'string') {
        amount.currency = gConfig.currency;
        amount.value = dropsToBase(chaindAmount);
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
}

function toTimestamp (rpepoch) {
    return (rpepoch + 0x386D4380)
}

function dropsToBase (drops) {
    return (new BigNumber(drops)).dividedBy(BaseDrops).toString()
}

function hexToString (h) {
    var a = []
    var i = 0

    if (h.length % 2) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)))
        i = 1
    }

    for (; i < h.length; i += 2) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i + 2), 16)))
    }

    return a.join('')
}

async function syncTransactionTotal(){
    const res = await TransactionModel.count({});
    global.gTxCount={
        total:res,
        time:new Date().getTime()
    }

}

module.exports = {
    parseTransaction,
    syncTransactionTotal
}