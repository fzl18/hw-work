const account = require('./account');
const sign = require('./sign');
module.exports = {
    generateAddress: account.generateAddress,
    isValidAddress: account.isValidAddress,
    sign: sign
}
