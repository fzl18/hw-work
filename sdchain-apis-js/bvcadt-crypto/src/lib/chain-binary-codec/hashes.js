const makeClass = require('./utils/make-class');
const { HashPrefix } = require('./hash-prefixes');
const { Hash256 } = require('./types');
const { parseBytes } = require('./utils/bytes-utils');
const createHash = require('create-hash');

const Sha512Half = makeClass({
  Sha512Half: function () {
    this.hash = createHash('sha512');
  },
  statics: {
    put: function (bytes) {
      return new this().put(bytes);
    }
  },
  put: function (bytes) {
    this.hash.update(parseBytes(bytes, Buffer));
    return this;
  },
  finish256: function () {
    const bytes = this.hash.digest();
    return bytes.slice(0, 32);
  },
  finish: function () {
    return new Hash256(this.finish256());
  }
});

function sha512Half(...args) {
  const hash = new Sha512Half();
  args.forEach(a => hash.put(a));
  return parseBytes(hash.finish256(), Uint8Array);
}

function transactionID(serialized) {
  return new Hash256(sha512Half(HashPrefix.transactionID, serialized));
}

module.exports = {
  Sha512Half,
  sha512Half,
  transactionID
};
