const events = require('events');
const thingyEmitter = require('./mqttThingyEvent');
const typeEmitter = require('./mqttTypeEvent');

const eventEmitter = new events.EventEmitter();

// Listen to events from a thingy
function emitThingyEvent(uuid, eventType, message) {
  thingyEmitter.emit(uuid, eventType, message);
}

// Listen to a specific type of event from any thingy
function emitTypeEvent(eventType, uuid, message) {
  typeEmitter.emit(eventType, uuid, message);
}

function handleIncomingEvent(uuid, eventType, message) {
  emitThingyEvent(uuid, eventType, message);
  emitTypeEvent(eventType, uuid, message);
}


// Default handler eventEmitter
eventEmitter.on('incomingEvent', handleIncomingEvent);

module.exports = eventEmitter;
