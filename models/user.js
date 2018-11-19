const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const typeEmitter = require('../lib/mqttTypeEvent');

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
    thingyUuid: {
      type: String,
      required: true,
      unique: true,
    },
    alarm: {
      type: Boolean,
    },
    lightAlert: {
      type: Boolean,
    },
    soundAlert: {
      type: Boolean,
    },
    imagesCapture: {
      type: Boolean,
    }
  },
  {
    timestamps: true
  }
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

userSchema.methods.sendCommand = function(command, data) {
    // do sth. with the model
    mqtt.publish(`${this.thingyUuid}/${command}`, data);
};


module.exports = mongoose.model('User', userSchema);
