// const thingyEmitter = require('./mqttThingyEvent');
const typeEmitter = require('./mqttTypeEvent');
const dataParser = require('./thingyDataParser');
const doorDetection = require('./doorDetection');
const base64 = require('./base64');
const Models = require('../models');
const SendMail = require('./sendMail');

const buttonEvents = {};

// Constants to fine-tune door-detection algorithm
const THRESHOLD = 4.0;
const RESET_MS = 5000;
const NUM_EVENTS = 3;

// Stores all movements above THRESHOLD during since RESET_MS
const lastMovements = {};

function handleRaw(uuid, message) {
  // Get x-axis of gyroscope
  const motion = dataParser.raw(message).gyroscope.x;

  // Init lastMovements array
  if (!(uuid in lastMovements)) {
    lastMovements[uuid] = [];
  }

  // Check if above THRESHOLD
  if (Math.abs(motion) > THRESHOLD) {
    lastMovements[uuid].push(motion);
    if (lastMovements[uuid].length === 1) {
      // Reset lastMovements after RESET Timeout
      setTimeout(() => {
        delete lastMovements[uuid];
      }, RESET_MS);
    } else if (lastMovements[uuid].length === NUM_EVENTS) {
      // Door movement identified!
      typeEmitter.emit('doorMovement', uuid, lastMovements[uuid]);
    }
  }
}

// Function to handle Button Press Events
function handleButton(uuid, message) {
  const down = message.readUInt8(0);

  // Ony handle Button down events
  if (!down) {
    return;
  }

  if (uuid in buttonEvents) {
    // Button Event already ongoing
    const event = buttonEvents[uuid];
    event.count += 1;
  } else {
    buttonEvents[uuid] = { count: 1 };
    setTimeout(() => {
      console.log('Button pressed ', buttonEvents[uuid].count, 'times!');

      typeEmitter.emit('buttonX', uuid, buttonEvents[uuid].count);
      delete buttonEvents[uuid];
    }, 3000);
  }
}

async function handleDoorMovement(uuid, movements) {
  const user = await Models.User.findOne({ thingyUuid: uuid }).exec();
  const event = doorDetection.detectEvent(uuid, movements);
  event.userId = user._id;
  event.timestamp = new Date().getTime();
  const log = new Models.Log(event);
  log.save();
  console.log('Created Log', log);
  if (user.alarm) {
    unixTimestamp = Math.floor(Date.now() / 1000);
    if (unixTimestamp > user.alarmActivationTime + user.alarmDelay) {
      if (user.imagesCapture){
        typeEmitter.emit('takeSnapshot', uuid, '');
      }
      if (user.emailAlert){
        SendMail.send(user.email, '', '');
      }
    }
  }
}

async function handleSnapshot(uuid, data) {
  console.log(uuid);
  const user = await Models.User.findOne({ thingyUuid: uuid }).exec();
  const encoded = JSON.parse(data);
  const path = `images/${uuid}/${encoded.filename}`;
  base64.decode(encoded.data, path);
  const log = new Models.Log({ imagePath: path, userId: user._id, timestamp: new Date().getTime() });
  log.save();
  console.log(`MQTT message: ${encoded.filename}`);
}

async function handleTakeSnapshot(uuid, data) {
  const user = await Models.User.findOne({ thingyUuid: uuid }).exec();
  console.log('Take snapshot on device', uuid)
  user.sendCommand('images/take_snapshot', data);
}

const EventHandler = function EventHandler() {
  this.init = () => {
    typeEmitter.on('button', handleButton);
    typeEmitter.on('doorMovement', handleDoorMovement);
    typeEmitter.on('raw', handleRaw);
    typeEmitter.on('snapshot', handleSnapshot);
    typeEmitter.on('takeSnapshot', handleTakeSnapshot);
  };
};

module.exports = new EventHandler();
