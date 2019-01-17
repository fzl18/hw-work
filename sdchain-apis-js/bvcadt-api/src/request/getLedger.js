const utils = require('../lib/common/utils');
const _ = require('lodash');

/**
 * get ledger info by options .
 * options:
 *   ledgerIndex : target ledger's index number default is 'validated'.
 *   expand: expand the transactions or accounts info , default is false return hash only.
 *   transactions : return the transactions info, default is false.
 *   accounts: return the accounts info , default is false.
 *   original: if true will return the result without converted.
 * @param {json} options 
 * @param {object} chainCore 
 */
function getLedger(options = {}, chainCore) {
    var request = utils.deleteUndefined({
        command: 'ledger',
        ledger_index: options.ledgerIndex || 'validated',
        expand: options.expand,
        transactions: options.transactions,
        accounts: options.accounts
    });
    return chainCore.request(request).then((result) => {
        const ledger = result.ledger;
        if (options.original) {
            return ledger;
        }
        return convertLedgerResponse(ledger);
    });
}

/**
 * convert ledger reponse.
 * 1. convert keys to camelcase
 * 2. add accountStateHashs info.  
 * 3. add transactionsHashs info
 * @param {*} ledger 
 */
function convertLedgerResponse(ledger) {
    const info = utils.convertKeysToCamelCase(ledger);
    if (info.accountState) {
        info.accountStateHashs = [];
        let expand = true;
        _.forEach(info.accountState, (state) => {
            if (typeof (state) === 'object') {
                info.accountStateHashs.push(state.index);
            } else if (typeof (state) === 'string') {
                info.accountStateHashs.push(state);
                expand = false;
            }
        });
        if (!expand) {
            info.accountState = [];
        }
    }
    if (info.transactions) {
        info.transactionsHashs = [];
        let expand = true;
        _.forEach(info.transactions, (trans) => {
            if (typeof (trans) === 'object') {
                info.transactionsHashs.push(trans.hash);
            } else if (typeof (trans) === 'string') {
                info.transactionsHashs.push(trans);
                expand = false;
            }
        });
        if (!expand) {
            info.transactions = [];
        }
    }
    return info;
}

module.exports = getLedger;