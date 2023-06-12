import Runtime from "../../../packages/scratch-vm/src/engine/runtime";
// import Cast from "../../../packages/scratch-vm/src/util/cast";
// import log from "../../../packages/scratch-vm/src/util/log";
import EventEmitter from "events";

import { ArgumentType, BlockType, color } from "$common";
import { Environment, BlockDefinitions, ButtonBlock, MenuItem } from "$common";
import { Extension } from "$common";

import ROSLIB from "roslib";

const EXTENSION_ID = "jibo";

type RGB = {
  x: number;
  y: number;
  z: number;
};
type ColorDef = {
  name: string;
  value: RGB;
};

const enum Color {
  Red,
  Yellow,
  Green,
  Cyan,
  Blue,
  Magenta,
  White,
  Random,
}

export const colorDefByColor: Record<Color, ColorDef> = {
  [Color.Red]: {
    name: "red",
    value: { x: 255, y: 0, z: 0 },
  },
  [Color.Yellow]: {
    name: "yellow",
    value: { x: 255, y: 69, z: 0 },
  },
  [Color.Green]: {
    name: "green",
    value: { x: 0, y: 167, z: 0 },
  },
  [Color.Cyan]: {
    name: "cyan",
    value: { x: 0, y: 167, z: 48 },
  },
  [Color.Blue]: {
    name: "blue",
    value: { x: 0, y: 0, z: 255 },
  },
  [Color.Magenta]: {
    name: "magenta",
    value: { x: 255, y: 0, z: 163 },
  },
  [Color.White]: {
    name: "white",
    value: { x: 255, y: 255, z: 255 },
  },
  [Color.Random]: {
    name: "random",
    value: { x: -1, y: -1, z: -1 },
  },
};

type DanceDef = {
  name: string;
  file: string;
};

const enum Dance {
  BackStep,
  Carlton,
  Celebrate,
  Clockworker,
  Doughkneader,
  Footstomper,
  HappyDance,
  Headbanger,
  Headdipper,
  Pigeon,
  SlowDance,
  RobotDance,
  RockingChair,
  Roxbury,
  Samba,
  Seaweed,
  Slideshow,
  Waltz,
  Disco,
}

const danceDefByDance: Record<Dance, DanceDef> = {
  [Dance.BackStep]: {
    name: "BackStep",
    file: "Dances/Back_Stepper_01_01.keys",
  },
  [Dance.Carlton]: {
    name: "Carlton",
    file: "Dances/Carlton_01_01.keys",
  },
  [Dance.Celebrate]: {
    name: "Celebrate",
    file: "Dances/Celebrate_01.keys",
  },
  [Dance.Clockworker]: {
    name: "Clockworker",
    file: "Dances/Clockworker_01_01.keys",
  },
  [Dance.Doughkneader]: {
    name: "Doughkneader",
    file: "Dances/Doughkneader_01_01.keys",
  },
  [Dance.Footstomper]: {
    name: "Footstomper",
    file: "Dances/Footstomper_01_01.keys",
  },
  [Dance.HappyDance]: {
    name: "Happy",
    file: "Dances/Happy_Lucky_01_01.keys",
  },
  [Dance.Headbanger]: {
    name: "Headbanger",
    file: "Dances/Headbanger_01_01.keys",
  },
  [Dance.Headdipper]: {
    name: "Headdipper",
    file: "Dances/Headdipper_01_01.keys",
  },
  [Dance.Pigeon]: {
    name: "Pigeon",
    file: "Dances/Pigeon_01_01.keys",
  },
  [Dance.SlowDance]: {
    name: "Slow",
    file: "Dances/Prom_Night_01_01.keys",
  },
  [Dance.RobotDance]: {
    name: "Robot",
    file: "Dances/Robotic_01_01.keys",
  },
  [Dance.RockingChair]: {
    name: "Rocking Chair",
    file: "Dances/Rocking_Chair_01.keys",
  },
  [Dance.Roxbury]: {
    name: "Roxbury",
    file: "Dances/Roxbury_01_01.keys",
  },
  [Dance.Samba]: {
    name: "Samba",
    file: "Dances/Samba_01_01.keys",
  },
  [Dance.Seaweed]: {
    name: "Seaweed",
    file: "Dances/Seaweed_01_01.keys",
  },
  [Dance.Slideshow]: {
    name: "Slideshow",
    file: "Dances/SlideshowDance_01_01.keys",
  },
  [Dance.Waltz]: {
    name: "Waltz",
    file: "Dances/Waltz_01_01.keys",
  },
  [Dance.Disco]: {
    name: "Disco",
    file: "Dances/dance_disco_00.keys",
  },
};

