require("regenerator-runtime/runtime"); // required to use async/await
// const Runtime = require("../../engine/runtime");
// const ArgumentType = require('../../extension-support/argument-type');
// const BlockType = require('../../extension-support/block-type');
// const Cast = require('../../util/cast');
// const log = require('../../util/log');

import Runtime from "../../engine/runtime";
import Cast from "../../util/cast";
import log from "../../util/log";
import EventEmitter from 'events';

import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment, BlockDefinitions } from "../../typescript-support/types";

import ROSLIB from 'roslib';

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'INSERT HERE'

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'INSERT HERE'

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

const _dances = {
    "Disco": "Dances/dance_disco_00.keys",
    "Slow Dance": "Dances/Prom_Night_01_01.keys",
    "Happy Dance": "Dances/Happy_Lucky_01_01.keys",
    "Robot": "Dances/Robotic_01_01.keys"
}

const _emotions = {
    "Celebrate": "Dances/Celebrate_01.keys",
    "Embarassed": "Misc/embarassed_01_02.keys",
    "Frustrated": "Misc/Frustrated_01_04.keys",
    "Laugh": "Misc/Laughter_01_03.keys",
    "Sad": "Misc/Sad_03.keys",
    "Thinking": "Misc/thinking_08.keys",
    "Disco": "Dances/dance_disco_00.keys",
    "Slow Dance": "Dances/Prom_Night_01_01.keys",
    "Happy Dance": "Dances/Happy_Lucky_01_01.keys",
    "Robot": "Dances/Robotic_01_01.keys"
}

const _emojis = {
    "Airplane": "Emoji/Emoji_Airplane_01_01.keys",
    "Apple": "Emoji/Emoji_AppleRed_01_01.keys",
    "Art": "Emoji/Emoji_Art_01_01.keys",
    "Bowling": "Emoji/Emoji_Bowling.keys",
    "Correct": "Emoji/Emoji_Checkmark_01_01.keys",
    "Exclamation": "Emoji/Emoji_ExclamationYellow.keys",
    "Football": "Emoji/Emoji_Football_01_01.keys",
    "Heart": "Emoji/Emoji_HeartArrow_01_01.keys",
    "Magic": "Emoji/Emoji_Magic_01_02.keys",
    "Ocean": "Emoji/Emoji_Ocean_01_01.keys",
    "Penguin": "Emoji/Emoji_Penguin_01_01.keys",
    "Rainbow" : "Emoji/Emoji_Rainbow_01_01.keys",
    "Robot": "Emoji/Emoji_Robot_01_01.keys",
    "Rocket": "Emoji/Emoji_Rocket_01_01.keys",
    "Snowflake": "Emoji/Emoji_Snowflake_01_01.keys",
    "Taco": "Emoji/Emoji_Taco_01_01.keys",
    "Video Game": "Emoji/Emoji_VideoGame_01_01.keys"
}

const _tutorial_speech = [
    '',
    'Use the text matches block in a yellow conditional block.',
    'The confidence block tells you how sure the classifier is that it has the right answer.',
    'To train the model, scroll to the Text Classification category and look for the button at the top',
    'On the Edit text model screen you can add all of your classes and training examples.',
    'You\'ll want to add multiple examples to each label to make your classifier work well.',
    'Complete the code by adding training examples to your model and adding more code too.'
];

const _progress_tab_speech = [
    'The progress tab shows you how can improve your work and what you have done well so far.',
    'Try to have more than two text class labels. You get the most points for having at least three classes.',
    'Also try to put at least five examples in each class',
    'Make sure that one class label doesn\'t have a bunch more examples than the others.',
    'Get creative with your use of text classification blocks. Use lots of matches blocks and confidence blocks.',
    'Use confidence blocks in embedded conditionals to check your predictions before you respond.'
];

// add const enums

type Details = {
    name: "Jibo Blocks", 
    description: "jibo", 
    iconURL: "", 
    insetIconURL: ""
}

