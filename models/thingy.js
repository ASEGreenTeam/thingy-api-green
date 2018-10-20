const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    alarm: {
      type: Boolean
    },
    lightAlert: {
      type: Boolean
    },
    soundAlert: {
      type: Boolean
    },
    imagesCapture: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Thingy', userSchema);
