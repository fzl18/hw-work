const makeClass = require('../utils/make-class');
const { ensureArrayLikeIs, SerializedType } = require('./serialized-type');
const { Field } = require('../enums');
const { STObject } = require('./st-object');
const { ArrayEndMarker } = Field;

const STArray = makeClass({
  mixins: SerializedType,
  inherits: Array,
  statics: {
    fromParser: function (parser) {
      const array = new STArray();
      while (!parser.end()) {
        const field = parser.readField();
        if (field === ArrayEndMarker) {
          break;
        }
        const outer = new STObject();
        outer[field] = parser.readFieldValue(field);
        array.push(outer);
      }
      return array;
    },
    from: function (value) {
      return ensureArrayLikeIs(STArray, value).withChildren(STObject);
    }
  },
  toJSON: function () {
    return this.map(v => v.toJSON());
  },
  toBytesSink: function (sink) {
    this.forEach(so => so.toBytesSink(sink));
  }
});

module.exports = {
  STArray
};
