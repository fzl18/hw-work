const utils = require('../lib/common/utils');
/**
 * get transaction info by address
 * options:
 *      binary: {boolean} Optional If true, the transactions will be sent from the server in a condensed binary format rather than JSON.
 *      convert: Convert Keys To CamelCas
 * @param {string} address
 * @param {object} options
 * @param {*} chainCore 
 */
function sign (txJson, options = {} , chainCore) {
  return chainCore.request({
    command: 'sign',
    tx_json: typeof txJson === 'string' ? JSON.parse(txJson) : txJson,
    secret: options.secret
  }).then((result) => {
    const convert = options.convert == false ? false : true
    const info = convert ? utils.convertKeysToCamelCase(result) : result
    return info
  })
}

module.exports = sign
