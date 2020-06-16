require("regenerator-runtime/runtime");
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');

const blockIconURI = 'data:image/png;base64,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';
const _colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white', 'random'];
const _icons = ['heart', 'check', 'X', 'smile', 'frown', 'ghost', 'triangle', 'diamond', 'square', 'checkers', 'note'];
const _drive = ['forward', 'backward'];
const _turn = ['left', 'right'];
const _button = ['A','B','A or B','A and B','neither A nor B'];
const _line_states = ['right side', 'left side', 'neither side', 'both sides'];
const EXTENSION_ID = 'microbitRobot';

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class MicrobitRobot {    
    constructor (runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.scratch_vm = runtime;
        this.scratch_vm.registerPeripheralExtension(EXTENSION_ID, this);
        this.scratch_vm.connectPeripheral(EXTENSION_ID, 0);
        
        this.robot = this;
        
        this._mStatus = 1;
        this._mConnection = null;
        this._mConnectionTimeout = null;
        this._ip = "192.168.1.124";

        this.msg1 = {};
        this.msg2 = {};
        this.dist_read  = 0;
        this.a_button = 0;
        this.b_button = 0;
        this.left_line = 0;
        this.right_line = 0;
        this.last_reading = 0;
        
    
        this.scratch_vm.on('PROJECT_STOP_ALL', this.resetRobot.bind(this));
        
        // RANDI make it possible to check if scratch_vm has an IP address?
        this.connect(this._ip);
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo () {
        return {
            id: EXTENSION_ID,
            name: formatMessage({
                id: 'microbitRobot',
                default: 'PRG Microbit Robot Blocks',
                description: 'Extension using ESP32 cam webserver to communicate with Microbit robot'
            }),
            showStatusButton: true,
            blockIconURI: blockIconURI,
            menuIconURI: blockIconURI,

            blocks: [
                {
                    opcode: 'setIPAddress',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'microbitBot.setIP',
                        default: 'use robot [IP_ADDRESS]',
                        description: 'Set the IP address for this robot and open a websocket connection'
                    }),
                    arguments: {
                        IP_ADDRESS: {
                            type:ArgumentType.STRING,
                            defaultValue: this._ip
                        }    
                    }
                },
                '---',
                {
                    opcode: 'setRgbLedColor',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.setLEDColor',
                        default: 'set headlight color [COLOR]',
                        description: 'Set the RGB headlight color'
                    }),
                    arguments: {
                        COLOR: {
                            type:ArgumentType.STRING,
                            menu: 'COLORS',
                            defaultValue: _colors[0]
                            // should I put a default color?
                        }    
                    }
                },
                {
                    opcode: 'rgbLedOff',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.ledOff',
                        default: 'turn headlights off',
                        description: 'Turn off the LED'
                    }),
                    arguments: { }
                },
                '---',
                {
                    opcode: 'setLEDDisplay',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.setLEDDisplay',
                        default: 'set LED display [ICON]',
                        description: 'Set the LED display to an icon'
                    }),
                    arguments: {
                        ICON: {
                            type:ArgumentType.STRING,
                            menu: 'ICONS',
                            defaultValue: _icons[0]
                        }    
                    }
                },
                {
                    opcode: 'ledDisplayOff',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.ledDisplayOff',
                        default: 'turn LED display off',
                        description: 'Turn off the LED display'
                    }),
                    arguments: { }
                },
                '---',
                {
                    opcode: 'drive',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.driveForwardBackward',
                        default: 'drive [DIR] for [NUM] seconds',
                        description: 'Send command to robot to drive forward or backward'
                    }),
                    arguments: {
                        NUM: {
                            type:ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        DIR: {
                            type:ArgumentType.String,
                            menu: 'DIRS',
                            defaultValue: _drive[0]
                        }
                    }
                },
                {
                    opcode: 'turn',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduinoBot.turnRightLeft',
                        default: 'turn [TURN] for [NUM] seconds',
                        description: 'Send command to robot to turn right or left'
                    }),
                    arguments: {
                        NUM: {
                            type:ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        TURN: {
                            type:ArgumentType.String,
                            menu: 'TURNS',
                            defaultValue: _turn[0]
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'arduinoBot.readButtonStatus',
                        default: 'when [BUTTON] button pressed',
                        description: 'Trigger when buttons on microbit are pressed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BUTTON: {
                            type:ArgumentType.String,
                            menu: 'BUTTON_STATES',
                            defaultValue: _button[0]
                        }
                    }
                },
                {
                    opcode: 'readLineStatus',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'arduinoBot.readLineSensorStatus',
                        default: 'line detected on [LINE]',
                        description: 'detect line sensor state'
                    }),
                    arguments: {
                        LINE: {
                            type:ArgumentType.String,
                            menu: 'LINE_STATES',
                            defaultValue: _line_states[0]
                        }
                    }
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
                }
                // play sounds
                // add blocks for speech?
            ],
            menus: {
                COLORS: {
                    acceptReporters: false,
                    items: _colors
                },
                ICONS: {
                    acceptReporters: false,
                    items: _icons
                },
                DIRS: {
                    acceptReporters: false,
                    items: _drive
                },
                TURNS: {
                    acceptReporters: false,
                    items: _turn
                },
                BUTTON_STATES: {
                    acceptReporters: false,
                    items: _button
                },
                LINE_STATES: {
                    acceptReporters: false,
                    items: _line_states
                }
            }
        };
    }
    isConnected() {
        //console.log("isConnected status: " + this._mStatus);
        return (this._mStatus == 2);
    }
    scan() {
        console.log("microbitRobotScan");
        this.connectToExtension();
    }
    async connect(ip_address) {
        this._ip = ip_address;
        console.log("Connect to this IP Address: http://" + this._ip);
        // Start getting data from robot
        let result = await this.requestFromRobot();
        if (result) {
          this.scratch_vm.emit(this.scratch_vm.constructor.PERIPHERAL_CONNECTED);
          this._mStatus = 2;
            return "Connected!";
        }
        return "Could not connect to robot.";
    }
    disconnect() {
        console.log("Closing websocket");
    }
    disconnectedFromRobot() {
        this._mStatus = 1;
        console.log("Lost connection to robot");   
        this.scratch_vm.emit(this.scratch_vm.constructor.PERIPHERAL_DISCONNECTED);
    }
    async sendToRobot(category, command) {
        let result = null;
        let cmd = "/control?var=rcmd&val=" + category + "&cmd=" + command;
        let boundDisconnectHandler = this.disconnectedFromRobot.bind(this);
        let url = this._ip + cmd;
        if (url.substring(0,7) != "http://") {
            url = "http://" + url;
        }
        return fetch(url).then(response => {
            // Update robot status? this._mStatus = 1;
            return;
        })
        .catch(function(err) {
            console.log('Error with fetch: ', err);
            boundDisconnectHandler();
        });
    }
    async caller(_url) {
        let boundDisconnectHandler = this.disconnectedFromRobot.bind(this);
        if (_url.substring(0,7) != "http://") {
            _url = "http://" + _url;
        }
        return fetch(_url).then(response => {
            return response.json();
      })
      .catch(function(err) {
          console.log('Error with fetch: ', err);
            boundDisconnectHandler();
       });
    }
    /**
     * Implement 
     * @param
     * Desc
     */
    async requestFromRobot() {
      let cmd = "/status";
      let rstatus = await this.caller(this._ip + cmd);
      
      if (rstatus == undefined) {
        return false;
      }
      // Update sensors
      this.a_button = Math.round(rstatus.a_button);
      this.b_button = Math.round(rstatus.b_button);
      this.left_line = Math.round(rstatus.left_line);
      this.right_line = Math.round(rstatus.right_line);
      this.dist_read = Math.round(rstatus.ultrasonic);
        
      // Update robot status?
        
      // Set timeout to wait for next update 
      if (this._mConnectionTimeout != null) {
        clearTimeout(this._mConnectionTimeout);
      }
      this._mConnectionTimeout = setTimeout(this.requestFromRobot.bind(this), 100);
      return true;
    }
    
  resetRobot() {
    this.stopMotors();
    this.rgbLedOff();
    this.ledDisplayOff();
  }
  async setIPAddress(args) {
    return await this.connect(args.IP_ADDRESS);
  }

  /**
   *
   */
  async setRgbLedColor (args) {
    console.log("set LED color: " + args.COLOR);    
    
    // Translate color to index
    var idxStr = (_colors.indexOf(args.COLOR) + 1).toString(16).charCodeAt(0);
    
    // Send message
    let cmd = 'L';
    return await this.sendToRobot(cmd.charCodeAt(0), idxStr);
  }
  async rgbLedOff () {
    console.log("Headlights off");
    // Send message
    let cmd = 'L0';
    return await this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
  }
  
  /**
   *
   */
  async setLEDDisplay (args) {
    console.log("set LED display: " + args.ICON);
    
    // Translate color to index
    var idxStr = (_icons.indexOf(args.ICON) + 1).toString(16).charCodeAt(0);
    // Send message
    let cmd = 'S';

    return this.sendToRobot(cmd.charCodeAt(0), idxStr);
    
  }
  async ledDisplayOff () {
    console.log("LED display off");
    // Send message
    let cmd = 'S0';
    this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
    return this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
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
  
    /**
     * Implement readButtonStaus
     */
  readButtonStatus (args) {
    var state = args.BUTTON;
    
    if (state == 'A') {
        return this.a_button == 1;   
    } else if (state == 'B') {
        return this.b_button == 1;
    } else if (state == 'A or B') {
        return (this.a_button == 1) || (this.b_button == 1);
    } else if (state == 'A and B') {
        return (this.a_button == 1) && (this.b_button == 1);
    } else if (state == 'neither A nor B') {
        return (this.a_button == 0) && (this.b_button == 0);
    }
    return false; // should never get here
  }
  /**
     * Implement whenButtonPressed
     */
    whenButtonPressed(args) {
        return this.readButtonStatus(args);
    }
  
  /**
     * Implement readLineStatus
     * @returns {string} t
     */
  readLineStatus (args) {
    var state = args.LINE;
    console.log(state + " " + this.right_line + " " + this.left_line);
    if (state == 'right side') {
        return this.right_line == 1;   
    } else if (state == 'left side') {
        return this.left_line == 1;
    } else if (state == 'both sides') {
        return (this.right_line == 1) && (this.left_line == 1);
    } else if (state == 'neither side') {
        return (this.right_line == 0) && (this.left_line == 0);
    }
    console.log("Should never get here");
    return false; // should never get here
  }

  async stopMotors () {
    console.log("Sending D0 to stop servos");
    // Send message
    let cmd = 'D0';
    //this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
    return this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
  }
  
  async wait(secs) {
    return new Promise(resolve => {
        setTimeout(resolve, secs*1000);
    });
  }
  /**
   * Implement drive to drive forward or backward
   * @secs {number} the number of seconds to drive backward
   * @dir {string} whether to turn "left" or "right"
   * @callback {function} the code to call when this function is done executing
   */
  async drive (args) {
    var secs = args.NUM;
    var dir = args.DIR;
    
    if (dir == 'forward') {
        console.log("Sending D1 to drive forward, secs: " + secs);
        // Send message
        let cmd = 'D1';
        this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
    } else {
        console.log('Sending D2 to drive backward, secs: ' + secs);
        // Send message
        let cmd = 'D2';
        this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));

    }
    
    await this.wait(secs);
    return this.stopMotors();
  }
  
  /**
   * Implement turn to turn left or right
   * @secs {number} the number of seconds to turn left
   * @dir {string} whether to turn "left" or "right"
   * @callback {function} the code to call when this function is done executing
   */
  async turn(args) {
    var secs = args.NUM;
    var dir = args.TURN;
    
    if (dir == 'left') {
    	console.log("Sending D3 to turn left, secs: " + secs);
        // Send message
        let cmd = 'D3';
        this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
    } else {
    	console.log("Sending D4 to turn right, secs: " + secs);
        // Send message
        let cmd = 'D4';
        this.sendToRobot(cmd.charCodeAt(0), cmd.charCodeAt(1));
    }
    
    await this.wait(secs);
    return this.stopMotors();
  }
 
}
module.exports = MicrobitRobot;