const utils = require('../lib/common/utils')
const validate = require('../lib/common/validate')
const parseTrustline = require('../offline/parseTrustline')
const parseTrustlineV1 = require('../offline/v1/parseTrustline')

/**
 * get account trust lines by address.
 * options:
 *   limit: the result size of query ,must be within the inclusive range 10 to 400. 
 *   marker: the start marker for limit query.
 * @param {*} address 
 * @param {*} options 
 * @param {*} chainCore 
 */
function currencyFilter (currency, trustline) {
  return currency === null || trustline.currency === currency
}

function getAccountLines (address, options = {} , chainCore) {
  validate.address(address)
  const request = utils.deleteUndefined({
    command: 'account_lines',
    account: address,
    ledger_index: isNaN(options.ledger) ? options.ledger : Number(options.ledger),
    limit: options.currency ? undefined : (Number(options.limit) || 100),
    peer: options.counterparty,
    marker: options.marker
  })

  return chainCore.request(request).then((result) => {
    const isV1 = options.isV1 == true ? true : false
    const trustlines = result.lines.map(isV1?parseTrustlineV1:parseTrustline).filter(trustline => {
      return currencyFilter(options.currency || null, trustline)
    })
    const convert = options.convert == false ? false : true
    const accountLines = {
      lines: convert ? utils.convertKeysToCamelCase(trustlines) : trustlines,
      marker: result.marker
    }

    return accountLines
  })
}

module.exports = getAccountLines
