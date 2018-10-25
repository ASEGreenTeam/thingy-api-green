const events = require('events');

const typeEmitter = new events.EventEmitter();

typeEmitter.on('newListener', (event) => {
  console.log('TypeEvent: New Listener for event', event);
});

module.exports = typeEmitter;
