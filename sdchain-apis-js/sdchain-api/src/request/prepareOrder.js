const getAccountInfo = require('./getAccountInfo')
const getFee = require('./getFee');
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')
const utils = require('../lib/common/utils')
const _ = require('lodash')

async function prepareOrder (address, options = {} , chainCore) {
    validate.address(address)

    const fee = options.fee ? options.fee : (await getFee(options, chainCore)).fee
    const quantity = utils.amountToDrops(options.quantity,'quantity')
    const totalPrice = utils.amountToDrops(options.totalPrice,'totalPrice')
    const direction = options.direction
    const takerPays = (direction === 'buy') ? quantity : totalPrice
    const takerGets = (direction === 'buy') ? totalPrice : quantity
    const txJson = {
        TransactionType: 'OfferCreate',
        Account: address,
        TakerGets: takerGets,
        TakerPays: takerPays,
        Fee: utils.baseToDrops(fee),
        Flags: 0,
        Memos: options.memos ? _.map(options.memos, utils.convertMemo) : undefined
    }
    if (options.direction === 'sell') {
        txJson.Flags |= constants.Flags.OfferCreate.Sell
    }
    if (options.passive === true) {
        txJson.Flags |= constants.Flags.OfferCreate.Passive
    }
    if(!options.unsign){
        const result = await getAccountInfo(address, {}, chainCore);
        const ledger = result.ledgerCurrentIndex;
        txJson.LastLedgerSequence = constants.BaseLedger!=0?ledger + constants.BaseLedger:undefined;
        txJson.Sequence = result.sequence;
    }
    return {
        txJson: JSON.stringify(txJson)
    }
}

module.exports = prepareOrder
