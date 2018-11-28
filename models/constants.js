const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let costantsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    value: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Constants', costantsSchema);
