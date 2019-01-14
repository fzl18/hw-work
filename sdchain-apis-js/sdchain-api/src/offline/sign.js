const lib = require('../lib');
const validate = require('../lib/common/validate');
const SignError = require('../lib/common/errors').SignError;

/**
 * local sign submit txJSON.
 * txJSON is the result of prepare method.
 * @param {*} txJSON 
 * @param {*} secret 
 */
function sign(txJSON, secret) {
    const _txJSON = typeof txJSON == 'object'?txJSON:JSON.parse(txJSON);
    validate.addressAndSecret(_txJSON.Account,secret);
    let txJSONStr = txJSON;
    if (typeof (txJSON) === 'object') {
        txJSONStr = JSON.stringify(txJSON);
    }
    try {
        return lib.sign(txJSONStr, secret);
    } catch (error) {
        throw new SignError(error.message); 
    }
   
}

module.exports = sign;
