const parseAmount = require('./parseAmount')
const constants = require('../lib/common/constants')

function parseOrder (order) {
  const direction = (order.flags & constants.Flags.Order.Sell) === 0 ? 'buy' : 'sell'
  const takerGets = parseAmount(order.taker_gets)
  const takerPays = parseAmount(order.taker_pays)
  const quantity = (direction === 'buy') ? takerPays : takerGets
  const totalPrice = (direction === 'buy') ? takerGets : takerPays
  return {
    direction: direction,
    quantity: quantity,
    totalPrice: totalPrice,
    sequence: order.seq,
    passive: ((order.flags & constants.Flags.Order.Passive) !== 0) || undefined,
    expirationTime: order.expiration
  }
}

module.exports = parseOrder
