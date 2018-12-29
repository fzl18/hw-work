const Cable = require('./CableRequest')
const DataAPI = require('./DataAPIRequest')
const Cache = require('./CacheRequest')
const Health = require('./HealthRequest')
module.exports = {
  newWallet: Cable.newWallet,
  server: Cable.server,
  balances: Cable.balances,

  ledgers: DataAPI.ledgers,
  ledgerList: DataAPI.ledgerList,
  ledgerDetail: DataAPI.ledgerDetail,
  payments: DataAPI.payments,
  transactions: DataAPI.transactions,
  transaction: DataAPI.transaction,
  transactionsAccount: DataAPI.transactionsAccount,
  paymentsCurrency: DataAPI.paymentsCurrency,
  dataBalances: DataAPI.balances,
  transactionsTotal: DataAPI.transactionsTotal,

  txCharts: Cache.txCharts,
  cLedgers: Cache.ledgers,
  cTransactions: Cache.transactions,

  health:Health.inspect,
  tokenDetail:Cable.tokenDetail

}
