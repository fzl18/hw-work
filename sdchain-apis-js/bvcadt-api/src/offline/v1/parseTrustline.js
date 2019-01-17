const constants = require('../../lib/common/constants')
function parseTrustline (line) {
  const _line = {
    counterparty: line.account,
    currency: line.currency,
    limit: line.limit,
    account_trustline_frozen: line.freeze ? line.freeze : false,
    reciprocated_limit: line.limit_peer,
    counterparty_trustline_frozen: line.freeze_peer ? line.freeze_peer : false
  }
  _line['account_allows_'+constants.BaseChain.toLowerCase()+'ing']=line['no_'+constants.BaseChain.toLowerCase()] ? !line['no_'+constants.BaseChain.toLowerCase()] : true;
  _line['counterparty_allows_'+constants.BaseChain.toLowerCase()+'ing']=line['no_'+constants.BaseChain.toLowerCase()+'_peer'] ? !line['no_'+constants.BaseChain.toLowerCase()+'_peer'] : true

  return _line
}

module.exports = parseTrustline
