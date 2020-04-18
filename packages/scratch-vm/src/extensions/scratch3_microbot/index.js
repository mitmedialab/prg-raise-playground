const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');



const blockIconURI = 'data:image/png;base64,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';

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class MicrobotRobot {    
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
            blockIconURI: blockIconURI,
            menuIconURI: blockIconURI,
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
module.exports = MicrobitRobot;