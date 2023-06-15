import Runtime from "../../../packages/scratch-vm/src/engine/runtime";
// import Cast from "../../../packages/scratch-vm/src/util/cast";
// import log from "../../../packages/scratch-vm/src/util/log";
import EventEmitter from "events";

import { ArgumentType, BlockType, color } from "$common";
import { Environment, BlockDefinitions, MenuItem } from "$common";
import { Extension } from "$common";

import ROSLIB from "roslib";

const EXTENSION_ID = "jibo";

type RGB = {
  x: number;
  y: number;
  z: number;
};

// TODO remove the const enums throughout this file, https://github.com/mitmedialab/prg-extension-boilerplate/blob/dev/extensions/src/common/types/enums.ts#L136
// https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
export const Color = {
  Red: `red`,
  Yellow: `yellow`,
  Green: `green`,
  Cyan: `cyan`,
  Blue: `blue`,
  Magenta: `magenta`,
  White: `white`,
  Random: `random`,
  Off: `off`,
} as const;
type ColorType = typeof Color[keyof typeof Color];
type ColorDefType = {
  value: RGB;
};

const colorDef: Record<ColorType, ColorDefType> = {
  [Color.Red]: {
    value: { x: 255, y: 0, z: 0 },
  },
  [Color.Yellow]: {
    value: { x: 255, y: 69, z: 0 },
  },
  [Color.Green]: {
    value: { x: 0, y: 167, z: 0 },
  },
  [Color.Cyan]: {
    value: { x: 0, y: 167, z: 48 },
  },
  [Color.Blue]: {
    value: { x: 0, y: 0, z: 255 },
  },
  [Color.Magenta]: {
    value: { x: 255, y: 0, z: 163 },
  },
  [Color.White]: {
    value: { x: 255, y: 255, z: 255 },
  },
  [Color.Random]: {
    value: { x: -1, y: -1, z: -1 },
  },
  [Color.Off]: {
    value: { x: 0, y: 0, z: 0 },
  },
};

type AnimFileType = {
  file: string;
};

const Dance = {
  BackStep: "Back Step",
  Carlton: "Carlton",
  Celebrate: "Celebration",
  Clockworker: "Clockworker",
  Doughkneader: "Doughkneader",
  Footstomper: "Footstomper",
  HappyDance: "Happy",
  Headbanger: "Headbanger",
  Headdipper: "Headdipper",
  Pigeon: "Pigeon",
  SlowDance: "Prom",
  RobotDance: "The Robot",
  RockingChair: "Rocking Chair",
  Roxbury: "Roxbury",
  Samba: "Samba",
  Seaweed: "Seaweed",
  Slideshow: "Slideshow",
  Waltz: "Waltz",
  Disco: "Disco",
} as const;
type DanceType = typeof Dance[keyof typeof Dance];

const danceFiles: Record<DanceType, AnimFileType> = {
  [Dance.BackStep]: {
    file: "Dances/Back_Stepper_01_01.keys",
  },
  [Dance.Carlton]: {
    file: "Dances/Carlton_01_01.keys",
  },
  [Dance.Celebrate]: {
    file: "Dances/Celebrate_01.keys",
  },
  [Dance.Clockworker]: {
    file: "Dances/Clockworker_01_01.keys",
  },
  [Dance.Doughkneader]: {
    file: "Dances/Doughkneader_01_01.keys",
  },
  [Dance.Footstomper]: {
    file: "Dances/Footstomper_01_01.keys",
  },
  [Dance.HappyDance]: {
    file: "Dances/Happy_Lucky_01_01.keys",
  },
  [Dance.Headbanger]: {
    file: "Dances/Headbanger_01_01.keys",
  },
  [Dance.Headdipper]: {
    file: "Dances/Headdipper_01_01.keys",
  },
  [Dance.Pigeon]: {
    file: "Dances/Pigeon_01_01.keys",
  },
  [Dance.SlowDance]: {
    file: "Dances/Prom_Night_01_01.keys",
  },
  [Dance.RobotDance]: {
    file: "Dances/Robotic_01_01.keys",
  },
  [Dance.RockingChair]: {
    file: "Dances/Rocking_Chair_01.keys",
  },
  [Dance.Roxbury]: {
    file: "Dances/Roxbury_01_01.keys",
  },
  [Dance.Samba]: {
    file: "Dances/Samba_01_01.keys",
  },
  [Dance.Seaweed]: {
    file: "Dances/Seaweed_01_01.keys",
  },
  [Dance.Slideshow]: {
    file: "Dances/SlideshowDance_01_01.keys",
  },
  [Dance.Waltz]: {
    file: "Dances/Waltz_01_01.keys",
  },
  [Dance.Disco]: {
    file: "Dances/dance_disco_00.keys",
  },
};