type Blocks = {
    JiboTTS: (text: string) => void, 
    JiboAsk: (text: string) => void, 
    JiboListen: () => any, 
    JiboEmoji: (akey: string) => void, 
    JiboEmote: (akey: string) => void, 
    JiboLED: (color: string) => void, 
    JiboLEDOff: () => void, 
    JiboLook: (x_angle: string, y_angle: string, z_angle: string) => void, 
}

class Scratch3Jibo extends Extension<Details, Blocks> {
    runtime: Runtime;
    ros: any; // TODO
    connected: boolean; 
    failed: boolean; 
    rosbridgeIP: string; 
    jbVolume: string; 
    asr_out: any; 
    jiboEvent: EventEmitter;
    progress: any; // is this right??

    init(env: Environment) {
        this.runtime = env.runtime;
        this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
        this.runtime.connectPeripheral(EXTENSION_ID, 0); 

        this.ros = null;
        this.connected = false; 
        this.failed = false;
        this.rosbridgeIP = "ws://localhost:9090";  // rosbridgeIP option includes port
        this.jbVolume="60";
        this.asr_out="";
        this.jiboEvent = new EventEmitter();

        this.RosConnect({rosIP: "localhost"});

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

    defineTranslations() { return undefined };

    defineBlocks(): BlockDefinitions<Blocks> {
        return {
            JiboTTS: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                arg: {
                        type: ArgumentType.String, 
                        defaultValue: "Hello, I am Jibo"
                    },
                text: (text: string) => `say ${text}`, 
                operation: (text: string) => this.JiboTTS(text)
            }), 
            JiboAsk: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                arg:
                    {
                        type: ArgumentType.String, 
                        defaultValue: "How are you?"
                    }, 
                text: (text: string) => `ask ${text} and wait`, 
                operation: (text: string) => this.JiboAsk(text)
            }), 
            JiboListen: (self: Scratch3Jibo) => ({
                type: BlockType.Reporter, 
                text: `answer`, 
                operation: () => this.JiboListen()
            }), 
            JiboEmoji: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                arg: {
                        type: ArgumentType.String, 
                        defaultValue: "Penguin", 
                        options: Object.keys(_emojis)
                    }, 
                text: (akey: string) => `set Jibo Emoji ${akey}`, 
                operation: (akey: string) => this.JiboEmoji(akey)
            }), 
            JiboEmote: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                arg: {
                        type: ArgumentType.String, 
                        defaultValue: "Celebrate", 
                        options: Object.keys(_emotions)
                    }, 
                text: (akey: string) => `set Jibo Animation to ${akey}`, 
                operation: (akey: string) => this.JiboEmote(akey)
            }), 
            JiboLED: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                arg: {
                        type: ArgumentType.String, 
                        defaultValue: "random",
                        options: Object.keys(_colors)
                    }, 
                text: (color: string) => `set Jibo LED to ${color}`, 
                operation: (color: string) => this.JiboLED(color)
            }), 
            JiboLEDOff: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                text: `turn Jibo LED off`, 
                operation: () => this.JiboLEDOff()
            }), 
            JiboLook: (self: Scratch3Jibo) => ({
                type: BlockType.Command, 
                args: [
                    {
                        type: ArgumentType.String, 
                        defaultValue: "0"   
                    }, 
                    {
                        type: ArgumentType.String, 
                        defaultValue: "0"   
                    }, 
                    {
                        type: ArgumentType.String, 
                        defaultValue: "0"   
                    }, 
                ], 
                text: (x_angle: string, y_angle: string, z_angle: string) => `set Jibo Look at ${x_angle}, ${y_angle}, ${z_angle}`,
                operation: (x_angle: string, y_angle: string, z_angle: string) => this.JiboLook(x_angle, y_angle, z_angle)
            })
        }
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
        // this.calculatePercentage();
    }

    progressReport(progressState: { percentage: number; }) {
        console.log(progressState);
        // percentage
        if (progressState.percentage == 100) {
            this.JiboTTS('Excellent work. You\'ve accomplished all of the items in checklist.');
        } else if (progressState.percentage >= 75) {
            this.JiboTTS('You\'ve made solid progress on your text classifier. There are a few more things I might add.');
        } else if (progressState.percentage >= 50) {
            this.JiboTTS('Looking good so far. Let\'s add a few more things to make your classifier work even better.');
        } else if (progressState.percentage >= 25) {
            this.JiboTTS('You\'re off to a really good start. Let\'s look at ways we might improve this program.');
        } else {
            this.JiboTTS('I bet that making some of these improvements will help you make your project work really well.');
        }

        // improvements
        // compliments
    }

    updateTutorial(tutorial: string, step: any) {
        // text-classifier-intro, ai-progress-tab
        console.log("Tutorial: ", tutorial, step);

        if (tutorial == 'text-classifier-intro') {
            //this.JiboTTS({TEXT: _tutorial_speech[step]});
        } else if (tutorial == 'ai-progress-tab') {
            //this.JiboTTS({TEXT: _progress_tab_speech[step]});
        }
    }

    // calculatePercentage () {
    //     if (!this.runtime || !this.runtime.modelData || this.runtime.targets <= 0) {
    //         return ;
    //     }
    //     let modelData = this.runtime.modelData.classifierData;
    //     let blocks_used = this.runtime.targets[1].blocks._blocks;

    //     this.numberOfClasses(modelData);
    //     this.atLeastFive(modelData);
    //     this.balancedClasses(modelData);
    //     this.analyzeBlocks(blocks_used);

    //     console.log(this.progress);
        
    //     return this.progress.percentage;
    // }

    numberOfClasses (textModel: any) {
        const textModelClasses = Object.keys(textModel);

        if (textModelClasses.length === 2) {
            // Jibo comment
            if (!this.progress.compliments['Two text classifier classes']) {
                this.JiboTTS('It\'s great that you have two text classifier classes. Try to keep adding more');
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
                this.JiboTTS('Great job adding additional classes to your classifier');
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

    atLeastFive (textModel: { [x: string]: string | any[]; }) {
        let minimum = false;
        for (const label in textModel) {
            if (textModel[label].length < 5) {
                minimum = true;
            }
        }

        if (minimum === true) {
            // Jibo comment
            if (this.progress.compliments['At least five examples per text classifier class']) {
                this.JiboTTS('Don\'t forget to have at least five examples in each class');
            }
            // update compliments
            this.progress.compliments['At least five examples per text classifier class'] = false;
            // update improvements
            this.progress.improvements['You need at least 5 examples per class to have an accurate classifier.'] = true;
        } else if (Object.keys(textModel).length > 0) {
            // Jibo comment
            if (!this.progress.compliments['At least five examples per text classifier class']) {
                this.JiboTTS('Nice! You added at least five examples to every class label');
            }
            // update compliments
            this.progress.compliments['At least five examples per text classifier class'] = true;
            // update improvements
            this.progress.improvements['You need at least 5 examples per class to have an accurate classifier.'] = false;
        }
    }

    balancedClasses (keys: { [x: string]: string | any; }) {
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
                    this.JiboTTS('Don\'t forget to balance those classes again');
                }
                // update compliments
                this.progress.compliments['Text classifier classes are well balanced'] = false;
                // update improvements
                this.progress.improvements['Try making the number of examples per class be the same.'] = true;
            } else if (minimum === false) {
                // Jibo comment
                if (!this.progress.compliments['Text classifier classes are well balanced']) {
                    this.JiboTTS('Look at that, your classes are all well balanced');
                }
                // update compliments
                this.progress.compliments['Text classifier classes are well balanced'] = true;
                // update improvements
                this.progress.improvements['Try making the number of examples per class be the same.'] = false;
            }
        }
    }

    analyzeBlocks (blocks: { [x: string]: any; }) {
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
                this.JiboTTS('Good use of embedded conditionals');
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
                this.JiboTTS('Nice coding. You used a lot of text classification blocks');
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

    RosConnect (args: { rosIP: any; }) {
        const rosIP = Cast.toString(args.rosIP);
        this.rosbridgeIP = "ws://"+rosIP+":9090";
        log.log("ROS: Attempting to connect to rosbridge at " + this.rosbridgeIP);

        if (!this.connected){
        
            this.ros = new ROSLIB.Ros({
                url : this.rosbridgeIP
            });

            // If connection is successful
            let connect_cb_factory = function(x: any) {return function(){
                x.connected = true;
                // send jibo welcome message
                x.JiboTTS({TEXT: "Hello there. Welcome to A.I. Blocks."});
            };};
            let connect_cb = connect_cb_factory(this);
            this.ros.on('connection', function() {
                connect_cb();
                log.info('ROS: Connected to websocket server.');        
            });

            // If connection fails
            let error_cb_factory = function(x: any) {return function(){x.failed = true;};};
            let error_cb = error_cb_factory(this);
            this.ros.on('error', function(error: any) {
                error_cb();
                log.error('ROS: Error connecting to websocket server: ', error);
            });

            // If connection ends
            let disconnect_cb_factory = function(x: any) {return function(){x.connected = false;};};
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

    async JiboTTS (text: string) {
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

    async JiboAsk (text: string) {
        // say question
        await this.JiboTTS(text);

        // listen for answer
        this.JiboASR_request();
        // wait for sensor to return
        this.asr_out = await this.JiboASR_reseive();
    }
    async JiboListen () {
        return this.asr_out;
    }

    JiboLED (color: string) {
        let ledHex = _colors[color];

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

    async JiboLEDOff () {
        var jibo_msg ={
            "do_led":true,
            "led_color": {x:0, y:0, z:0}
            };
        await this.JiboPublish(jibo_msg);
    }

    // JiboLED1 (args) {
    //     const led = Cast.toString(args.COLOR);
    //     log.log(led);
    //     log.log(this.hexToRgb(led))

    //     var jibo_msg ={
    //         "do_led":true,
    //         "led_color": this.hexToRgb(led)
    //         };
    //     this.JiboPublish(jibo_msg);
    // }

    // JiboVolume (args) {
    //     const Volume = Cast.toString(args.VOL);
    //     log.log(parseFloat(Volume));
    //     this.jbVolume = parseFloat(Volume);

    //     var jibo_msg ={
    //         "do_volume":true,
    //         "volume": parseFloat(Volume)
    //         };
    //     this.JiboPublish(jibo_msg);
    // }

    JiboLook (X: string, Y: string, Z: string) {
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

    async JiboEmoji(akey: string) {
        const animation_key = _emojis[akey];
        await this.JiboAnim(animation_key);
    }

    async JiboEmote(akey: string) {
        const animation_key = _emotions[akey];
        await this.JiboAnim(animation_key);
    }

    // async JiboDance(args) {
    //     const animation_key = _dances[args.AKEY];
    //     await this.JiboAnim({AKEY: animation_key});
    // }


    async JiboAnim(animation_key: string) {
        log.log(animation_key);

        var jibo_msg ={
            "do_motion":true,
            "do_tts":false,
            "do_lookat":false,
            "motion": animation_key
            };
        await this.JiboPublish(jibo_msg);

        await this.JiboPublish({"do_anim_transition":true,"anim_transition":0});

        /* // wait for command to compelte
        return new Promise((resolve) => {
            this.jiboEvent.once("command.complete", async () => {
                resolve();
            });
        });*/
    }

    // async JiboAudio(args) {
    //     const audio_key = Cast.toString(args.VKEY);
    //     log.log(audio_key);

    //     var jibo_msg ={
    //         "do_motion":false,
    //         "do_tts":false,
    //         "do_lookat":false,
    //         "do_sound_playback":true,
    //         "audio_filename": audio_key
    //         };
    //     await this.JiboPublish(jibo_msg);
    // }


    async JiboPublish(msg: any){
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

        state_listener.subscribe(function(message: any) {
            console.log('Received message on ' + state_listener.name + ': ');
            console.log(message);
            state_listener.unsubscribe();

            //this.jiboEvent.emit('command.complete');
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

            asr_listener.subscribe(function(message: { transcription: unknown; }) {
                console.log('Received message on ' + asr_listener.name + ': ');
                console.log(message);
                asr_listener.unsubscribe();
                //this.asr_out = message.transcription;
                resolve(message.transcription);
            });
        });
    }

    hexToRgb(hex: any) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        x: parseInt(result[1], 16),
        y: parseInt(result[2], 16),
        z: parseInt(result[3], 16)
      } : null;
    }
}

module.exports = Scratch3Jibo;