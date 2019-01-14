const utils = require('../lib/common/utils')
const validate = require('../lib/common/validate')
const parseOrder = require('../offline/parseOrder')
const parseOrderV1 = require('../offline/v1/parseOrder')
/**
 * get orders info by address
 * options:
 *      ledger: {string}   Optional Return orders as of this historical ledger version.
 *      limit: {integer}   Optional At most this many orders will be returned.
 * @param {string} address
 * @param {json} options
 * @param {*} chainCore 
 */
function getOrders (address, options = {} , chainCore) {
  validate.address(address)
  return chainCore.request({
    command: 'account_offers',
    account: address,
    ledger_index: isNaN(options.ledger) ? options.ledger : Number(options.ledger),
    limit: options.limit ? Number(options.limit) : undefined,
    marker: options.marker,
  }).then((result) => {
    const isV1 = options.isV1 == true ? true : false
    const offers = result.offers.map(isV1?parseOrderV1:parseOrder)
    const convert = options.convert == false ? false : true
    const resInfo = {
      orders: (convert&&!isV1) ? utils.convertKeysToCamelCase(result.offers) : offers,
      marker: result.marker
    }
    return resInfo
  })
}

module.exports = getOrders
