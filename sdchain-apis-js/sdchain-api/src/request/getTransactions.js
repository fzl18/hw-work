const utils = require('../lib/common/utils');
const validate = require('../lib/common/validate');
const parseTransaction = require('../offline/parseTransaction');
const parseTransactionV1 = require('../offline/v1/parseTransaction')
/**
 * get transaction info by address
 * options:
 *      binary: {boolean} Optional If true, the transactions will be sent from the server in a condensed binary format rather than JSON.
 *      convert: Convert Keys To CamelCas
 * @param {string} address
 * @param {object} options
 * @param {*} chainCore 
 */
function getTransactions(address, options = {}, chainCore) {
    validate.address(address);
    function parseAccountTransactionV1(_address){
        return function(tx){
            return parseTransactionV1(tx,_address)
        };
    }
    return chainCore.request({
        command: 'account_tx',
        account: address,
        ledger_index_min: options.ledgerIndexMin || -1,
        ledger_index_max: options.ledgerIndexMax || -1,
        binary: options.binary || false,
        limit: options.limit ? Number(options.limit) : null,
        forward: options.forward || false,
        marker: options.marker || null
    }).then((result) => {
        const txParse = options.txParse == false ? false : true
        const isV1 = options.isV1 == true ? true : false
        const transactions = txParse ? result.transactions.map(isV1?parseAccountTransactionV1(address):parseTransaction) : result.transactions;
        const resTransactions = {
            transactions: transactions,
            marker: result.marker
        }
        return resTransactions
    });
}

module.exports = getTransactions