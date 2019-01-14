const utils = require('../lib/common/utils')
const validate = require('../lib/common/validate')
const constants = require('../lib/common/constants')

const getAccountInfo = require('./getAccountInfo')
const getAccountLines = require('./getAccountLines')

/**
 * get Balances info by address
 * @param {string} address
 * @param {*} chainCore 
 */

function getTrustlineBalanceAmount (trustline) {
  return {
    currency: trustline.currency,
    counterparty: trustline.counterparty,
    value: trustline.balance
  }
}

function formatBalances (address, _balances,options) {
  const base = {
    currency: constants.BaseCurrency,
    counterparty: '',
    value: _balances[0].balance
  }
  let balances = []
  if((options.counterparty===undefined&&(options.currency===undefined||options.currency===constants.BaseCurrency))){
    balances.push(base)
  }
  const linesBalance = (_balances[1]&&Array.isArray(_balances[1].lines)) ? _balances[1].lines.map(getTrustlineBalanceAmount) : []
  const linesMarker =  _balances[1] ? _balances[1].marker:undefined
  const result = {
    ledger:_balances[0].ledger,
    account: address,
    ownerCount:_balances[0].ownerCount,
    balances: balances.concat(linesBalance),
    marker: linesMarker
  }
  return result
}

function getBaseBalance (address, options = {} , chainCore) {
  return getAccountInfo(address, options, chainCore).then(data => {
    return {
      ownerCount:data.ownerCount,
      ledger:data.ledgerCurrentIndex,
      balance:utils.dropsToBase(data.balance)
    }
  })
}

function getTrustlines (address, options = {} , chainCore) {
  return getAccountLines(address, options, chainCore).then(data => {
    return data
  })
}

function getBalances (address, options = {} , chainCore) {
  validate.address(address)
  return Promise.all([getBaseBalance(address, options, chainCore), getTrustlines(address, options, chainCore)]).then(results => {

    return formatBalances(address, results,options)
  })
}

module.exports = getBalances
