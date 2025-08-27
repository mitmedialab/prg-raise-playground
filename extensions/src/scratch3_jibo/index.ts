// firebase
import database from './firebase';

import { ArgumentType, BlockType, BlockUtilityWithID } from "$common";
import { BlockDefinitions, MenuItem } from "$common";
import { Extension } from "$common";
import { RuntimeEvent } from "$common";

import VirtualJibo from "./virtualJibo/virtualJibo";
import { Color, ColorType, colorDef } from "./jiboUtils/ColorDef";
import { Direction, DirType, directionDef } from "./jiboUtils/LookAtDef";
import {
  Dance, DanceType, danceFiles,
  Emotion, EmotionType, emotionFiles,
  Icon, IconType, iconFiles,
  Audio, AudioType, audioFiles
} from "./jiboUtils/AnimDef";

/** Import our svelte components */
import ColorArgUI from "./ColorArgument.svelte";
import EmojiArgUI from "./EmojiArgument.svelte";
import IconArgUI from "./IconArgument.svelte";

import ROSLIB from "roslib";


const EXTENSION_ID = "jibo";

// jibo's name
var jiboName: string = "";
// var databaseRef = database.ref("Jibo-Name/" + jiboName);

type Details = {
  name: "Jibo",
  description: "Program your favorite social robot, Jibo. This extension works with a physical or virtual Jibo.",
  iconURL: "jibo_icon.png",
  insetIconURL: "jibo_inset_icon.png",
  tags: ["Made by PRG"],
};

type Blocks = {
  JiboButton: () => void;
  JiboTTS: (text: string) => void;
  JiboAsk: (text: string) => void;
  JiboListen: () => any;
  JiboEmote: (emotion: string) => void;
  JiboIcon: (icon: string) => void;
  JiboDance: (dance: string) => void;
  JiboAudio: (audio: string) => void; // new audio block
  //JiboVolume: (text: string) => void; // new volume block
  JiboLED: (color: string) => void;
  JiboLook: (dir: string) => void; // (x_angle: string, y_angle: string, z_angle: string) => void;
};

var jibo_event = {
  // readyForNext: true,
  msg_type: "",
  // anim_transition: 0,
  // attention_mode: 1,
  // audio_filename: "",
  // do_anim_transition: false,
  // do_attention_mode: false,
  // do_led: false,
  // do_lookat: false,
  // do_motion: false,
  // do_sound_playback: false,
  // do_tts: false,
  // do_volume: false,
  // led_color: [0, 100, 0], //red, green, blue
  // lookat: [0, 0, 0], //x, y, z
  // motion: "",
  // tts_duration_stretch: 0,
  // tts_pitch: 0,
  // tts_text: "",
  // volume: 0,
};

// class FirebaseQueue {
//   async timedFinish(timeoutFn: () => Promise<void>): Promise<void> {
//     const requests = [
//       timeoutFn(),
//       this.animFinished(),
//     ];
//     return Promise.race(requests);
//   }

//   async ASR_received(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       console.log("Waiting to hear from JiboAsrEvent");
//       const pathRef = database.ref("Jibo-Name/" + jiboName);
//       var eventKey: any;
//       var eventData: any;
//       pathRef.on("value", (snapshot) => {
//         // Loop through the child snapshots of JiboAsrResult
//         snapshot.forEach((childSnapshot) => {
//           eventKey = childSnapshot.key;
//           eventData = childSnapshot.val();
//         });
//         if (eventData.msg_type === "JiboAsrResult") {
//           pathRef.off();
//           // console.log("eventData is: " + JSON.stringify(eventData));
//           var transcription = eventData.transcription;
//           console.log("Jibo heard: " + transcription);
//           resolve(transcription);
//         }
//       });
//     });
//   }
//   async animFinished(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       console.log("Waiting for default message from database");
//       const pathRef = database.ref("Jibo-Name/" + jiboName);
//       var eventKey: any;
//       var eventData: any;
//       pathRef.on("value", (snapshot) => {
//         // Loop through the child snapshots of JiboAsrResult
//         snapshot.forEach((childSnapshot) => {
//           eventKey = childSnapshot.key;
//           eventData = childSnapshot.val();
//         });
//         console.log("last event is");
//         console.log(eventData);
//         if (eventData.msg_type === "default") {
//           pathRef.off();
//           resolve();
//         }
//       });
//     });
//   }

