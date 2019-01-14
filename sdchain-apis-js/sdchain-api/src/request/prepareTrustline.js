const getAccountInfo = require('./getAccountInfo')
const getFee = require('./getFee');
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')
const utils = require('../lib/common/utils')

async function prepareTrustline (address, options = {} , chainCore) {
    validate.address(address)
    validate.amount(options.limitAmount, 'limitAmount')

    const fee = options.fee ? options.fee : (await getFee(options, chainCore)).fee
    const txJson = {
        TransactionType: 'TrustSet',
        Flags: 0,
        Account: address,
        LimitAmount: options.limitAmount,
        Fee: utils.baseToDrops(fee),
        Memos: options.memos ? _.map(options.memos, utils.convertMemo) : undefined
    }
    const _option = {
        input: options,
        flags: constants.FlagsStr.TrustSet,
        clear_setting: ''
    }
    if(!options.unsign){
        const result = await getAccountInfo(address, {}, chainCore);
        const ledger = result.ledgerCurrentIndex;
        txJson.LastLedgerSequence = constants.BaseLedger!=0?ledger + constants.BaseLedger:undefined;
        txJson.Sequence = result.sequence;
    }
    return {
        txJson:JSON.stringify(utils.getTxBitFlags(txJson, _option))
    }
}

module.exports = prepareTrustline
