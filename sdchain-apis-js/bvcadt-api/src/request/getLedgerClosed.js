const utils = require('../lib/common/utils');

/**
 * get closed ledger hash and index.
 * @param {*} chainCore 
 */
function getLedgerClosed(options = {}, chainCore) {
    return chainCore.request({ command: 'ledger_closed' })
        .then((result) => {
            const convert = options.convert == false ? false : true;
            const info = convert ? utils.convertKeysToCamelCase(result) : result;
            return info;
        });
}

module.exports = getLedgerClosed;
