var MQTT = require("async-mqtt");
var client  = MQTT.connect('mqtt://mqtt.thing.zone', { 'port': 1895, 'username': 'green', 'password': process.env.MQTT_PASSWORD })

// THINGY Service Codes
var TCS_UUID              = 'ef6801009b3549339b1052ffa9740042';
var TES_UUID              = 'ef6802009b3549339b1052ffa9740042';
var TES_TEMP_UUID         = 'ef6802019b3549339b1052ffa9740042';
var TES_PRESS_UUID        = 'ef6802029b3549339b1052ffa9740042';
var TES_HUMID_UUID        = 'ef6802039b3549339b1052ffa9740042';
var TES_GAS_UUID          = 'ef6802049b3549339b1052ffa9740042';
var TES_COLOR_UUID        = 'ef6802059b3549339b1052ffa9740042';
var TES_CONF_UUID         = 'ef6802069b3549339b1052ffa9740042';
var UIS_UUID              = 'ef6803009b3549339b1052ffa9740042';
var UIS_LED_UUID          = 'ef6803019b3549339b1052ffa9740042';
var UIS_BTN_UUID          = 'ef6803029b3549339b1052ffa9740042';
var UIS_PIN_UUID          = 'ef6803039b3549339b1052ffa9740042';
var TMS_UUID              = 'ef6804009b3549339b1052ffa9740042';
var TMS_CONF_UUID         = 'ef6804019b3549339b1052ffa9740042';
var TMS_TAP_UUID          = 'ef6804029b3549339b1052ffa9740042';
var TMS_ORIENTATION_UUID  = 'ef6804039b3549339b1052ffa9740042';
var TMS_QUATERNION_UUID   = 'ef6804049b3549339b1052ffa9740042';
var TMS_STEP_COUNTER_UUID = 'ef6804059b3549339b1052ffa9740042';
var TMS_RAW_DATA_UUID     = 'ef6804069b3549339b1052ffa9740042';
var TMS_EULER_UUID        = 'ef6804079b3549339b1052ffa9740042';
var TMS_ROTATION_UUID     = 'ef6804089b3549339b1052ffa9740042';
var TMS_HEADING_UUID      = 'ef6804099b3549339b1052ffa9740042';
var TMS_GRAVITY_UUID      = 'ef68040a9b3549339b1052ffa9740042';
var TSS_UUID              = 'ef6805009b3549339b1052ffa9740042';
var TSS_CONF_UUID         = 'ef6805019b3549339b1052ffa9740042';
var TSS_SPEAKER_DATA_UUID = 'ef6805029b3549339b1052ffa9740042';
var TSS_SPEAKER_STAT_UUID = 'ef6805039b3549339b1052ffa9740042';
var TSS_MIC_UUID          = 'ef6805049b3549339b1052ffa9740042';

// Constants to fine-tune door-detection algorithm
var THRESHOLD = 2.0;
var RESET_MS = 3000;
var NUM_EVENTS = 3;

// Stores all movements above THRESHOLD during since RESET_MS
var last_movements = [];

client.on('connect', async function () {
  console.log('MQTT Connected!');
  try {
    // TODO: Subsribe only to needed channels
    await client.subscribe('#', subscribeSuccess);
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
});

// On successful subscription
async function subscribeSuccess(error, granted) {
  console.log(error, granted);
}

// Subscribe to Message handler
client.on('message', handleMessage);

// Message handler
async function handleMessage(topic, message, packet) {
  // Separate device and service UUID
  thingy_service = topic.split('/');
  if(thingy_service[2].replace(/-/g, '') == TMS_ROTATION_UUID) {
    // TODO: Is this a better metric?
    // console.log('Rotation: ', rotationMatrix(message));
  } else if(thingy_service[2].replace(/-/g, '') == TMS_HEADING_UUID) {
    // Not useful for door detection as it is not absolute
    // console.log('Heading: ', heading(message));
  } else if(thingy_service[2].replace(/-/g, '') == TMS_RAW_DATA_UUID) {
    // Get x-axis of gyroscope
    x_movement = raw(message)['gyroscope']['x'];
    // Check if above THRESHOLD
    if(Math.abs(x_movement) > THRESHOLD){
      last_movements.push(x_movement);
      if(last_movements.length == 1){
        // Reset last_movements after RESET Timeout
        setTimeout(() => { last_movements = [] }, RESET_MS);
      } else if(last_movements.length >= NUM_EVENTS) {
        // Door movement identified!
        detect_event();
      }
    }
  }
}

// Detects whether this is a door open or door close event.
// TODO: This depends on the door and on which side the device is placed!
function detect_event(){
  let avg = last_movements.reduce( ( p, c ) => p + c, 0 ) / last_movements.length;
  last_movements = []; // Reset array
  if(avg > 0.0){
    console.log('Door opened!')
  } else {
    console.log('Door closed!')
  }
}

function rotationMatrix(data){
  return {
        m_11 : Math.round(data.readInt16LE(0)/(1<<14),2),
        m_12 : Math.round(data.readInt16LE(2)/(1<<14),2),
        m_13 : Math.round(data.readInt16LE(4)/(1<<14),2),

        m_21 : Math.round(data.readInt16LE(6)/(1<<14),2),
        m_22 : Math.round(data.readInt16LE(8)/(1<<14),2),
        m_23 : Math.round(data.readInt16LE(10)/(1<<14),2),

        m_31 : Math.round(data.readInt16LE(12)/(1<<14),2),
        m_32 : Math.round(data.readInt16LE(14)/(1<<14),2),
        m_33 : Math.round(data.readInt16LE(16)/(1<<14),2)
  };
}

function heading(data){
  return Math.round(data.readInt32LE(0)/(1<<16), 0);
}

function raw(data){
  return {
      accelerometer : {
          x : data.readInt16LE(0)/(1<<10),
          y : data.readInt16LE(2)/(1<<10),
          z : data.readInt16LE(4)/(1<<10)
      },
      gyroscope : {
          x : data.readInt16LE(6)/(1<<5),
          y : data.readInt16LE(8)/(1<<5),
          z : data.readInt16LE(10)/(1<<5)
      },
      compass : {
          x : data.readInt16LE(12)/(1<<4),
          y : data.readInt16LE(14)/(1<<4),
          z : data.readInt16LE(16)/(1<<4)
      },
  }
};

module.exports = client;
