import { ArgumentType, BlockType, color } from "$common";
import { Environment, BlockDefinitions, MenuItem } from "$common";
import { Extension } from "$common";

import type BlockUtility from "$scratch-vm/engine/block-utility";
import Target from "$scratch-vm/engine/target";
import ROSLIB from "roslib";

import jiboBodyBlack from "./virtualJibo/jiboBody/black.png";
import jiboBodyRed from "./virtualJibo/jiboBody/red.png";
import jiboBodyYellow from "./virtualJibo/jiboBody/yellow.png";
import jiboBodyGreen from "./virtualJibo/jiboBody/green.png";
import jiboBodyCyan from "./virtualJibo/jiboBody/cyan.png";
import jiboBodyBlue from "./virtualJibo/jiboBody/blue.png";
import jiboBodyMagenta from "./virtualJibo/jiboBody/magenta.png";
import jiboBodyWhite from "./virtualJibo/jiboBody/white.png";

import jiboEyeAirplane from "./virtualJibo/jiboEye/Airplane.png";
import jiboEyeApple from "./virtualJibo/jiboEye/Apple.png";
import jiboEyeArt from "./virtualJibo/jiboEye/Art.png";
import jiboEyeBowling from "./virtualJibo/jiboEye/Bowling.png";
import jiboEyeCheckmark from "./virtualJibo/jiboEye/Checkmark.png";
import jiboEyeExclamation from "./virtualJibo/jiboEye/Exclamation.png";
import jiboEyeFootball from "./virtualJibo/jiboEye/Football.png";
import jiboEyeHeart from "./virtualJibo/jiboEye/Heart.png";
import jiboEyeMagic from "./virtualJibo/jiboEye/Magic.png";
import jiboEyeOcean from "./virtualJibo/jiboEye/Ocean.png";
import jiboEyePenguin from "./virtualJibo/jiboEye/Penguin.png";
import jiboEyeRainbow from "./virtualJibo/jiboEye/Rainbow.png";
import jiboEyeRobot from "./virtualJibo/jiboEye/Robot.png";
import jiboEyeRocket from "./virtualJibo/jiboEye/Rocket.png";
import jiboEyeSnowflake from "./virtualJibo/jiboEye/Snowflake.png";
import jiboEyeTaco from "./virtualJibo/jiboEye/Taco.png";
import jiboEyeVideoGame from "./virtualJibo/jiboEye/VideoGame.png";

const EXTENSION_ID = "jibo";
const JIBO_BODY = "jibo-body";
const JIBO_EYE = "jibo-eye";

type RGB = {
  x: number;
  y: number;
  z: number;
};

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
  imageData: string;
};

const colorDef: Record<ColorType, ColorDefType> = {
  [Color.Red]: {
    value: { x: 255, y: 0, z: 0 },
    imageData: jiboBodyRed,
  },
  [Color.Yellow]: {
    value: { x: 255, y: 69, z: 0 },
    imageData: jiboBodyYellow,
  },
  [Color.Green]: {
    value: { x: 0, y: 167, z: 0 },
    imageData: jiboBodyGreen,
  },
  [Color.Cyan]: {
    value: { x: 0, y: 167, z: 48 },
    imageData: jiboBodyCyan,
  },
  [Color.Blue]: {
    value: { x: 0, y: 0, z: 255 },
    imageData: jiboBodyBlue,
  },
  [Color.Magenta]: {
    value: { x: 255, y: 0, z: 163 },
    imageData: jiboBodyMagenta,
  },
  [Color.White]: {
    value: { x: 255, y: 255, z: 255 },
    imageData: jiboBodyWhite,
  },
  [Color.Random]: {
    value: { x: -1, y: -1, z: -1 },
    imageData: ""
  },
  [Color.Off]: {
    value: { x: 0, y: 0, z: 0 },
    imageData: jiboBodyBlack,
  },
};

