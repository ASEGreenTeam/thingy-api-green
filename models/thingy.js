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

module.exports = mongoose.model('Thingy', ThingySchema);
