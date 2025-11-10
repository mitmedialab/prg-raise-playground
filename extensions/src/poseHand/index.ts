import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent } from "$common";
import { legacyFullSupport, info } from "./legacy";
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
const { legacyExtension, legacyDefinition } = legacyFullSupport.for<PoseHand>();

// TODO: Add extension's health check (peripheral)

/**
 * States what the video state can be set to.
 * @readonly
 */
const VideoState = {
  /** Video turned off. */
  OFF: 'off',

  /** Video turned on with default y axis mirroring. */
  ON: 'on',

  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 'on-flipped'
} as const;

/**
 * Contains the details about the Hand Sensing extension
 */
type Details = {
  name: "Hand Sensing",
  description: "Sense hand movement with the camera.",
  iconURL: "pose-hand.png",
  insetIconURL: "pose-hand-small-3.svg",
  tags: ["Dancing with AI", "Made by PRG"]
};

/**
 * Contains descriptions of the blocks of the Hand Sensing extension
 */
type Blocks = {
  goToHandPart(handPart: string, fingerPart: number): void;
  returnHandPart(coord: string, handPart: string, fingerPart: number): number;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggle(state: string): void;
  setVideoTransparency(transparency: number): void;
};

@legacyExtension()
export default class PoseHand extends Extension<Details, Blocks> {
  /**
   * The state of where the hand and its parts are estimated to be
   */
  handPoseState;

  /**
   * The hand model from handpose
   */
  private handModel;

  /**
   * The current video state
   * @type {string}
   */
  globalVideoState: string;

  /**
   * The current transparency of the video
   * @type {number}
   */
  globalVideoTransparency: number;

  /**
   * Dimensions of the frame
   * @type {number[]}
   */
  DIMENSIONS = [480, 360];

  /**
   * Access different fingers
   */
  fingerOptions = info.menus.HAND_PART.items;

  /**
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {
    this.loadMediaPipeModel();
    // if (this.runtime.ioDevices) {
    //   // this._loop();
    //   // this.handModel
    // }
  }

  /**
 * Converts the coordinates from the MediaPipe hand estimate to Scratch coordinates
 * @param x 
 * @param y
 * @param z
 * @returns enum
 */
  mediapipeCoordsToScratch(x, y, z) {
    return this.tfCoordsToScratch({ x: (this.DIMENSIONS[0] - (this.DIMENSIONS[0] * x)), y: this.DIMENSIONS[1] * y, z });
  }

  /**
   * Converts the coordinates from the hand pose estimate to Scratch coordinates
   * @param x 
   * @param y
   * @param z
   * @returns enum
   */
  tfCoordsToScratch({ x, y, z }) {
    return { x: x - 250, y: 200 - y };
  }

  /**
   * Get the latest values for video transparency and state,
   * and set the video device to use them.
   */
  projectStarted() {
    this.videoTransparency(this.globalVideoTransparency);
    this.toggleVideo(this.globalVideoState);
  }

  /**
   * Checks if the hand pose estimate is ready to be used
   * @returns {boolean} true if connected, false if not connected
   */
  // isConnected() {
  //   console.log(this.handPoseState);
  //   return !!this.handPoseState && this.handPoseState.landmarks.length > 0;
  // }

  /**
   * Runs for the entire time the extension is running. Gets information about the video frame.
   * Estimates where the hand is on the video frame. Creates a delay to prevent this function from constantly running,
   * so as to prevent the entire program from slowing down.
   */
  // async _loop() {
  //   while (true) {
  //     const frame = this.runtime.ioDevices.video.getFrame({
  //       format: 'canvas',
  //       dimensions: this.DIMENSIONS
  //     });

  //     const time = +new Date();
  //     if (this.handModel && frame) {
  //       this.handPoseState = this.handModel.detect(frame);
  //     }
  //     const estimateThrottleTimeout = (+new Date() - time) / 4;
  //     await new Promise(r => setTimeout(r, estimateThrottleTimeout));
  //   }
  // }



  async loadMediaPipeModel() {
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.handModel = await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      
  }

