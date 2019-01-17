const makeClass = require('../utils/make-class');
const { decodeAccountID, encodeAccountID } = require('../../chain-address-codec');
const { Hash160 } = require('./hash-160');
const constants = require('../../common/constants')

const AccountID = makeClass({
  AccountID: function (bytes) {
    Hash160.call(this, bytes);
  },
  inherits: Hash160,
  statics: {
    from: function (value) {
      return value instanceof this ? value :
       new RegExp('^'+constants.BaseAlphabet.chain.substring(0,1)).test(value) ? this.fromBase58(value) :
          new this(value);
    },
    cache: {},
    fromCache: function (base58) {
      let cached = this.cache[base58];
      if (!cached) {
        cached = this.cache[base58] = this.fromBase58(base58);
      }
      return cached;
    },
    fromBase58: function (value) {
      const acc = new this(decodeAccountID(value));
      acc._toBase58 = value;
      return acc;
    }
  },
  toJSON: function () {
    return this.toBase58();
  },
  cached: {
    toBase58: function () {
      return encodeAccountID(this._bytes);
    }
  }
});

module.exports = {
  AccountID
};