export const Emotion  = {
  Embarassed: `embarassed`,
  Frustrated: `frustrated`,
  Laugh: `laughing`,
  Sad: `sad`,
  Thinking: `thinking`,
  Happy: `happy`,
  SadEyes: `sad eyes`,
  Interested: `interested`,
  Curious: `curious`,
  No: `no`,
  Yes: `yes`,
  Puzzled: `puzzled`,
  Relieved: `relieved`,
  Success: `success`,
} as const;
export type EmotionType = typeof Emotion[keyof typeof Emotion];

const emotionFiles: Record<EmotionType, AnimFileType> = {
  [Emotion.Embarassed]: {
    file: "Misc/embarassed_01_02.keys",
  },
  [Emotion.Frustrated]: {
    file: "Misc/Frustrated_01_04.keys",
  },
  [Emotion.Laugh]: {
    file: "Misc/Laughter_01_03.keys",
  },
  [Emotion.Sad]: {
    file: "Misc/Sad_03.keys",
  },
  [Emotion.Thinking]: {
    file: "Misc/thinking_08.keys",
  },
  [Emotion.Happy]: {
    file: "Misc/Eye_to_Happy_02.keys",
  },
  [Emotion.SadEyes]: {
    file: "Misc/Eye_Sad_03_02.keys",
  },
  [Emotion.Interested]: {
    file: "Misc/interested_01.keys",
  },
  [Emotion.Curious]: {
    file: "Misc/Question_01_02.keys",
  },
  [Emotion.No]: {
    file: "Misc/no_4.keys",
  },
  [Emotion.Yes]: {
    file: "Misc/yep_02.keys",
  },
  [Emotion.Puzzled]: {
    file: "Misc/puzzled_01_02.keys",
  },
  [Emotion.Relieved]: {
    file: "Misc/relieved_01.keys",
  },
  [Emotion.Success]: {
    file: "Misc/success_02.keys",
  },
};

export const Icon = {
  Airplane: `airplane`,
  Apple: `apple`,
  Art: `art`,
  Bowling: `bowling`,
  Checkmark: `checkmark`,
  ExclamationPoint: `exclamation point`,
  Football: `football`,
  Heart: `heart`,
  Magic: `magic`,
  Ocean: `ocean`,
  Penguin: `penguin`,
  Rainbow: `rainbow`,
  Robot: `robot`,
  Rocket: `rocket`,
  Snowflake: `snowflake`,
  Taco: `taco`,
  VideoGame: `video game`,
} as const;
export type IconType = typeof Icon[keyof typeof Icon];

const iconFiles: Record<IconType, AnimFileType> = {
  [Icon.Airplane]: {
    file: "Emoji/Emoji_Airplane_01_01.keys",
  },
  [Icon.Apple]: {
    file: "Emoji/Emoji_AppleRed_01_01.keys",
  },
  [Icon.Art]: {
    file: "Emoji/Emoji_Art_01_01.keys",
  },
  [Icon.Bowling]: {
    file: "Emoji/Emoji_Bowling.keys",
  },
  [Icon.Checkmark]: {
    file: "Emoji/Emoji_Checkmark_01_01.keys",
  },
  [Icon.ExclamationPoint]: {
    file: "Emoji/Emoji_ExclamationYellow.keys",
  },
  [Icon.Football]: {
    file: "Emoji/Emoji_Football_01_01.keys",
  },
  [Icon.Heart]: {
    file: "Emoji/Emoji_HeartArrow_01_01.keys",
  },
  [Icon.Magic]: {
    file: "Emoji/Emoji_Magic_01_02.keys",
  },
  [Icon.Ocean]: {
    file: "Emoji/Emoji_Ocean_01_01.keys",
  },
  [Icon.Penguin]: {
    file: "Emoji/Emoji_Penguin_01_01.keys",
  },
  [Icon.Rainbow]: {
    file: "Emoji/Emoji_Rainbow_01_01.keys",
  },
  [Icon.Robot]: {
    file: "Emoji/Emoji_Robot_01_01.keys",
  },
  [Icon.Rocket]: {
    file: "Emoji/Emoji_Rocket_01_01.keys",
  },
  [Icon.Snowflake]: {
    file: "Emoji/Emoji_Snowflake_01_01.keys",
  },
  [Icon.Taco]: {
    file: "Emoji/Emoji_Taco_01_01.keys",
  },
  [Icon.VideoGame]: {
    file: "Emoji/Emoji_VideoGame_01_01.keys",
  },
};

