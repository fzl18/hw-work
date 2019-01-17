const utils = require('../lib/common/utils')
const parseTransaction = require('../offline/parseTransaction')
const parseTransactionV1 = require('../offline/v1/parseTransaction')
/**
 * get transaction info by id
 * options:
 *      convert: Convert Keys To CamelCas
 * @param {string} id 
 * @param {object} chainCore 
 */
function getTransaction (id, options = {} , chainCore) {
  // validate.getTransaction(id)
  return chainCore.request({
    command: 'tx',
    transaction: id,
    maxLedgerVersion: options.maxLedgerVersion,
    minLedgerVersion: options.minLedgerVersion
  }).then((result) => {
    const txParse = options.txParse == false ? false : true
    const convert = options.convert == false ? false : true
    const isV1 = options.isV1 == true ? true : false
    const _result = txParse ? (isV1 ? parseTransactionV1(result) : parseTransaction(result)) : result
    const info = convert&&!isV1 ? utils.convertKeysToCamelCase(_result) : _result
    return info
  })
}

module.exports = getTransaction
