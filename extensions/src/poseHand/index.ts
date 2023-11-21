import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent } from "$common";
import { legacyFullSupport, info } from "./legacy";

import * as handpose from '@tensorflow-models/handpose';
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

    if (this.runtime.ioDevices) {
      this._loop();
    }
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
  isConnected() {
    console.log('connected');
    return !!this.handPoseState && this.handPoseState.length > 0;
  }

  /**
   * Runs for the entire time the extension is running. Gets information about the video frame.
   * Estimates where the hand is on the video frame. Creates a delay to prevent this function from constantly running,
   * so as to prevent the entire program from slowing down.
   */
  async _loop() {
    while (true) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: 'image-data',
        dimensions: this.DIMENSIONS
      });

      const time = +new Date();
      if (frame) {
        this.handPoseState = await this.estimateHandPoseOnImage(frame);
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }

  /**
   * Estimates where the hand is on the video frame.
   * @param imageElement
   * @returns {Promise<AnnotatedPrediction[]>}
   */
  async estimateHandPoseOnImage(imageElement) {
    const handModel = await this.getLoadedHandModel();
    return await handModel.estimateHands(imageElement, {
      flipHorizontal: false
    });
  }

  /**
   * Gets the hand model from handpose
   * @returns hand model
   */
  async getLoadedHandModel() {
    this.handModel ??= await handpose.load();
    return this.handModel;
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

    const goToHandPart = legacyDefinition.goToHandPart({
      operation: (handPart: string, fingerPart: number, util) => {
        if (this.isConnected()) {
          console.log('connected 2');
          const [x, y, z] = this.handPoseState[0].annotations[handPart][fingerPart];
          const { x: scratchX, y: scratchY } = this.tfCoordsToScratch({ x, y, z });
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
      videoToggle,
      setVideoTransparency
    }
  }
}



