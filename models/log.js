const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let logSchema = new Schema(
  {
    direction: {
      type: String,
      enum: ['is_opening', 'is_closing'], // is_opening or is_closing are the two accepted strings
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId
    },
    timestamp: {
      type: Date,
      required: true
    },
    event: {
      type: Number
    },
    data: {
      type: String
    },
    imagePath: {
      type: String
    },
    buttonEvent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Log', logSchema);
