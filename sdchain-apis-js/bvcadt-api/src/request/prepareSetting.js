const getAccountInfo = require('./getAccountInfo')
const getFee = require('./getFee');
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')
const utils = require('../lib/common/utils')
const _ = require('lodash')

async function prepareSetting (address, options = {} , chainCore) {
    validate.address(address)
    
    const fee = options.fee ? options.fee : (await getFee(options, chainCore)).fee
    const keys =Object.keys(options)
    let flag = -1;
    let key;
    for(let k = 0;k<keys.length;k++){
        const _flag = constants.Flags.AccountSet[keys[k]]
        if(_flag&&_flag>flag){
            flag = _flag
            key = keys[k]
        }
    }

    const txJson = {
        TransactionType: 'AccountSet',
        Flags: 0,
        Account: address,
        Domain: options.domain ? (options.domain instanceof Object ? utils.convertStringToHex(JSON.stringify(options.domain)) : utils.convertStringToHex(options.domain)) : undefined,
        Fee: utils.baseToDrops(fee),
        Memos: options.memos ? _.map(options.memos, utils.convertMemo) : undefined
    }
    if(key!==undefined&&flag!=-1){
        txJson[utils.toBoolean(options[key])?'SetFlag':'ClearFlag']=flag
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
