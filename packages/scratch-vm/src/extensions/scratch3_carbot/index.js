const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');


/**
 * Url of icon to be displayed at the left edge of each extension block.
 * @type {string}
 */
// eslint-disable-next-line max-len
const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==';


/**
 * Url of icon to be displayed in the toolbox menu for the extension category.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==';        

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class ArduinoRobot {    
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.scratch_vm = runtime;
        
        this.robot = this;
        
        this._mStatus = 1;
        this._mConnection = null;
        this.CHROME_EXTENSION_ID = "jpehlabbcdkiocalmhikacglppfenoeo"; // "molfimodiodghknifkeikkldkogpapki"; APP ID on Chrome Web Store

        this.msg1 = {};
        this.msg2 = {};
        this.dist_read  = 0;
    
        this.scratch_vm.on('PROJECT_STOP_ALL', this.stopMotors.bind(this));
    
        this.connectToExtension();
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: 'arduinoRobot',
            name: formatMessage({
                id: 'arduinoRobot',
                default: 'PRG Arduino Robot Blocks',
                description: 'Extension using Gizmo Robot Chrome extension to communicate with Arduino robot'
            }),
            blockIconURI: iconURI,
            menuIconURI: menuIconURI,
            docsURI: 'https://aieducation.mit.edu/poppet.html',

            blocks: [
                {
                    opcode: 'setLEDColor',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.setLEDColor',
                        default: 'set LED color [COLOR]',
                        description: 'Set the LED color'
                    }),
                    arguments: {
                        COLOR: {
                            type:ArgumentType.COLOR
                            // should I put a default color?
                        }    
                    }
                },
                {
                    opcode: 'ledOff',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.ledOff',
                        default: 'turn LED off',
                        description: 'Turn off the LED'
                    }),
                    arguments: { }
                },
                {
                    opcode: 'readDistance',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'arduinoBot.readDistance',
                        default: 'read distance',
                        description: 'Get distance read from ultrasonic distance sensor'
                    }),
                    arguments: { }
                },
                {
                    opcode: 'driveForward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.driveForward',
                        default: 'drive forward [NUM] second(s)',
                        description: 'The amount of time to drive forward for'
                    }),
                    arguments: {
                        NUM: {
                            type:ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'driveBackward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.driveBackward',
                        default: 'drive backward [NUM] second(s)',
                        description: 'The amount of time to drive backward for'
                    }),
                    arguments: {
                        NUM: {
                            type:ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                }
                // add blocks for turning, should I do degrees?
                // add blocks for speech?
            ]
        };
    }

    connectToExtension() {
        // Save reference to robot for use later
        var robot = this;
        var boundMsgHandler = this.onMsgFromExtension.bind(this);
        
        // Attenpt to connect to the Gizmo Chrome Extension
        chrome.runtime.sendMessage(this.CHROME_EXTENSION_ID, {message: "STATUS"}, function (response) {
            if (response === undefined) { //Chrome app not found
                // Must have the wrong extension ID (if extension was not downloaded from Chrome webstore, the extension id is not consistent)
                console.log("Chrome app not found with extension ID: " + robot.CHROME_EXTENSION_ID);
                
                // Attempt to get the extension ID from local browser storage
                robot.CHROME_EXTENSION_ID = window.localStorage.getItem('gizmo_extension_id');
                console.log("Stored extension ID: " + robot.CHROME_EXTENSION_ID);
                if (robot.CHROME_EXTENSION_ID === undefined || robot.CHROME_EXTENSION_ID === "" || robot.CHROME_EXTENSION_ID === null) {
                    // If there is no extension ID in local browser storage, prompt user to enter one
                   robot.CHROME_EXTENSION_ID = window.prompt("Enter the correct Chrome Extension ID", "pnjoidacmeigcdbikhgjolnadkdiegca");  
                }
                robot._mStatus = 0;
                // Try to connect to the Chrome extension again
                robot.connectToExtension();
            } else if (response.status === false) { //Chrome app says not connected
                console.log("Chome extension is not running"); // what does this mean?
                robot._mStatus = 1;
            } else {// Chrome app is connected
                console.log("Chrome extension found");
                // Save the extension ID in local browser storage for next time
                window.localStorage.setItem('gizmo_extension_id', robot.CHROME_EXTENSION_ID);
                if (robot._mStatus !== 2) {
                    robot._mConnection = chrome.runtime.connect(robot.CHROME_EXTENSION_ID);
                    // Add listener that triggers onMsgFromExtension everytime the Chrome extension gets a message from the robot
                    robot._mConnection.onMessage.addListener(boundMsgHandler);
                    // We're not sure that it's working until we start receiving messages
                    robot._mStatus = 1;
                }
            }
        });
    }
    
    /**
     * Implement onMsgFromExtension
     * @msg {chrome.runtime.Message} the message received from the connected Chrome extension
     * When a message is received from the Chrome extension, and therefore the robot, this handles that message
     */
    onMsgFromExtension (msg) {
      if (this._mStatus == 1) {
        console.log("Receiving messages from robot");
      }
      this._mStatus = 2;
      var buffer = msg.buffer;
      
      // The beginning of the buffer (from firmata) starts with 224, if this buffer starts with 224 it is the beginning of the message
      if ( buffer[0]==224) {
        this.messageParser(buffer);
        last_reading = 0; // Last reading signifies that the last thing stored in the msg buffer is the first part of the message
      }
  
      if (buffer[0] != 224 && last_reading == 0) { // Checking last reading makes sure that we don't concatenate the wrong part of the message
          this.messageParser(buffer);
          last_reading = 1;
      }
    }
    
    /**
     * Implement messageParser
     * @buf {byte buffer} a buffer containing a series of opcode keys and data value pairs
     * @dist_read {int} the last reading from the ultrasonic distance sensor
     * @msg1 {byte buffer} since the entire buffer does not always get transmitted in a message, this will store the first part of the buffer
     * @msg2 {byte buffer} since the entire buffer does not always get transmitted in a message, this will store the second part of the buffer
     */
    messageParser (buf) {
      var msg = {};
      if (buf[0]==224){
        this.msg1 = buf;
      } else if (buf[0] != 224) {
        this.msg2 = buf;
      }
      msg.buffer = this.msg1.concat(this.msg2);
      
      if (msg.buffer.length > 10) {
        msg.buffer = msg.buffer.slice(0,10); // The length of the buffer (from firmata) is only 10 bytes
      }
      if (msg.buffer.length == 10){
        if (msg.buffer[8] == 240) { // The opcode key before the ultrasonic distance reading data is 240
          this.dist_read = Math.round(msg.buffer[9] );
        }
        // We currently don't read any other data from the robot, but if we did we would put it here
      }
  }
  
  /**
   *
   */
  setLEDColor (args) {
    var h = args.COLOR;
    
    // Translate color arg to red, green, blue values
    var rVal = parseInt("0x" + h[1] + h[2], 16);
    var gVal = parseInt("0x" + h[3] + h[4], 16);
    var bVal = parseInt("0x" + h[5] + h[6], 16);

    console.log("set LED color: " + args.COLOR);    
    console.log("R:" + rVal + " B:" + bVal + " G:" + gVal);
    
    // Send message
    var msg = {}
    msg.buffer = [204,rVal];
    this._mConnection.postMessage(msg);
    
    msg.buffer = [205,gVal];
    this._mConnection.postMessage(msg);
	
	msg.buffer = [206,bVal]; 
    this._mConnection.postMessage(msg);
    
    return;
  }
  
  ledOff () {
    console.log("LED off");
    var msg = {}
    msg.buffer = [204,0];
    this._mConnection.postMessage(msg);
    
    msg.buffer = [205,0];
    this._mConnection.postMessage(msg);
	
	msg.buffer = [206,0]; 
    this._mConnection.postMessage(msg);
    
    return;
  }
  
  /**
     * Implement readDistance
     * @returns {string} the distance, in cm, of the nearest object. -1 means error
     */
  readDistance () {
    var distance = this.dist_read;
    if (distance == 0) {
        distance = -1;
    }
    return distance;
  }

    stopMotors () {
        var msg = {};
        console.log("Sending 207 to stop servos");
        msg.buffer = [207,99];
        this._mConnection.postMessage(msg);
      }
  
  /**
   * Implement driveForward
   * @secs {number} the number of seconds to drive forward
   * @callback {function} the code to call when this function is done executing
   */
  driveForward (args) {
	var msg = {};
    var secs = args.NUM;
	console.log("Sending 208 to drive forward, secs: " + secs);
	msg.buffer = [208,99];
    this._mConnection.postMessage(msg);
    
    return new Promise(resolve => {
            setTimeout(() => {
                this.stopMotors();
                resolve();
            }, secs*1000);
        });
  }
  
  /**
   * Implement driveBackward
   * @secs {number} the number of seconds to drive backward
   * @callback {function} the code to call when this function is done executing
   */
  driveBackward (args) {
	var msg = {};
    var secs = args.NUM;
	console.log("Sending 209 to drive backward, secs: " + secs);
	msg.buffer = [209,99];
    this._mConnection.postMessage(msg);
    
    return new Promise(resolve => {
            setTimeout(() => {
                this.stopMotors();
                resolve();
            }, secs*1000);
        });
  }
  

}
module.exports = ArduinoRobot;