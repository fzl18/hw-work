const assert = require('assert');
const makeClass = require('../utils/make-class');
const { Comparable, SerializedType } = require('./serialized-type');
const { compareBytes, parseBytes } = require('../utils/bytes-utils');

const Hash = makeClass({
  Hash: function (bytes) {
    const width = this.constructor.width;
    this._bytes = bytes ? parseBytes(bytes, Uint8Array) :
      new Uint8Array(width);
    assert.equal(this._bytes.length, width);
  },
  mixins: [Comparable, SerializedType],
  statics: {
    width: NaN,
    from: function (value) {
      if (value instanceof this) {
        return value;
      }
      return new this(parseBytes(value));
    },
    fromParser: function (parser, hint) {
      return new this(parser.read(hint || this.width));
    }
  },
  compareTo: function (other) {
    return compareBytes(this._bytes, this.constructor.from(other)._bytes);
  },
  toString: function () {
    return this.toHex();
  },
  nibblet: function (depth) {
    const byte_ix = depth > 0 ? (depth / 2) | 0 : 0;
    let b = this._bytes[byte_ix];
    if (depth % 2 === 0) {
      b = (b & 0xF0) >>> 4;
    } else {
      b = b & 0x0F;
    }
    return b;
  }
});

module.exports = {
  Hash
};
