const lib = require('../lib')
function isValidAddress(address) {
  return {
    wallet: lib.isValidAddress(address)
  }
}

module.exports = isValidAddress
