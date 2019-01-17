const getAccountInfo = require('./getAccountInfo')
const getFee = require('./getFee');
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')
const utils = require('../lib/common/utils')
const _ = require('lodash')

async function prepareOrderCancellation (address, options = {} , chainCore) {
    validate.address(address)

    const fee = options.fee ? options.fee : (await getFee(options, chainCore)).fee
    const txJson = {
        Flags: 0,
        TransactionType: 'OfferCancel',
        Account: address,
        OfferSequence: Number(options.offerSequence),
        Fee: utils.baseToDrops(fee),
        Memos: options.memos ? _.map(options.memos, utils.convertMemo) : undefined
    }
    if(!options.unsign){
        const result = await getAccountInfo(address, {}, chainCore);
        const ledger = result.ledgerCurrentIndex;
        txJson.LastLedgerSequence = constants.BaseLedger!=0?ledger + constants.BaseLedger:undefined;
        txJson.Sequence = result.sequence;
    }
    return {
        txJson:JSON.stringify(txJson)
    }
}

module.exports = prepareOrderCancellation
