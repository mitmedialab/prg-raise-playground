require("regenerator-runtime/runtime"); // required to use async/await
const Runtime = require("../../engine/runtime");

const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const Color = require("../../util/color");

const Doodlebot = require("./doodlebot-web-bluetooth/index.js");
const EventEmitter = require('events');
const { addAbortSignal } = require("stream");

// eslint-disable-next-line max-len
const blockIconURI =
    "data:image/png;base64,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";

const EXTENSION_ID = "doodlebot";

const command_pause = 100;

const _drive = ["forward", "backward", "left", "right"];
const _turns = ["left", "right"];

const _pen_dirs = ["up", "down"];
const _pen_protocol = ["35", "10"];

const _bumpers = ["front", "back", "front or back", "front bumper and back", "neither"];

const _pixel_anims = ["blink", "chase", "solid"];
const _pixels = [
    "light 1",
    "light 2",
    "light 3",
    "light 4",
    "light 5",
    "light 6",
    "light 7",
    "light 8",
    "all lights"
];

const _no_blinks = [
    "confused",
    "disgust",
    "happy",
    "love",
    "sleeping",
    "wink"
];
const _anims = {
    "angry": "a",
    "annoyed": "y",
    "confused": "m",
    "disgust": "d",
    "engaged": "e",
    "fear": "f",
    "happy": "h",
    "love": "o",
    "neutral": "n",
    "sad": "s",
    "sleeping": "l",
    "surprise": "p",
    "wink": "i",
    "worried": "r",
    "wrong": "w"
}
const _anim_sounds = {
    "angry": "4",
    "annoyed": "",
    "confused": "63",
    "disgust": "29",
    "engaged": "72",
    "fear": "150",
    "happy": "88",
    "love": "",
    "neutral": "",
    "sad": "",
    "sleeping": "53",
    "surprise": "",
    "wink": "",
    "worried": "",
    "wrong": "136"
};

const _sensors = {
    "bumpers": "b",
    "distance": "d",
    "altimeter": "u",
    "accelerometer": "x",
    "magnetometer": "o",
    "gyroscope": "g",
    "color sensor": "l",
    "temperature": "t",
    "humidity": "h",
    "pressure": "p",
    "all sensors": "a",
};

// Core, Team, and Official extension classes should be registered statically with the Extension Manager.
// See: scratch-vm/src/extension-support/extension-manager.js
class DoodlebotBlocks {
    constructor(runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.scratch_vm = runtime;
        this.scratch_vm.registerPeripheralExtension(EXTENSION_ID, this);
        this.scratch_vm.connectPeripheral(EXTENSION_ID, 0);

        this.robot = this;

        this._robotStatus = 1;
        this._robotDevice = null;
        this._robotUart = null;

        this._colorArr = [0,0,0,0,0,0,0,0];
        this._pixelStatus = 0;
        this._pixelSpeed = 500;
        this._currentFace = null;
        this._blinkInterval = null;
        this._pixelInterval = null;

        this.motorEvent = new EventEmitter();

        this.sensorValues = {};
        this.sensorEvent = new EventEmitter();
        this.last_reading_time = 0;

        this.scratch_vm.on("PROJECT_STOP_ALL", this.resetRobot.bind(this));
        this.scratch_vm.on("CONNECT_DOODLEBOT", this.connectToBLE.bind(this));

        console.log("Version: trying Jan. firmware updates");
    }

