const mongoose = require('mongoose');
const mqtt = require('../lib/mqtt');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      unique: true,
    },
    thingyUuid: {
      type: String,
      unique: true,
    },
    alarm: {
      type: Boolean,
      default: false,
    },
    lightAlert: {
      type: Boolean,
      default: false,
    },
    soundAlert: {
      type: Boolean,
      default: false,
    },
    imagesCapture: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.query.byUuid = function byUuid(uuid) {
  return this.find({ uuid });
};

/*
userSchema.statics.findOrCreate = function findOrCreate(uuid) {
  return this.findOne({ thingyUuid: uuid }).exec()
    .then( (user) => {
      if(user == null) {
        user = Thingy.create({ uuid: uuid })
          .then( t => { return t; });
      }
      return thingy;
     });
}
*/

userSchema.methods.sendCommand = function sendCommand(command, data) {
  // Send command over mqtt
  console.log('Sending command', `${this.thingyUuid}/${command}`)
  mqtt.publish(`${this.thingyUuid}/${command}`, data);
};


module.exports = mongoose.model('User', userSchema);
