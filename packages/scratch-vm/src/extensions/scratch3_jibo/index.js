require("regenerator-runtime/runtime"); // required to use async/await
const Runtime = require("../../engine/runtime");
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const formatMessage = require("format-message");
const Color = require("../../util/color");

// eslint-disable-next-line max-len
const blockIconURI = "data:image/png;base64,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"
    
const EXTENSION_ID = "jibo";

const _colors = {
    "red": {x:255, y:0, z:0},
    //"orange": {x:255, y:69, z:0},
    "yellow": {x:255, y:69, z:0},
    "green": {x:0, y:167, z:0},
    "cyan": {x:0, y:167, z:48},
    "blue": {x:0, y:0, z:255},
    "magenta": {x:255, y:0, z:163},
    //"pink": {x:255, y:20, z:147},
    "white": {x:255, y:255, z:255},
    "random": "random"
}

const _tutorial_speech = [
    '',
    'First, let\'s look at the text classification blocks. This is the text matches block. You can put anything into the text box, then the dropdown let\'s you match the text to any of the classes in your classifier. Use this block in a yellow conditional block.',
    'Here is the confidence block. It tells you how sure the classifier is that it has the right answer. I would recommend using this block in an embedded conditional block, like the picture.',
    'Now let\'s see how we train our model. Scroll to the Text Classification category and look for the Edit Model button at the top',
    'On the Edit text model screen you can add all of your classes and training examples. Press add label to add new classes. Type examples for each class into the text box and press add example to save them.',
    'You\'ll want to add multiple examples to each label to make your classifier work well.',
    'Let\'s give it a try. Go ahead and add training examples to your model and add more to the code too.'
];

const _progress_tab_speech = [
    'The progress tab is here to help you level up your project. It shows you how can improve your work and what you have done well so far.',
    'Try to have more than two text class labels. You get the most points for having at least three classes.',
    'Also try to put at least five examples in each class',
    'Then, make sure that your classes are balanced. You don\'t want one class label to have more examples than the others.',
    'In your code, get creative with your use of text classification blocks. Use lots of matches blocks and confidence blocks.',
    'Make your code more capable using embedded conditionals. You can use them to check the confidence of a match before you respond.'
];

const ROSLIB = require('roslib');

class Scratch3Jibo {
    constructor (runtime) {
        this.runtime = runtime;
        this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
        this.runtime.connectPeripheral(EXTENSION_ID, 0);

        this.ros = null;
        this.connected = false;
        this.failed = false;
        this.rosbridgeIP = "ws://localhost:9090";  // rosbridgeIP option includes port
        this.jbVolume="60";
        this.asr_out="";

        // OPTIONAL alert enter rosip
        // connect to jibo via ros
        this.RosConnect({rosIP: "localhost"});

        // prepare to comment on progress
        this.runtime.on("PROJECT_CHANGED", this.updateProgress.bind(this));
        this.runtime.on("PROGRESS_TAB_ACCESS", this.progressReport.bind(this));
        this.runtime.on("TUTORIAL_CHANGED", this.updateTutorial.bind(this));
        this.progress = {
            compliments: {
                'At least five examples per text classifier class': false,
                'Text classifier classes are well balanced': false,
                'Using embedded conditionals': false,
                'Using two text classification blocks': false,
                'Two text classifier classes': false,
                'Three or more text classifier classes': false,
            },
            improvements: {
                'You have two text classifier classes so far. Try to see if you can add more.': false,
                'Try adding some text classifier classes with the \'Edit Model\' button to increase your progress.': false,
                'You need at least 5 examples per class to have an accurate classifier.': false,
                'Try making the number of examples per class be the same.': false,
                'Try adding a variety of text classification blocks to increase your progress.': false,
                'Try embedding conditionals to make your code more complex.': false,
                'It seems like you\'re not using the same type of answer and asking blocks.': false,
            }
          };
    }

