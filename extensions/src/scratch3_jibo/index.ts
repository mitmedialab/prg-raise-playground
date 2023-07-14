import Runtime from "../../../packages/scratch-vm/src/engine/runtime";
// import Cast from "../../../packages/scratch-vm/src/util/cast";
// import log from "../../../packages/scratch-vm/src/util/log";
import EventEmitter from "events";

import database from './firebase';

import { ArgumentType, BlockType, color } from "$common";
import { block, buttonBlock, extension } from "$common";
import { Environment, BlockDefinitions, MenuItem } from "$common";
import { Extension } from "$common";

import ROSLIB from "roslib";
////////////////////////// Randi's changes - IMPORTS
import type BlockUtility from "$scratch-vm/engine/block-utility";
import Target from "$scratch-vm/engine/target";
import SensingBlocks from "$scratch-vm/blocks/scratch3_sensing.js";
import Text2Speech from "$scratch-vm/extensions/scratch3_text2speech/index.js";

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
////////////////////////// Randi's changes - IMPORTS END


////////////////////////// Randi's changes - CONSTANTS
const EXTENSION_ID = "jibo";
const JIBO_BODY = "jibo-body";
const JIBO_EYE = "jibo-eye";

const DEFAULT_JIBO_BODY = {
  x: 4,
  y: -9,
  size: 100,
  direction: 90,
}

// TODO make Jibo eye relative to body
const DEFAULT_JIBO_EYE = {
  x: 1,
  y: 75,
  size: 35,
  direction: 90,
}
////////////////////////// Randi's changes - CONSTANTS END

// jibo's name
// opal-sage-victor-valley
var jiboName: string = "";


type RGB = {
  x: number;
  y: number;
  z: number;
};

