const constants = require('../lib/common/constants')
function parseTrustline (line) {
  return {
    counterparty: line.account,
    currency: line.currency,
    balance: line.balance,
    limit: line.limit,
    spread: line['no_'+constants.BaseChain.toLowerCase()] ? !line['no_'+constants.BaseChain.toLowerCase()] : true,
    frozen: line.freeze ? line.freeze : false,
    counterpartyLimit: line.limit_peer,
    counterpartySpread: line['no_'+constants.BaseChain.toLowerCase()+'_peer'] ? !line['no_'+constants.BaseChain.toLowerCase()+'_peer'] : true,
    counterpartyFrozen: line.freeze_peer ? line.freeze_peer : false

  }
}

module.exports = parseTrustline
