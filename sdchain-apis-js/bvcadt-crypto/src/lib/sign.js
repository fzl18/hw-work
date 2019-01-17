'use strict';

var keypairs = require('./chain-keypairs');
var binary = require('./chain-binary-codec');

var _require = require('./chain-hashes');

var computeBinaryTransactionHash = _require.computeBinaryTransactionHash;


function computeSignature(tx, privateKey, signAs) {
  var signingData = signAs ? binary.encodeForMultisigning(tx, signAs) : binary.encodeForSigning(tx);
  return keypairs.sign(signingData, privateKey);
}

function sign(txJSON, secret) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validateSign({ txJSON: txJSON, secret: secret });
  // we can't validate that the secret matches the account because
  // the secret could correspond to the regular key

  var tx = JSON.parse(txJSON);
  if (tx.TxnSignature || tx.Signers) {
    throw new SignError('txJSON must not contain "TxnSignature" or "Signers" properties');
  }

  var keypair = keypairs.deriveKeypair(secret);
  tx.SigningPubKey = options.signAs ? '' : keypair.publicKey;

  if (options.signAs) {
    var signer = {
      Account: options.signAs,
      SigningPubKey: keypair.publicKey,
      TxnSignature: computeSignature(tx, keypair.privateKey, options.signAs)
    };
    tx.Signers = [{ Signer: signer }];
  } else {
    tx.TxnSignature = computeSignature(tx, keypair.privateKey);
  }

  var serialized = binary.encode(tx);
  return {
    signedTransaction: serialized,
    hash: computeBinaryTransactionHash(serialized)
  };
}

function validateSign({ txJSON: txJSON, secret: secret }) {
  try {
    var kp = keypairs.deriveKeypair(secret);
  } catch (err) {
    throw new SignError(err.message);
  }
}

function SignError(message, e) {
  this.message = message;
  Error.captureStackTrace(this, SignError);
}
SignError.prototype = new Error();
SignError.prototype.name = 'SignError';

module.exports = sign;