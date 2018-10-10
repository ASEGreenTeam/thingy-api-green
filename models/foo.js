const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fooSchema = new Schema(
  {
    foo: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Foo', fooSchema);
