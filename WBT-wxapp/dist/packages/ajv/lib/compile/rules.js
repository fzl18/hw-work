'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ruleModules = require('./_rules.js'),
    toHash = require('./util.js').toHash;

module.exports = function rules() {
  var RULES = [{ type: 'number',
    rules: [{ 'maximum': ['exclusiveMaximum'] }, { 'minimum': ['exclusiveMinimum'] }, 'multipleOf', 'format'] }, { type: 'string',
    rules: ['maxLength', 'minLength', 'pattern', 'format'] }, { type: 'array',
    rules: ['maxItems', 'minItems', 'uniqueItems', 'contains', 'items'] }, { type: 'object',
    rules: ['maxProperties', 'minProperties', 'required', 'dependencies', 'propertyNames', { 'properties': ['additionalProperties', 'patternProperties'] }] }, { rules: ['$ref', 'const', 'enum', 'not', 'anyOf', 'oneOf', 'allOf'] }];

  var ALL = ['type'];
  var KEYWORDS = ['additionalItems', '$schema', '$id', 'id', 'title', 'description', 'default', 'definitions'];
  var TYPES = ['number', 'integer', 'string', 'array', 'object', 'boolean', 'null'];
  RULES.all = toHash(ALL);
  RULES.types = toHash(TYPES);

  RULES.forEach(function (group) {
    group.rules = group.rules.map(function (keyword) {
      var implKeywords;
      if ((typeof keyword === 'undefined' ? 'undefined' : _typeof(keyword)) == 'object') {
        var key = Object.keys(keyword)[0];
        implKeywords = keyword[key];
        keyword = key;
        implKeywords.forEach(function (k) {
          ALL.push(k);
          RULES.all[k] = true;
        });
      }
      ALL.push(keyword);
      var rule = RULES.all[keyword] = {
        keyword: keyword,
        code: ruleModules[keyword],
        implements: implKeywords
      };
      return rule;
    });

    if (group.type) RULES.types[group.type] = group;
  });

  RULES.keywords = toHash(ALL.concat(KEYWORDS));
  RULES.custom = {};

  return RULES;
};