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


const CHROME_EXTENSION_ID = "molfimodiodghknifkeikkldkogpapki"; //"jpehlabbcdkiocalmhikacglppfenoeo"; // APP ID on Chrome Web Store
        

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
        
        this.msg1 = {};
        this.msg2 = {};
        this.dist_read  = 0;
    
        // Connect to the Chrome runtime
        // Randi - this causes a problem because I can no longer access the ArduinoRobot object       
        var boundMsgHandler = this.onMsgFromExtension.bind(this);
        
        chrome.runtime.sendMessage(CHROME_EXTENSION_ID, {message: "STATUS"}, function (response) {
            if (response === undefined) { //Chrome app not found
                console.log("Chrome app not found");
                _mStatus = 0;
            } else if (response.status === false) { //Chrome app says not connected
                console.log("Chome app is not running"); // what does this mean?
                _mStatus = 1;
            } else {// Chrome app is connected
                console.log("Chrome app found");
                if (this._mStatus !== 2) {
                    _mConnection = chrome.runtime.connect(CHROME_EXTENSION_ID);
                    _mConnection.onMessage.addListener(boundMsgHandler); // THIS IS WRONG
                    _mStatus = 1;
                }
            }
        });
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
                    // Required: the machine-readable name of this operation.
                    // This will appear in project JSON.
                    opcode: 'readDistance',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'arduinoBot.readDistance',
                        default: 'read distance',
                        description: 'Get distance read from ultrasonic distance sensor'
                    }),
                    arguments: { }
                }
                /*, {
                    // Another block...
                }*/
            ]
        };
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
    
    onMsgFromExtension (msg) {
      if (this._mStatus == 1) {
        console.log("Receiving messages from robot");
      }
      this._mStatus = 2;
      var buffer = msg.buffer;
      
      if ( buffer[0]==224) {
        this.messageParser(buffer);
        last_reading = 0;
      }
  
      if (buffer[0] != 224 && last_reading == 0) {
          this.messageParser(buffer);
          last_reading = 1;
      }
    }
    
    messageParser (buf) {
      var msg = {};
      if (buf[0]==224){
        this.msg1 = buf;
      } else if (buf[0] != 224) {
        this.msg2 = buf;
      }
      msg.buffer = this.msg1.concat(this.msg2);
      
      if (msg.buffer.length > 10) {
        msg.buffer = msg.buffer.slice(0,10);
      }
      if (msg.buffer.length == 10){
        if (msg.buffer[8] == 240) {
          this.dist_read = Math.round(msg.buffer[9] );
        }
      }
  }

}
module.exports = ArduinoRobot;