type EmojiDef = {
  name: string;
  file: string;
};

const enum Emoji {
  Embarassed,
  Frustrated,
  Laugh,
  Sad,
  Thinking,
  Happy,
  SadEyes,
  Interested,
  Curious,
  No,
  Yes,
  Puzzled,
  Relieved,
  Success,
}

export const emojiDefByEmoji: Record<Emoji, EmojiDef> = {
  [Emoji.Embarassed]: {
    name: "embarassed",
    file: "Misc/embarassed_01_02.keys",
  },
  [Emoji.Frustrated]: {
    name: "frustrated",
    file: "Misc/Frustrated_01_04.keys",
  },
  [Emoji.Laugh]: {
    name: "laugh",
    file: "Misc/Laughter_01_03.keys",
  },
  [Emoji.Sad]: {
    name: "sad",
    file: "Misc/Sad_03.keys",
  },
  [Emoji.Thinking]: {
    name: "thinking",
    file: "Misc/thinking_08.keys",
  },
  [Emoji.Happy]: {
    name: "happy",
    file: "Misc/Eye_to_Happy_02.keys",
  },
  [Emoji.SadEyes]: {
    name: "sad eyes",
    file: "Misc/Eye_Sad_03_02.keys",
  },
  [Emoji.Interested]: {
    name: "interested",
    file: "Misc/interested_01.keys",
  },
  [Emoji.Curious]: {
    name: "curious",
    file: "Misc/Question_01_02.keys",
  },
  [Emoji.No]: {
    name: "no",
    file: "Misc/no_4.keys",
  },
  [Emoji.Yes]: {
    name: "yes",
    file: "Misc/yep_02.keys",
  },
  [Emoji.Puzzled]: {
    name: "puzzled",
    file: "Misc/puzzled_01_02.keys",
  },
  [Emoji.Relieved]: {
    name: "relieved",
    file: "Misc/relieved_01.keys",
  },
  [Emoji.Success]: {
    name: "success",
    file: "Misc/success_02.keys",
  },
};

type IconDef = {
  name: string;
  icon: string;
  file: string;
};

const enum Icon {
  Airplane,
  Apple,
  Art,
  Bowling,
  Correct,
  Exclamation,
  Football,
  Heart,
  Magic,
  Ocean,
  Penguin,
  Rainbow,
  Robot,
  Rocket,
  Snowflake,
  Taco,
  VideoGame,
}