//   async pushToFirebase(data: any, awaitFn: () => Promise<void>) {
//     if (jiboName != "") {
//       database.ref("Jibo-Name/" + jiboName).push({ ...data });
//       await new Promise(r => setTimeout(r, 2000)); // wait a bit before proceeding
//       await awaitFn();
//     }
//     else {
//       console.log("No Jibo Name added.");
//     }
//   }
// }
// const queue = new FirebaseQueue();

export async function setJiboName(name: string): Promise<void> {
  var jiboNameRef = database.ref("Jibo-Name");
  return new Promise<void>((resolve) => {
    jiboNameRef
      .once("value", (snapshot) => {
        localStorage.setItem("prevJiboName", name);
        if (snapshot.hasChild(name)) {
          console.log("'" + name + "' exists.");
          jiboName = name;
          resolve();
        } else {
          database.ref("Jibo-Name/" + name).push(jibo_event);
          jiboName = name;
          console.log(
            "'" + name + "' did not exist, and has now been created."
          );
          resolve();
        }
      });
  });
}

export default class Scratch3Jibo extends Extension<Details, Blocks> {
  ros: any; // TODO
  connected: boolean;
  rosbridgeIP: string;
  jbVolume: string;
  asr_out: any;
  dances: MenuItem<string>[];
  dirs: MenuItem<string>[];
  audios: MenuItem<string>[]; // new
  virtualJibo: VirtualJibo;
  state: any;

  init(env) {
    this.dances = Object.entries(Dance).map(([dance, def]) => ({
      text: Dance[dance],
      value: Dance[dance],
    }));
    this.dirs = Object.entries(Direction).map(([direction]) => ({
      text: Direction[direction],
      value: Direction[direction],
    }));
    this.audios = Object.entries(Audio).map(([audio, def]) => ({ // new
      value: Audio[audio],
      text: Audio[audio],
    }));

    this.openUI("UI");
    this.runtime._downloadProjectFromURLDirect("https://www.dropbox.com/scl/fi/gfexwdpvq7b0ntyuzs0oj/JiboStarter_fs.sb3?rlkey=joffuyxw0pag8v3o62g1xhxdm&st=ygrbc5cw&dl=0&tutorial=jiboBlocks");

    this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    this.runtime.connectPeripheral(EXTENSION_ID, 0);
    this.runtime.on(RuntimeEvent.PeripheralConnected, this.connect.bind(this));
    this.virtualJibo = new VirtualJibo();
    this.virtualJibo.init(this.runtime);
    this.asr_out = "";

    this.state = null;
    

  }

  setJiboName(name: string) {
    console.log("NAME", name);
    this.ros = null;
    this.connected = false;
    this.rosbridgeIP = `wss://${name}.mitlivinglab.org`; // rosbridgeIP option includes port
    this.jbVolume = "60";
    const connection = this.RosConnect({ rosIP: `${name}.mitlivinglab.org` });
    if (connection) {
      this.connect();
      jiboName = name;
    }
    
  }

