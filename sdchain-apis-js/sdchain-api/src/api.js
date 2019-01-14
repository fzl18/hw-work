const ChainCoreRPC = require('./lib/common/chaincorerpc')
const ChainCoreWS = require('./lib/common/chaincorews')
const parseURL = require('url').parse
const EventEmitter = require('events').EventEmitter
const getServerInfo = require('./request/getServerInfo')
const getFee = require('./request/getFee')
const generateAddress = require('./offline/generateAddress')
const isValidAddress = require('./offline/isValidAddress')
const getAccountInfo = require('./request/getAccountInfo')
const getSettings = require('./request/getSettings')
const getAccountLines = require('./request/getAccountLines')
const getTransactions = require('./request/getTransactions')
const getTransaction = require('./request/getTransaction')
const getOrders = require('./request/getOrders')
const getBalances = require('./request/getBalances')
const getOrderBook = require('./request/getOrderBook')
const getTrustLines = require('./request/getTrustLines')
const getLedger = require('./request/getLedger')
const getLedgerClosed = require('./request/getLedgerClosed')
const sign = require('./offline/sign')
const coreSign = require('./request/sign')
const parseTransaction = require('./offline/parseTransaction')
const preparePayment = require('./request/preparePayment')
const prepareTrustline = require('./request/prepareTrustline')
const prepareSetting = require('./request/prepareSetting')
const prepareOrder = require('./request/prepareOrder')
const prepareOrderV1 = require('./request/v1/prepareOrder')
const prepareOrderCancellation = require('./request/prepareOrderCancellation')
const submit = require('./request/submit')
const smartContract = require('./request/smartContract')
const getGatewayBalances = require('./request/getGatewayBalances')
const prepareMultiPayment = require('./request/prepareMultiPayment')
const base = require('./offline/base')
const error = require('./lib/common/errors')
const validate = require('./lib/common/validate')
const constants = require('./lib/common/constants')

class ChainAPI extends EventEmitter {
  constructor (options = {}) {
    super()
    const url = options.url
    let ChainCore = ChainCoreRPC
    const self = this
    if (url !== undefined) {
      const parsedURL = parseURL(url)
      if (parsedURL.protocol === 'wss:' || parsedURL.protocol === 'ws:') {
        ChainCore = ChainCoreWS
      }
      self.chainCore = new ChainCore(url, options)
      self._eventPrefix = self.chainCore.getEventPrefix()
      self.chainCore.on(self._eventPrefix + 'error', (errorCode, errorMessage, data) => {
        self.emit('api-error', errorCode, errorMessage, data)
      })
      self.chainCore.on(self._eventPrefix + 'connected', () => {
        self.emit('api-connected')
      })
      self.chainCore.on(self._eventPrefix + 'disconnected', () => {
        self.emit('api-disconnected')
      })
    } else {
      self.chainCore = new ChainCore(null, options)
    }
  }

  base () {
    return base
  }
  error(){
    return error
  }
  validate(){
    return validate
  }
  /**
   * connect to chain core
   */
  connect () {
    return this.chainCore.connect()
  }

  /**
   * if connected to chain core
   */
  isConnected () {
    return this.chainCore.isConnected()
  }

  /**
   * close the connection
   */
  disconnect () {
    return this.chainCore.disconnect()
  }

  /**
   * get chain core server info.
   * @param {*} options 
   */
  getServerInfo (options) {
    return getServerInfo(options, this.chainCore)
  }

  /**
   * get chain core server info.
   * @param {*} options 
   */
  getFee (options) {
    return getFee(options, this.chainCore)
  }

  /**
   * create a new address keypair
   */
  generateAddress (secret, entropy) {
    return generateAddress(secret, entropy)
  }

  /**
   * validate address
   * @param {*} address 
   */
  isValidAddress (address) {
    return isValidAddress(address)
  }

  /**
   * get account info by address  
   * @param {string} address 
   * @param {object} options 
   */
  getAccountInfo (address, options) {
    return getAccountInfo(address, options, this.chainCore)
  }

  /**
   * get account settings by address
   * @param {string} address 
   * @param {object} options 
   */
  getSettings (address, options) {
    return getSettings(address, options, this.chainCore)
  }

