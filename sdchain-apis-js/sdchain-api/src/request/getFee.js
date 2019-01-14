const getServerInfo = require('./getServerInfo')
const BigNumber = require('bignumber.js')
const constants = require('../lib/common/constants')

/**
 * get chain core server info.
 * @param {*} options 
 * @param {*} chainCore 
 */
function getFee (options = {} , chainCore) {
  return getServerInfo({}, chainCore).then((result) => {
    const serverInfo = result
    const baseFee = new BigNumber(serverInfo.validatedLedger.baseFee)
    let fee = baseFee.times(serverInfo.loadFactor).times(constants.BaseCushion)
    fee = BigNumber.min(fee, options.maxFee ? options.maxFee : fee)
    const feeJson = {
      fee: fee.toString(10)
    }
    return feeJson
  })
}

module.exports = getFee
