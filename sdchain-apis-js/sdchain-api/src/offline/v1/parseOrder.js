const parseAmount = require('../parseAmount')
const constants = require('../../lib/common/constants')

function parseOrder (order) {
  const type = (order.flags & constants.Flags.Order.Sell) === 0 ? 'buy' : 'sell'
  const takerGets = parseAmount(order.taker_gets)
  const takerPays = parseAmount(order.taker_pays)
  return {
    type: type,
    taker_gets: takerGets,
    taker_pays: takerPays,
    sequence: order.seq,
    passive: ((order.flags & constants.Flags.Order.Passive) !== 0) || undefined,
    expirationTime: order.expiration
  }
}

module.exports = parseOrder