// TODO remove the const enums throughout this file, https://github.com/mitmedialab/prg-extension-boilerplate/blob/dev/extensions/src/common/types/enums.ts#L136
// https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
export const Color = {
  Red: "Red",
  Yellow: "Yellow",
  Green: "Green",
  Cyan: "Cyan",
  Blue: "Blue",
  Magenta: "Magenta",
  White: "White",
  Random: "Random",
  Off: "Off",
} as const;
type ColorType = typeof Color[keyof typeof Color];
type ColorDefType = {
  value: RGB;
  imageData: string; // Randi's
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

////////////////////////// Randi's changes
type Coords = {
  x: number;
  y: number;
  z: number;
};
export const Direction = {
  up: `up`,
  down: `down`,
  right: `right`,
  left: `left`,
  forward: `forward`,
  backward: `backward`,
} as const;
type DirType = typeof Direction[keyof typeof Direction];
type DirDefType = {
  value: Coords;
};
const directionDef: Record<DirType, DirDefType> = {
  [Direction.up]: {
    value: { x: 500, y: 100, z: 500 },
  },
  [Direction.down]: {
    value: { x: 500, y: 100, z: -500 },
  },
  [Direction.left]: {
    value: { x: 100, y: 500, z: 100 },
  },
  [Direction.right]: {
    value: { x: 100, y: -500, z: 100 },
  },
  [Direction.forward]: {
    value: { x: 500, y: 100, z: 100 },
  },
  [Direction.backward]: {
    value: { x: -500, y: 100, z: 100 },
  },
};
////////////////////////// Randi's changes 

type AnimFileType = {
  file: string;
  imageData: string; // Randi's
};

const Dance = {
  BackStep: "BackStep",
  Carlton: "Carlton",
  Celebrate: "Celebrate",
  Clockworker: "Clockworker",
  Doughkneader: "Doughkneader",
  Footstomper: "Footstomper",
  HappyDance: "HappyDance",
  Headbanger: "Headbanger",
  Headdipper: "Headdipper",
  Pigeon: "Pigeon",
  SlowDance: "SlowDance",
  RobotDance: "RobotDance",
  RockingChair: "RockingChair",
  Roxbury: "Roxbury",
  Samba: "Samba",
  Seaweed: "Seaweed",
  Slideshow: "Slideshow",
  Waltz: "Waltz",
  Disco: "Disco",
} as const;
type DanceType = typeof Dance[keyof typeof Dance];

// tasneem new audio files start
const Audio = {
  Bawhoop: "Bawhoop",
  Bleep: "Bleep",
  Blip: "Blip",
  Bloop: "Bloop",
  BootUp: "BootUp",
  Disgusted_01: "Disgusted_01",
  Disgusted_02: "Disgusted_02",
  Disgusted_03: "Disgusted_03",
  DoYouWantToPlay: "DoYouWantToPlay",
  FillingUp: "FillingUp",
  GoodJob: "GoodJob",
  Holyhappiness: "Holyhappiness",
  ImBroken: "ImBroken",
  PeekABoo: "PeekABoo",
  Whistle: "Whistle",
  CheckmarkButton: "CheckmarkButton",
  TurnTakingOff: "TurnTakingOff",
  TurnTakingOn: "TurnTakingOn",
  Aww: "Aww",
  Confirm: "Confirm",
  Disappointed: "Disappointed",
  Hello: "Hello",
  Belly_Dance_00: "Belly_Dance_00",
} as const;
type AudioType = typeof Audio[keyof typeof Audio];

const audioFiles: Record<AudioType, AnimFileType> = {
  [Audio.Bawhoop]: {
    file: "FX_Bawhoop.mp3",
    imageData: "",
  },
  [Audio.Bleep]: {
    file: "FX_Bleep.mp3",
    imageData: "",
  },
  [Audio.Blip]: {
    file: "FX_Blip.mp3",
    imageData: "",
  },
  [Audio.Bloop]: {
    file: "FX_Bloop.mp3",
    imageData: "",
  },
  [Audio.BootUp]: {
    file: "FX_BootUp.mp3",
    imageData: "",
  },
  [Audio.Disgusted_01]: {
    file: "FX_Disgusted_01.mp3",
    imageData: "",
  },
  [Audio.Disgusted_02]: {
    file: "FX_Disgusted_02.mp3",
    imageData: "",
  },
  [Audio.Disgusted_03]: {
    file: "FX_Disgusted_03.mp3",
    imageData: "",
  },
  [Audio.DoYouWantToPlay]: {
    file: "FX_DoYouWantToPlay_01.mp3",
    imageData: "",
  },
  [Audio.FillingUp]: {
    file: "FX_FillingUp_01.mp3",
    imageData: "",
  },
  [Audio.GoodJob]: {
    file: "FX_GoodJob_01.mp3",
    imageData: "",
  },
  [Audio.Holyhappiness]: {
    file: "FX_Holyhappiness.mp3",
    imageData: "",
  },
  [Audio.ImBroken]: {
    file: "FX_ImBroken_01.mp3",
    imageData: "",
  },
  [Audio.PeekABoo]: {
    file: "FX_PeekABoo_01.mp3",
    imageData: "",
  },
  [Audio.Whistle]: {
    file: "FX_Whistle.mp3",
    imageData: "",
  },
  [Audio.CheckmarkButton]: {
    file: "SFX_Global_CheckmarkButton.m4a",
    imageData: "",
  },
  [Audio.TurnTakingOff]: {
    file: "SFX_Global_TurnTakingOff.m4a",
    imageData: "",
  },
  [Audio.TurnTakingOn]: {
    file: "SFX_Global_TurnTakingOn.m4a",
    imageData: "",
  },
  [Audio.Aww]: {
    file: "SSA_aww.m4a",
    imageData: "",
  },
  [Audio.Confirm]: {
    file: "SSA_confirm.m4a",
    imageData: "",
  },
  [Audio.Disappointed]: {
    file: "SSA_disappointed.m4a",
    imageData: "",
  },
  [Audio.Hello]: {
    file: "SSA_hello.wav",
    imageData: "",
  },
  [Audio.Belly_Dance_00]: {
    file: "music/music_belly_dance_00.m4a",
    imageData: "",
  }

}
// tasneem new audio files end

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
  Embarassed: `Embarassed`,
  Frustrated: `Frustrated`,
  Laugh: `Laugh`,
  Sad: `Sad`,
  Thinking: `Thinking`,
  Happy: `Happy`,
  SadEyes: `SadEyes`,
  Interested: `Interested`,
  Curious: `Curious`,
  No: `No`,
  Yes: `Yes`,
  Puzzled: `Puzzled`,
  Relieved: `Relieved`,
  Success: `Success`,
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
  Airplane: `Airplane`,
  Apple: `Apple`,
  Art: `Art`,
  Bowling: `Bowling`,
  Checkmark: `Checkmark`,
  ExclamationPoint: `ExclamationPoint`,
  Football: `Football`,
  Heart: `Heart`,
  Magic: `Magic`,
  Ocean: `Ocean`,
  Penguin: `Penguin`,
  Rainbow: `Rainbow`,
  Robot: `Robot`,
  Rocket: `Rocket`,
  Snowflake: `Snowflake`,
  Taco: `Taco`,
  VideoGame: `VideoGame`,
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
  JiboButton: () => void; // new jibo's name modal
  JiboTTS: (text: string) => void;
  JiboAsk: (text: string) => void;
  JiboListen: () => any;
  JiboEmote: (emotion: string) => void;
  JiboIcon: (icon: string) => void;
  JiboDance: (dance: string) => void;
  JiboAudio: (audio: string) => void; // new audio block
  JiboVolume: (text: string) => void; // new volume block
  JiboLED: (color: string) => void;
  JiboLook: (x_angle: string, y_angle: string, z_angle: string) => void;
  JiboMultitask: () => void;
  JiboEnd: () => void;
};

