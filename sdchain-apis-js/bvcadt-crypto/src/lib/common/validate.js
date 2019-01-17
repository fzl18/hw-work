const Errors = require('./errors')
const constants = require('./constants')
const generateAddress = require('../../offline/generateAddress')
const keypairs = require('../../lib/chain-keypairs')

ValidationError = Errors.ValidationError

function field (options,parameter) {
  if(!options[parameter]){
    throw new ValidationError('Missing field: ' + parameter)
  }
}

function address (address) {
  if (!new RegExp('^' + constants.BaseAlphabet.chain.substring(0, 1) + '[1-9A-HJ-NP-Za-km-z]{25,34}$').test(address)) {
    throw new ValidationError('Illegal address: ' + address)
  }
  return true
}

function vAddress (_address) {
  let v = true
  try {
    address(_address)
  } catch (err) {
    v = false
  }
  return v
}

function currency (currency) {
  if (!/^([a-zA-Z0-9]{2,5}|[A-Fa-f0-9]{40})$/.test(currency)) {
    throw new ValidationError('Illegal currency: ' + currency)
  }
  return true
}

function issuer (amount) {
  return amount && currency(amount.currency)
    && ((amount.currency === constants.BaseCurrency && !amount.counterparty && !amount.issuer)
    || (amount.currency !== constants.BaseCurrency && address(
      amount.counterparty || amount.issuer)))
}

function value (value) {
  return typeof value === 'string' && value.length > 0 && isFinite(value)
}

function amount (amount, parameter) {
  if (typeof amount == 'string' && parameter !== 'limitAmount') {
    return
  }
  if ((typeof amount == 'string' && parameter == 'limitAmount') || (!(issuer(amount) && value(amount.value)))) {
    throw new ValidationError('Illegal ' + (parameter ? parameter : 'amount') + '.Must be a valid Amount object')
  }
}

function vAmount (_amount, parameter) {
  let v = true
  try {
    amount(_amount, parameter)
  } catch (err) {
    v = false
  }
  return v
}

function addressAndSecret (address, secret) {
  try {
    if (generateAddress(secret).wallet.address !== address) {
      throw new ValidationError('Illegal secret :the sercet can not match the address')
    }
  } catch (err) {
    throw new ValidationError('Illegal secret :the sercet can not match the address')
  }
}

function secret (secret) {
  try {
    keypairs.deriveKeypair(secret)
  } catch (err) {
    throw new ValidationError('Illegal secret: ' + secret)
  }
}

function apiConstant (options) {
  if (options.baseCurrency) {
    if (options.baseCurrency.toUpperCase() != options.baseCurrency) {
      throw new ValidationError('Illegal baseCurrency: ' + options.baseCurrency + '.Must be capital letters')
    }
  }else {
    throw new ValidationError('Parameter missing: baseCurrency')
  }
  if (options.baseFee) {
    if (!Number.isInteger(options.baseFee)) {
      throw new ValidationError('Illegal baseFee: ' + options.baseFee + '.Must be a number')
    }
  }else {
    throw new ValidationError('Parameter missing: baseFee')
  }
  if (options.baseAlphabet) {
  }else {
    throw new ValidationError('Parameter missing: baseAlphabet')
  }
}

function payees (_payees) {
  if (!Array.isArray(_payees)) {
    throw new ValidationError('Invalid parameter: payees. Must be an array with payee objects')
  }

  if (_payees.length === 0) {
    throw new ValidationError('Invalid parameter: payees. '
      + 'Must contain at least one payee object, '
      + 'otherwise omit the payees property')
  }

  for (let i in _payees) {
    if (!vAddress(_payees[i].destination)) {
      throw new ValidationError('Invalid parameter: '
        + 'destination:payees[' + i + '],' + JSON.stringify(_payees[i]))
    }
    if (!vAmount(_payees[i].amount)) {
      throw new ValidationError('Invalid parameter: '
        + 'amount:payees[' + i + '],' + JSON.stringify(_payees[i]))
    }
  }
}

module.exports = {
  field,
  address,
  currency,
  amount,
  addressAndSecret,
  secret,
  apiConstant,
  payees
}