  /**
   * get account trust lines by address
   * options:
   *   limit: the result size of query. 
   *   marker: the start marker for limit query.
   * @param {string} address
   * @param {object} options  
   */
  getAccountLines (address, options) {
    return getAccountLines(address, options, this.chainCore)
  }

  /**
   * get account trust lines by address
   * options:
   *   limit: the result size of query, must be within the inclusive range 10 to 400. 
   *   marker: the start marker for limit query.
   * @param {string} address
   * @param {object} options  
   */
  getTrustLines (address, options) {
    return getTrustLines(address, options, this.chainCore)
  }

  /**
   * get balances by address
   * @param {string} address
   * @param {object} options  
   */
  getBalances (address, options) {
    return getBalances(address, options, this.chainCore)
  }

  /**
   * get transactions by address
   * @param {string} address
   * @param {object} options  
   */
  getTransactions (address, options) {
    return getTransactions(address, options, this.chainCore)
  }

  /**
   * get transaction by hash
   * @param {*} id
   * @param {*} options
   */
  getTransaction (id, options) {
    return getTransaction(id, options, this.chainCore)
  }

  /**
   * get orders by address
   * @param {string} address
   * @param {object} options  
   */
  getOrders (address, options) {
    return getOrders(address, options, this.chainCore)
  }

  /**
   * get getOrderBook by address
   * @param {*} address
   * @param {*} takerGets
   * @param {*} takerPays
   * @param {*} options
   */
  getOrderBook (takerGets, takerPays, options) {
    return getOrderBook(takerGets, takerPays, options, this.chainCore)
  }

  /**
   * get ledger info by options .
   * options: 
   *   ledgerIndex : target ledger's index number default is 'validated'.
   *   expand: expand the transactions or accounts info , default is false return hash only.
   *   transactions : return the transactions info, default is false.
   *   accounts: return the accounts info , default is false.
   *   original: if true will return the result without converted.
   * @param {json} options 
   */
  getLedger (options) {
    return getLedger(options, this.chainCore)
  }

  /**
   * get closed ledger hash and index.
   */
  getLedgerClosed () {
    return getLedgerClosed({}, this.chainCore)
  }

  /**
   * local sign or core sign submit txJSON.
   * txJSON is the result of prepare method.
   * @param {*} txJSON 
   * @param {*} secret 
   * @param {*} isCoreSign 
   */
  sign(txJSON, secret, isCoreSign) {
    return isCoreSign ? coreSign(txJSON, { secret: secret }, this.chainCore) : sign(txJSON, secret)
  }

  /**
   *   parseTransaction
   *   account is option
   * @param {*} tx 
   * @param {*} account 
   */
  parseTransaction (tx, account) {
    return parseTransaction(tx, account)
  }
  /**
   * parseAmount
   * amount{
   * "currency":
   * "value":
   * "issuer"/"counterparty"
   * }
   * @param {*} chaindAmount 
   * @param {*} useIssuer 
   */
  parseAmount (chaindAmount, useIssuer) {
    return parseAmount(chaindAmount, useIssuer)
  }

  preparePayment (address, options) {
    return preparePayment(address, options, this.chainCore)
  }

  prepareTrustline (address, options) {
    return prepareTrustline(address, options, this.chainCore)
  }
  prepareSetting (address, options) {
    return prepareSetting(address, options, this.chainCore)
  }
  prepareOrder (address, options) {
    return options.isV1?prepareOrderV1(address, options, this.chainCore):prepareOrder(address, options, this.chainCore)
  }
  prepareOrderCancellation (address, options) {
    return prepareOrderCancellation(address, options, this.chainCore)
  }
  submit (txBlob, options) {
    return submit(txBlob, options, this.chainCore)
  }
  smartContract (hash, options) {
    return smartContract(hash, options, this.chainCore)
  }
  getGatewayBalances(address, options) {
    return getGatewayBalances(address, options, this.chainCore)
  }
  prepareMultiPayment(address, options) {
    return prepareMultiPayment(address, options, this.chainCore)
  }
}

module.exports = ChainAPI
