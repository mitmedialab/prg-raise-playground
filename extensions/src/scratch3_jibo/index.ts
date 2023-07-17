import EventEmitter from "events";
// firebase
import database from './firebase';

import { ArgumentType, BlockType, color } from "$common";
import { Environment, BlockDefinitions, MenuItem } from "$common";
import { Extension } from "$common";

/** Import our svelte components */
import ColorArgUI from "./ColorArgument.svelte";
import EmojiArgUI from "./EmojiArgument.svelte";
import IconArgUI from "./IconArgument.svelte";

import ROSLIB from "roslib";

const EXTENSION_ID = "jibo";

// jibo's name
// opal-sage-victor-valley
var jiboName: string = "";
// var databaseRef = database.ref("Jibo-Name/" + jiboName);

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

type AnimFileType = {
  file: string;
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
  },
  [Audio.Bleep]: {
    file: "FX_Bleep.mp3",
  },
  [Audio.Blip]: {
    file: "FX_Blip.mp3",
  },
  [Audio.Bloop]: {
    file: "FX_Bloop.mp3",
  },
  [Audio.BootUp]: {
    file: "FX_BootUp.mp3",
  },
  [Audio.Disgusted_01]: {
    file: "FX_Disgusted_01.mp3",
  },
  [Audio.Disgusted_02]: {
    file: "FX_Disgusted_02.mp3",
  },
  [Audio.Disgusted_03]: {
    file: "FX_Disgusted_03.mp3",
  },
  [Audio.DoYouWantToPlay]: {
    file: "FX_DoYouWantToPlay_01.mp3",
  },
  [Audio.FillingUp]: {
    file: "FX_FillingUp_01.mp3",
  },
  [Audio.GoodJob]: {
    file: "FX_GoodJob_01.mp3",
  },
  [Audio.Holyhappiness]: {
    file: "FX_Holyhappiness.mp3",
  },
  [Audio.ImBroken]: {
    file: "FX_ImBroken_01.mp3",
  },
  [Audio.PeekABoo]: {
    file: "FX_PeekABoo_01.mp3",
  },
  [Audio.Whistle]: {
    file: "FX_Whistle.mp3",
  },
  [Audio.CheckmarkButton]: {
    file: "SFX_Global_CheckmarkButton.m4a",
  },
  [Audio.TurnTakingOff]: {
    file: "SFX_Global_TurnTakingOff.m4a",
  },
  [Audio.TurnTakingOn]: {
    file: "SFX_Global_TurnTakingOn.m4a",
  },
  [Audio.Aww]: {
    file: "SSA_aww.m4a",
  },
  [Audio.Confirm]: {
    file: "SSA_confirm.m4a",
  },
  [Audio.Disappointed]: {
    file: "SSA_disappointed.m4a",
  },
  [Audio.Hello]: {
    file: "SSA_hello.wav",
  },
  [Audio.Belly_Dance_00]: {
    file: "music/music_belly_dance_00.m4a",
  }

}
// tasneem new audio files end

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

// tasneem new - queue sata structure
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

  //////////////////////////////// pushToFirebase() (or setJiboMsg()) function WITHOUT FLAG 
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


  //////////////////////////////// pushToFirebase() (or setJiboMsg()) function WITH FLAG
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
  busy: boolean;
  tts: any;
  dances: MenuItem<string>[];
  dirs: MenuItem<string>[];
  audios: MenuItem<string>[]; // new

  init() {
    this.text = "Hello! I'm Jibo!";
    this.animName = "My Animation";
    this.busy = false;
    this.dances = Object.entries(Dance).map(([dance, def]) => ({
      value: dance,
      text: Dance[dance],
    }));
    this.dirs = Object.entries(Direction).map(([direction]) => ({
      text: Direction[direction],
      value: Direction[direction],
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
      JiboButton: () => ({
        type: BlockType.Button,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Jibo's name here",
        },
        text: () => `Enter Jibo's name`,
        operation: () => this.openUI("jiboNameModal", "My Jibo"),
      }),
      JiboTTS: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "Hello, I am Jibo",
        },
        text: (text: string) => `say ${text}`,
        operation: (text: string) =>
          // (async () => {
          //   await self.jiboTTSFn(text)
          // })(),
          this.jiboTTSFn(text),
      }),
      JiboAsk: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          defaultValue: "How are you?",
        },
        text: (text: string) => `ask ${text} and wait`,
        operation: (text: string) =>
          // (async () => {
          //   await self.jiboAskFn(text)
          // })(),
          this.jiboAskFn(text),
      }),
      JiboListen: () => ({
        type: BlockType.Reporter,
        text: `answer`,
        operation: () =>
          // (async () => {
          //   await self.jiboListenFn()
          // })(),
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
          console.log("line 610 to know the dance file: " + dance);
          console.log(JSON.stringify(danceFiles[dance]));
          const akey = danceFiles[dance].file;
          await this.jiboAnimFn(akey);
        },
      }),
      // new audio block start
      JiboAudio: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: this.audios,
        },
        text: (audioname) => `play ${audioname} audio`,
        operation: async (audio: AudioType) => {
          console.log("The audio file: " + audio);
          console.log(JSON.stringify(audioFiles[audio]));
          const audiokey = audioFiles[audio].file;
          await this.jiboAudioFn(audiokey);
        },
      }),
      // new audio block end
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
            text: "happy",
          },
        }),
        text: (aname) => `play ${aname} emotion`,
        operation: async (anim: EmotionType) => {
          console.log("line 610 to know the dance file: " + anim);
          const akey = emotionFiles[anim].file;
          await this.jiboAnimFn(akey);
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
        operation: async (icon: IconType) => {
          const akey = iconFiles[icon].file;
          await this.jiboAnimFn(akey);
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
        operation: (color: ColorType) =>
          (async () => {
            await this.jiboLEDFn(color)
          })(),
        // {
        //   console.log("line 654 to know the color: " + color);
        //   self.jiboLEDFn(color);
        // },
      }),
      JiboLook: () => ({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.String,
          options: this.dirs,
        },
        text: (dname) => `look ${dname}`,
        operation: async (dir: DirType) => {
          await this.jiboLookFn(dir);
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

  // TODO remove the self variable here
  async jiboTTSFn(text: string) {
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
      do_sound_playback: false,
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

  jiboLEDFn(color: string) { // I added async
    let ledValue = colorDef[color].value;

    if (color === "Random") {
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
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated delay of 3 seconds
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);


    this.JiboPublish(jibo_msg);
  }

  async jiboLookFn(dir: string) {
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
    queue.addToQueue(jibo_msg);
    // setJiboMsg(jibo_msg);

    await this.JiboPublish(jibo_msg);
  }

  async jiboAnimFn(animation_key: string) {
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

  async jiboAudioFn(audio_file: string) {
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
      console.log("Got value from firebase");
      console.log(value);
      return value;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
