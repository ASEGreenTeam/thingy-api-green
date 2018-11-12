const mongoose = require('mongoose');

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

var Thingy = mongoose.model('Thingy', ThingySchema);

Thingy.findOrCreate = async function(uuid) {
  return await Thingy.findOne({ uuid: uuid }).exec()
    .then( (thingy) => {
      if(thingy == null) {
        thingy = Thingy.create({ uuid: uuid })
          .then( t => { return t; });
      }
      return thingy;
     });
}

module.exports = Thingy;
