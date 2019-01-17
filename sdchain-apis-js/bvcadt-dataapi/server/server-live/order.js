const BigNumber = require('bignumber.js');
const _ = require('lodash');
const {parseFlags} = require('../lib/tools/tools')
const OrderClinchModel = require('../lib/models/order_clinch');
const OrderKlineModel = require('../lib/models/order_kline');

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

async function syncKline(hourTime,endHour){
    const orderClinchCount = await OrderClinchModel.count({
        time: {
            $gte: hourTime,
            $lt: endHour
        }
    });
    if(orderClinchCount>0){
        const orderKlines = []
        const orderKArr = await OrderClinchModel.aggregate([
            {$match:{time:{$gte:hourTime, $lt:endHour}}},
            {$sort:{time:-1}},
            {$group:{_id:"$pair",begin:{$first:"$price"},end:{$last:"$price"},max:{$max:"$price"},min:{$min:"$price"},count:{$sum:1},amount:{$sum:"$takerPaysValue"}}}
        ])
        for(let o = 0;o<orderKArr.length;o++){
            const orderK = orderKArr[o];
            const orderKlineBegin =await OrderKlineModel.find({time:{$lt:hourTime},pair:orderK.pair}).sort({time:-1}).limit(1);
            const orderKline = {
                time: hourTime,
                type: 60,//类型，hour/60
                pair: orderK._id, //交易对
                price_begin: orderKlineBegin.length===1?orderKlineBegin[0].price_end:orderK.begin, //开盘价
                price_end: orderK.end, //收盘价
                price_max: orderK.max, //最高价
                price_min: orderK.min, //最低价
                amount_count: orderK.amount,
                order_count: orderK.count //交易历史数量
            }
            orderKlines.push({
                updateOne: {
                    filter: {
                        time: hourTime,
                        pair: orderK._id
                    },
                    update: orderKline,
                    upsert: true
                }
            });
        }
        if(orderKlines.length>0){
            await OrderKlineModel.bulkWrite(orderKlines)
        }
    }
}
module.exports = {
    parseOrder,
    syncKline
}