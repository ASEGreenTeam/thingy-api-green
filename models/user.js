const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    token: {
      type: String,
      unique: true
    },
    thingyId: {
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
