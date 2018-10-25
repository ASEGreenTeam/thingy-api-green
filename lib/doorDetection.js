
const DoorDetection = function DoorDetection() {
  this.settings = {};

  this.detectEvent = (uuid, movements) => {
    // init detection for uuid
    console.log(this);
    if (!(uuid in this.settings)) {
      this.settings[uuid] = { stillClosed: true, openingClockwise: 1 };
    }
    const uuidSettings = this.settings[uuid];
    const avg = movements.reduce((p, c) => p + c, 0) / movements.length;

    if (uuidSettings.stillClosed) {
      if (avg > 0.0) {
        uuidSettings.openingClockwise = 1;
      } else {
        uuidSettings.openingClockwise = -1;
      }
      uuidSettings.stillClosed = false;
    }
    // Opening
    if (uuidSettings.openingClockwise * avg > 0.0) {
      console.log('Door opened!');
      return { direction: 'is_opening' };
    }
    // Closing
    console.log('Door closed!');
    return { direction: 'is_closing' };
  };
};

module.exports = new DoorDetection();
