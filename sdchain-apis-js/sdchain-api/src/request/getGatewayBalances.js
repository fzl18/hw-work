const utils = require('../lib/common/utils');
const validate = require('../lib/common/validate');
/**
 * get account info by address
 * @param {string} address 
 * @param {object} chainCore 
 */
function getGatewayBalances(address, options = {}, chainCore) {
    validate.address(address);
    return chainCore.request({
        command: 'gateway_balances',
        strict: true,
        account: address,
        ledger_index: isNaN(options.ledger) ? options.ledger : Number(options.ledger)
    }).then((result) => {
        const convert = options.convert == false ? false : true;
        const info = convert ? utils.convertKeysToCamelCase(result) : result;
        if(convert){
            info.obligations = result.obligations
            info.balances = result.balances
            info.assets = result.assets
        }
        return info;
    });
}

module.exports = getGatewayBalances;