    getInfo () {
        return {
            id: EXTENSION_ID,
            name: formatMessage({
                id: "jibo",
                default: "PRG Jibo Control Blocks",
                description:
                    "Extension using ROS docker to communicate with Jibo",
            }),
            showStatusButton: true,
            blocks: [
                /*{
                    opcode: "RosConnect",
                    blockType: BlockType.COMMAND,
                    text: "Connect to ROS IP [rosIP]",
                    arguments: {
                        rosIP: {
                            type: ArgumentType.STRING,
                            defaultValue: "localhost"
                        }
                    }
                },
                "---",*/
                {
                    opcode: 'JiboTTS',
                    blockType: BlockType.COMMAND,
                    text: 'say [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello, I am Jibo"
                        }
                    }
                },
                {
                    opcode: 'JiboAsk',
                    blockType: BlockType.COMMAND,
                    text: 'ask [TEXT] and wait',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "How are you?"
                        }
                    }
                },
                {
                    opcode: 'JiboListen',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "jibo.listen",
                        default: "answer",
                        description:
                            "returns the speech Jibo hears from his ASR",
                    }),
                },
                {
                    opcode: "JiboVolume",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.setVolume",
                        default: "set Jibo Volume to [VOL]",
                        description: "Set Jibo Volume",
                    }),
                    arguments: {
                        VOL: {
                            type: ArgumentType.STRING,
                            menu: "VOLS",
                            defaultValue: this.jbVolume,
                        },
                    },
                },
                {
                    opcode: "JiboAnim",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.setAnim",
                        default: "set Jibo Animation to [AKEY]",
                        description: "Set Jibo Volume",
                    }),
                    arguments: {
                        AKEY: {
                            type: ArgumentType.STRING,
                            menu: "AnimKeys",
                            defaultValue: "spider.keys",
                        },
                    },
                },
                {
                    opcode: "JiboAudio",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.playAudio",
                        default: "play Jibo Audio to [VKEY]",
                        description: "Play Jibo Audio",
                    }),
                    arguments: {
                        VKEY: {
                            type: ArgumentType.STRING,
                            menu: "AudioKeys",
                            defaultValue: "instruments/Blocks.mp3",
                        },
                    },
                },
                {
                    opcode: "JiboLED",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.setLED",
                        default: "set Jibo LED to [COLOR]",
                        description: "Set the LED lights",
                    }),
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: "LedColors",
                            defaultValue: "random",
                        },
                    },
                },
                {
                    opcode: "JiboLEDOff",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.turnLEDOff",
                        default: "turn Jibo LED off",
                        description: "Turn off Jibo LED",
                    }),
                },
                /*{
                    opcode: "JiboLED1",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.setLED",
                        default: "set Jibo LED to [COLOR]",
                        description: "Set the LED lights",
                    }),
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR
                        },
                    },
                },*/
                {
                    opcode: "JiboLook",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "jibo.setLook",
                        default: "set Jibo Look at [X_angle], [Y_angle], [Z_angle]",
                        description: "Set Jibo Look angles",
                    }),
                    arguments: {
                        X_angle: {
                            type: ArgumentType.STRING,
                            defaultValue:"0"
                        },
                        Y_angle: {
                            type: ArgumentType.STRING,
                            defaultValue:"0"
                        },
                        Z_angle: {
                            type: ArgumentType.STRING,
                            defaultValue:"0"
                        },
                    },
                },
            ],
            menus: {
                VOLS: {
                    acceptReporters: false,
                    items: ["10","20","30","40","50","60","70","80","90","100"],
                },
                AnimKeys: {
                    acceptReporters: true,
                    items: ["spider.keys","snail.keys"],
                },
                AudioKeys: {
                    acceptReporters: true,
                    items: ["instruments/Blocks.mp3"],
                },
                LedColors: {
                    acceptReporters: true,
                    items: Object.keys(_colors),
                },
            }
        };
    }

    /* The following 4 functions have to exist for the peripherial indicator */
    connect() {
        console.log("this.connect");
    }
    disconnect() {}
    scan() {}
    isConnected() {
        console.log("isConnected status: " + this.connected);
        return this.connected;
    }

    updateProgress() {
        this.calculatePercentage();
    }

    progressReport(progressState) {
        console.log(progressState);
        // percentage
        if (progressState.percentage == 100) {
            this.JiboTTS({TEXT: 'Excellent work. You\'ve accomplished all of the items in checklist. Test out your classifier thoroughly to make sure it works for everyone who might use it.'});
        } else if (progressState.percentage >= 75) {
            this.JiboTTS({TEXT: 'You\'ve made solid progress on your text classifier. There are a few more things I might add.'});
        } else if (progressState.percentage >= 50) {
            this.JiboTTS({TEXT: 'Looking good so far. Let\'s add a few more things to make your classifier work even better.'});
        } else if (progressState.percentage >= 25) {
            this.JiboTTS({TEXT: 'You\'re off to a really good start. Let\'s look at ways we might improve this program.'});
        } else {
            this.JiboTTS({TEXT: 'I bet that making some of these improvements will help you make your project work really well.'});
        }

        // improvements
        // compliments
    }

    updateTutorial(tutorial, step) {
        // text-classifier-intro, ai-progress-tab
        console.log("Tutorial: ", tutorial, step);

        if (tutorial == 'text-classifier-intro') {
            this.JiboTTS({TEXT: _tutorial_speech[step]});
        } else if (tutorial == 'ai-progress-tab') {
            this.JiboTTS({TEXT: _progress_tab_speech[step]});
        }
    }

    calculatePercentage () {
        if (!this.runtime || !this.runtime.modelData || this.runtime.targets <= 0) {
            return ;
        }
        let modelData = this.runtime.modelData.classifierData;
        let blocks_used = this.runtime.targets[1].blocks._blocks;

        this.numberOfClasses(modelData);
        this.atLeastFive(modelData);
        this.balancedClasses(modelData);
        this.analyzeBlocks(blocks_used);

        console.log(this.progress);
        
        return this.progress.percentage;
    }

    numberOfClasses (textModel) {
        textModelClasses = Object.keys(textModel);

        if (textModelClasses.length === 2) {
            // Jibo comment
            if (!this.progress.compliments['Two text classifier classes']) {
                this.JiboTTS({TEXT: 'It\'s great that you have two text classifier classes. Try to keep adding more'});
            }
            // update compliments
            this.progress.compliments['Two text classifier classes'] = true;
            this.progress.compliments['Three or more text classifier classes'] = false;
            // update improvements
            this.progress.improvements['You have two text classifier classes so far. Try to see if you can add more.'] = true;
            this.progress.improvements['Try adding some text classifier classes with the \'Edit Model\' button to increase your progress.'] = true;
        } else if (textModelClasses.length > 2) {
            // Jibo comment
            if(!this.progress.compliments['Three or more text classifier classes']) {
                this.JiboTTS({TEXT: 'Great job adding additional classes to your classifier'});
            }
            // update compliments
            this.progress.compliments['Two text classifier classes'] = true;
            this.progress.compliments['Three or more text classifier classes'] = true;
            // update improvements
            this.progress.improvements['You have two text classifier classes so far. Try to see if you can add more.'] = false;
            this.progress.improvements['Try adding some text classifier classes with the \'Edit Model\' button to increase your progress.'] = true;
        } else {
            // Jibo comment

            // update compliments
            this.progress.compliments['Two text classifier classes'] = false;
            this.progress.compliments['Three or more text classifier classes'] = false;
            // update improvements
            this.progress.improvements['You have two text classifier classes so far. Try to see if you can add more.'] = false;
            this.progress.improvements['Try adding some text classifier classes with the \'Edit Model\' button to increase your progress.'] = true;
        }
    }

    atLeastFive (textModel) {
        let minimum = false;
        for (const label in textModel) {
            if (textModel[label].length < 5) {
                minimum = true;
            }
        }

        if (minimum === true) {
            // Jibo comment
            if (this.progress.compliments['At least five examples per text classifier class']) {
                this.JiboTTS({TEXT: 'Don\'t forget to have at least five examples in each class'});
            }
            // update compliments
            this.progress.compliments['At least five examples per text classifier class'] = false;
            // update improvements
            this.progress.improvements['You need at least 5 examples per class to have an accurate classifier.'] = true;
        } else if (Object.keys(textModel).length > 0) {
            // Jibo comment
            if (!this.progress.compliments['At least five examples per text classifier class']) {
                this.JiboTTS({TEXT: 'Nice! You added at least five examples to every class label'});
            }
            // update compliments
            this.progress.compliments['At least five examples per text classifier class'] = true;
            // update improvements
            this.progress.improvements['You need at least 5 examples per class to have an accurate classifier.'] = false;
        }
    }

    balancedClasses (keys) {
        let classNumbers = [];
        let minimum = false;
        for (const label in keys) {
            let count = 0;
            for (const _ in keys[label]) {
                count = count + 1;
            }
            if (keys[label].length < 5) {
                minimum = true;
            }
            classNumbers.push(count);
        }

        classNumbers.sort();
        if (classNumbers.length > 1) {
            if (classNumbers[classNumbers.length - 1] - classNumbers[0] > 3) {
                // Jibo comment
                if (this.progress.compliments['Text classifier classes are well balanced']) {
                    this.JiboTTS({TEXT: 'Don\'t forget to balance those classes again'});
                }
                // update compliments
                this.progress.compliments['Text classifier classes are well balanced'] = false;
                // update improvements
                this.progress.improvements['Try making the number of examples per class be the same.'] = true;
            } else if (minimum === false) {
                // Jibo comment
                if (!this.progress.compliments['Text classifier classes are well balanced']) {
                    this.JiboTTS({TEXT: 'Look at that, your classes are all well balanced'});
                }
                // update compliments
                this.progress.compliments['Text classifier classes are well balanced'] = true;
                // update improvements
                this.progress.improvements['Try making the number of examples per class be the same.'] = false;
            }
        }
    }

    analyzeBlocks (blocks) {
        let count = 0;
        const parents = [];
        let sensing = 0;
        let answer = 0;
        let usedEmbeddedConditionals = false;

        // go through all of the blocks
        for (const block in blocks) {
            if (blocks[block].opcode.includes('textClassification')) {
                count = count + 1;
            }
            if (blocks[block].opcode.includes('control_if')) {
                parents.push(blocks[block].id);
            }

            if (blocks[block].opcode.includes('sensing_askandwait')) {
                sensing = sensing + 1;
            }

            if (blocks[block].opcode.includes('sensing_answer')) {
                answer = answer + 1;
            }
        }

        // check if sensing and answer matches
        if (sensing !== 0 && answer === 0) {
            // Jibo comment

            // update compliments

            // update improvements
            this.progress.improvements['It seems like you\'re not using the same type of answer and asking blocks.'] = true;
        } else {
            // Jibo comment

            // update compliments

            // update improvements
            this.progress.improvements['It seems like you\'re not using the same type of answer and asking blocks.'] = false;
        }

        // check if there is an embedded
        for (const block in blocks) {
            if (blocks[block].opcode.includes('control_if')) {
                if (parents.includes(blocks[block].parent)) {
                    usedEmbeddedConditionals = true;
                }
            }
        }
        // if not an embedded
        if (!usedEmbeddedConditionals) {
            // Jibo comment

            // update compliments
            this.progress.compliments['Using embedded conditionals'] = false;
            // update improvements
            this.progress.improvements['Try embedding conditionals to make your code more complex.'] = true;
        } else {
            // Jibo comment
            if (!this.progress.compliments['Using embedded conditionals']) {
                this.JiboTTS({TEXT: 'Good use of embedded conditionals'});
            }
            // update compliments
            this.progress.compliments['Using embedded conditionals'] = true;
            // update improvements
            this.progress.improvements['Try embedding conditionals to make your code more complex.'] = false;
        }
        
        // check how many text classification blocks there are
        if (count >= 2) {
            // Jibo comment
            if (!this.progress.compliments['Using two text classification blocks']) {
                this.JiboTTS({TEXT: 'Nice coding. You used a lot of text classification blocks'});
            }
            // update compliments
            this.progress.compliments['Using two text classification blocks'] = true;
            // update improvements
            this.progress.improvements['Try adding a variety of text classification blocks to increase your progress.'] = true;
        } else {
            this.progress.compliments['Using two text classification blocks'] = false;
            this.progress.improvements['Try adding a variety of text classification blocks to increase your progress.'] = false;
        }
    }

    RosConnect (args) {
        const rosIP = Cast.toString(args.rosIP);
        this.rosbridgeIP = "ws://"+rosIP+":9090";
        log.log("ROS: Attempting to connect to rosbridge at " + this.rosbridgeIP);

        if (!this.connected){
        
            this.ros = new ROSLIB.Ros({
                url : this.rosbridgeIP
            });

            // If connection is successful
            let connect_cb_factory = function(x) {return function(){
                x.connected = true;
                // send jibo welcome message
                //x.JiboTTS({TEXT: "Hello there. Welcome to A.I. Blocks. We're going to make a classifier that can tell the difference between positive and negative reviews."});
            };};
            let connect_cb = connect_cb_factory(this);
            this.ros.on('connection', function() {
                connect_cb();
                log.info('ROS: Connected to websocket server.');        
            });

            // If connection fails
            let error_cb_factory = function(x) {return function(){x.failed = true;};};
            let error_cb = error_cb_factory(this);
            this.ros.on('error', function(error) {
                error_cb();
                log.error('ROS: Error connecting to websocket server: ', error);
            });

            // If connection ends
            let disconnect_cb_factory = function(x) {return function(){x.connected = false;};};
            let disconnect_cb = disconnect_cb_factory(this);
            this.ros.on('close', function() {
                disconnect_cb();
                log.info('ROS: Connection to websocket server closed.');
            });
        }
        this.JiboState();
        this.JiboPublish({
            "do_attention_mode":true,
            "attention_mode": 1,
            "do_anim_transition":true,
            "anim_transition":0,
            "do_led":true,
            "led_color": {"x":0,"y":0,"z":0,}
        });
        this.JiboASR_reseive();

        return this.connected;
    
    }

    async JiboTTS (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
        var jibo_msg ={
            "do_tts":true,
            "tts_text": text,
            "do_lookat":false,
            "do_motion":false,
            "volume":parseFloat(this.jbVolume)
            };
        await this.JiboPublish(jibo_msg);
    }

    async JiboAsk (args) {
        // say question
        await this.JiboTTS({TEXT: args.TEXT});

        // listen for answer
        this.JiboASR_request();
        // wait for sensor to return
        this.asr_out = await this.JiboASR_reseive();
    }
    async JiboListen (args) {
        return this.asr_out;
    }

    JiboLED (args) {
        let ledHex = _colors[args.COLOR];

        if (ledHex == "random") {
            const randomColorIdx = Math.floor(Math.random() * (Object.keys(_colors).length-1));
            const randomColor = Object.keys(_colors)[randomColorIdx];
            ledHex = _colors[randomColor];
        }
        log.log(ledHex);

        var jibo_msg ={
            "do_led":true,
            "led_color": ledHex
            };
        this.JiboPublish(jibo_msg);
    }

    JiboLEDOff (args) {
        var jibo_msg ={
            "do_led":true,
            "led_color": {x:0, y:0, z:0}
            };
        this.JiboPublish(jibo_msg);
    }

    JiboLED1 (args) {
        const led = Cast.toString(args.COLOR);
        log.log(led);
        log.log(this.hexToRgb(led))

        var jibo_msg ={
            "do_led":true,
            "led_color": this.hexToRgb(led)
            };
        this.JiboPublish(jibo_msg);
    }

    JiboVolume (args) {
        const Volume = Cast.toString(args.VOL);
        log.log(parseFloat(Volume));
        this.jbVolume = parseFloat(Volume);

        var jibo_msg ={
            "do_volume":true,
            "volume": parseFloat(Volume)
            };
        this.JiboPublish(jibo_msg);
    }

    JiboLook (args) {
        const X = Cast.toString(args.X_angle);
        const Y = Cast.toString(args.Y_angle);
        const Z = Cast.toString(args.Z_angle);
        log.log(parseFloat(X), parseFloat(Y), parseFloat(Z));

        var jibo_msg ={
            "do_lookat":true,
            "lookat": {
                x: parseFloat(X),
                y: parseFloat(Y),
                z: parseFloat(Z)
              }
            };
        this.JiboPublish(jibo_msg);
    }



    JiboAnim(args) {
        const animation_key = Cast.toString(args.AKEY);
        log.log(animation_key);

        var jibo_msg ={
            "do_motion":true,
            "do_tts":false,
            "do_lookat":false,
            "motion": animation_key
            };
        this.JiboPublish(jibo_msg);


        this.JiboPublish({"do_anim_transition":true,"anim_transition":0});
    }


    JiboAudio(args) {
        const audio_key = Cast.toString(args.VKEY);
        log.log(audio_key);

        var jibo_msg ={
            "do_motion":false,
            "do_tts":false,
            "do_lookat":false,
            "do_sound_playback":true,
            "audio_filename": audio_key
            };
        this.JiboPublish(jibo_msg);
    }


    async JiboPublish(msg){
        if (!this.connected){
            console.log("ROS is not connetced")
            return false
        }
        var cmdVel = new ROSLIB.Topic({
                ros : this.ros,
                name : '/jibo',
                messageType : 'jibo_msgs/JiboAction'
            });
        console.log(msg);
        var jibo_msg = new ROSLIB.Message(msg);
        cmdVel.publish(jibo_msg);
        await new Promise(r => setTimeout(r, 2000));
        this.JiboState();
    }

    JiboState(){

        // Subscribing to a Topic
        // ----------------------

        var state_listener = new ROSLIB.Topic({
            ros : this.ros,
            name : '/jibo_state',
            messageType : 'jibo_msgs/JiboState'
        });

        state_listener.subscribe(function(message) {
            console.log('Received message on ' + state_listener.name + ': ');
            console.log(message);
            state_listener.unsubscribe();
        });
    }
    JiboASR_request(){
        if (!this.connected){
            console.log("ROS is not connetced")
            return false
        }
        var cmdVel = new ROSLIB.Topic({
                ros : this.ros,
                name : '/jibo_asr_command',
                messageType : 'jibo_msgs/JiboAsrCommand'
            });
        var jibo_msg = new ROSLIB.Message({"heyjibo":false,"command": 1});
        cmdVel.publish(jibo_msg);
    }

    async JiboASR_reseive() {
        return new Promise((resolve) => {
            var asr_listener = new ROSLIB.Topic({
                ros : this.ros,
                name : '/jibo_asr_result',
                messageType : 'jibo_msgs/JiboAsrResult'
            });

            asr_listener.subscribe(function(message) {
                console.log('Received message on ' + asr_listener.name + ': ');
                console.log(message);
                asr_listener.unsubscribe();
                //this.asr_out = message.transcription;
                resolve(message.transcription);
            });
        });
    }

    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        x: parseInt(result[1], 16),
        y: parseInt(result[2], 16),
        z: parseInt(result[3], 16)
      } : null;
    }
}

module.exports = Scratch3Jibo;