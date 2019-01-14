const parseAmount = require('./parseAmount')
const constants = require('../lib/common/constants')
const BigNumber = require('bignumber.js')

function parseOrderBook (order) {
  const maker = order.Account
  const direction = (order.Flags & constants.Flags.OfferCreate.Sell) === 0 ? 'buy' : 'sell'
  const takerGets = parseAmount(order.TakerGets)
  const takerPays = parseAmount(order.TakerPays)
  const quantity = takerPays
  const totalPrice = takerGets
  const fundedAmount = order.TakerGetsFunded ? parseAmount(order.TakerGetsFunded) : quantity
  const priceOfFundedAmount = order.TakerPaysFunded ? parseAmount(order.TakerPaysFunded) : totalPrice
  const sequence = order.Sequence
  const quality = (new BigNumber(quantity.value)).dividedBy(totalPrice.value).toString()

  return {
    maker: maker,
    quantity: quantity,
    totalPrice: totalPrice,
    fundedAmount: fundedAmount,
    priceOfFundedAmount: priceOfFundedAmount,
    sequence: sequence,
    quality: quality,
    passive: ((order.Flags & constants.Flags.OfferCreate.Passive) !== 0) || undefined
  }
}

module.exports = parseOrderBook
