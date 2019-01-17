const constants = require('../lib/common/constants');
const utils = require('../lib/common/utils');
function isBaseCurrency(tokenName) {
    return constants.BaseCurrency == tokenName;
}

function prepareAmount(amount) {
    let objAmount = amount;
    if (typeof amount == 'string') {
        const _amount = {};
        _amount.value = amount;
        _amount.currency = constants.BaseCurrency;
        _amount.issuer = '';
        objAmount = _amount
    }
    return utils.amountToDrops(objAmount);
}

module.exports = {
    isBaseCurrency: isBaseCurrency,
    baseCurrency: constants.BaseCurrency,
    constants: constants,
    utils: utils,
    prepareAmount: prepareAmount,
    baseToDrops: utils.baseToDrops,
    string2Hex: utils.convertStringToHex,
    hex2String: utils.hexToStringUTF8
};
