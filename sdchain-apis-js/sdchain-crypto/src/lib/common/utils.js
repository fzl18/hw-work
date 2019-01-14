const _ = require('lodash')
const BigNumber = require('bignumber.js')
const constants = require('./constants')
const Errors = require('./errors')
ValidationError = Errors.ValidationError

function renameKeys(object, mapping) {
  _.forEach(mapping, function (to, from) {
    object[to] = object[from]
    delete object[from]
  })
}

function convertKeysToCamelCase(obj, firstLowCase = true) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj) && obj.length == 0) {
      return [];
    }
    let newKey
    return _.reduce(obj, (result, value, key) => {
      if (firstLowCase && typeof (key) === 'string') {
        key = key.slice(0, 1).toLowerCase() + key.slice(1)
        newKey = key
        // taking this out of function leads to error in PhantomJS
        const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g
        if (FINDSNAKE.test(key)) {
          newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase())
        }
        result[newKey] = convertKeysToCamelCase(value)
        return result
      } else if (typeof (key) === 'number') {
        if (!(result instanceof Array)) {
          result = []
        }
        result.push(convertKeysToCamelCase(value))
        return result
      }
    }, {})
  }
  return obj
}

function deleteUndefined(obj) {
  return _.reduce(obj, (result, value, key) => {
    if (value != undefined) {
      result[key] = value
    }
    return result
  }, {})
}

function dropsToBase(drops) {
  return (new BigNumber(drops)).dividedBy(constants.BaseDrops).toString()
}

function baseToDrops(base) {
  return (new BigNumber(base)).times(constants.BaseDrops).floor().toString()
}

function toTimestamp(rpepoch) {
  return (rpepoch + 0x386D4380) * 1000
}

function getTxBitFlags(tx_json, options) {
  for (var flagName in options.flags) {
    var flag = options.flags[flagName]

    // Set transaction flags
    if (!(flag.name in options.input)) {
      continue
    }

    var value = options.input[flag.name]

    if (value === options.clear_setting) {
      value = false
    }

    if (flag.unset) {
      tx_json = setFlags(tx_json, value ? flag.set : flag.unset)
    } else if (flag.set && value) {
      tx_json = setFlags(tx_json, flag.set)
    }
  }
  return tx_json
}

function setFlags(tx_json, flags) {
  if (flags === undefined) {
    return tx_json
  }

  if (typeof flags === 'number') {
    tx_json.Flags = flags
    return tx_json
  }

  var transaction_flags = constants.Flags[tx_json.TransactionType] || {}
  var flag_set = Array.isArray(flags) ? flags : [flags]

  for (var i = 0, l = flag_set.length; i < l; i++) {
    var flag = flag_set[i]

    if (transaction_flags.hasOwnProperty(flag)) {
      tx_json.Flags += transaction_flags[flag]
    } else {
      // XXX Should throw?
      throw new ValidationError('tejInvalidFlag')
    }
  }

  return tx_json
}

function convertStringToHex(string) {
  return new Buffer(string, 'utf8').toString('hex').toUpperCase()
}

function convertMemo(memo) {
  const _memo = {
    Memo: deleteUndefined({
      MemoType: memo.memoType ? convertStringToHex(memo.memoType) : undefined,
      MemoData: memo.memoData ? convertStringToHex(memo.memoData) : undefined
    })
  }
  return _memo
}

function hexToString(h) {
  var a = []
  var i = 0

  if (h.length % 2) {
    a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)))
    i = 1
  }

  for (; i < h.length; i += 2) {
    a.push(String.fromCharCode(parseInt(h.substring(i, i + 2), 16)))
  }

  return a.join('')
}

function hexToStringUTF8(h) {
  return new Buffer(h, 'hex').toString('utf-8')
}

function amountToDrops(amount) {
  if (typeof amount === 'object' && amount.currency === constants.BaseCurrency) {
    return baseToDrops(amount.value)
  }
  return amount
}

module.exports = {
  renameKeys,
  convertKeysToCamelCase,
  deleteUndefined,
  dropsToBase,
  baseToDrops,
  toTimestamp,
  getTxBitFlags,
  convertStringToHex,
  hexToString,
  convertMemo,
  amountToDrops,
  hexToStringUTF8
}
