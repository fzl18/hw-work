const generateAddress = require('./offline/generateAddress')
const isValidAddress = require('./offline/isValidAddress')
const sign = require('./offline/sign')
const base = require('./offline/base')

class ChainAPI {
  constructor() {
  }

  base() {
    return base
  }


  /**
   * create a new address keypair
   */
  generateAddress(secret, entropy) {
    return generateAddress(secret, entropy)
  }

  /**
   * validate address
   * @param {*} address 
   */
  isValidAddress(address) {
    return isValidAddress(address)
  }


  /**
   * local sign submit txJSON.
   * txJSON is the result of prepare method.
   * @param {*} txJSON 
   * @param {*} secret 
   */
  sign(txJSON, secret) {
    return sign(txJSON, secret)
  }
}

module.exports = ChainAPI