type AnimFileType = {
  file: string;
  imageData: string;
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
    imageData: "",
  },
  [Dance.Carlton]: {
    file: "Dances/Carlton_01_01.keys",
    imageData: "",
  },
  [Dance.Celebrate]: {
    file: "Dances/Celebrate_01.keys",
    imageData: "",
  },
  [Dance.Clockworker]: {
    file: "Dances/Clockworker_01_01.keys",
    imageData: "",
  },
  [Dance.Doughkneader]: {
    file: "Dances/Doughkneader_01_01.keys",
    imageData: "",
  },
  [Dance.Footstomper]: {
    file: "Dances/Footstomper_01_01.keys",
    imageData: "",
  },
  [Dance.HappyDance]: {
    file: "Dances/Happy_Lucky_01_01.keys",
    imageData: "",
  },
  [Dance.Headbanger]: {
    file: "Dances/Headbanger_01_01.keys",
    imageData: "",
  },
  [Dance.Headdipper]: {
    file: "Dances/Headdipper_01_01.keys",
    imageData: "",
  },
  [Dance.Pigeon]: {
    file: "Dances/Pigeon_01_01.keys",
    imageData: "",
  },
  [Dance.SlowDance]: {
    file: "Dances/Prom_Night_01_01.keys",
    imageData: "",
  },
  [Dance.RobotDance]: {
    file: "Dances/Robotic_01_01.keys",
    imageData: "",
  },
  [Dance.RockingChair]: {
    file: "Dances/Rocking_Chair_01.keys",
    imageData: "",
  },
  [Dance.Roxbury]: {
    file: "Dances/Roxbury_01_01.keys",
    imageData: "",
  },
  [Dance.Samba]: {
    file: "Dances/Samba_01_01.keys",
    imageData: "",
  },
  [Dance.Seaweed]: {
    file: "Dances/Seaweed_01_01.keys",
    imageData: "",
  },
  [Dance.Slideshow]: {
    file: "Dances/SlideshowDance_01_01.keys",
    imageData: "",
  },
  [Dance.Waltz]: {
    file: "Dances/Waltz_01_01.keys",
    imageData: "",
  },
  [Dance.Disco]: {
    file: "Dances/dance_disco_00.keys",
    imageData: "",
  },
};

