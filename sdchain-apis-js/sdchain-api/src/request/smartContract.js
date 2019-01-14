const utils = require('../lib/common/utils')

function smartContract (hash, options = {} , chainCore) {
  return chainCore.request({
    command: 'sc',
    transaction: hash,
    tx_json: typeof options.txJson === 'string' ? JSON.parse(options.txJson) : options.txJson,
  }).then((result) => {
    const convert = options.convert == false ? false : true
    const info = convert ? utils.convertKeysToCamelCase(result) : result
    return info
  })
}

module.exports = smartContract
