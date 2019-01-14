const constants = require('../lib/common/constants');
function isBaseCurrency(tokenName) {
    return constants.BaseCurrency == tokenName;
}

module.exports = {
    isBaseCurrency: isBaseCurrency,
    baseCurrency: constants.BaseCurrency,
    constants:constants
};