  checkBusy(self: Scratch3Jibo) {
    // checking state
    var state_listener = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo_state",
      messageType: "jibo_msgs/JiboState",
    });

    state_listener.subscribe(function (message: any) {
      state_listener.unsubscribe();
    });
  }

  defineTranslations() {
    return undefined;
  }



  defineBlocks(): BlockDefinitions<Scratch3Jibo> {
    return {
      JiboButton: (self: Scratch3Jibo) => ({
        type: BlockType.Button,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Jibo's name here",
        },
        text: () => `Connect/Disconnect Jibo`,
        operation: async () => {
          if (jiboName === "")
            this.openUI("UI", "Connect Jibo");
          else
            jiboName = "";
        },
      }),
      JiboTTS: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Hello, I am Jibo",
        },
        text: (text: string) => `say ${text}`,
        operation: async (text: string, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.say(text, target);
          let physicalJ = this.jiboTTSFn(text);
          await Promise.all([virtualJ, physicalJ]);
        }
      }),
      JiboAsk: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: async (text: string, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.say(text, target);;
          let awaitResponse;
          // TODO test
          if (jiboName === "") awaitResponse = this.virtualJibo.ask(text);
          else awaitResponse = this.jiboAskFn(text);

          await Promise.all([virtualJ, awaitResponse]);
        }
      }),
      JiboListen: () => ({
        type: BlockType.Reporter,
        text: `answer`,
        operation: () =>
          this.jiboListenFn(),
      }),
      // JiboState: () => ({ // helpful for debugging
      //     type:BlockType.Command,
      //     text: `read state`,
      //     operation: () => self.JiboState()
      // }),
      JiboDance: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: this.dances,
        },
        text: (dname) => `play ${dname} dance`,
        operation: async (dance: DanceType) => {
          const akey = danceFiles[dance].file;
          await this.jiboDanceFn(akey, 5000);
        },
      }),
      JiboAudio: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: this.audios,
        },
        text: (audioname) => `play ${audioname} audio`,
        operation: async (audio: AudioType) => {
          const audiokey = audioFiles[audio].file;
          await this.jiboAudioFn(audiokey);
        },
      }),
      /* Jibo block still does not work
      // new volume block start
      JiboVolume: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "60",
        },
        text: (volume: string) => `set volume to ${volume}`,
        operation: (volume: string) =>
          this.jiboVolumeFn(volume),
      }),
      // new volume block end
      */
      JiboEmote: () => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: EmojiArgUI,
          initial: {
            value: Emotion.Happy,
            text: "Happy",
          },
        }),
        text: (aname) => `play ${aname} emotion`,
        operation: async (anim: EmotionType, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.anim(anim, "emotion", target);
          const akey = emotionFiles[anim].file;
          let physicalJ = this.jiboAnimFn(akey, 1000);
          await Promise.all([virtualJ, physicalJ]);
        },
      }),
      JiboIcon: () => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: IconArgUI,
          initial: {
            value: Icon.Taco,
            text: "taco",
          },
        }),
        text: (aname) => `show ${aname} icon`,
        operation: async (icon: IconType, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.anim(icon, "icon", target);
          const akey = iconFiles[icon].file;
          let physicalJ = this.jiboAnimFn(akey, 1000);
          await Promise.all([virtualJ, physicalJ]);
        }
      }),
      JiboLED: () => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: ColorArgUI,
          initial: {
            value: Color.Blue,
            text: "blue",
          },
        }),
        text: (cname) => `set LED ring to ${cname}`,
        operation: async (color: ColorType, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.setLED(color, target);
          let physicalJ = this.jiboLEDFn(color);
          await Promise.all([virtualJ, physicalJ]);
        }
      }),
      JiboLook: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: this.dirs,
        },
        text: (dname) => `look ${dname}`,
        operation: async (dir: DirType, { target }: BlockUtilityWithID) => {
          let virtualJ = this.virtualJibo.lookAt(dir, target);
          let physicalJ = this.jiboLookFn(dir);
          await Promise.all([virtualJ, physicalJ]);
        },
      }),
    };
  }

  /* The following 4 functions have to exist for the peripherial indicator */
  connect() {
    console.log(`Jibo this.connect ${jiboName}`);
    this.jiboTTSFn("Hey there. I am ready to program now");
  }
  disconnect() {
  }
  scan() { }
  isConnected() {
    console.log("isConnected status: " + jiboName);
    return !(jiboName === "");
  }

  RosConnect(args: { rosIP: any }) {
    const rosIP = args.rosIP.toString();
    this.rosbridgeIP = "wss://" + rosIP;
    // log.log("ROS: Attempting to connect to rosbridge at " + this.rosbridgeIP);

    if (!this.connected) {
      this.ros = new ROSLIB.Ros({
        url: this.rosbridgeIP,
      });

      // If connection is successful
      let connect_cb_factory = function (self: Scratch3Jibo) {
        return function () {
          self.connected = true;
          // send jibo welcome message
          let welcomeText = `Hello there. I am ready for you to program me.`;
          self.jiboTTSFn(welcomeText);
        };
      };
      let connect_cb = connect_cb_factory(this);
      this.ros.on("connection", function () {
        connect_cb();
        // log.info('ROS: Connected to websocket server.');
      });

      // If connection fails
      let error_cb_factory = function (self: Scratch3Jibo) {
        return function () {
          self.connected = false;
        };
      };
      let error_cb = error_cb_factory(this);
      this.ros.on("error", function (error: any) {
        error_cb();
        // log.error('ROS: Error connecting to websocket server: ', error);
      });

      // If connection ends
      let disconnect_cb_factory = function (self: Scratch3Jibo) {
        return function () {
          self.connected = false;
        };
      };
      let disconnect_cb = disconnect_cb_factory(this);
      this.ros.on("close", function () {
        disconnect_cb();
        // log.info('ROS: Connection to websocket server closed.');
      });
    }
    this.JiboState();
    this.JiboPublish({
      do_attention_mode: true,
      attention_mode: 1,
      do_anim_transition: true,
      anim_transition: 0,
      do_led: true,
      led_color: { x: 0, y: 0, z: 0 },
    });
    this.JiboASR_receive();
    return this.connected;
  }

  async jiboTTSFn(text: string) {
    console.log("saying");
    await this.waitToClear();
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_tts: true,
      tts_text: text,
      do_lookat: false,
      do_motion: false,
      do_sound_playback: false,
      volume: parseFloat(this.jbVolume),
    };

    // write to firebase
    // await queue.pushToFirebase(jibo_msg, queue.animFinished);

    await this.JiboPublish(jibo_msg);
    //await this.waitForFieldToComplete('tts_message');
    await this.waitToClear();
  }

  // TODO figure out why Jibo seems to ignore this value
  async jiboVolumeFn(volume: string) {
    // update Jibo's volume
    this.jbVolume = volume;
  }

  async jiboAskFn(text: string) {
    await this.waitToClear();
    // say question
    await this.jiboTTSFn(text);
    // making the ASR request
    await this.JiboASR_request();

    // wait for sensor to return
    this.asr_out = await this.JiboASR_receive();
  }
  async jiboListenFn() {
    if (jiboName === "") return this.virtualJibo.answer;
    return this.asr_out;
  }

  async jiboLEDFn(color: string) {
    let ledValue = colorDef[color].value;
    if (color === "random") {
      const randomColorIdx = Math.floor(
        // exclude random and off
        Math.random() * (Object.keys(colorDef).length - 2)
      );
      const randomColor = Object.keys(colorDef)[randomColorIdx];
      ledValue = colorDef[randomColor].value;
    }

    // must be "var" does not work with "let"
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_led: true,
      led_color: ledValue,
    };

    // write to firebase
    // var timer = () => new Promise<void>((resolve, reject) => {
    //   setTimeout(resolve, 500);
    // });
    // await queue.pushToFirebase(jibo_msg,
    //   () => queue.timedFinish(timer)
    // ); // set 500ms time limit on led command

    await this.JiboPublish(jibo_msg);
  }

  // there is no message when the look finishes. Just using a set time to finish block
  async jiboLookFn(dir: string) {
    await this.waitToClear();
    let coords = directionDef[dir].value;
    let jibo_msg = {
      do_lookat: true,
      lookat: {
        x: coords.x,
        y: coords.y,
        z: coords.z,
      },
    };

    // write to firebase
    var timer = () => new Promise<void>((resolve, reject) => {
      setTimeout(resolve, 1000); // wait a second for movement to complete
    });
    // await queue.pushToFirebase(jibo_msg, timer)

    await this.JiboPublish(jibo_msg);
    await this.waitForMotionToComplete();
  }

  async jiboAnimFn(animation_key: string, delay: number) {
    await this.waitToClear();
    console.log("the animation file is: " + animation_key); // debug statement
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_motion: true,
      do_sound_playback: false,
      do_tts: false,
      do_lookat: false,
      motion: animation_key,
    };

    // write to firebase
    // var timer = (delay) => new Promise<void>((resolve, reject) => {
    //   setTimeout(resolve, delay); // using timer because animFinished does not seem to be reliable
    // });
    // await queue.pushToFirebase(jibo_msg, timer.bind(delay)); // delay before next command

    await this.JiboPublish(jibo_msg);
    await this.waitForFieldToComplete('in_motion')
    console.log("ANIMATION DONE");
  }

  async jiboDanceFn(animation_key: string, delay: number) {
    await this.waitToClear();
    await this.jiboAnimFn(animation_key, delay);
    // transition back to neutral
    var timer = () => new Promise<void>((resolve, reject) => {
      setTimeout(resolve, 500);
    });

    await this.JiboPublish({ do_anim_transition: true, anim_transition: 0 });
    await this.waitForFieldToComplete('in_motion');
  }

  async jiboAudioFn(audio_file: string) {
    await this.waitToClear();
    console.log("the audio file is: " + audio_file); // debug statement
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_motion: false,
      do_sound_playback: true,
      do_tts: false,
      do_lookat: false,
      audio_filename: audio_file,
    };

    // write to firebase
    // await queue.pushToFirebase(jibo_msg, queue.animFinished);

    await this.JiboPublish(jibo_msg);
    await this.waitForFieldToComplete('audio');
  }

  waitToClear() {
    return new Promise<void>((resolve) => {
        console.log(this.state);
        const interval = setInterval(() => {
          if (this.state && this.state['is_listening'] === false 
            && this.state['in_motion'] == '' 
            && this.state['audio'] == '' 
            && this.state['tts_msg'] == ''
            && this.state['doing_motion'] == false) {
            clearInterval(interval);
            console.log("All fields clear");
            resolve();
          } else {
            console.log(this.state);
          }
        }, 100); // Check every 100ms
    });
  }

  waitForFieldToComplete(field: string) {
    return new Promise<void>((resolve) => {
        console.log(this.state);
        const interval = setInterval(() => {
          if (this.state && this.state[field] === '') {
            clearInterval(interval);
            console.log("Dance complete.");
            resolve();
          }
        }, 100); // Check every 100ms
    });
  }

  waitForMotionToComplete() {
    return new Promise<void>((resolve) => {
      console.log(this.state);
      const interval = setInterval(() => {
        if (this.state && this.state.doing_motion === false) {
          clearInterval(interval);
          console.log("Dance complete.");
          resolve();
        }
      }, 100); // Check every 100ms
    });
  }

  

  async JiboPublish(msg: any) {
    if (!this.connected) {
      console.log("ROS is not connected");
      return false;
    }
    var cmdVel = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo",
      messageType: "jibo_msgs/JiboAction",
    });
    // console.log(msg);
    var jibo_msg = new ROSLIB.Message(msg);
    cmdVel.publish(jibo_msg);
    await new Promise((r) => setTimeout(r, 500));
  }

  JiboState() {
    // Subscribing to a Topic
    // ----------------------

    console.log("listening...");

    var state_listener = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo_state",
      messageType: "jibo_msgs/JiboState",
    });

    state_listener.subscribe((message: any) => {
      //console.log("Received message on " + state_listener.name + ": ");
      // console.log(message);
      this.state = message;
      //state_listener.unsubscribe();
    });
  }
  async JiboASR_request() {
    if (!this.connected) {
      console.log("ROS is not connetced");
      return false;
    }
    var cmdVel = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo_asr_command",
      messageType: "jibo_msgs/JiboAsrCommand",
    });
    var jibo_msg = new ROSLIB.Message({ heyjibo: false, command: 1 });
    cmdVel.publish(jibo_msg);
    await new Promise((r) => setTimeout(r, 500));
    // var jibo_msg = {
    //   msg_type: "JiboAsrCommand",
    //   command: 1,
    //   heyjibo: false,
    //   detectend: false,
    //   continuous: false,
    //   incremental: false,
    //   alternatives: false,
    //   rule: "",
    // };

    // var timer = () => new Promise<void>((resolve, reject) => {
    //   setTimeout(resolve, 500);
    // });
    // await queue.pushToFirebase(jibo_msg, timer); // delay a bit before next command
    // // cmdVel.publish(jibo_msg);
  }

  async JiboASR_receive(): Promise<any> {
    return new Promise((resolve) => {
      var asr_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/jibo_asr_result",
        messageType: "jibo_msgs/JiboAsrResult",
      });

      asr_listener.subscribe(function (message: { transcription: unknown }) {
        console.log("Received message on " + asr_listener.name + ": ");
        console.log(message);
        asr_listener.unsubscribe();
        //this.asr_out = message.transcription;
        resolve(message.transcription);
        // return readAsrAnswer(message.transcription);
      });
    });

  }
}