export const iconDefByIcon: Record<Icon, IconDef> = {
  [Icon.Airplane]: {
    name: "airplane",
    icon: "✈️",
    file: "Emoji/Emoji_Airplane_01_01.keys",
  },
  [Icon.Apple]: {
    name: "apple",
    icon: "🍎",
    file: "Emoji/Emoji_AppleRed_01_01.keys",
  },
  [Icon.Art]: {
    name: "art",
    icon: "🎨",
    file: "Emoji/Emoji_Art_01_01.keys",
  },
  [Icon.Bowling]: {
    name: "bowling",
    icon: "🎳",
    file: "Emoji/Emoji_Bowling.keys",
  },
  [Icon.Correct]: {
    name: "correct",
    icon: "✅",
    file: "Emoji/Emoji_Checkmark_01_01.keys",
  },
  [Icon.Exclamation]: {
    name: "exclamation",
    icon: "❕",
    file: "Emoji/Emoji_ExclamationYellow.keys",
  },
  [Icon.Football]: {
    name: "football",
    icon: "🏈",
    file: "Emoji/Emoji_Football_01_01.keys",
  },
  [Icon.Heart]: {
    name: "heart",
    icon: "❤️",
    file: "Emoji/Emoji_HeartArrow_01_01.keys",
  },
  [Icon.Magic]: {
    name: "magic",
    icon: "🪄",
    file: "Emoji/Emoji_Magic_01_02.keys",
  },
  [Icon.Ocean]: {
    name: "ocean",
    icon: "🌊",
    file: "Emoji/Emoji_Ocean_01_01.keys",
  },
  [Icon.Penguin]: {
    name: "penguin",
    icon: "🐧",
    file: "Emoji/Emoji_Penguin_01_01.keys",
  },
  [Icon.Rainbow]: {
    name: "rainbow",
    icon: "🌈",
    file: "Emoji/Emoji_Rainbow_01_01.keys",
  },
  [Icon.Robot]: {
    name: "robot",
    icon: "🤖",
    file: "Emoji/Emoji_Robot_01_01.keys",
  },
  [Icon.Rocket]: {
    name: "rocket",
    icon: "🚀",
    file: "Emoji/Emoji_Rocket_01_01.keys",
  },
  [Icon.Snowflake]: {
    name: "snowflake",
    icon: "❄️",
    file: "Emoji/Emoji_Snowflake_01_01.keys",
  },
  [Icon.Taco]: {
    name: "taco",
    icon: "🌮",
    file: "Emoji/Emoji_Taco_01_01.keys",
  },
  [Icon.VideoGame]: {
    name: "video game",
    icon: "🎮",
    file: "Emoji/Emoji_VideoGame_01_01.keys",
  },
};

type Details = {
  name: "Jibo";
  description: "jibo blocks";
  iconURL: "jibo_icon.png";
  insetIconURL: "jibo_inset_icon.png";
};

type Blocks = {
  JiboTTS: (text: string) => void;
  JiboAsk: (text: string) => void;
  JiboListen: () => any;
  // TODO come back and finish emoji, icon, and led
  //JiboEmoji: (akey: Emoji) => void;
  //JiboIcon: (akey: Icon) => void;
  JiboDance: (dkey: Dance) => void;
  JiboLED: (arg: Color) => void;
  JiboLook: (x_angle: string, y_angle: string, z_angle: string) => void;
  JiboMultitask: () => void;
  JiboEnd: () => void;
};

// type EmojiArgument = { name: string };
// type ColorArgument = { color: string }

export default class Scratch3Jibo extends Extension<Details, Blocks> {
  // runtime: Runtime;
  ros: any; // TODO
  connected: boolean;
  failed: boolean;
  rosbridgeIP: string;
  jbVolume: string;
  asr_out: any;
  jiboEvent: EventEmitter;
  emoji: string;
  text: string;
  animName: string;
  multitask: boolean;
  prevTasks: any;
  multitask_msg: any;
  busy: boolean;
  tts: any;
  animation_list: string[];
  getAnimationList: () => MenuItem<string>[];
  colors: MenuItem<Color>[];
  dances: MenuItem<Dance>[];
  emojis: MenuItem<Emoji>[];
  icons: MenuItem<Icon>[];

