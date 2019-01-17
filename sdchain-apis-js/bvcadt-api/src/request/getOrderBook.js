const utils = require('../lib/common/utils')
const validate = require('../lib/common/validate')
const parseOrderBook = require('../offline/parseOrderBook')
const parseOrderBookV1 = require('../offline/v1/parseOrderBook')
/**
 * get orderbook info by address
 * options:
 *      ledgerIndex: {string}   Optional Return orders as of this historical ledger version.
 *      limit: {integer}   Optional At most this many orders will be returned.
 * @param {string} address
 * @param {JSON} taker_gets
 * @param {JSON} taker_pays
 * @param {json} options
 * @param {*} chainCore 
 */
function getOrderBook (takerGets, takerPays, options = {} , chainCore) {
  function parseOrderBooksV1(isAsk){
    return function(order){
        return parseOrderBookV1(order,isAsk)
    };
  }
  if (options.address) {
    validate.address(options.address)
  }

  return chainCore.request({
    command: 'book_offers',
    taker: options.address,
    taker_gets: takerGets,
    taker_pays: takerPays,
    ledger_index: isNaN(options.ledger) ? options.ledger : Number(options.ledger),
    limit: options.limit ? Number(options.limit) : undefined,
    marker: options.marker
  }).then((result) => {
    const isV1 = options.isV1 == true ? true : false
    const offers = result.offers.map(isV1?parseOrderBooksV1(options.isAsk):parseOrderBook)
    const info = isV1?offers:utils.convertKeysToCamelCase(offers)
    return info
  })
}

module.exports = getOrderBook