type Details = {
  name: "Jibo";
  description: "Program your favorite social robot.";
  iconURL: "jibo_icon.png";
  insetIconURL: "jibo_inset_icon.png";
};

type Blocks = {
  JiboTTS: (text: string) => void;
  JiboAsk: (text: string) => void;
  JiboListen: () => any;
  JiboEmote: (emotion: string) => void;
  JiboIcon: (icon: string) => void;
  JiboDance: (dance: string) => void;
  JiboLED: (color: string) => void;
  JiboLook: (x_angle: string, y_angle: string, z_angle: string) => void;
  JiboMultitask: () => void;
  JiboEnd: () => void;
};

export default class Scratch3Jibo extends Extension<Details, Blocks> {
  // runtime: Runtime;
  ros: any; // TODO
  connected: boolean;
  failed: boolean;
  rosbridgeIP: string;
  jbVolume: string;
  asr_out: any;
  jiboEvent: EventEmitter;
te: string;
  text: string;
  animName: string;
  multitask: boolean;
  prevTasks: any;
  multitask_msg: any;
  busy: boolean;
  tts: any;
  animation_list: string[];
  getAnimationList: () => MenuItem<string>[];
  dances: MenuItem<string>[];

  init(env: Environment) {
    this.text = "Hello! I'm Jibo!";
    this.animName = "My Animation";
    this.multitask = false;
    this.prevTasks = [];
    this.multitask_msg = {};
    this.busy = false;
    this.dances = Object.entries(Dance).map(([dance, def]) => ({
      value: dance,
      text: Dance[dance],
    }));
    this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    this.runtime.connectPeripheral(EXTENSION_ID, 0);

    this.ros = null;
    this.connected = false;
    this.failed = false;
    this.rosbridgeIP = "ws://localhost:9090"; // rosbridgeIP option includes port
    this.jbVolume = "60";
    this.asr_out = "";
    this.jiboEvent = new EventEmitter();
    this.tts = [];

    this.RosConnect({ rosIP: "localhost" });

    this.getAnimationList = () =>
      this.animation_list.map((anim) => ({
        text: anim,
        value: anim,
      }));

    //   setInterval((() => {
    //     this.checkBusy(self);
    //     console.log("busy: " + this.busy);
    //     console.log(this.animation_list)
    //     console.log(this.getAnimationList())
    // }), 100);
  }

