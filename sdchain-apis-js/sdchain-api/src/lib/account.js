const keypairs = require('./chain-keypairs')
const addressCodec = require('./chain-address-codec')
const ValidationError = require('./common/constants').ValidationError;
function generateAddress(_secret, _entropy) {
  let secret = _secret;
  if (!secret) {
    if (_entropy) {
      secret = keypairs.generateSeed({ entropy: new Buffer(_entropy, 'binary') })
    } else {
      secret = keypairs.generateSeed()
    }
  }
  let keypair
  try {
    keypair = keypairs.deriveKeypair(secret)
  } catch (err) {
    throw new ValidationError('illegal secret: ' + secret);
  }

  const address = keypairs.deriveAddress(keypair.publicKey)
  return { secret, address }
}

function isValidAddress(address) {
  return addressCodec.isValidAddress(address)
}

module.exports = {
  generateAddress: generateAddress,
  isValidAddress: isValidAddress
}