var MQTT = require("async-mqtt");
var client  = MQTT.connect('mqtt://mqtt.thing.zone', { 'port': 1895, 'username': 'green', 'password': process.env.MQTT_PASSWORD })
var still_closed = true;
var opening_clockwise = 1;

var request = require("request");

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

var button_events = {};

var cb_store = {};

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
  const thingy_topic = topic.split('/');
  const thingy_uuid = thingy_topic[0];
  const thingy_service = thingy_topic[2].replace(/-/g, '');


  switch(thingy_service){
    case TMS_RAW_DATA_UUID:
      handleRaw(thingy_uuid, thingy_service, message);
      break;
    case UIS_BTN_UUID:
      handleButton(thingy_uuid, thingy_service, message);
      break;
    default:
      console.log('Thingy service', thingy_service, ' not found!');
  }
}

client.register_callback = function (key, callback) {
  cb_store[key] = callback;
}

function handleRaw(uuid, service, message){
  // Get x-axis of gyroscope
  let x_movement = raw(message)['gyroscope']['x'];
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

// Function to handle Button Press Events
function handleButton(uuid, service, message){

  let down = message.readUInt8(0);

  // Ony handle Button down events
  if(!down){
    return;
  }

  if(uuid in button_events){
    // Button Event already ongoing
    let event = button_events[uuid];
    event['count'] += 1;
  } else {
    button_events[uuid] = { 'count': 1 }
    setTimeout(() => {
      console.log('Button pressed ', button_events[uuid]['count'], 'times!');
      switch(button_events[uuid]['count']){
        case 5:
          handleRegisterThingyRequest(uuid);
          break;
        default:
          // Do nothing
      }
      // Do something here!
      delete button_events[uuid];
    }, 3000)
  }
}

function handleRegisterThingyRequest(uuid){
  if('registerThingy' in cb_store){
    let callback = cb_store['registerThingy'];
    callback(uuid);
  }
}

// Detects whether this is a door open or door close event.
// The door must be closed when starting the program.
function detect_event(){
  let avg = last_movements.reduce( ( p, c ) => p + c, 0 ) / last_movements.length;
  last_movements = []; // Reset array
  if(still_closed){
    if(avg > 0.0){
      opening_clockwise = 1;
    } else {
      opening_clockwise = -1;
    }
    still_closed = false;
  }
  if(opening_clockwise*avg > 0.0){
    console.log('Door opened!')
    request.post('http://localhost:3000/logs').form({direction:'is_opening'})
  } else {
    console.log('Door closed!')
    request.post('http://localhost:3000/logs').form({direction:'is_closing'})
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
