const lib = require('../lib')
function generateAddress(secret, entropy) {
  return {
    wallet: lib.generateAddress(secret, entropy)
  }
}

module.exports = generateAddress
