const utils = require('../../lib/common/utils')
const parseAmount = require('../parseAmount')
const parseFlags = require('../parseFlags')
const constants = require('../../lib/common/constants')

function parseTransaction (_tx, account) {
  const tx = _tx.tx || _tx
  const txValidated = _tx.tx === undefined ? tx.validated : _tx.validated
  let transaction = {
    hash: tx.hash,
    account: tx.Account,
    state: txValidated === true ? 'validated' : 'pending',
    type: tx.TransactionType,
    date: tx.date ? utils.toTimestamp(tx.date) / 1000 : '',
    time: (tx.date ? new Date(utils.toTimestamp(tx.date)).toISOString() : ''),
    fee: utils.dropsToBase(tx.Fee) || '',
    ledger: tx.ledger_index ? tx.ledger_index + '' : 'pending',
    sequence: tx.Sequence,
    validated: txValidated,
    result: txValidated === true ? _tx.meta.TransactionResult : undefined,
    txnFee: tx.TxnFee,
    effects: _tx.meta ? _tx.meta.AffectedNodes : undefined
  }
  if (tx.ledger_current_index && tx.LastLedgerSequence && txValidated === undefined && tx.ledger_current_index > tx.LastLedgerSequence) {
    transaction.state = 'failed'
  }
  if (Array.isArray(tx.Memos) && tx.Memos.length > 0) {
    transaction.memos = []
    transaction.simple_memos = []
    for (let m = 0; m < tx.Memos.length; m++) {
      const memo = {
        memo_type: tx.Memos[m].Memo.MemoType,
        memo_data: tx.Memos[m].Memo.MemoData
      }
      const simpleMemo = {
        memo_type: tx.Memos[m].Memo.MemoType ? utils.hexToStringUTF8(tx.Memos[m].Memo.MemoType) : undefined,
        memo_data: tx.Memos[m].Memo.MemoData ? utils.hexToStringUTF8(tx.Memos[m].Memo.MemoData) : undefined
      }
      transaction.memos.push(memo)
      transaction.simple_memos.push(simpleMemo)
    }
  }
  if (tx.TransactionType == 'Payment') {
    transaction.effects = []
    transaction.destination = tx.Destination
    if (account) {
      transaction.counterparty = (account === tx.Account ? tx.Destination : tx.Account)
      transaction.direction = (account === tx.Account ? 'outgoing' : (account === tx.Destination ? 'incoming' : 'passthrough'))
    }
    transaction.amount = parseAmount(tx.Amount, true)
    transaction.destination_tag = tx.DestinationTag
  } else if (tx.TransactionType == 'OfferCreate') {
    const flags = parseFlags(tx.Flags, constants.FlagsStr.OfferCreateFlags)
    const taker_gets = parseAmount(tx.TakerGets)
    const taker_getsStr = taker_gets.counterparty == '' ? taker_gets.currency : taker_gets.currency + ':' + taker_gets.counterparty
    const taker_pays = parseAmount(tx.TakerPays)
    const taker_paysStr = taker_pays.counterparty == '' ? taker_pays.currency : taker_pays.currency + ':' + taker_pays.counterparty
    transaction.offertype = flags.sell ? 'sell' : 'buy'
    transaction.seq = tx.Sequence
    transaction.effects = []

    const effect = {
      effect: 'offer_created',
      type: flags.sell ? 'sell' : 'buy',
      seq: tx.Sequence,
      price: taker_gets.value,
      pair: taker_getsStr + '/' + taker_paysStr,
      amount: taker_pays
    }
    transaction.effects.push(effect)
    transaction.pair = effect.pair
    transaction.price = effect.price
    transaction.amount = effect.amount
    if (_tx.meta) {
      for (let i = 0;i < _tx.meta.AffectedNodes.length;i++) {
        const affectedNode = _tx.meta.AffectedNodes[i]
        if (affectedNode.CreatedNode && affectedNode.CreatedNode.LedgerEntryType == 'Offer' && affectedNode.CreatedNode.NewFields) {
          const createdOfferd = affectedNode.CreatedNode.NewFields
          const _takerGets = parseAmount(createdOfferd.TakerGets)
          const _takerGetsStr = _takerGets.counterparty == '' ? _takerGets.currency : _takerGets.currency + ':' + _takerGets.counterparty
          const _takerPays = parseAmount(createdOfferd.TakerPays)
          const _takerPaysStr = _takerPays.counterparty == '' ? _takerPays.currency : _takerPays.currency + ':' + _takerPays.counterparty
          const createdOffer = {
            effect: 'offerCreated',
            type: createdOfferd.Flags == 131072 ? 'sell' : 'buy',
            seq: createdOfferd.Sequence,
            price: _takerGets.value,
            pair: _takerGetsStr + '/' + _takerPaysStr,
            amount: _takerPays
          }
          transaction.effects.push(createdOffer)
        }
        if (affectedNode.ModifiedNode && affectedNode.ModifiedNode.LedgerEntryType == 'Offer' && affectedNode.ModifiedNode.FinalFields) {
          const modifiedOfferd = affectedNode.ModifiedNode.FinalFields
          const _takerGets = parseAmount(modifiedOfferd.TakerGets)
          const _takerGetsStr = _takerGets.counterparty == '' ? _takerGets.currency : _takerGets.currency + ':' + _takerGets.counterparty
          const _takerPays = parseAmount(modifiedOfferd.TakerPays)
          const _takerPaysStr = _takerPays.counterparty == '' ? _takerPays.currency : _takerPays.currency + ':' + _takerPays.counterparty
          const modifiedOffer = {
            effect: 'offerDeleted',
            account: modifiedOfferd.Account,
            type: modifiedOfferd.Flags == 131072 ? 'sell' : 'buy',
            seq: modifiedOfferd.Sequence,
            pair: _takerGetsStr + '/' + _takerPaysStr,
            price: _takerGets.value,
            amount: _takerPays
          }
          if (affectedNode.ModifiedNode.PreviousFields) {
            const _takerGetsD = parseAmount(affectedNode.ModifiedNode.PreviousFields.TakerGets)
            const _takerPaysD = parseAmount(affectedNode.ModifiedNode.PreviousFields.TakerPays)
            modifiedOffer.prePrice = _takerGetsD.value
            modifiedOffer.preAmount = _takerPaysD
          }
          transaction.effects.push(modifiedOffer)
        }
        if (affectedNode.DeletedNode && affectedNode.DeletedNode.LedgerEntryType == 'Offer' && affectedNode.DeletedNode.FinalFields) {
          const deletedOfferd = affectedNode.DeletedNode.FinalFields
          const _takerGets = parseAmount(deletedOfferd.TakerGets)
          const _takerGetsStr = _takerGets.counterparty == '' ? _takerGets.currency : _takerGets.currency + ':' + _takerGets.counterparty
          var _takerPays = parseAmount(deletedOfferd.TakerPays)
          const _takerPaysStr = _takerPays.counterparty == '' ? _takerPays.currency : _takerPays.currency + ':' + _takerPays.counterparty

          const deletedOffer = {
            effect: 'offerDeleted',
            account: deletedOfferd.Account,
            type: deletedOfferd.Flags == 131072 ? 'sell' : 'buy',
            seq: deletedOfferd.Sequence,
            pair: _takerGetsStr + '/' + _takerPaysStr,
            price: _takerGets.value,
            amount: _takerPays
          }
          if (affectedNode.DeletedNode.PreviousFields) {
            const _takerGetsD = parseAmount(affectedNode.DeletedNode.PreviousFields.TakerGets)
            const _takerPaysD = parseAmount(affectedNode.DeletedNode.PreviousFields.TakerPays)
            deletedOffer.prePrice = _takerGetsD.value
            deletedOffer.preAmount = _takerPaysD
          }
          transaction.effects.push(deletedOffer)
        }
      }
    }
  } else if (tx.TransactionType == 'OfferCancel') {
    transaction.effects = []
    transaction.offerseq = tx.OfferSequence

    const effect = {}
    if (_tx.meta) {
      for (let i = 0; i < _tx.meta.AffectedNodes.length; i++) {
        if (_tx.meta && _tx.meta.AffectedNodes[i].DeletedNode && _tx.meta.AffectedNodes[i].DeletedNode.LedgerEntryType == 'Offer') {
          var deletedField = _tx.meta.AffectedNodes[i].DeletedNode.FinalFields
          effect.effect = 'offer_cancel'
          effect.type = deletedField.Flags == 131072 ? 'sell' : 'buy'
          effect.seq = _tx.OfferSequence
          const taker_gets = parseAmount(deletedField.TakerGets, true)
          const taker_getsStr = taker_gets.issuer == '' ? taker_gets.currency : taker_gets.currency + ':' + taker_gets.issuer
          const taker_pays = parseAmount(deletedField.TakerPays, true)
          const taker_paysStr = taker_pays.issuer == '' ? taker_pays.currency : taker_pays.currency + ':' + taker_pays.issuer
          effect.price = taker_gets.value
          effect.pair = taker_getsStr + '/' + taker_paysStr
          effect.amount = taker_pays
          effect.deleted = true
          transaction.effects.push(effect)
        }
      }
    }
  } else if (tx.TransactionType == 'TrustSet') {
    transaction.effects = []
    transaction.amount = parseAmount(tx.LimitAmount, true)
    transaction.counterparty = transaction.amount.counterparty
  } else if (tx.TransactionType == 'AccountSet') {
  }else if (tx.TransactionType == 'MultiPayment') {
    const payees = []
    transaction.effects = []
    for (let p in tx.Payees) {
      const payee = {
        destination: tx.Payees[p].Payee.Destination,
        amount: parseAmount(tx.Payees[p].Payee.Amount, true)
      }
      payees.push(payee)
    }
    transaction.payees = payees
  }
  return transaction
}

module.exports = parseTransaction
