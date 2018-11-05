const MQTT = require('async-mqtt');
const eventEmitter = require('./mqttEvent');
const eventHandlers = require('./mqttEventHandlers');
>>>>>>> 9a67f2bf3b34b46f33c29dd06a02979677da3422

const client = MQTT.connect('mqtt://mqtt.thing.zone', { port: 1895, username: 'green', password: process.env.MQTT_PASSWORD });

// register eventHandlers
eventHandlers.init();

// THINGY Service Codes
const TCS_UUID              = 'ef6801009b3549339b1052ffa9740042';
const TES_UUID              = 'ef6802009b3549339b1052ffa9740042';
const TES_TEMP_UUID         = 'ef6802019b3549339b1052ffa9740042';
const TES_PRESS_UUID        = 'ef6802029b3549339b1052ffa9740042';
const TES_HUMID_UUID        = 'ef6802039b3549339b1052ffa9740042';
const TES_GAS_UUID          = 'ef6802049b3549339b1052ffa9740042';
const TES_COLOR_UUID        = 'ef6802059b3549339b1052ffa9740042';
const TES_CONF_UUID         = 'ef6802069b3549339b1052ffa9740042';
const UIS_UUID              = 'ef6803009b3549339b1052ffa9740042';
const UIS_LED_UUID          = 'ef6803019b3549339b1052ffa9740042';
const UIS_BTN_UUID          = 'ef6803029b3549339b1052ffa9740042';
const UIS_PIN_UUID          = 'ef6803039b3549339b1052ffa9740042';
const TMS_UUID              = 'ef6804009b3549339b1052ffa9740042';
const TMS_CONF_UUID         = 'ef6804019b3549339b1052ffa9740042';
const TMS_TAP_UUID          = 'ef6804029b3549339b1052ffa9740042';
const TMS_ORIENTATION_UUID  = 'ef6804039b3549339b1052ffa9740042';
const TMS_QUATERNION_UUID   = 'ef6804049b3549339b1052ffa9740042';
const TMS_STEP_COUNTER_UUID = 'ef6804059b3549339b1052ffa9740042';
const TMS_RAW_DATA_UUID     = 'ef6804069b3549339b1052ffa9740042';
const TMS_EULER_UUID        = 'ef6804079b3549339b1052ffa9740042';
const TMS_ROTATION_UUID     = 'ef6804089b3549339b1052ffa9740042';
const TMS_HEADING_UUID      = 'ef6804099b3549339b1052ffa9740042';
const TMS_GRAVITY_UUID      = 'ef68040a9b3549339b1052ffa9740042';
const TSS_UUID              = 'ef6805009b3549339b1052ffa9740042';
const TSS_CONF_UUID         = 'ef6805019b3549339b1052ffa9740042';
const TSS_SPEAKER_DATA_UUID = 'ef6805029b3549339b1052ffa9740042';
const TSS_SPEAKER_STAT_UUID = 'ef6805039b3549339b1052ffa9740042';
const TSS_MIC_UUID          = 'ef6805049b3549339b1052ffa9740042';

// On successful subscription
async function subscribeSuccess(error, granted) {
  console.log(error, granted);
}

// Message handler
async function handleMessage(topic, message, _packet) {
  // Separate device and service UUID
  const thingyTopic = topic.split('/');
  const thingyUuid = thingyTopic[0];
  const thingyService = thingyTopic[2].replace(/-/g, '');


  switch (thingyService) {
    case TMS_RAW_DATA_UUID:
      eventEmitter.emit('incomingEvent', thingyUuid, 'raw', message);
      break;
    case UIS_BTN_UUID:
      eventEmitter.emit('incomingEvent', thingyUuid, 'button', message);
      break;
    default:
      console.log('Thingy service', thingyService, ' not found!');
  }
}

client.on('connect', async () => {
  console.log('MQTT Connected!');
  try {
    // TODO: Subsribe only to needed channels
    await client.subscribe('#', subscribeSuccess);
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
});

// Subscribe to Message handler
client.on('message', handleMessage);

module.exports = client;
