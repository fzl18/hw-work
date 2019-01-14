const utils = require('../lib/common/utils');
const validate = require('../lib/common/validate');
/**
 * get account info by address
 * @param {string} address 
 * @param {object} chainCore 
 */
function getAccountInfo(address, options = {}, chainCore) {
    validate.address(address);
    return chainCore.request({
        command: 'account_info',
        strict: true,
        account: address,
        ledger_index: isNaN(options.ledger) ? options.ledger : Number(options.ledger)
    }).then((result) => {
        const accountData = result.account_data;
        accountData.ledger_current_index = result.ledger_current_index||result.ledger_index;
        const convert = options.convert == false ? false : true;
        const info = convert ? utils.convertKeysToCamelCase(accountData) : accountData;
        return info;
    });
}

module.exports = getAccountInfo;