  checkBusy(self: Scratch3Jibo) {
    // checking state
    var state_listener = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo_state",
      messageType: "jibo_msgs/JiboState",
    });

    state_listener.subscribe(function (message: any) {
      // console.log('Received message on ' + state_listener.name + ': ');
      // console.log("check: " + message.is_playing_sound);
      // console.log(message)
      self.busy = message.is_playing_sound;
      // console.log("in check, busy: " + this.busy)
      state_listener.unsubscribe();
    });
  }

  defineTranslations() {
    return undefined;
  }

  defineBlocks(): BlockDefinitions<Scratch3Jibo> {
    return {
      JiboTTS: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Hello, I am Jibo",
        },
        text: (text: string) => `say ${text}`,
        operation: (text: string) => self.jiboTTSFn(text),
      }),
      JiboAsk: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: (text: string) => self.jiboAskFn(text),
      }),
      JiboListen: (self: Scratch3Jibo) => ({
        type: BlockType.Reporter,
        text: `answer`,
        operation: () => self.jiboListenFn(),
      }),
      // JiboState: () => ({ // helpful for debugging
      //     type:BlockType.Command,
      //     text: `read state`,
      //     operation: () => self.JiboState()
      // }),
      JiboDance: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: self.dances,
        },
        text: (dname) => `play ${dname} dance`,
        operation: async (dance: DanceType) => {
          const akey = danceFiles[dance].file;
          await self.jiboAnimFn(akey);
        },
      }),
      JiboEmote: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "EmojiArgument",
          initial: {
            value: Emotion.Happy,
            text: "happy",
          },
        }),
        text: (aname) => `play ${aname} emotion`,
        operation: async (anim: EmotionType) => {
          const akey = emotionFiles[anim].file;
          await self.jiboAnimFn(akey);
        },
      }),
      JiboIcon: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "IconArgument",
          initial: {
            value: Icon.Taco,
            text: "taco",
          },
        }),
        text: (aname) => `show ${aname} icon`,
        operation: async (icon: IconType) => {
          const akey = iconFiles[icon].file;
          await self.jiboAnimFn(akey);
        }
      }),
      JiboLED: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "ColorArgument",
          initial: {
            value: Color.Blue,
            text: "blue",
          },
        }),
        text: (cname) => `set LED ring to ${cname}`,
        operation: (color: ColorType) => {
          self.jiboLEDFn(color);
        },
      }),
      JiboLook: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        args: [
          {
            type: ArgumentType.String,
            defaultValue: "0",
          },
          {
            type: ArgumentType.String,
            defaultValue: "0",
          },
          {
            type: ArgumentType.String,
            defaultValue: "0",
          },
        ],
        text: (x_angle: string, y_angle: string, z_angle: string) =>
          `look at ${x_angle}, ${y_angle}, ${z_angle}`,
        operation: (x_angle: string, y_angle: string, z_angle: string) =>
          self.jiboLookFn(x_angle, y_angle, z_angle),
      }),
      JiboMultitask: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: `start multitask`,
        operation: () => {
          self.multitask = true;
          console.log("starting multitask");
        },
      }),
      JiboEnd: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: `end multitask`,
        operation: () => {
          // console.log(self.multitask_msg); // debug
          self.JiboPublish(self.multitask_msg);
          self.multitask = false;
          self.multitask_msg = {};
          self.prevTasks.length = 0;
          console.log("ending multitask");
        },
      }),
    };
  }

  /* The following 4 functions have to exist for the peripherial indicator */
  connect() {
    console.log("this.connect");
  }
  disconnect() { }
  scan() { }
  isConnected() {
    console.log("isConnected status: " + this.connected);
    return this.connected;
  }

  RosConnect(args: { rosIP: any }) {
    const rosIP = args.rosIP.toString();
    this.rosbridgeIP = "ws://" + rosIP + ":9090";
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
          self.failed = true;
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
    this.JiboASR_reseive();
    return this.connected;
  }

  // TODO remove the self variable here
  async jiboTTSFn(text: string) {
    // log.log(text);

    console.log("multitask: " + this.multitask);

    if (this.multitask) {
      console.log(this.prevTasks);
      if (this.prevTasks.includes("tts") || this.prevTasks.includes("emote")) {
        this.prevTasks.length = 0;
        console.log("performing");
        console.log(this.multitask_msg);

        while (this.busy) {
          console.log("hello");
        }
        this.busy = true;
        await this.JiboPublish(this.multitask_msg);
        this.busy = false;

        this.multitask_msg = {};
      }

      this.multitask_msg["do_tts"] = true;
      this.multitask_msg["tts_text"] = text;
      this.multitask_msg["volume"] = parseFloat(this.jbVolume);

      this.prevTasks.push("tts");
      console.log(this.multitask_msg);
      return;
    }

    // // checking state
    // var state_listener = new ROSLIB.Topic({
    //     ros : this.ros,
    //     name : '/jibo_state',
    //     messageType : 'jibo_msgs/JiboState'
    // });

    // // call a promise that doesn't resolve

    // state_listener.subscribe(function(message: any) {

    //     console.log('Received message on ' + state_listener.name + ': ');
    //     console.log("in tts: " + message.is_playing_sound);
    //     console.log(message)
    //     state_listener.unsubscribe();

    // });

    while (this.busy) {
      console.log(this.busy);
      this.checkBusy(this);
    }

    // console.log("before while: " + this.busy)
    // var i = 0;
    // while (this.busy && i <= 10000) {
    //     console.log("busy")
    //     i = i + 1;
    // }

    var jibo_msg = {
      do_tts: true,
      tts_text: text,
      do_lookat: false,
      do_motion: false,
      volume: parseFloat(this.jbVolume),
    };

    // this.tts.push(jibo_msg);
    // console.log(this.tts)

    // while (this.tts.length != 0 && !this.busy) {
    //     console.log(this.tts)
    //     this.busy = true;
    //     await this.JiboPublish(this.tts.shift())
    //     this.busy = false;
    // }

    // this.busy = true;
    // console.log("before publishing")
    await this.JiboPublish(jibo_msg);
    // console.log("after publishing")

    // var rep = true;
    // while (rep) {
    //     this.JiboPublish(jibo_msg).then(() => {
    //         rep = false;
    //         console.log(rep);
    //     }
    //     )
    // }
    return;
  }

  async jiboAskFn(text: string) {
    // say question
    await this.jiboTTSFn(text);

    // listen for answer
    this.JiboASR_request();

    // wait for sensor to return
    this.asr_out = await this.JiboASR_reseive();
  }
  async jiboListenFn() {
    return this.asr_out;
  }

  jiboLEDFn(color: string) {
    let ledName = colorDef[color].name;
    let ledValue = colorDef[color].value;

    if (ledName == "random") {
      const randomColorIdx = Math.floor(
        // exclude random and off
        Math.random() * (Object.keys(colorDef).length - 2)
      );
      const randomColor = Object.keys(colorDef)[randomColorIdx];
      ledValue = colorDef[randomColor].value;
    }

    if (this.multitask) {
      if (this.prevTasks.includes("led")) {
        this.prevTasks.length = 0;
        console.log("performing");
        console.log(this.multitask_msg);
        this.JiboPublish(this.multitask_msg);
        this.multitask_msg = {};
      }
      this.multitask_msg["do_led"] = true;
      this.multitask_msg["led_color"] = ledValue;
      this.prevTasks.push("led");
      return;
    }

    var jibo_msg = {
      do_led: true,
      led_color: ledValue,
    };
    this.JiboPublish(jibo_msg);
  }

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

  // TODO make this better - like look up down left right, etc.
  jiboLookFn(X: string, Y: string, Z: string) {
    if (this.multitask) {
      if (
        this.prevTasks.includes("look") ||
        this.prevTasks.includes("emote") ||
        this.prevTasks.includes("emoji")
      ) {
        console.log("performing");
        console.log(this.multitask_msg);
        this.JiboPublish(this.multitask_msg);
        this.prevTasks.length = 0;
        this.multitask_msg = {};
      }
      this.multitask_msg["do_lookat"] = true;
      this.multitask["lookat"] = {
        x: parseFloat(X),
        y: parseFloat(Y),
        z: parseFloat(Z),
      };
      this.prevTasks.push("look");
      return;
    }

    var jibo_msg = {
      do_lookat: true,
      lookat: {
        x: parseFloat(X),
        y: parseFloat(Y),
        z: parseFloat(Z),
      },
    };
    this.JiboPublish(jibo_msg);
  }

  async jiboAnimFn(animation_key: string) {
    // console.log(animation_key); // debug statement
    var jibo_msg = {
      do_motion: true,
      do_tts: false,
      do_lookat: false,
      motion: animation_key,
    };
    await this.JiboPublish(jibo_msg);

    await this.JiboPublish({ do_anim_transition: true, anim_transition: 0 });

    /* // wait for command to complete
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

  /*async JiboMultitask() {
    var jibo_msg = {
      do_led: true,
      led_color: { x: 0, y: 255, z: 255 },
      do_motion: true,
      motion: "Emoji/Emoji_HeartArrow_01_01.keys", // "Misc/Laughter_01_03.keys", //"Dances/dance_disco_00.keys",
      // "do_tts": true,
      // "tts_text": "Hello, I am Jibo.",
      do_lookat: true,
      lookat: {
        x: 100,
        y: 100,
        z: 100,
      },
    };
    await this.JiboPublish(jibo_msg);
    return "done";
  }*/

  async JiboPublish(msg: any) {
    if (!this.connected) {
      console.log("ROS is not connetced");
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

    state_listener.subscribe(function (message: any) {
      console.log("Received message on " + state_listener.name + ": ");
      console.log(message);
      state_listener.unsubscribe();

      //this.jiboEvent.emit('command.complete');
    });
  }
  JiboASR_request() {
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
  }

  async JiboASR_reseive() {
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
      });
    });
  }

  addAnimationToList(anim: string) {
    return this.animation_list.push(anim);
  }
}
