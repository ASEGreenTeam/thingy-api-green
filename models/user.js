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
      default: '',
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
    emailAlert: {
      type: Boolean,
      default: false,
    },
    alarmDelay: { // Delay in seconds before actually activating the alarm
      type: Number,
      default: 30,
    },
    alarmActivationTime: { // Unix timestamp in seconds, useful for the alarm delay
      type: Number,        // No need to assign this value manually! See below
    },
    telegramChatId: {
      type: Number,
      default: 0,
    }

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

// Modify the save function to assign a value to alarmActivationTime if needed.
userSchema.pre('save', function(callback) {
  var user = this;
  if (!user.isModified('alarm')) return callback();
  var unixTimestamp = Math.floor(Date.now() / 1000);
  user.alarmActivationTime = unixTimestamp;
  callback();
});

module.exports = mongoose.model('User', userSchema);