  init(env: Environment) {
    this.text = "Hello! I'm Jibo!";
    this.animName = "My Animation";
    this.multitask = false;
    this.prevTasks = [];
    this.multitask_msg = {};
    this.busy = false;

    this.colors = Object.entries(colorDefByColor).map(([color, def]) => ({
      value: parseInt(color),
      text: def.name,
    }));
    this.dances = Object.entries(danceDefByDance).map(([dance, def]) => ({
      value: parseInt(dance),
      text: def.name,
    }));
    this.emojis = Object.entries(emojiDefByEmoji).map(([emoji, def]) => ({
      value: parseInt(emoji),
      text: def.name,
    }));
    this.icons = Object.entries(iconDefByIcon).map(([icon, def]) => ({
      value: parseInt(icon),
      text: def.name,
    }));

    this.runtime = env.runtime;
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

    var self = this;

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
        operation: (text: string) => this.JiboTTS(this, text),
      }),
      JiboAsk: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: (text: string) => this.JiboAsk(text),
      }),
      JiboListen: (self: Scratch3Jibo) => ({
        type: BlockType.Reporter,
        text: `answer`,
        operation: () => this.JiboListen(),
      }),
      // JiboState: (self: Scratch3Jibo) => ({
      //     type:BlockType.Command,
      //     text: `read state`,
      //     operation: () => this.JiboState()
      // }),
      JiboDance: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.Number,
          options: self.dances,
        },
        text: (dname) => `set Jibo Dance to ${dname}`,
        operation: (dkey: Dance) => {
          this.JiboDance(dkey);
        },
      }),
      /*JiboEmoji: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: (arg) => `Set Jibo Emoji to ${arg}`,
        arg: this.makeCustomArgument({
          component: "EmojiArgument",
          initial: {
            value: "Celebrate",
            text: "Celebrate",
          },
        }),
        operation: (akey) => this.JiboEmoji(akey),
      }),
      JiboIcon: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: (arg) => `Set Jibo icon to ${arg}`,
        arg: this.makeCustomArgument({
          component: "IconArgument",
          initial: {
            value: "Taco",
            text: "Taco",
          },
        }),
        operation: (akey) => this.JiboIcon(akey),
      }),
      
       type: BlockType.Command,
        arg: self.makeCustomArgument({
          component: "AnimalArgument",
          initial: { value: Animal.Leopard, text: nameByAnimal[Animal.Leopard] }
        }),
        text: (animal) => `Add ${animal} to collection`,
        operation: (animal) => {
          this.addAnimalToCollection(animal);
          this.openUI("Alert");
        },
      */
      JiboLED: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "ColorArgument",
          initial: { value: Color.Red, text: colorDefByColor[Color.Red].name },
        }),
        text: (cname) => `set Jibo LED to ${cname}`,
        operation: (cval: Color) => {
          this.JiboLED(cval as Color);
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
          `set Jibo Look at ${x_angle}, ${y_angle}, ${z_angle}`,
        operation: (x_angle: string, y_angle: string, z_angle: string) =>
          this.JiboLook(x_angle, y_angle, z_angle),
      }),
      JiboMultitask: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: `start multitask`,
        operation: () => {
          this.multitask = true;
          console.log("starting multitask");
        },
      }),
      JiboEnd: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        text: `end multitask`,
        operation: () => {
          console.log(this.multitask_msg);
          this.JiboPublish(this.multitask_msg);
          this.multitask = false;
          this.multitask_msg = {};
          this.prevTasks.length = 0;
          console.log("ending multitask");
        },
      }),
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

  RosConnect(args: { rosIP: any }) {
    const rosIP = args.rosIP.toString();
    this.rosbridgeIP = "ws://" + rosIP + ":9090";
    // log.log("ROS: Attempting to connect to rosbridge at " + this.rosbridgeIP);

    if (!this.connected) {
      this.ros = new ROSLIB.Ros({
        url: this.rosbridgeIP,
      });

      // If connection is successful
      let connect_cb_factory = function (x: any) {
        return function () {
          x.connected = true;
          // send jibo welcome message
          x.JiboTTS({ TEXT: "Hello there. Welcome to A.I. Blocks." });
        };
      };
      let connect_cb = connect_cb_factory(this);
      this.ros.on("connection", function () {
        connect_cb();
        // log.info('ROS: Connected to websocket server.');
      });

      // If connection fails
      let error_cb_factory = function (x: any) {
        return function () {
          x.failed = true;
        };
      };
      let error_cb = error_cb_factory(this);
      this.ros.on("error", function (error: any) {
        error_cb();
        // log.error('ROS: Error connecting to websocket server: ', error);
      });

      // If connection ends
      let disconnect_cb_factory = function (x: any) {
        return function () {
          x.connected = false;
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

  async JiboTTS(self: Scratch3Jibo, text: string) {
    // log.log(text);

    console.log("multitask: " + self.multitask);

    if (self.multitask) {
      console.log(this.prevTasks);
      if (self.prevTasks.includes("tts") || self.prevTasks.includes("emote")) {
        self.prevTasks.length = 0;
        console.log("performing");
        console.log(this.multitask_msg);

        while (self.busy) {
          console.log("hello");
        }
        self.busy = true;
        await self.JiboPublish(self.multitask_msg);
        self.busy = false;

        self.multitask_msg = {};
      }

      self.multitask_msg["do_tts"] = true;
      self.multitask_msg["tts_text"] = text;
      self.multitask_msg["volume"] = parseFloat(self.jbVolume);

      self.prevTasks.push("tts");
      console.log(self.multitask_msg);
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

    while (self.busy) {
      console.log(self.busy);
      this.checkBusy(self);
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
    await self.JiboPublish(jibo_msg);
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

  async JiboAsk(text: string) {
    // say question
    await this.JiboTTS(this, text);

    // listen for answer
    this.JiboASR_request();

    // wait for sensor to return
    this.asr_out = await this.JiboASR_reseive();
  }
  async JiboListen() {
    return this.asr_out;
  }

  JiboLED(color: Color) {
    let ledName = colorDefByColor[color].name;
    let ledValue = colorDefByColor[color].value;

    if (ledName == "random") {
      const randomColorIdx = Math.floor(
        Math.random() * (Object.keys(colorDefByColor).length - 1)
      );
      const randomColor = Object.keys(colorDefByColor)[randomColorIdx];
      ledValue = colorDefByColor[randomColor].value;
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

  async JiboLEDOff() {
    var jibo_msg = {
      do_led: true,
      led_color: { x: 0, y: 0, z: 0 },
    };
    await this.JiboPublish(jibo_msg);
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

  JiboLook(X: string, Y: string, Z: string) {
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

  async JiboEmoji(akey: string) {
    console.log(akey);
    const animation_key = this.emojis[akey];
    await this.JiboAnim(animation_key);
  }

  async JiboIcon(akey: string) {
    const animation_key = this.icons[akey];
    await this.JiboAnim(animation_key);
  }

  async JiboDance(dkey: Dance) {
    const dance_file = danceDefByDance[dkey].file;
    await this.JiboAnim(dance_file);
  }

  async JiboAnim(animation_key: string) {
    // log.log(animation_key);

    var jibo_msg = {
      do_motion: true,
      do_tts: false,
      do_lookat: false,
      motion: animation_key,
    };
    await this.JiboPublish(jibo_msg);

    await this.JiboPublish({ do_anim_transition: true, anim_transition: 0 });

    /* // wait for command to compelte
        return new Promise((resolve) => {
            this.jiboEvent.once("command.complete", async () => {
                resolve();
            });
        });*/
  }

  async customAnim() {
    const animation_key = this.emojis[this.animName];
    var jibo_msg = {
      do_motion: true,
      do_tts: true,
      tts_text: this.text,
      motion: animation_key,
    };

    await this.JiboPublish(jibo_msg);

    await this.JiboPublish({ do_anim_transition: true, anim_transition: 0 });
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

  async JiboMultitask() {
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
  }

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

  hexToRgb(hex: any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          x: parseInt(result[1], 16),
          y: parseInt(result[2], 16),
          z: parseInt(result[3], 16),
        }
      : null;
  }

  addAnimationToList(anim: string) {
    return this.animation_list.push(anim);
  }
}
