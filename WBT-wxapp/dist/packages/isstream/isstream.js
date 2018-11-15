'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stream = require('stream');

function isStream(obj) {
  return obj instanceof stream.Stream;
}

function isReadable(obj) {
  return isStream(obj) && typeof obj._read == 'function' && _typeof(obj._readableState) == 'object';
}

function isWritable(obj) {
  return isStream(obj) && typeof obj._write == 'function' && _typeof(obj._writableState) == 'object';
}

function isDuplex(obj) {
  return isReadable(obj) && isWritable(obj);
}

module.exports = isStream;
module.exports.isReadable = isReadable;
module.exports.isWritable = isWritable;
module.exports.isDuplex = isDuplex;