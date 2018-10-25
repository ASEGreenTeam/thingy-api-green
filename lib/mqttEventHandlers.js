const request = require('request');
// const thingyEmitter = require('./mqttThingyEvent');
const typeEmitter = require('./mqttTypeEvent');
const dataParser = require('./thingyDataParser');
const doorDetection = require('./doorDetection');

const buttonEvents = {};

// Constants to fine-tune door-detection algorithm
const THRESHOLD = 2.0;
const RESET_MS = 3000;
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
        delete lastMovements.uuid;
      }, RESET_MS);
    } else if (lastMovements[uuid].length >= NUM_EVENTS) {
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

function handleDoorMovement(uuid, movements) {
  request.post('http://localhost:3000/logs').form(doorDetection.detectEvent(uuid, movements));
}

const EventHandler = function EventHandler() {
  this.init = () => {
    typeEmitter.on('button', handleButton);
    typeEmitter.on('doorMovement', handleDoorMovement);
    typeEmitter.on('raw', handleRaw);
  };
};

module.exports = new EventHandler();
