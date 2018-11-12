const mongoose = require('mongoose');
const mqtt = require('../lib/mqtt');

const { Schema } = mongoose;

const ThingySchema = new Schema(
  {
    uuid: {
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
    },
  },
  {
    timestamps: true,
  },
);

ThingySchema.query.byUuid = function byUuid(uuid) {
  return this.find({ uuid });
};

ThingySchema.statics.findOrCreate = function findOrCreate(uuid) {
  return this.findOne({ uuid: uuid }).exec()
    .then( (thingy) => {
      if(thingy == null) {
        thingy = Thingy.create({ uuid: uuid })
          .then( t => { return t; });
      }
      return thingy;
     });
}

ThingySchema.methods.sendCommand = function(command, data) {
    // do sth. with the model
    mqtt.publish(`${this.uuid}/${command}`, data);
};

var Thingy = mongoose.model('Thingy', ThingySchema);

module.exports = Thingy;
