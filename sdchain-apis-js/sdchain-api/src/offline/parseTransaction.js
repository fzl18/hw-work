const utils = require('../lib/common/utils')
const parseAmount = require('../offline/parseAmount')

function parseTransaction (_tx) {
  const tx = _tx.tx || _tx
  const txValidated = _tx.tx === undefined ? tx.validated : _tx.validated
  let transaction = {
    hash: tx.hash,
    account: tx.Account,
    state: txValidated === true ? 'validated' : 'pending',
    type: tx.TransactionType,
    date: tx.date ? utils.toTimestamp(tx.date) / 1000 : '',
    fee: utils.dropsToBase(tx.Fee) || '',
    ledger: tx.ledger_index,
    sequence: tx.Sequence,
    validated: txValidated,
    result: txValidated === true ? _tx.meta.TransactionResult : undefined
  }
  if (tx.ledger_current_index && tx.LastLedgerSequence && txValidated === undefined && tx.ledger_current_index > tx.LastLedgerSequence) {
    transaction.state = 'fail'
  }
  if (Array.isArray(tx.Memos) && tx.Memos.length > 0) {
    transaction.memos = []
    transaction.simpleMemos = []
    for (let m = 0; m < tx.Memos.length; m++) {
      const memo = {
        memoType:tx.Memos[m].Memo.MemoType,
        memoData:tx.Memos[m].Memo.MemoData
      }
      const simpleMemo = {
        memoType:tx.Memos[m].Memo.MemoType ? utils.hexToStringUTF8(tx.Memos[m].Memo.MemoType) : undefined,
        memoData:tx.Memos[m].Memo.MemoData ? utils.hexToStringUTF8(tx.Memos[m].Memo.MemoData) : undefined
      }
      transaction.memos.push(memo)
      transaction.simpleMemos.push(simpleMemo)
    }
  }
  transaction.changes = []
  if (txValidated === undefined) {
    return transaction
  }
  let effect = {}
  if (tx.TransactionType == 'Payment') {
    effect.source = tx.Account
    effect.destination = tx.Destination
    effect.amount = parseAmount(tx.Amount, true)
  } else if (tx.TransactionType == 'OfferCreate') {
    effect.seq = tx.Sequence
    const taker_gets = parseAmount(tx.TakerGets)
    const taker_getsStr = taker_gets.counterparty == '' ? taker_gets.currency : taker_gets.currency + ':' + taker_gets.counterparty
    const taker_pays = parseAmount(tx.TakerPays)
    const taker_paysStr = taker_pays.counterparty == '' ? taker_pays.currency : taker_pays.currency + ':' + taker_pays.counterparty
    effect.price = taker_gets.value
    effect.pair = taker_getsStr + '/' + taker_paysStr
    effect.amount = taker_pays
  } else if (tx.TransactionType == 'OfferCancel') {
    effect.offerSeq = tx.OfferSequence
    for (let i = 0; i < _tx.meta.AffectedNodes.length; i++) {
      if (_tx.meta.AffectedNodes[i].DeletedNode && _tx.meta.AffectedNodes[i].DeletedNode.LedgerEntryType == 'Offer') {
        const taker_gets = parseAmount(_tx.meta.AffectedNodes[i].DeletedNode.FinalFields.TakerGets, true)
        const taker_getsStr = taker_gets.issuer == '' ? taker_gets.currency : taker_gets.currency + ':' + taker_gets.issuer
        const taker_pays = parseAmount(_tx.meta.AffectedNodes[i].DeletedNode.FinalFields.TakerPays, true)
        const taker_paysStr = taker_pays.issuer == '' ? taker_pays.currency : taker_pays.currency + ':' + taker_pays.issuer
        effect.price = taker_gets.value
        effect.pair = taker_getsStr + '/' + taker_paysStr
        effect.amount = taker_pays
        effect.deleted = true
      }
    }
  } else if (tx.TransactionType == 'TrustSet') {
    effect.amount = parseAmount(tx.LimitAmount, true)
  } else if (tx.TransactionType == 'AccountSet') {
    effect.domain = tx.Domain ? utils.hexToString(tx.Domain) : undefined
    effect.defaultSpread = tx.SetFlag == 8 ? true : undefined
  }

  if (effect) {
    transaction.changes.push(effect)
  }
  return transaction
}

module.exports = parseTransaction
