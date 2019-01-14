const parseAmount = require('../parseAmount')
const constants = require('../../lib/common/constants')
const BigNumber = require('bignumber.js')
BigNumber.set({
  DECIMAL_PLACES: 20
});
function parseOrderBook (order,isAsk) {
  const maker = order.Account
  const takerGets = parseAmount(order.TakerGets)
  const takerPays = parseAmount(order.TakerPays)
  const taker_gets_total = takerGets
  const taker_pays_total = takerPays
  const taker_gets_funded = order.TakerGetsFunded ? parseAmount(order.TakerGetsFunded) : takerGets
  const taker_pays_funded = order.TakerPaysFunded ? parseAmount(order.TakerPaysFunded) : takerPays
  const sequence = order.Sequence
  let price;
  if (isAsk) {
    price = {
      currency: taker_pays_total.currency,
      counterparty: taker_pays_total.counterparty,
      value: new BigNumber(taker_pays_total.value).dividedBy(
        new BigNumber(taker_gets_total.value))
    };
  } else {
    price = {
      currency: taker_gets_total.currency,
      counterparty: taker_gets_total.counterparty,
      value: new BigNumber(taker_gets_total.value).dividedBy(
        new BigNumber(taker_pays_total.value))
    };
  }
  price.value = price.value.toString();
  return {
    price: price,
    taker_gets_funded: taker_gets_funded,
    taker_gets_total: taker_gets_total,
    taker_pays_funded: taker_pays_funded,
    taker_pays_total:taker_pays_total,
    order_maker: maker,
    sequence: sequence,
    passive: (order.Flags & constants.Flags.Order.Passive) !== 0,
    sell: (order.Flags & constants.Flags.Order.Sell) !== 0
  }
}

module.exports = parseOrderBook
