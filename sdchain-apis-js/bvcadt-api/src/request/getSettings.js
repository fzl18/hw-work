const _ = require('lodash')
const getAccountInfo = require('./getAccountInfo')
const constants = require('../lib/common/constants')
const AccountRoot = constants.Flags.AccountRoot
const utils = require('../lib/common/utils')

function buildSettingResult (info) {
  const settings = {
    account : info.account,
    domain :info.domain ? utils.hexToStringUTF8(info.domain) : undefined,
    flags:info.flags,
    transferRate:info.transferRate,
    limitAmounts:info.limitAmounts,
    transferFee:info.transferFee
  }
 
  _.forIn(AccountRoot, (value, key) => {
    if (value & settings.flags) {
      settings[key] = true
    }
  })
  return settings
}

/**
 * get account settings
 * @param {*} address 
 * @param {*} options 
 * @param {*} chainCore 
 */
function getSettings (address, options = {} , chainCore) {
  return getAccountInfo(address, options, chainCore)
    .then((accountInfo) => {
      return buildSettingResult(accountInfo)
    })
}

module.exports = getSettings
