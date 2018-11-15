'use strict';

var util = require('./util.js');

module.exports = SchemaObject;

function SchemaObject(obj) {
  util.copy(obj, this);
}