export const Emotion = {
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
    imageData: "",
  },
  [Emotion.Frustrated]: {
    file: "Misc/Frustrated_01_04.keys",
    imageData: "",
  },
  [Emotion.Laugh]: {
    file: "Misc/Laughter_01_03.keys",
    imageData: "",
  },
  [Emotion.Sad]: {
    file: "Misc/Sad_03.keys",
    imageData: "",
  },
  [Emotion.Thinking]: {
    file: "Misc/thinking_08.keys",
    imageData: "",
  },
  [Emotion.Happy]: {
    file: "Misc/Eye_to_Happy_02.keys",
    imageData: "",
  },
  [Emotion.SadEyes]: {
    file: "Misc/Eye_Sad_03_02.keys",
    imageData: "",
  },
  [Emotion.Interested]: {
    file: "Misc/interested_01.keys",
    imageData: "",
  },
  [Emotion.Curious]: {
    file: "Misc/Question_01_02.keys",
    imageData: "",
  },
  [Emotion.No]: {
    file: "Misc/no_4.keys",
    imageData: "",
  },
  [Emotion.Yes]: {
    file: "Misc/yep_02.keys",
    imageData: "",
  },
  [Emotion.Puzzled]: {
    file: "Misc/puzzled_01_02.keys",
    imageData: "",
  },
  [Emotion.Relieved]: {
    file: "Misc/relieved_01.keys",
    imageData: "",
  },
  [Emotion.Success]: {
    file: "Misc/success_02.keys",
    imageData: "",
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
    imageData: jiboEyeAirplane,
  },
  [Icon.Apple]: {
    file: "Emoji/Emoji_AppleRed_01_01.keys",
    imageData: jiboEyeApple,
  },
  [Icon.Art]: {
    file: "Emoji/Emoji_Art_01_01.keys",
    imageData: jiboEyeArt,
  },
  [Icon.Bowling]: {
    file: "Emoji/Emoji_Bowling.keys",
    imageData: jiboEyeBowling,
  },
  [Icon.Checkmark]: {
    file: "Emoji/Emoji_Checkmark_01_01.keys",
    imageData: jiboEyeCheckmark,
  },
  [Icon.ExclamationPoint]: {
    file: "Emoji/Emoji_ExclamationYellow.keys",
    imageData: jiboEyeExclamation,
  },
  [Icon.Football]: {
    file: "Emoji/Emoji_Football_01_01.keys",
    imageData: jiboEyeFootball,
  },
  [Icon.Heart]: {
    file: "Emoji/Emoji_HeartArrow_01_01.keys",
    imageData: jiboEyeHeart,
  },
  [Icon.Magic]: {
    file: "Emoji/Emoji_Magic_01_02.keys",
    imageData: jiboEyeMagic,
  },
  [Icon.Ocean]: {
    file: "Emoji/Emoji_Ocean_01_01.keys",
    imageData: jiboEyeOcean,
  },
  [Icon.Penguin]: {
    file: "Emoji/Emoji_Penguin_01_01.keys",
    imageData: jiboEyePenguin,
  },
  [Icon.Rainbow]: {
    file: "Emoji/Emoji_Rainbow_01_01.keys",
    imageData: jiboEyeRainbow,
  },
  [Icon.Robot]: {
    file: "Emoji/Emoji_Robot_01_01.keys",
    imageData: jiboEyeRobot,
  },
  [Icon.Rocket]: {
    file: "Emoji/Emoji_Rocket_01_01.keys",
    imageData: jiboEyeRocket,
  },
  [Icon.Snowflake]: {
    file: "Emoji/Emoji_Snowflake_01_01.keys",
    imageData: jiboEyeSnowflake,
  },
  [Icon.Taco]: {
    file: "Emoji/Emoji_Taco_01_01.keys",
    imageData: jiboEyeTaco,
  },
  [Icon.VideoGame]: {
    file: "Emoji/Emoji_VideoGame_01_01.keys",
    imageData: jiboEyeVideoGame,
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
  ros: ROSLIB.Ros;
  connected: boolean;
  failed: boolean;
  rosbridgeIP: string;
  jbVolume: string;
  asr_out: string;
  multitask: boolean;
  prevTasks: any;
  multitask_msg: any;
  busy: boolean;
  tts: any;
  animation_list: string[];
  getAnimationList: () => MenuItem<string>[];
  dances: MenuItem<string>[];

  init(env: Environment) {
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

    this.RosConnect("localhost");

    this.getAnimationList = () =>
      this.animation_list.map((anim) => ({
        text: anim,
        value: anim,
      }));

  }

  checkBusy() {
    // checking state
    var state_listener = new ROSLIB.Topic({
      ros: this.ros,
      name: "/jibo_state",
      messageType: "jibo_msgs/JiboState",
    });

    state_listener.subscribe((message: any) => {
      // console.log('Received message on ' + state_listener.name + ': ');
      this.busy = message.is_playing_sound;
      // console.log("in check, busy: " + this.busy)
      state_listener.unsubscribe();
    });
  }

  defineTranslations() {
    return undefined;
  }

  defineBlocks(): BlockDefinitions<Scratch3Jibo> {
    return {
      JiboTTS: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Hello, I am Jibo",
        },
        text: (text: string) => `say ${text}`,
        operation: async (text: string, { target }: BlockUtility) => {
          this.virtualJiboSayFn(text, target);
          await this.jiboTTSFn(text);
          // TODO if ROS not connected, speak the text as well as displaying it
          this.virtualJiboSayFn("", target);
        }
      }),
      JiboAsk: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: async (text: string, { target }: BlockUtility) => {
          this.virtualJiboSayFn(text, target);
          await this.jiboAskFn(text);
          // TODO if ROS not connected, ask the question on the stage
          this.virtualJiboSayFn("", target);
        }
      }),
      JiboListen: () => ({
        type: BlockType.Reporter,
        text: `answer`,
        operation: () => this.jiboListenFn(),
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
          await this.jiboAnimFn(akey);
        },
      }),
      JiboEmote: () => ({
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
          await this.jiboAnimFn(akey);
        },
      }),
      JiboIcon: () => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "IconArgument",
          initial: {
            value: Icon.Taco,
            text: "taco",
          },
        }),
        text: (aname) => `show ${aname} icon`,
        operation: async (icon: IconType, { target }: BlockUtility) => {
          this.virtualJiboAnimFn(icon, "icon", target);
          const akey = iconFiles[icon].file;
          await this.jiboAnimFn(akey);
        }
      }),
      JiboLED: () => ({
        type: BlockType.Command,
        arg: this.makeCustomArgument({
          component: "ColorArgument",
          initial: {
            value: Color.Blue,
            text: "blue",
          },
        }),
        text: (cname) => `set LED ring to ${cname}`,
        operation: (color: ColorType, { target }: BlockUtility) => {
          this.virtualJiboLEDFn(color, target);
          this.jiboLEDFn(color);
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
      JiboMultitask: () => ({
        type: BlockType.Command,
        text: `start multitask`,
        operation: () => {
          this.multitask = true;
          console.log("starting multitask");
        },
      }),
      JiboEnd: () => ({
        type: BlockType.Command,
        text: `end multitask`,
        operation: () => {
          // console.log(self.multitask_msg); // debug
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
  disconnect() { }
  scan() { }
  isConnected() {
    console.log("isConnected status: " + this.connected);
    return this.connected;
  }

  RosConnect(rosIP: string) {
    this.rosbridgeIP = "ws://" + rosIP + ":9090";

    if (!this.connected) {
      this.ros = new ROSLIB.Ros({
        url: this.rosbridgeIP,
      });

      // If connection is successful
      let connect_cb_factory = (self: Scratch3Jibo) => {
        return () => {
          self.connected = true;
          // send jibo welcome message
          let welcomeText = `Hello there. I am ready for you to program me.`;
          self.jiboTTSFn(welcomeText);
        };
      };
      let connect_cb = connect_cb_factory(this);
      this.ros.on("connection", () => {
        connect_cb();
        // log.info('ROS: Connected to websocket server.');
      });

      // If connection fails
      let error_cb_factory = (self: Scratch3Jibo) => {
        return () => {
          self.failed = true;
        };
      };
      let error_cb = error_cb_factory(this);
      this.ros.on("error", (error: string) => {
        error_cb();
      });

      // If connection ends
      let disconnect_cb_factory = (self: Scratch3Jibo) => {
        return () => {
          self.connected = false;
        };
      };
      let disconnect_cb = disconnect_cb_factory(this);
      this.ros.on("close", () => {
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

  /* update the appearance of virtual Jibo's LED*/
  virtualJiboSayFn(text: string, currentTarget: Target) {
    // find the jibo-body sprite to make speak
    let spriteTarget;
    if (currentTarget.getName().startsWith(JIBO_BODY)) {
      // first see if the current target is a Jibo body
      // if so, assume this is the one we want to edit
      spriteTarget = currentTarget;
    } else if (currentTarget.getName().startsWith(JIBO_EYE)) {
      // next see if this is a Jibo eye, and select the corresponding jibo body (same suffix)
      let jiboEyeName = currentTarget.getName();
      let suffix = jiboEyeName.substring(jiboEyeName.indexOf(JIBO_EYE) + JIBO_EYE.length);
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY + suffix));
      if (matches.length > 0) spriteTarget = matches[0];
    } else {
      // otherwise, pick the first Jibo body you see
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY));
      if (matches.length > 0) spriteTarget = matches[0];
    }

    if (spriteTarget) {
      // emit the say function
      this.runtime.emit('SAY', spriteTarget, 'say', text);
    } else {
      console.log("No Jibo body found");
    }
  }
  async jiboTTSFn(text: string) {
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

    while (this.busy) {
      console.log(this.busy);
      this.checkBusy();
    }

    var jibo_msg = {
      do_tts: true,
      tts_text: text,
      do_lookat: false,
      do_motion: false,
      volume: parseFloat(this.jbVolume),
    };

    await this.JiboPublish(jibo_msg);
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

  setSpriteCostume(target: Target, name: string, imageDataURI: string) {
    // try to set the costume of the target by name
    let foundCostume = this.setCostumeByName(target, name);

    if (!foundCostume) {
      console.log("Did not find the costume we wanted. Adding new one");
      // if not, add and set the costume
      this.addCostumeBitmap(target, imageDataURI, "add and set", name);
    }
  }
  /* update the appearance of virtual Jibo's LED*/
  virtualJiboLEDFn(color: string, currentTarget: Target) {
    // find the jibo-body sprite to edit
    let spriteTarget;
    if (currentTarget.getName().startsWith(JIBO_BODY)) {
      // first see if the current target is a Jibo body
      // if so, assume this is the one we want to edit
      spriteTarget = currentTarget;
    } else if (currentTarget.getName().startsWith(JIBO_EYE)) {
      // next see if this is a Jibo eye, and select the corresponding jibo body (same suffix)
      let jiboEyeName = currentTarget.getName();
      let suffix = jiboEyeName.substring(jiboEyeName.indexOf(JIBO_EYE) + JIBO_EYE.length);
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY + suffix));
      if (matches.length > 0) spriteTarget = matches[0];
    } else {
      // otherwise, pick the first Jibo body you see
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY));
      if (matches.length > 0) spriteTarget = matches[0];
    }

    if (spriteTarget) {
      // change the Sprite costume
      if (color == "random") {
        const randomColorIdx = Math.floor(
          // exclude random and off
          Math.random() * (Object.keys(colorDef).length - 2)
        );
        color = Object.keys(colorDef)[randomColorIdx];
      }

      let imageDataURI = colorDef[color].imageData;
      this.setSpriteCostume(spriteTarget, color, imageDataURI);
    } else {
      console.log("No Jibo body found");
    }
  }
  /* send command to Jibo to update its LED */
  jiboLEDFn(color: string) {
    let ledValue = colorDef[color].value;

    if (color == "random") {
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
    }

    var jibo_msg = {
      do_led: true,
      led_color: ledValue,
    };
    this.JiboPublish(jibo_msg);
  }

  // JiboVolume (args) {
  //     const Volume = Cast.toString(args.VOL);
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

  /* update the appearance of virtual Jibo's eye */
  virtualJiboAnimFn(animation: string, commandType: string, currentTarget: Target) {
    // find the jibo-body sprite to edit
    let spriteTarget;
    if (currentTarget.getName().startsWith(JIBO_EYE)) {
      // first see if the current target is a Jibo eye
      // if so, assume this is the one we want to edit
      spriteTarget = currentTarget;
    } else if (currentTarget.getName().startsWith(JIBO_BODY)) {
      // next see if this is a Jibo body, and select the corresponding jibo eye (same suffix)
      let jiboBodyName = currentTarget.getName();
      let suffix = jiboBodyName.substring(jiboBodyName.indexOf(JIBO_BODY) + JIBO_BODY.length);
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_EYE + suffix));
      if (matches.length > 0) spriteTarget = matches[0];
    } else {
      // otherwise, pick the first Jibo eye you see
      let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_EYE));
      if (matches.length > 0) spriteTarget = matches[0];
    }

    if (spriteTarget) {
      // change the Sprite costume 
      let imageDataURI;
      if (commandType == "dance") imageDataURI = danceFiles[animation].imageData;
      else if (commandType == "emotion") imageDataURI = emotionFiles[animation].imageData;
      else if (commandType == "icon") imageDataURI = iconFiles[animation].imageData;

      this.setSpriteCostume(spriteTarget, animation, imageDataURI);
    } else {
      console.log("No Jibo eye found");
    }
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
  }

  // async JiboAudio(args) {
  //     const audio_key = Cast.toString(args.VKEY);

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

    state_listener.subscribe((message: ROSLIB.Message) => {
      console.log("Received message on " + state_listener.name + ": ");
      console.log(message);
      state_listener.unsubscribe();
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
    return new Promise<string>((resolve) => {
      var asr_listener = new ROSLIB.Topic({
        ros: this.ros,
        name: "/jibo_asr_result",
        messageType: "jibo_msgs/JiboAsrResult",
      });

      asr_listener.subscribe((message: { transcription: string }) => {
        console.log("Received message on " + asr_listener.name + ": ");
        console.log(message);
        asr_listener.unsubscribe();
        resolve(message.transcription);
      });
    });
  }
}
