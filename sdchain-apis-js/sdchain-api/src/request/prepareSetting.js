const getAccountInfo = require('./getAccountInfo')
const getFee = require('./getFee');
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')
const utils = require('../lib/common/utils')
const _ = require('lodash')

async function prepareSetting (address, options = {} , chainCore) {
    validate.address(address)
    
    const fee = options.fee ? options.fee : (await getFee(options, chainCore)).fee
    const txJson = {
        TransactionType: 'AccountSet',
        Flags: 0,
        Account: address,
        SetFlag: options.defaultSpread === true ? 8 : undefined,
        ClearFlag: options.defaultSpread === false ? 8 : undefined,
        Domain: options.domain ? (options.domain instanceof Object ? utils.convertStringToHex(JSON.stringify(options.domain)) : utils.convertStringToHex(options.domain)) : undefined,
        Fee: utils.baseToDrops(fee),
        Memos: options.memos ? _.map(options.memos, utils.convertMemo) : undefined
    }
    if(options.transferFee){
        validate.amount(options.transferFee,"transferFee");
        txJson.TransferFee = options.transferFee
    }
    if(options.limitAmount){
        validate.amount(options.limitAmount,"limitAmount");
        txJson.LimitAmount = options.limitAmount
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

module.exports = prepareSetting
