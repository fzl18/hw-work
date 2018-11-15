'use strict';

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var errors = require('./errors.js');
var types = require('./types.js');

var Reader = require('./reader.js');
var Writer = require('./writer.js');

///--- Exports

module.exports = {

  Reader: Reader,

  Writer: Writer

};

for (var t in types) {
  if (types.hasOwnProperty(t)) module.exports[t] = types[t];
}
for (var e in errors) {
  if (errors.hasOwnProperty(e)) module.exports[e] = errors[e];
}