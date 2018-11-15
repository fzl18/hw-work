'use strict';

//all requires must be explicit because browserify won't work with dynamic requires

module.exports = {
  '$ref': require('../dotjs/ref.js'),
  allOf: require('../dotjs/allOf.js'),
  anyOf: require('../dotjs/anyOf.js'),
  const: require('../dotjs/const.js'),
  contains: require('../dotjs/contains.js'),
  dependencies: require('../dotjs/dependencies.js'),
  'enum': require('../dotjs/enum.js'),
  format: require('../dotjs/format.js'),
  items: require('../dotjs/items.js'),
  maximum: require('../dotjs/_limit.js'),
  minimum: require('../dotjs/_limit.js'),
  maxItems: require('../dotjs/_limitItems.js'),
  minItems: require('../dotjs/_limitItems.js'),
  maxLength: require('../dotjs/_limitLength.js'),
  minLength: require('../dotjs/_limitLength.js'),
  maxProperties: require('../dotjs/_limitProperties.js'),
  minProperties: require('../dotjs/_limitProperties.js'),
  multipleOf: require('../dotjs/multipleOf.js'),
  not: require('../dotjs/not.js'),
  oneOf: require('../dotjs/oneOf.js'),
  pattern: require('../dotjs/pattern.js'),
  properties: require('../dotjs/properties.js'),
  propertyNames: require('../dotjs/propertyNames.js'),
  required: require('../dotjs/required.js'),
  uniqueItems: require('../dotjs/uniqueItems.js'),
  validate: require('../dotjs/validate.js')
};