  /**
   * Turns the video camera off/on/on and flipped. This is called in the operation of videoToggleBlock
   * @param state 
   */
  toggleVideo(state: string) {
    if (state === VideoState.OFF) return this.runtime.ioDevices.video.disableVideo();

    this.runtime.ioDevices.video.enableVideo();
    // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
    this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
  }

  /**
   * Sets the video's transparency. This is called in the operation of setVideoTransparencyBlock
   * @param transparency 
   */
  videoTransparency(transparency: number) {
    const trans = Math.max(Math.min(transparency, 100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }

  /**
   * Sets up the default settings for the extension. Gives information related to each of the extension's blocks
   * @returns The extension's blocks
   */
  defineBlocks(): PoseHand["BlockDefinitions"] {

    /**
     * Sets up the extension's default video settings
     */
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    this.projectStarted();
    this.handModel = null;

    const handlerFingerOptions: Array<string> = this.fingerOptions.map(finger => finger.value);

    const handOptions = {
      "thumb": {
        3: 4,
        1: 2,
        0: 1,
        2: 3
      },
      "indexFinger": {
        3: 8,
        1: 6,
        0: 5,
        2: 7
      },
      "middleFinger": {
        3: 12,
        1: 10,
        0: 9,
        2: 11
      },
      "ringFinger": {
        3: 16,
        1: 14,
        0: 13,
        2: 15
      },
      "pinky": {
        3: 20,
        1: 18,
        0: 17,
        2: 19
      },
    }

    const goToHandPart = legacyDefinition.goToHandPart({
      
      operation: (handPart: string, fingerPart: number, util) => {
        let results;
        if (this.runtime.ioDevices && this.runtime.ioDevices.video.provider._video) {
          results = this.handModel.detectForVideo(this.runtime.ioDevices.video.provider._video, Date.now());
        }
        
        if (results && results.landmarks.length > 0) {
          const { x, y, z } = results.landmarks[0][handOptions[handPart][fingerPart]];
          const { x: scratchX, y: scratchY } = this.mediapipeCoordsToScratch(x, y, z);
          (util.target as any).setXY(scratchX, scratchY, false);
        }
      },
      argumentMethods: {
        0: {
          handler: (finger: string) => {
            return handlerFingerOptions.includes(finger) ? finger : "thumb";
          }
        },
        1: {
          handler: (part: number) => {
            return Math.max(Math.min(part, 3), 0)
          }
        }
      }
    });

    const returnHandPart = legacyDefinition.returnHandPart({
      operation: (coord: string, handPart: string, fingerPart: number) => {

        let results;
        if (this.runtime.ioDevices && this.runtime.ioDevices.video.provider._video) {
          results = this.handModel.detectForVideo(this.runtime.ioDevices.video.provider._video, Date.now());
        }
        
        if (results && results.landmarks.length > 0) {
          console.log('connected 2');
          const { x, y, z } = results.landmarks[0][handOptions[handPart][fingerPart]];
          const { x: scratchX, y: scratchY } = this.mediapipeCoordsToScratch(x, y, z);
          if (coord === 'x') {
            return scratchX;
          } else {
            return scratchY;
          }
        } else {
          return 0;
        }
      },
      argumentMethods: {
        0: {
          handler: (coord: string) => {
            return ['x', 'y'].includes(coord) ? coord : "x";
          }
        },
        1: {
          handler: (finger: string) => {
            return handlerFingerOptions.includes(finger) ? finger : "thumb";
          }
        },
        2: {
          handler: (part: number) => {
            return Math.max(Math.min(part, 3), 0)
          }
        }
      }
    });

    const videoToggle = legacyDefinition.videoToggle({
      operation: (video_state) => {
        this.toggleVideo(video_state);
      },
      argumentMethods: {
        0: {
          handler: (video_state: string) => {
            return ['on', 'off', 'on-flipped'].includes(video_state) ? video_state : VideoState.ON;
          },
        }
      }
    });

    const setVideoTransparency = legacyDefinition.setVideoTransparency({
      operation: (transparency: number) => {
        this.videoTransparency(transparency);
      }
    });


    return {
      goToHandPart,
      returnHandPart,
      videoToggle,
      setVideoTransparency
    }
  }
}