/* JiboAction/JiboAsrCommand/JiboAsrResult/defaultFlag 
just to know the structure - not used */
var JiboAction = {
  anim_transition: 0,
  attention_mode: 1,
  audio_filename: "",
  do_anim_transition: false,
  do_attention_mode: false,
  do_led: false,
  do_lookat: false,
  do_motion: false,
  do_sound_playback: false,
  do_tts: false,
  do_volume: false,
  led_color: [0, 100, 0], //red, green, blue
  lookat: [0, 0, 0], //x, y, z
  motion: "",
  tts_duration_stretch: 0,
  tts_pitch: 0,
  tts_text: "",
  volume: 0,
};
var JiboAsrCommand = {
  command: 0,
  heyjibo: false,
  detectend: false,
  continuous: false,
  incremental: false,
  alternatives: false,
  rule: "",
  // stop: 0,
  // start: 1
};
var JiboAsrResult = {
  transcription: "",
  confidence: 0,
  heuristic_score: 0,
  slotAction: "",
};

var defaultFlag = {
  msg_type: "default",
};

var jibo_event = {
  tts_text: "Hello there. I am ready for you to program me.",
  msg_type: "",
  do_tts: true,
  do_lookat: false,
  do_motion: false,
  volume: 60,
  // readyForNext: true,
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

// tasneem new - queue data structure
class FirebaseQueue {
  private queue: any[] = [];
  private isProcessing: boolean = false;

  addToQueue(data: any) {
    this.queue.push(data);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const data = this.queue[0]; // first element in the queue
      try {
        await this.pushToFirebase(data); // Push to db
        this.queue.shift(); // Remove from the queue
      } catch (error) {
        console.error('Error pushing data to Firebase:', error);
        break;
      }
    }
    this.isProcessing = false;
  }

  //////////////////////////////// KEEP -- pushToFirebase() (or setJiboMsg()) function WITHOUT FLAG 
  /* 
    async pushToFirebase(data: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (jiboName != "") {
          database.ref("Jibo-Name/" + jiboName)
            .push({ ...data })
            .then(function () {
              console.log("New record for '" + jiboName + "' created successfully as: " + data.msg_type);
            })
            .catch(function (error) {
              console.error(
                "Error creating new record for '" + jiboName + "' as: " + + data.msg_type,
                error
              );
            });
          resolve(data);
          // console.log("Jibo is ready for a new message to be pushed.");
        }
        else {
          console.log("No Jibo Name added.");
        }
      });
    });
  }
  */
  ////////////////////////////////


  //////////////////////////////// KEEP -- pushToFirebase() (or setJiboMsg()) function WITH FLAG
  async pushToFirebase(data: any) {
    return new Promise((resolve, reject) => {
      if (jiboName != "") {
        const pathRef = database.ref("Jibo-Name/" + jiboName);
        var eventKey: any;
        var eventData: any;
        pathRef
          .once("value")
          .then((snapshot) => {
            console.log("Reading the last thing before inserting the new one");
            snapshot.forEach((childSnapshot) => {
              eventKey = childSnapshot.key;
              eventData = childSnapshot.val();
            });
            console.log(eventData);
            if (eventData.msg_type === "default" || eventData.msg_type === "") {
              console.log("Jibo is ready for a new message to be pushed.");
              database.ref("Jibo-Name/" + jiboName)
                .push({ ...data })
                .then(function () {
                  console.log("New record for '" + jiboName + "' created successfully as: " + data.msg_type);
                  resolve(data);
                })
                .catch(function (error) {
                  console.error(
                    "Error creating new record for '" + jiboName + "' as: " + + data.msg_type,
                    error
                  );
                  reject("Something went wrong in pushing to db")
                });
            }
            else {
              console.log("The last record was of type: ");
              console.log(eventData.msg_type);
              console.log("Pushing new one immediately");
              database.ref("Jibo-Name/" + jiboName)
                .push({ ...data })
                .then(function () {
                  console.log("New record for '" + jiboName + "' created successfully as: " + data.msg_type);
                  resolve(data);
                })
                .catch(function (error) {
                  console.error(
                    "Error creating new record for '" + jiboName + "' as: " + + data.msg_type,
                    error
                  );
                  reject("Something went wrong in pushing to db")
                });
            }
          });
      }
      else {
        console.log("No Jibo Name added.");
      }
    });
  }
  ////////////////////////////////
}
// firebase push 
// const pathRef = database.ref("Jibo-Name/" + jiboName);
// var eventKey: any;
// var eventData: any;
// pathRef
//   .once("value")
//   .then((snapshot) => {
//     console.log("Reading the last thing before inserting the new one");
//     snapshot.forEach((childSnapshot) => {
//       eventKey = childSnapshot.key;
//       eventData = childSnapshot.val();
//     });
//     console.log(eventData);
//     if (eventData.msg_type === "JiboAction" || eventData.msg_type === "") {
//       console.log("ready for next from the last read record is: " + eventData.readyForNext);
//       if (eventData.readyForNext) {
// write the message to the database only if jibo is ready
// if (jiboName != "") {
//   database.ref("Jibo-Name/" + jiboName)
//     .push({ ...data })
//     .then(function () {
//       console.log("New record for '" + jiboName + "' created successfully as: " + data.msg_type);
//     })
//     .catch(function (error) {
//       console.error(
//         "Error creating new record for '" + jiboName + "' as: " + + data.msg_type,
//         error
//       );
//     });
//   resolve(data);
//   // console.log("Jibo is ready for a new message to be pushed.");
// }
// else {
//   console.log("No Jibo Name added.");
// }
//       });
//     });
//   }
// }
//   }
//   else {
//     console.log("Jibo is NOT ready for a new message to be pushed.");

