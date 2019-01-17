const { bytesToHex, slice } = require('../utils/bytes-utils');
const { BytesList } = require('../serdes/binary-serializer');

const Comparable = {
  lt: function (other) {
    return this.compareTo(other) < 0;
  },
  eq: function (other) {
    return this.compareTo(other) === 0;
  },
  gt: function (other) {
    return this.compareTo(other) > 0;
  },
  gte: function (other) {
    return this.compareTo(other) > -1;
  },
  lte: function (other) {
    return this.compareTo(other) < 1;
  }
};

const SerializedType = {
  toBytesSink: function (sink) {
    sink.put(this._bytes);
  },
  toHex: function () {
    return bytesToHex(this.toBytes());
  },
  toBytes: function () {
    if (this._bytes) {
      return slice(this._bytes);
    }
    const bl = new BytesList();
    this.toBytesSink(bl);
    return bl.toBytes();
  },
  toJSON: function () {
    return this.toHex();
  },
  toString: function () {
    return this.toHex();
  }
};

function ensureArrayLikeIs(Type, arrayLike) {
  return {
    withChildren: function (Child) {
      if (arrayLike instanceof Type) {
        return arrayLike;
      }
      const obj = new Type();
      for (let i = 0; i < arrayLike.length; i++) {
        obj.push(Child.from(arrayLike[i]));
      }
      return obj;
    }
  };
}

module.exports = {
  ensureArrayLikeIs,
  SerializedType,
  Comparable
};
