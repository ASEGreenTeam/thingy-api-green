const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let costantsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  value
);

module.exports = mongoose.model('Constants', constants);
