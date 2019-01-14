const parseSubmit = require('../offline/parseSubmit')
/**
 * get transaction info by address
 * options:
 *      binary: {boolean} Optional If true, the transactions will be sent from the server in a condensed binary format rather than JSON.
 *      convert: Convert Keys To CamelCas
 * @param {string} address
 * @param {object} options
 * @param {*} chainCore 
 */
function submit (signedTransaction, options = {} , chainCore) {
  return chainCore.request({
    command: 'submit',
    tx_blob: !options.unsign ? signedTransaction : undefined,
    tx_json: options.unsign ? (typeof signedTransaction === 'string' ? JSON.parse(signedTransaction) : signedTransaction) : undefined,
    secret: options.unsign ? options.secret : undefined
  }).then((result) => {
    const convert = options.convert == false ? false : true
    const info = convert ? parseSubmit(result) : result
    return info
  })
}

module.exports = submit