//   }
// }
// else {
//   if (jiboName != "") {
//     database.ref("Jibo-Name/" + jiboName)
//       .push({ ...data })
//       .then(function () {
//         console.log("New record for '" + jiboName + "' created successfully as: " + data.msg_type);
//       })
//       .catch(function (error) {
//         console.error(
//           "Error creating new record for '" + jiboName + "' as: " + + data.msg_type,
//           error
//         );
//       });
//     resolve(data);
//     console.log("Jibo is ready for a new message to be pushed.");
//   }
//   else {
//     console.log("No Jibo Name added.");
//   }
// }
//       }).catch((error) => {
//           reject(error);
//           console.error("Error retrieving data: ", error);
//         });
//       // end of pushing block
//       console.log('Pushing data to Firebase:', data);
//       resolve(data);
//     }, 1000);
//   });
//       });
//     });
//   }
// }
const queue = new FirebaseQueue();
// tasneem new - end of queue stuff

export function setJiboName(name: string): void {
  var jiboNameRef = database.ref("Jibo-Name");
  jiboNameRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.hasChild(name)) {
        console.log("'" + name + "' exists.");
        jiboName = name;
      } else {
        database.ref("Jibo-Name/" + name).push(jibo_event);
        jiboName = name;
        console.log(
          "'" + name + "' did not exist, and has now been created."
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
///////////////////////////////// KEEP THIS FUNCTION! /////////////////////////////////
// function setJiboMsg(jibo_msg: any) {
//   return new Promise((resolve, reject) => {
//     // read the last inserted record to know if jibo is ready for the next message
//     const pathRef = database.ref("Jibo-Name/" + jiboName);
//     var eventKey: any;
//     var eventData: any;
//     pathRef
//       .once("value")
//       .then((snapshot) => {
//         // Loop through the child snapshots of JiboAsrResult
//         console.log("Reading the last thing before inserting the new one");
//         snapshot.forEach((childSnapshot) => {
//           eventKey = childSnapshot.key;
//           eventData = childSnapshot.val();
//         });
//         console.log(eventData);
//         if (eventData.msg_type === "JiboAction" || eventData.msg_type === "") {
//           console.log("ready for next from the last read record is: " + eventData.readyForNext);
//           if (eventData.readyForNext) {
//             // jiboReady = true;
//             // write the message to the database only if jibo is ready
//             if (jiboName != "") {
//               database.ref("Jibo-Name/" + jiboName)
//                 .push({ ...jibo_msg })
//                 .then(function () {
//                   console.log("New record for '" + jiboName + "' created successfully as: " + jibo_msg.msg_type);
//                 })
//                 .catch(function (error) {
//                   console.error(
//                     "Error creating new record for '" + jiboName + "' as: " + + jibo_msg.msg_type,
//                     error
//                   );
//                 });
//               // Simulating asynchronous behavior with a delay of 1 second
//               setTimeout(() => {
//                 resolve(jibo_msg); // Resolve the promise after the delay
//               }, 1000);
//               console.log("Jibo is ready for a new message to be pushed.");
//             }
//             else {
//               console.log("No Jibo Name added.");
//             }
//           }
//           else {
//             console.log("Jibo is NOT ready for a new message to be pushed.");

//           }
//         }
//         else {
//           if (jiboName != "") {
//             database.ref("Jibo-Name/" + jiboName)
//               .push({ ...jibo_msg })
//               .then(function () {
//                 console.log("New record for '" + jiboName + "' created successfully as: " + jibo_msg.msg_type);
//               })
//               .catch(function (error) {
//                 console.error(
//                   "Error creating new record for '" + jiboName + "' as: " + + jibo_msg.msg_type,
//                   error
//                 );
//               });
//             // Simulating asynchronous behavior with a delay of 1 second
//             setTimeout(() => {
//               resolve(jibo_msg); // Resolve the promise after the delay
//             }, 1000);
//             console.log("Jibo is ready for a new message to be pushed.");
//           }
//           else {
//             console.log("No Jibo Name added.");
//           }
//         }
//       })
//       .catch((error) => {
//         reject(error);
//         console.error("Error retrieving data: ", error);
//       });
//     // // write the message to the database only if jibo is ready
//     // if (jiboName != "") {
//     //   if (jiboReady) {
//     //     database.ref("Jibo-Name/" + jiboName)
//     //       .push({ ...jibo_msg })
//     //       .then(function () {
//     //         console.log("New record for '" + jiboName + "' created successfully as: " + jibo_msg.msg_type);
//     //       })
//     //       .catch(function (error) {
//     //         console.error(
//     //           "Error creating new record for '" + jiboName + "' as: " + + jibo_msg.msg_type,
//     //           error
//     //         );
//     //       });
//     //     // Simulating asynchronous behavior with a delay of 1 second
//     //     setTimeout(() => {
//     //       resolve(jibo_msg); // Resolve the promise after the delay
//     //     }, 1000);
//     //   }
//     //   else {
//     //     console.log("Jibo is NOT ready for a new message to be pushed.");
//     //   }
//     // }
//     // else {
//     //   console.log("No Jibo Name added.");
//     // }
//   });
// }
///////////////////////////////// KEEP THIS FUNCTION! /////////////////////////////////

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
  audios: MenuItem<string>[]; // new

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
    this.audios = Object.entries(Audio).map(([audio, def]) => ({ // new
      value: audio,
      text: Audio[audio],
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
      JiboButton: (self: Scratch3Jibo) => ({
        type: BlockType.Button,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Jibo's name here",
        },
        text: () => `Enter Jibo's name`,
        operation: () => self.openUI("jiboNameModal", "My Jibo"),
      }),
      JiboTTS: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Hello, I am Jibo",
        },
        text: (text: string) => `say ${text}`,
        operation: (text: string) =>
          async (text: string, { target }: BlockUtility) => // Randi's
          {
            await this.virtualJiboSayFn(text, target);
            await this.jiboTTSFn(text);
            // self.jiboTTSFn(text), // old
          }
      }),
      JiboAsk: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: (text: string) => async (text: string, { target }: BlockUtility) => // Randi's
        {
          this.virtualJiboSayFn(text, target);
          await this.jiboAskFn(text);
          // self.jiboAskFn(text), // old
        }
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
          console.log("The dance file: " + dance);
          console.log(JSON.stringify(danceFiles[dance]));
          const akey = danceFiles[dance].file;
          await self.jiboAnimFn(akey);
        },
      }),
      // new audio block start
      JiboAudio: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: self.audios,
        },
        text: (audioname) => `play ${audioname} audio`,
        operation: async (audio: AudioType) => {
          console.log("The audio file: " + audio);
          console.log(JSON.stringify(audioFiles[audio]));
          const audiokey = audioFiles[audio].file;
          await self.jiboAnimFn(audiokey);
        },
      }),
      // new audio block end
      // new volume block start
      JiboVolume: (self: Scratch3Jibo) => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "60",
        },
        text: (volume: string) => `set volume to ${volume}`,
        operation: (volume: string) =>
          // (async () => {
          //   await self.jiboVolumeFn(volume)
          // })(),
          self.jiboVolumeFn(volume),
      }),
      // new volume block end
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
          console.log("The animation file: " + anim);
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
        operation: (color: ColorType) =>
          async (color: ColorType, { target }: BlockUtility) => // Randi's
          {
            this.virtualJiboLEDFn(color, target);
            this.jiboLEDFn(color);
          },
        // self.jiboLEDFn(color), // old
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
          // (async () => {
          //   await self.jiboLookFn(x_angle, y_angle, z_angle)
          // })(),
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
    this.JiboASR_receive();
    return this.connected;
  }

  ////////////////////////// Randi's changes
  getJiboBodyTarget(currentTarget: Target) {
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
    return spriteTarget;
  }

  async virtualJiboSayFn(text: string, currentTarget: Target) {
    let spriteTarget = this.getJiboBodyTarget(currentTarget);
    if (spriteTarget) {
      // emit the say function
      this.runtime.emit('SAY', spriteTarget, 'say', text);
      // wait for a bit of time
      let wordCount = text.match(/\S+/g).length;
      await new Promise((r) => setTimeout(r, 500 * wordCount));
      this.runtime.emit('SAY', spriteTarget, 'say', '');
    } else {
      console.log("No Jibo body found");
    }
  }
  stageAnswerReceive() {
    return new Promise((resolve, reject) => {
      this.runtime.once('ANSWER', (answer) => {
        // TODO this introduces a bug with the sensing blocks, improve if possible
        this.asr_out = answer;
        resolve(0);
      });
    });
  }
  ////////////////////////// Randi's changes - END

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

      this.multitask_msg["do_tts"] = false;
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
      // readyForNext: false,
      msg_type: "JiboAction",
      do_tts: true,
      tts_text: text,
      do_lookat: false,
      do_motion: false,
      volume: parseFloat(this.jbVolume),
    };

    // write to firebase
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay of 1 second
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);

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

  async jiboVolumeFn(volume: string) {
    if (this.multitask) {
      if (this.prevTasks.includes("volume")) {
        this.prevTasks.length = 0;
        console.log("performing");
        console.log(this.multitask_msg);
        this.JiboPublish(this.multitask_msg);
        this.multitask_msg = {};
      }
      this.multitask_msg["do_volume"] = true;
      this.multitask_msg["volume"] = parseFloat(volume);
      this.prevTasks.push("volume");
      return;
    }
    this.jbVolume = volume;
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_volume: true,
      volume: parseFloat(volume)
    };
    // write to firebase
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated delay of 3 seconds
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);

    this.JiboPublish(jibo_msg);
  }

  async jiboAskFn(text: string) {
    // say question
    // this.jiboTTSFn(text); // this is working with firebase

    await this.jiboTTSFn(text)
      .then(() => {
        // Delay of 2 seconds before sending the next message
        setTimeout(() => {
          this.JiboASR_request();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });

    // listen for answer
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated delay of 3 seconds
    // this.JiboASR_request();

    // wait for sensor to return
    // this.asr_out = await this.JiboASR_receive(); 
  }
  async jiboListenFn() {
    // return this.asr_out;
    /////////////////////////////////////////////////////////////////
    try {
      this.asr_out = await this.getDataFromFirebase();
      return this.asr_out;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }

  }

  ////////////////////////// Randi's changes
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

      spriteTarget.setXY(DEFAULT_JIBO_BODY.x, DEFAULT_JIBO_BODY.y);
      spriteTarget.setDirection(DEFAULT_JIBO_BODY.direction);
      spriteTarget.setSize(DEFAULT_JIBO_BODY.size);

    } else {
      console.log("No Jibo body found");
    }
  }
  ////////////////////////// Randi's changes - END

  jiboLEDFn(color: string) {
    console.dir("The color from inside JiboLEDFn function is: " + color);
    let ledName = colorDef[color].name;
    let ledValue = colorDef[color].value;
    console.log("The color name is: " + JSON.stringify(ledValue));

    if (ledName == "Random") {
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
      // readyForNext: false,
      msg_type: "JiboAction",
      do_led: true,
      led_color: ledValue,
    };


    // write to firebase
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated delay of 3 seconds
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);


    this.JiboPublish(jibo_msg);
  }

  // TODO make this better - like look up down left right, etc.
  async jiboLookFn(X: string, Y: string, Z: string) {
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
      // readyForNext: false,
      msg_type: "JiboAction",
      do_lookat: true,
      lookat: {
        x: parseFloat(X),
        y: parseFloat(Y),
        z: parseFloat(Z),
      },
    };

    // write to firebase
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);

    this.JiboPublish(jibo_msg);
  }

  ////////////////////////// Randi's changes - IMPORTS
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

      // TODO do transition animation to change sprite icon
      this.setSpriteCostume(spriteTarget, animation, imageDataURI);
      spriteTarget.setXY(DEFAULT_JIBO_EYE.x, DEFAULT_JIBO_EYE.y);
      spriteTarget.setDirection(DEFAULT_JIBO_EYE.direction);
      spriteTarget.setSize(DEFAULT_JIBO_EYE.size);

    } else {
      console.log("No Jibo eye found");
    }
  }
  ////////////////////////// Randi's changes - END

  async jiboAnimFn(animation_key: string) {
    console.log("the animation file is: " + animation_key); // debug statement
    var jibo_msg = {
      // readyForNext: false,
      msg_type: "JiboAction",
      do_motion: true,
      do_tts: false,
      do_lookat: false,
      motion: animation_key.toLowerCase(),
    };

    // write to frebase
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);

    await this.JiboPublish(jibo_msg);

    await this.JiboPublish({ do_anim_transition: true, anim_transition: 0 });

    /* // wait for command to complete
        return new Promise((resolve) => {
            this.jiboEvent.once("command.complete", async () => {
                resolve();
            });
        });*/
  }

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
  async JiboASR_request() {
    // if (!this.connected) {
    //   console.log("ROS is not connetced");
    //   return false;
    // }
    // var cmdVel = new ROSLIB.Topic({
    //   ros: this.ros,
    //   name: "/jibo_asr_command",
    //   messageType: "jibo_msgs/JiboAsrCommand",
    // });
    // var jibo_msg = new ROSLIB.Message({ heyjibo: false, command: 1 });
    var jibo_msg = {
      msg_type: "JiboAsrCommand",
      command: 1,
      heyjibo: false,
      detectend: false,
      continuous: false,
      incremental: false,
      alternatives: false,
      rule: "",
      // stop: 0,
      // start: 1
    };
    // setJiboMsg(jibo_msg);
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay of 1 second
    queue.addToQueue(jibo_msg);
    console.log("Sent JiboAsrCommand to firebase");
    // cmdVel.publish(jibo_msg);
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

  // taz test new function
  async readAsrAnswer(): Promise<any> {

    return new Promise((resolve, reject) => {
      interface EventData {
        msg_type: string,
        confidence: number;
        heuristic_score: number;
        slotAction: string;
        transcription: string;
      }
      console.log("Now reading the answer from the database: ");
      const pathRef = database.ref("Jibo-Name/" + jiboName);
      var eventKey: any;
      var eventData: any;
      pathRef
        .once("value")
        .then((snapshot) => {
          // Loop through the child snapshots of JiboAsrResult
          snapshot.forEach((childSnapshot) => {
            eventKey = childSnapshot.key;
            eventData = childSnapshot.val() as EventData;
          });
          if (eventData.msg_type === "JiboAsrResult") {
            // console.log("eventData is: " + JSON.stringify(eventData));
            var transcription = eventData.transcription;
            console.log("The last entered answer is: " + transcription);
            resolve(transcription);
          }
        })
        .catch((error) => {
          reject(error);
          console.error("Error retrieving data: ", error);
        });
    });

  }

  async getDataFromFirebase(): Promise<any> {
    try {
      const value = await this.readAsrAnswer();
      return value;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  addAnimationToList(anim: string) {
    return this.animation_list.push(anim);
  }
}