    /**
     * @return {object} This extension's metadata.
     */
    getInfo() {
        return {
            id: EXTENSION_ID,
            name: formatMessage({
                id: "doodlebot",
                default: "PRG Doodlebot Blocks",
                description:
                    "Extension using BLE to communicate with Doodlebot",
            }),
            showStatusButton: true,
            blockIconURI: blockIconURI,
            menuIconURI: blockIconURI,

            blocks: [
                {
                    func: "CONNECT_DOODLEBOT",
                    blockType: BlockType.BUTTON,
                    text: "Connect Robot",
                },
                "---",
                {
                    opcode: "playAnimation",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.playAnimation",
                        default: "play [ANIM] animation",
                        description: "Start an animation",
                    }),
                    arguments: {
                        ANIM: {
                            type: ArgumentType.STRING,
                            menu: "ANIMS",
                            defaultValue: "happy",
                        },
                    },
                },
                {
                    opcode: 'speakText',
                    text: formatMessage({
                        id: 'doodlebot.speakText',
                        default: 'say [TEXT]',
                        description: 'Send text to the speech to text engine'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello'
                        }
                    }
                },
                /*{
                    opcode: 'askSpeechRecognition',
                    text: formatMessage({
                        id: 'doodlebot.speakAndListen',
                        default: 'ask [PROMPT] and wait',
                        description: 'Send text to STT engine then listen via TTS'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'How are you?'
                        }
                    }
                },
                {
                    opcode: 'getRecognizedSpeech',
                    text: formatMessage({
                        id: 'doodlebot.getRecognizedSpeech',
                        default: 'answer',
                        description: 'Return the results of the speech recognition'
                    }),
                    blockType: BlockType.REPORTER
                },*/
                {
                    opcode: "displayText",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.displayText",
                        default: "display text [TEXT]",
                        description: "display text on the screen",
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello!"
                        },
                    },
                },
                {
                    opcode: "clearDisplay",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.clearDisplay",
                        default: "clear display",
                        description: "Clear the display",
                    }),
                    arguments: {},
                },
                /*"---",
                {
                    opcode: "setPixels",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.setPixels",
                        default: "set [PIXEL] to [COLOR]",
                        description: "Set the neopixel lights",
                    }),
                    arguments: {
                        PIXEL: {
                            type: ArgumentType.STRING,
                            menu: "PIXELS",
                            defaultValue: "all lights",
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                        },
                    },
                },
                {
                    opcode: "setPixelColor",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.setLEDColor",
                        default:
                            "set lights to [COLOR1] [COLOR2] [COLOR3] [COLOR4] [COLOR5] [COLOR6] [COLOR7] [COLOR8]",
                        description: "Set the neopixel color",
                    }),
                    arguments: {
                        COLOR1: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR2: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR3: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR4: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR5: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR6: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR7: {
                            type: ArgumentType.COLOR,
                        },
                        COLOR8: {
                            type: ArgumentType.COLOR,
                        },
                    },
                },
                {
                    opcode: "setPixelAnim",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.setPixelAnim",
                        default: "set light animation to [ANIM]",
                        description: "Start a neopixel light animation",
                    }),
                    arguments: {
                        ANIM: {
                            type: ArgumentType.STRING,
                            menu: "PIXEL_ANIMS",
                            defaultValue: "blink",
                        },
                    },
                },
                {
                    opcode: "pixelsOff",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.ledOff",
                        default: "turn off pixels",
                        description: "Turn off the LED",
                    }),
                    arguments: {},
                },*/
                "---",
                {
                    opcode: "drive",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.driveFor",
                        default: "drive [DIR] for [NUM] steps",
                        description:
                            "Send command to robot to move motors for a certain number of steps",
                    }),
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                        },
                        DIR: {
                            type: ArgumentType.String,
                            menu: "DIRS",
                            defaultValue: _drive[0],
                        },
                    },
                },
                {
                    opcode: "turn",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.turnFor",
                        default: "spin [DIR] [NUM] degrees",
                        description:
                            "Send command to robot to turn in place to a certain angle",
                    }),
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90,
                        },
                        DIR: {
                            type: ArgumentType.String,
                            menu: "TURNS",
                            defaultValue: _turns[0],
                        },
                    },
                },
                {
                    opcode: "turnArc",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.turnArc",
                        default: "arc [DIR] with radius [RAD] for [NUM] degrees",
                        description:
                            "Send command to robot to turn in an arc to a certain angle",
                    }),
                    arguments: {
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90,
                        },
                        RAD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                        },
                        DIR: {
                            type: ArgumentType.String,
                            menu: "TURNS",
                            defaultValue: _turns[0],
                        },
                    },
                },
                {
                    opcode: "stopMotors",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.stopMotors",
                        default: "stop motors",
                        description:
                            "Send command to robot to stop moving motors",
                    }),
                    arguments: {},
                },
                {
                    opcode: "movePen",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.movePen",
                        default: "move pen [DIR]",
                        description:
                            "Send command to robot to raise or lower pen",
                    }),
                    arguments: {
                        DIR: {
                            type: ArgumentType.String,
                            menu: "PEN_DIRS",
                            defaultValue: _pen_dirs[0],
                        },
                    },
                },
                "---",
                {
                    opcode: "enableSensor",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.enableSensor",
                        default: "enable [SENSOR]",
                        description:
                            "Send command to enable a sensor",
                    }),
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.String,
                            menu: "SENSORS",
                            defaultValue: _sensors[0],
                        },
                    },
                },
                {
                    opcode: "disableSensor",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.disableSensor",
                        default: "disable [SENSOR]",
                        description:
                            "Send command to disable a sensor",
                    }),
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.String,
                            menu: "SENSORS",
                            defaultValue: _sensors[0],
                        },
                    },
                },
                {
                    opcode: "whenBumperPressed",
                    text: formatMessage({
                        id: "doodlebot.bumperStatusEvent",
                        default: "when [BUMPER] bumper [STATE]",
                        description:
                            "Edge trigger event for doodlebot bumpers",
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BUMPER: {
                            type: ArgumentType.String,
                            menu: "BUMPERS",
                            defaultValue: _bumpers[0],
                        }, 
                        STATE: {
                            type: ArgumentType.String,
                            menu: "PRESSED_STATE",
                            defaultValue: "pressed",
                        }
                    },
                },
                {
                    opcode: "ifBumperPressed",
                    text: formatMessage({
                        id: "doodlebot.readBumperStatus",
                        default: "[BUMPER] bumper pressed?",
                        description:
                            "Conditional indicating when bumpers on doodlebot are pressed",
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BUMPER: {
                            type: ArgumentType.String,
                            menu: "BUMPERS",
                            defaultValue: _bumpers[0],
                        },
                    },
                },
                {
                    opcode: "readBattery",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readBattery",
                        default: "battery level",
                        description:
                            "Get battery reading from robot",
                    }),
                },
                {
                    opcode: "readTemperature",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readTemperature",
                        default: "temperature",
                        description:
                            "Get temperature reading from robot",
                    }),
                },                {
                    opcode: "readHumidity",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readHumidity",
                        default: "humidity",
                        description:
                            "Get humidity reading from robot",
                    }),
                },                {
                    opcode: "readPressure",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readPressure",
                        default: "pressure",
                        description:
                            "Get pressure reading from robot",
                    }),
                },
                {
                    opcode: "readDistance",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readDistance",
                        default: "distance",
                        description:
                            "Get distance reading from robot",
                    }),
                },
                {
                    opcode: "readAccelerometer",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readAccelerometer",
                        default: "accelerometer [DIR]",
                        description:
                            "Get accelerometer reading from robot",
                    }),
                    arguments: {
                        DIR: {
                            type: ArgumentType.String,
                            menu: "ACC_GYRO_DIRS",
                            defaultValue: 'x',
                        },
                    },
                },
                {
                    opcode: "readMagnetometer",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readMagnetometer",
                        default: "magnetometer [DIR]",
                        description:
                            "Get magnetometer reading from robot",
                    }),
                    arguments: {
                        DIR: {
                            type: ArgumentType.String,
                            menu: "MAG_DIRS",
                            defaultValue: 'roll',
                        },
                    },
                },
                {
                    opcode: "readGyroscope",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "doodlebot.readGyroscope",
                        default: "gyroscope [DIR]",
                        description:
                            "Get gyroscope reading from robot",
                    }),
                    arguments: {
                        DIR: {
                            type: ArgumentType.String,
                            menu: "ACC_GYRO_DIRS",
                            defaultValue: 'x',
                        },
                    },
                },
                "---",
                {
                    opcode: "ifRobotConnected",
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: "doodlebot.isConnected",
                        default: "robot connected?",
                        description:
                            "Boolean to check if robot is connected to Scratch",
                    }),
                },
                {
                    opcode: "connectToWifi",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.setWifi",
                        default: "connect to [SSID] pw [PASSWORD]",
                        description: "Command to connect to Wifi network"
                    }),
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: "ssid"
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: "pw"
                        }
                    }
                },
                {
                    opcode: "quietSystems",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.quietSystems",
                        default: "quiet [SYSTEM]",
                        description: "Put systems in low power mode",
                    }),
                    arguments: {
                        SYSTEM: {
                            type: ArgumentType.STRING,
                            menu: "SYSTEMS",
                            defaultValue: "all",
                        },
                    },
                },
                {
                    opcode: "sendCommand",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.sendCommand",
                        default: "send comand [COMMAND]",
                        description: "Send a particular command to the robot",
                    }),
                    arguments: {
                        COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: "(d,n)",
                        },
                    },
                },
                {
                    opcode: "sendCommandAndWait",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "doodlebot.sendCommandAndWait",
                        default: "send comand [COMMAND] and wait",
                        description: "Send a particular command to the robot and wait for response from robot",
                    }),
                    arguments: {
                        COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: "(m,100,100,50,50)",
                        },
                    },
                },
            ],
            menus: {
                ACC_GYRO_DIRS: {
                    acceptReporters: false,
                    items: ['x', 'y', 'z'],
                },
                ANIMS: {
                    acceptReporters: true,
                    items: Object.keys(_anims),
                },
                BUMPERS: {
                    acceptReporters: false,
                    items: _bumpers,
                },
                DIRS: {
                    acceptReporters: false,
                    items: _drive,
                },
                MAG_DIRS: {
                    acceptReporters: false,
                    items: ['roll', 'pitch', 'yaw'],
                },
                PEN_DIRS: {
                    acceptReporters: false,
                    items: _pen_dirs,
                },
                PIXELS: {
                    acceptReporters: false,
                    items: _pixels,
                },
                PIXEL_ANIMS: {
                    acceptReporters: false,
                    items: _pixel_anims,
                },
                PRESSED_STATE: {
                    acceptReporters: false,
                    items: ["pressed", "released"],
                },
                SENSORS: {
                    acceptReporters: false,
                    items: Object.keys(_sensors),
                },
                SYSTEMS: {
                    acceptReporters: false,
                    items: ['all','motors','camera'],
                },
                TURNS: {
                    acceptReports: false,
                    items: _turns,
                },
            },
        };
    }

    /* The following 4 functions have to exist for the peripherial indicator */
    connect() {}
    disconnect() {}
    scan() {}
    isConnected() {
        console.log("isConnected status: " + this._robotStatus);
        return this._robotStatus == 2;
    }

    async onDeviceConnected() {
        console.log("Connected to bluetooth device: ", this._robotDevice);

        // update peripheral indicator
        this._robotStatus = 2;
        this.scratch_vm.emit(this.scratch_vm.constructor.PERIPHERAL_CONNECTED);

        // set listener for device disconnected
        console.log("Listen for device disconnect");
        this._robotDevice.addEventListener(
            "gattserverdisconnected",
            this.onDeviceDisconnected.bind(this)
        );

        // set listener for messages from uart service
        if (this._robotUart.addEventListener) {
            console.log("Receive mesages from uart service");
            this._robotUart.addEventListener(
                "receiveText",
                this.updateSensors.bind(this)
            );
        }
         
        // set up the text
        await this.sendCommandToRobot(
            "(d,x,2,1,65535)", command_pause
        );
        // start with face neutral
        this.playAnimation({ ANIM: "neutral" });
    }
    onDeviceDisconnected() {
        console.log("Lost connection to robot");
        
        // stop blinking
        this.stopBlink();

        // TODO stop pixel animation interval

        // update peripheral indicator
        this.scratch_vm.emit(
            this.scratch_vm.constructor.PERIPHERAL_DISCONNECTED
        );
        this._robotStatus = 1;

        // remove event listeners
        if (this._robotUart && this._robotUart.removeEventListener)
            this._robotUart.removeEventListener(
                "receiveText",
                this.updateSensors.bind(this)
            );
        this._robotDevice.removeEventListener(
            "gattserverdisconnected",
            this.onDeviceDisconnected.bind(this)
        );

        // reset robot variables
        this._robotDevice = null;
        this._robotUart = null;
    }

    async connectToBLE() {
        console.log("Getting BLE device");

        // for development
        let deviceNamePrefix = "Bluefruit52"; // "Saira" "BBC micro:bit";

        // RANDI try bluetooth audio devices
        const robotName = "Q65"; // "DoodlebotBT"
        let devices = await window.navigator.mediaDevices.enumerateDevices();
        let speakers = devices.filter(device => {
                            return device.kind === "audiooutput" && device.label.indexOf(robotName) >= 0;
                        });

        if (window.navigator.bluetooth) {
            try {
                this._robotDevice = await Doodlebot.requestRobot(
                    window.navigator.bluetooth,
                    deviceNamePrefix
                );
                const services = await Doodlebot.getServices(this._robotDevice);

                if (services.uartService) {
                    this._robotUart = services.uartService;

                    this.onDeviceConnected();
                }
            } catch (err) {
                console.log(err);
                if (err.message == "Bluetooth adapter not available.") {
                    alert("Your device does not support BLE connections.");
                } else if (err.message !== "User cancelled the requestDevice() chooser.") {
                    alert(
                        "There was a problem connecting your device, please try again or request assistance."
                    );
                }
            }
        }
    }

    resetRobot() {
        console.log("Stop everything on robot");
        // go into quiet mode? (q,a)
        // pen up?

        // stop motors
        this.stopMotors();
        // turn off lights
        this.pixelsOff();
        // stop blinking
        this.stopBlink();
    }

    /**
     * For reading accelerometer data back
     */
    async readAccelerometer(args) {
        let accDir = "accelerometer.x";
        if (args.DIR == "y") {
            accDir = "accelerometer.y";
        } else if (args.DIR == "z") {
            accDir = "accelerometer.z";
        }
        if (this._robotUart) {
            // enable the accelerometer if it is not already enabled
            if (!this.sensorValues.hasOwnProperty(accDir)) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "accelerometer"});
            }
            console.log(this.sensorValues["accelerometer.x"] + 
                ", " + this.sensorValues["accelerometer.y"] +
                ", " + this.sensorValues["accelerometer.z"]);
                return this.sensorValues[accDir];
        }
        return -1;
    }

    /**
     * For reading magnetometer data back
     */
    async readMagnetometer(args) {
        let magDir = "magnetometer.roll";
        if (args.DIR == "pitch") {
            magDir = "magnetometer.pitch";
        } else if (args.DIR == "yaw") {
            magDir = "magnetometer.yaw";
        }
        if (this._robotUart) {
            // enable the magnetometer if it is not already enabled
            if (!this.sensorValues.hasOwnProperty(magDir)) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "magnetometer"});   
            }
            console.log(this.sensorValues["magnetometer.roll"] + 
                ", " + this.sensorValues["magnetometer.pitch"] +
                ", " + this.sensorValues["magnetometer.yaw"]);
            return this.sensorValues[magDir];
        }
        return -1;
    }

    /**
     * For reading gyroscope data back
     */
    async readGyroscope(args) {
        let gyroDir = "gyroscope.x";
        if (args.DIR == "y") {
            gyroDir = "gyroscope.y";
        } else if (args.DIR == "z") {
            gyroDir = "gyroscope.z";
        }
        if (this._robotUart) {
            // enable the gyroscope if it is not already enabled
            if (!this.sensorValues.hasOwnProperty(gyroDir)) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "gyroscope"});   
            }
            console.log(this.sensorValues["gyroscope.x"] + 
                ", " + this.sensorValues["gyroscope.y"] +
                ", " + this.sensorValues["gyroscope.z"]);
            return this.sensorValues[gyroDir];
        }
        return -1;
    }

    /**
     * For reading temperature data back
     */
    async readTemperature() {
        if (this._robotUart) {
            // enable the thermometer if it is not already enabled
            if (!this.sensorValues.hasOwnProperty('temperature')) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "temperature"});   
            }
            
            return this.sensorValues['temperature'];
        }
        return -1; // should never get here
    }

    
    /**
     * For reading distance data back
     */
     async readDistance() {
        if (this._robotUart) {
            // enable the distance sensor if it is not already enabled
            if (!this.sensorValues.hasOwnProperty('distance')) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "distance"});   
            }
            
            return this.sensorValues['distance'];
        }
        return -1; // should never get here
    }

    /**
     * For reading pressure data back
     */
    async readPressure() {
        if (this._robotUart) {
            // enable the pressure sensor if it is not already enabled
            if (!this.sensorValues.hasOwnProperty('pressure')) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "pressure"});  
            } 

            return this.sensorValues['pressure'];
        }
        return -1; // should never get here
    }

    /**
     * For reading humidity data back
     */
    async readHumidity() {
        if (this._robotUart) {
            // enable the thermometer if it is not already enabled
            if (!this.sensorValues.hasOwnProperty('humidity')) {   
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "humidity"});   
            }

            return this.sensorValues['humidity'];
        }
        return -1; // should never get here
    }

    /**
     * For reading battery data back
     */
    async readBattery() {
        // enable battery
        if (this._robotUart) {
            // enable the battery if it is not already enabled
            console.log("enable battery");    
            await this.sendCommandToRobot(
                "(e,f)", command_pause
            );

            // wait for sensor to return
            return new Promise((resolve) => {
                this.sensorEvent.once("battery", async (value) => {
                    // disable the battery
                    console.log("disable battery");
                    await this.sendCommandToRobot(
                        "(x,f)", command_pause
                    );
                    resolve(value);
                });
            });
        }

        return -1; // should never get here
    }

    /**
     * For reading data back from the device
     */
    async ifBumperPressed(args) {
        let bumperSel = args.BUMPER;

        // enable bumpers
        if (this._robotUart) {
            // enable the bumpers if they are not already enabled
            if (!this.sensorValues.hasOwnProperty('bumper.front') || !this.sensorValues.hasOwnProperty('bumper.back')) {
                // wait for sensor to turn on
                await this.enableSensor({SENSOR: "bumpers"});   
            }
            
            const front = this.sensorValues["bumper.front"] == 0;
            const back = this.sensorValues["bumper.back"] == 0;

            if (bumperSel == "front") {
                return front;
            } else if (bumperSel == "back") {
                return back
            } else if (bumperSel == "front or back") {
                return front || back;
            } else if (bumperSel == "front bumper and back") {
                return front && back;
            } else if (bumperSel == "neither") {
                return !(front || back);
            }
        }

        return false; // should never get here
    }
    /**
     * Implement whenBumperPressed
     */
    whenBumperPressed(args) {
        let bumperSel = args.BUMPER;
        
        if (this._robotUart) {
            // make sure the bumpers are on
            if (this.sensorValues.hasOwnProperty('bumper.front') && this.sensorValues.hasOwnProperty('bumper.back')) {
                const front = this.sensorValues["bumper.front"] == 1;
                const back = this.sensorValues["bumper.back"] == 1;

                if (bumperSel == "front") {
                    return front;
                } else if (bumperSel == "back") {
                    return back
                } else if (bumperSel == "front or back") {
                    return front || back;
                } else if (bumperSel == "front bumper and back") {
                    return front && back;
                } else if (bumperSel == "neither") {
                    return !(front || back);
                }
            }
        }
    }

    async sendCommandToRobot(command, delayInMs) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (this._robotUart) {
                    console.log("Sending command:", command);
                    this._robotUart.sendText(command);
                }
                else console.log("Robot not available");
                resolve();
            }, delayInMs);
        });
    }

    async enableAllSensors(args) {
        const cmd = args.MODE == "enable" ? "e" : "x";
        const sensor_pause = 50;

        console.log("all sensors", args.MODE);

        for (const [sensor, sensor_cmd] of Object.entries(_sensors)) {
            await this.sendCommandToRobot(
                "(" + cmd + "," + sensor_cmd + ")", sensor_pause
            );
        }
    }

    /**
     * For enabling sensors
     */
    async enableSensor(args) {
        // send message
        let sensor_cmd = _sensors[args.SENSOR];
        console.log("Enable " + args.SENSOR + " sensor: " + sensor_cmd);

        if (args.SENSOR == "all sensors") {
            let sensor_cmds = Object.values(_sensors);
            // subtract 1 to exclude the "all sensors" entry
            for (let i=0; i<sensor_cmds.length-1; i++) {
                await this.sendCommandToRobot(
                    "(e," + _sensor_cmds[i] + ")", command_pause
                );
            }
        } else {
            await this.sendCommandToRobot(
                "(e," + sensor_cmd + ")", command_pause
            );
        }

        let sensorName = args.SENSOR;
        if (args.SENSOR == "all sensors" || args.SENSOR == "accelerometer") {
            sensorName = "accelerometer.x";
        } else if (args.SENSOR == "bumpers") {
            sensorName = "bumper.front";
        } else if (args.SENSOR == "gyroscope") {
            sensorName = "gyroscope.x";
        } else if (args.SENSOR == "magnetometer") {
            sensorName = "magnetometer.roll";
        }

        return new Promise((resolve) => {
            this.sensorEvent.once(sensorName, (value) => {
                resolve();
            });
        });
    }

    /**
     * For disabling sensors
     */
    async disableSensor(args) {
        let sensor_cmd = _sensors[args.SENSOR];

        console.log("Disable sensor " + sensor_cmd);
        if (args.SENSOR == "all sensors") {
            console.log("Disable everything");        
            // empty the sensor value array
            this.sensorValues = {};

            let sensor_cmds = Object.values(_sensors);
            for (let i=0; i<sensor_cmds.length-1; i++) {
                await this.sendCommandToRobot(
                    "(x," + sensor_cmds[i] + ")", command_pause
                );
            }
        } else if (args.SENSOR == "accelerometer") {
            delete this.sensorValues["accelerometer.x"];
            delete this.sensorValues["accelerometer.y"];
            delete this.sensorValues["accelerometer.z"];
        } else if (args.SENSOR == "bumpers") {
            delete this.sensorValues["bumper.front"];
            delete this.sensorValues["bumper.back"];
        } else if (args.SENSOR == "gyroscope") {
            delete this.sensorValues["gyroscope.x"];
            delete this.sensorValues["gyroscope.y"];
            delete this.sensorValues["gyroscope.z"];
        } else if (args.SENSOR == "magnetometer") {
            delete this.sensorValues["magnetometer.roll"];
            delete this.sensorValues["magnetometer.pitch"];
            delete this.sensorValues["magnetometer.yaw"];
        } else {
            delete this.sensorValues[args.SENSOR];
        }
        await this.sendCommandToRobot(
            "(x," + sensor_cmd + ")", command_pause
        );

        console.log("Enabled sensors: " + Object.keys(this.sensorValues));
    }

    /**
     * For returning sensor readings
     */
    updateSensors(event) {
        const dataLine = event.detail.split("(");
        console.log("Received message: ", dataLine); // for debugging

        for (let i=0; i<dataLine.length; i++) {
            let data = dataLine[i];
            if (data) {
                if (data == "ms)") {
                    console.log("Stop the motor");
                    this.motorEvent.emit('stop');
                } else if (data != "") {
                    let ds = data.split(",");
                    const sensor = ds[0];
                    switch(sensor) {
                        case "b":
                            this.sensorEvent.emit('bumper.front', Number.parseInt(ds[1]));
                            this.sensorEvent.emit('bumper.back', Number.parseInt(ds[2]));
                            this.sensorValues['bumper.front'] = Number.parseInt(ds[1]);
                            this.sensorValues['bumper.back'] = Number.parseInt(ds[2]);
                            break;
                        case "l":
                            this.sensorEvent.emit('color.red', Number.parseFloat(ds[1]));
                            this.sensorEvent.emit('color.green', Number.parseFloat(ds[2]));
                            this.sensorEvent.emit('color.blue', Number.parseFloat(ds[3]));
                            this.sensorValues['color.red'] = Number.parseFloat(ds[1]);
                            this.sensorValues['color.green'] = Number.parseFloat(ds[2]);
                            this.sensorValues['color.blue'] = Number.parseFloat(ds[3]);
                            break;
                        case "d":
                            this.sensorEvent.emit('distance', Number.parseInt(ds[1]));
                            this.sensorValues['distance'] = Number.parseInt(ds[1]);
                            break;
                        case "h":
                            this.sensorEvent.emit('humidity', Number.parseFloat(ds[1]));
                            this.sensorValues['humidity'] = Number.parseFloat(ds[1]);
                            break;
                        case "t":
                            this.sensorEvent.emit('temperature', Number.parseFloat(ds[1]));
                            this.sensorValues['temperature'] = Number.parseFloat(ds[1]);
                            break;
                        case "p":
                            this.sensorEvent.emit('pressure', Number.parseFloat(ds[1]));
                            this.sensorValues['pressure'] = Number.parseFloat(ds[1]);
                            break;
                        case "o":
                            this.sensorEvent.emit('magnetometer.roll', Number.parseFloat(ds[1]));
                            this.sensorEvent.emit('magnetometer.pitch', Number.parseFloat(ds[2]));
                            this.sensorEvent.emit('magnetometer.yaw', Number.parseFloat(ds[3]));
                            this.sensorValues['magnetometer.roll'] = Number.parseFloat(ds[1]);
                            this.sensorValues['magnetometer.pitch'] = Number.parseFloat(ds[2]);
                            this.sensorValues['magnetometer.yaw'] = Number.parseFloat(ds[3]);
                            break;
                        case "g":
                            this.sensorEvent.emit('gyroscope.x', Number.parseFloat(ds[1]));
                            this.sensorEvent.emit('gyroscope.y', Number.parseFloat(ds[2]));
                            this.sensorEvent.emit('gyroscope.z', Number.parseFloat(ds[3]));
                            this.sensorValues['gyroscope.x'] = Number.parseFloat(ds[1]);
                            this.sensorValues['gyroscope.y'] = Number.parseFloat(ds[2]);
                            this.sensorValues['gyroscope.z'] = Number.parseFloat(ds[3]);
                            break;
                        case "u":
                            this.sensorEvent.emit('altitude', Number.parseFloat(ds[1]));
                            this.sensorValues['altitude'] = Number.parseFloat(ds[1]);
                            break;
                        case "x":
                            this.sensorEvent.emit('accelerometer.x', Number.parseFloat(ds[1]));
                            this.sensorEvent.emit('accelerometer.y', Number.parseFloat(ds[2]));
                            this.sensorEvent.emit('accelerometer.z', Number.parseFloat(ds[3]));
                            this.sensorValues['accelerometer.x'] = Number.parseFloat(ds[1]);
                            this.sensorValues['accelerometer.y'] = Number.parseFloat(ds[2]);
                            this.sensorValues['accelerometer.z'] = Number.parseFloat(ds[3]);
                            break;
                        case "f":
                            this.sensorEvent.emit('battery', Number.parseFloat(ds[1]));
                            this.sensorValues['battery'] = Number.parseFloat(ds[1]); // TODO constantly monitor battery
                            break;
                        default:
                            console.log("Received unrecognized data:", data);
                    }
                }
            }
        }
    }

    /**
     * For playing robot animations
     */
    async playAnimation(args) {
        // Translate face to ble protocol command
        this._currentFace = args.ANIM;
        const animFace = _anims[this._currentFace];
        const animSound = _anim_sounds[this._currentFace];
        console.log("play animation: " + args.ANIM + " " + animFace);

        // stop blinking
        this.stopBlink();

        // blink to transition faces
        await this.sendCommandToRobot("(d,b)", command_pause);
        await this.sendCommandToRobot(
            "(d," + animFace + ")", command_pause
        );
        // play sound associated with animation
        if (animSound != "") {
            await this.sendCommandToRobot(
                "(s," + animSound + ")", command_pause
            );
        }
        
        // send message
        if (args.ANIM == "happy") {
            const happy_pause = 250;
            // Bounce the pen twice to indicate joy
            await this.sendCommandToRobot("(u,35)", happy_pause);
            await this.sendCommandToRobot("(u,10)", happy_pause);
            await this.sendCommandToRobot("(u,35)", happy_pause);
            await this.sendCommandToRobot("(u,10)", happy_pause);
        }

        // start blinking
        if (_no_blinks.indexOf(args.ANIM) == -1 && !this._blinkInterval) {
            console.log("starting blink interval");
            this._blinkInterval = setInterval(this.playBlink.bind(this), 4023);
        }
    }
    /**
     * For playing the blinking animation
     */
    async playBlink() {
        const animFace = _anims[this._currentFace];
        const blink_pause = 150;

        console.log("play animation: blink");

        // send message
        await this.sendCommandToRobot("(d,b)", command_pause);
        await this.sendCommandToRobot(
            "(d," + animFace + ")", blink_pause
        );
    }   
    /**
     * For stopping the blinking animation
     */
    stopBlink() {
        console.log("stopping blink interval");

        // stop blink intervals
        if (this._blinkInterval) {
            clearInterval(this._blinkInterval);
            this._blinkInterval = null;
        }
    }

    /**
     * For speaking via text-to-speech system
     */
     async speakText(args) {
        console.log("say: " + args.TEXT);

        // TODO TTS
    }

    /**
     * For setting text on display
     */
    async displayText(args) {
        console.log("display text: " + args.TEXT);

        // stop blinking
        this.stopBlink();

        // send message
        await this.sendCommandToRobot("(d,t," + args.TEXT + ")", command_pause);
    }


    /**
     * For clearing the display
     */
    async clearDisplay(args) {
        console.log("clear display");

        // stop blinking
        this.stopBlink();

        // send message
        await this.sendCommandToRobot("(d,c)", command_pause);
    }

    pixelHexToDecimal(inputColor) {
        let rgbColor = Color.hexToRgb(inputColor);
        let hsvColor = Color.rgbToHsv(rgbColor);

        hsvColor.s = hsvColor.s > 0 ? 1 - ((1 - hsvColor.s) / 4) : hsvColor.s;
        hsvColor.v = hsvColor.v / 4;

        rgbColor = Color.hsvToRgb(hsvColor);
        return Color.rgbToDecimal(rgbColor);
    }
    /**
     * For setting individual neopixel colors
     */
    async setPixels(args) {
        if (args.PIXEL == "all lights") {
            for (let i = 0; i < this._colorArr.length; i++) {
                // Translate hex color to rgb
                this._colorArr[i] = this.pixelHexToDecimal(args.COLOR);
            }
        } else {
            // calculate the index of the pixel, note light 1 is on top, light 8 is on bottom
            const idx = (this._colorArr.length-1) - _pixels.indexOf(args.PIXEL);
            this._colorArr[idx] = this.pixelHexToDecimal(args.COLOR);
        }

        console.log("set pixels: " + this._colorArr.join(","));

        // send message
        await this.sendCommandToRobot("(p," + this._colorArr.join(",") + ")", command_pause);
    }
    /**
     * For setting individual neopixel colors
     */
    async setPixelColor(args) {
        // get all the color args as array
        const colorArgs = Object.entries(args)
            .filter((entry) => entry[0].startsWith("COLOR"))
            .map((entry) => entry[1]);

        let color = this.pixelHexToDecimal(colorArgs[0]);
        // count the pixels backward to line up with the order of the pixels on the robot
        for (let i = 0; i < this._colorArr.length; i++) {
            // if there is a list of colors, use the correct index, otherwise use the first color in the array
            if (colorArgs.length > i) {
                // Translate hex color to binary
                color = this.pixelHexToDecimal(colorArgs[i]);
            }
            this._colorArr[(this._colorArr.length - 1) - i] = color;
        }

        console.log("set color: " + this._colorArr.join(","));

        // send message      
        await this.sendCommandToRobot("(p," + this._colorArr.join(",") + ")", command_pause);
    }
    /**
     * For shifting the colors of the lights in the neopixel array
     */
    async shiftPixels() {
        let tmp = null;
        for (let i = 1; i < this._colorArr.length; i++) {
            tmp = this._colorArr[i];
            this._colorArr[i] = this._colorArr[i-1];
            this._colorArr[i-1] = tmp;
        }

        console.log("shift pixels: " + this._colorArr.join(","));

        // send message
        await this.sendCommandToRobot("(p," + this._colorArr.join(",") + ")", command_pause);
    }
    /**
     * For blinking the lights in the neopixel array
     */
    async togglePixels() {
        if (this._pixelStatus == 0) {
            // send message        
            await this.sendCommandToRobot("(p," + this._colorArr.join(",") + ")", command_pause);
            this._pixelStatus = 1;
        } else {
            // lights off
            await this.sendCommandToRobot("(p,0,0,0,0,0,0,0,0)", command_pause);
            this._pixelStatus = 0;
        }
    }
    /**
     * For turning off all of the pixels
     */
    setPixelAnim(args) {
        console.log("set neopixel animation: " + args.ANIM);

        // clear the preivous interval
        if (this._pixelInterval) {
            console.log("Clear pixel interval");
            clearInterval(this._pixelInterval);
            this._pixelInterval = null;
        }

        if (args.ANIM == "blink") {
            console.log("starting neopixel blink interval");
            this._pixelInterval = setInterval(this.togglePixels.bind(this), this._pixelSpeed);
        } else if (args.ANIM == "chase") {
            console.log("starting pixel chase interval");
            this._pixelInterval = setInterval(this.shiftPixels.bind(this), this._pixelSpeed);
        }
    }
    /**
     * For turning off all of the pixels
     */
    async pixelsOff(args) {
        console.log("turning off neopixels");

        // clear the preivous interval
        if (this._pixelInterval) {
            console.log("Clear pixel interval");
            clearInterval(this._pixelInterval);
            this._pixelInterval = null;
        }

        // send message
        await this.sendCommandToRobot("(p,0,0,0,0,0,0,0,0)", command_pause);
    }

    /**
     * For activating the motors
     */
    async drive(args) {
        console.log(
            "drive command: " +
                args.DIR +
                " " +
                args.NUM +
                " steps"
        );
        // determine the number of steps
        let leftSteps = args.NUM;
        let rightSteps = args.NUM;
        if (args.DIR == "left" || args.DIR == "backward")
            leftSteps = -leftSteps;
        if (args.DIR == "right" | args.DIR == "backward")
            rightSteps = - rightSteps;

        // send message
        await this.sendCommandToRobot("(m,100,100,"  + leftSteps + "," + rightSteps + ")", command_pause);
        
        // wait for the motor command to finish executing
        return new Promise((resolve) => {
            this.motorEvent.once('stop', () =>{ 
                resolve();
            });
        });
    }
    async turn(args) {
        console.log(
            "turn command: " +
                args.DIR +
                " " +
                args.NUM +
                " degrees"
        );
        
        // determine the number of degrees
        let numDegrees = args.NUM;
        if (args.DIR == "right")
            numDegrees = -numDegrees;

        // send message
        await this.sendCommandToRobot("(t,0," + numDegrees + ")", command_pause);

        // wait for the motor command to finish executing
        return new Promise((resolve) => {
            this.motorEvent.once('stop', () =>{ 
                resolve();
            });
        });
    }
    async turnArc(args) {
        console.log(
            "arc command: " +
                args.DIR +
                " " +
                args.RAD + 
                " radius " +
                args.NUM +
                " degrees"
        );
        
        // determine the number of degrees
        let numDegrees = args.NUM;
        if (args.DIR == "right")
            numDegrees = -numDegrees;

        // send message
        await this.sendCommandToRobot("(t," + args.RAD + "," + numDegrees + ")", command_pause);

        // wait for the motor command to finish executing
        return new Promise((resolve) => {
            this.motorEvent.once('stop', () =>{ 
                resolve();
            });
        });
    }
    /**
     * For moving the pen
     */
    async movePen(args) {
        // Translate direction to ble protocol command
        let penCmd = _pen_protocol[_pen_dirs.indexOf(args.DIR)];

        console.log("move pen: " + args.DIR + " " + penCmd);
        // send message
        await this.sendCommandToRobot("(u," + penCmd + ")", command_pause);
    }
    /**
     * For stopping motors
     */
    async stopMotors(args) {
        console.log("stopping motors");
        // send message
        await this.sendCommandToRobot("(m,s)", command_pause);
    }

    /**
     * Just for testing, checks if robot is connected or not 
     */
    ifRobotConnected(args) {
        return this._robotStatus == 2;
    }
    /**
     * Block for connecting to Wifi network TODO return or store ip address
     */
    async connectToWifi(args) {
        let ssid = args.SSID;
        let pw = args.PASSWORD;

        console.log("connecting to Wifi");
        //send message
        await this.sendCommandToRobot("(k," + ssid + "," + pw + ")", command_pause);

       // wait to receive ip address in response
       /*return new Promise((resolve) => {
        this.robotEvent.once('ip', () =>{ 
            resolve(ipAddress);
        });*/
    }
    /**
     * Block for putting items in low power mode
     */
    async quietSystems(args) {
        let system = args.SYSTEM;

        console.log("put " + system + " into low power mode");
        
        let system_cmd = "a";
        if (system == "motors") {
            system_cmd = "m"
        } else if (system == "camera") {
            system_cmd = "c"
        }

        //send message
        await this.sendCommandToRobot("(q," + system_cmd + ")", command_pause);
    }
    /**
     * Just for testing out sending commands to robot via ble
     */
    async sendCommand(args) {
        let command = args.COMMAND;
        console.log("Sending uart command: ", command);

        // stop blinking
        this.stopBlink();

        await this.sendCommandToRobot(
            command, command_pause
        );
    }
    /**
     * Just for testing out sending commands to robot via ble
     */
    async sendCommandAndWait(args) {
        let command = args.COMMAND;
        console.log("Sending a blocking uart command: ", command);

        // stop blinking
        this.stopBlink();

        // send message
        await this.sendCommandToRobot(
            command, command_pause
        );

        // wait for the motor command to finish executing
        return new Promise((resolve) => {
            this.motorEvent.once('stop', () =>{ 
                resolve();
            });
        });
    }
}
module.exports = DoodlebotBlocks;
