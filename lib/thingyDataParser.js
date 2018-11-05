/* eslint no-bitwise: ["error", { "allow": ["<<"] }] */
const DataParser = function DateParser() {
  this.rotationMatrix = data => ({
    m_11: Math.round(data.readInt16LE(0) / (1 << 14), 2),
    m_12: Math.round(data.readInt16LE(2) / (1 << 14), 2),
    m_13: Math.round(data.readInt16LE(4) / (1 << 14), 2),

    m_21: Math.round(data.readInt16LE(6) / (1 << 14), 2),
    m_22: Math.round(data.readInt16LE(8) / (1 << 14), 2),
    m_23: Math.round(data.readInt16LE(10) / (1 << 14), 2),

    m_31: Math.round(data.readInt16LE(12) / (1 << 14), 2),
    m_32: Math.round(data.readInt16LE(14) / (1 << 14), 2),
    m_33: Math.round(data.readInt16LE(16) / (1 << 14), 2),
  });

  this.heading = (data) => {
    Math.round(data.readInt32LE(0) / (1 << 16), 0);
  };

  this.raw = data => ({
    accelerometer: {
      x: data.readInt16LE(0) / (1 << 10),
      y: data.readInt16LE(2) / (1 << 10),
      z: data.readInt16LE(4) / (1 << 10),
    },
    gyroscope: {
      x: data.readInt16LE(6) / (1 << 5),
      y: data.readInt16LE(8) / (1 << 5),
      z: data.readInt16LE(10) / (1 << 5),
    },
    compass: {
      x: data.readInt16LE(12) / (1 << 4),
      y: data.readInt16LE(14) / (1 << 4),
      z: data.readInt16LE(16) / (1 << 4),
    },
  });
};

module.exports = new DataParser();
