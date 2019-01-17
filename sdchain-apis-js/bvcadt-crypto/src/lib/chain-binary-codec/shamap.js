const assert = require('assert');
const makeClass = require('./utils/make-class');
const { Hash256 } = require('./types');
const { HashPrefix } = require('./hash-prefixes');
const { Sha512Half: Hasher } = require('./hashes');

const ShaMapNode = makeClass({
  virtuals: {
    hashPrefix: function () { },
    isLeaf: function () { },
    isInner: function () { }
  },
  cached: {
    hash: function () {
      const hasher = Hasher.put(this.hashPrefix());
      this.toBytesSink(hasher);
      return hasher.finish();
    }
  }
});

const ShaMapLeaf = makeClass({
  inherits: ShaMapNode,
  ShaMapLeaf: function (index, item) {
    ShaMapNode.call(this);
    this.index = index;
    this.item = item;
  },
  isLeaf: function () {
    return true;
  },
  isInner: function () {
    return false;
  },
  hashPrefix: function () {
    return this.item.hashPrefix();
  },
  toBytesSink: function (sink) {
    this.item.toBytesSink(sink);
    this.index.toBytesSink(sink);
  }
});

const $uper = ShaMapNode.prototype;

const ShaMapInner = makeClass({
  inherits: ShaMapNode,
  ShaMapInner: function (depth = 0) {
    ShaMapNode.call(this);
    this.depth = depth;
    this.slotBits = 0;
    this.branches = Array(16);
  },
  isInner: function () {
    return true;
  },
  isLeaf: function () {
    return false;
  },
  hashPrefix: function () {
    return HashPrefix.innerNode;
  },
  setBranch: function (slot, branch) {
    this.slotBits = this.slotBits | (1 << slot);
    this.branches[slot] = branch;
  },
  empty: function () {
    return this.slotBits === 0;
  },
  hash: function () {
    if (this.empty()) {
      return Hash256.ZERO_256;
    }
    return $uper.hash.call(this);
  },
  toBytesSink: function (sink) {
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      const hash = branch ? branch.hash() : Hash256.ZERO_256;
      hash.toBytesSink(sink);
    }
  },
  addItem: function (index, item, leaf) {
    assert(index instanceof Hash256);
    const nibble = index.nibblet(this.depth);
    const existing = this.branches[nibble];
    if (!existing) {
      this.setBranch(nibble, leaf || new ShaMapLeaf(index, item));
    } else if (existing.isLeaf()) {
      const newInner = new ShaMapInner(this.depth + 1);
      newInner.addItem(existing.index, null, existing);
      newInner.addItem(index, item, leaf);
      this.setBranch(nibble, newInner);
    } else if (existing.isInner()) {
      existing.addItem(index, item, leaf);
    } else {
      assert(false);
    }
  }
});

const ShaMap = makeClass({
  inherits: ShaMapInner
});

module.exports = {
  ShaMap
};
