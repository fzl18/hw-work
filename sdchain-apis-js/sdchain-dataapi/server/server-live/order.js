const BigNumber = require('bignumber.js');
const _ = require('lodash');
const {parseFlags} = require('../lib/tools/tools')

function parseOrder (tx, ledger, closeTime,account,seq) {
    let transaction = {
        pair:tx.pair||'',
        _hash:tx.hash+'|'+account+'|'+seq,
        hash: tx.hash || '',
        account: tx.Account,
        _account:account,
        passiveness:tx.Account!=account,
        type: tx.TransactionType || '',
        time: tx.date ? toTimestamp(tx.date) : closeTime,
        fee: dropsToBase(tx.Fee) || '0',
        ledger: tx.ledger_index || ledger,
        flags:tx.Flags,
        sequence:tx.Sequence,
        result: tx.metaData.TransactionResult || '',
        tx: tx
    }

   if (tx.TransactionType === 'OfferCreate') {
    const flags = parseFlags(tx.Flags, gConstants.FlagsStr.OfferCreateFlags)
    transaction.offerType =flags.sell ? 'sell' : 'buy'
    transaction.offerSequence=seq
    transaction.takerGetsValue = typeof tx.TakerGets === 'object' ?  tx.TakerGets.value : tx.TakerGets/gConfig.chainDrops
    transaction.takerGetsCurrency = typeof tx.TakerGets === 'object' ? tx.TakerGets.currency : gConfig.currency,
    transaction.takerGetsIssuer = typeof tx.TakerGets === 'object' ? tx.TakerGets.issuer : ''
    transaction.takerPaysValue = typeof tx.TakerPays === 'object' ? tx.TakerPays.value : tx.TakerPays/gConfig.chainDrops
    transaction.takerPaysCurrency = typeof tx.TakerPays === 'object' ? tx.TakerPays.currency : gConfig.currency,
    transaction.takerPaysIssuer = typeof tx.TakerPays === 'object' ? tx.TakerPays.issuer : ''
    } else if (tx.TransactionType === 'OfferCancel') {
        for (let i = 0; i < tx.metaData.AffectedNodes.length; i++) {
            if (tx.metaData.AffectedNodes[i].DeletedNode && tx.metaData.AffectedNodes[i].DeletedNode.LedgerEntryType == 'Offer') {
                const offer = tx.metaData.AffectedNodes[i].DeletedNode.FinalFields;
                transaction.offerType =offer.Flags == 131072 ? 'sell' : 'buy'
                transaction.offerSequence=offer.OfferSequence
                transaction.takerGetsValue = typeof offer.TakerGets === 'object' ?  offer.TakerGets.value : offer.TakerGets/gConfig.chainDrops
                transaction.takerGetsCurrency = typeof offer.TakerGets === 'object' ? offer.TakerGets.currency : gConfig.currency,
                transaction.takerGetsIssuer = typeof offer.TakerGets === 'object' ? offer.TakerGets.issuer : ''
                transaction.takerPaysValue = typeof offer.TakerPays === 'object' ? offer.TakerPays.value : offer.TakerPays/gConfig.chainDrops
                transaction.takerPaysCurrency = typeof offer.TakerPays === 'object' ? offer.TakerPays.currency : gConfig.currency,
                transaction.takerPaysIssuer = typeof offer.TakerPays === 'object' ? offer.TakerPays.issuer : ''
            }
        }
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


function dropsToBase (drops) {
    return (new BigNumber(drops)).dividedBy(gConfig.chainDrops).toString()
}


module.exports = parseOrder