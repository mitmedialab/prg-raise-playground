import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent, ValueOf } from "$common";
import * as posenet from '@tensorflow-models/posenet';

import { legacyFullSupport, info } from "./legacy";

const { legacyExtension, legacyDefinition } = legacyFullSupport.for<PoseBody>();

// TODO: Implement extension health check (peripheral)

/**
 * States what the video sensing activity can be set to.
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
 * Contains descriptions of the blocks of the Body Sensing extension
 */
type Details = {
  name: "Body Sensing",
  description: "Sense body position with the camera.",
  iconURL: "pose-body.png",
  insetIconURL: "pose-body-small.svg",
  tags: ["Dancing with AI", "Made by PRG"]
};

/**
 * Contains descriptions of the blocks of the Block Sensing extension
 */
type Blocks = {
  goToPart(bodyPart: string): void;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggle(state: string): void;
  setVideoTransparency(transparency: number): void;
};

@legacyExtension()
export default class PoseBody extends Extension<Details, Blocks> {
  /**
   * The state of where the body and its parts are estimated to be
   */
  poseState;

  /**
   * The body model from posenet
   */
  private bodyModel;

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
   * Dimensions of the video frame
   */
  DIMENSIONS = [480, 360];

  /**
   * Accessible body parts
   */
  bodyOptions = info.menus.PART.items;


  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Acts like class PoseBody's constructor (instead of a child class constructor)
   * @param env 
   */
  async init(env: Environment) {

    await this.loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
    
    if (this.runtime.ioDevices) {
      this._loop();
    }
  }

  /**
   * Converts the coordinates from the body pose estimate to Scratch coordinates
   * @param x 
   * @param y
   * @param z
   * @returns enum
   */
  tfCoordsToScratch({ x, y }) {
    return { x: x - 250, y: 200 - y };
  }

  /**
   * Get the latest values for video transparency and state,
   * and set the video device to use them.
   */
  projectStarted() {
    this.setTransparency(this.globalVideoTransparency);
    this.toggleVideo(this.globalVideoState);
  }

  /**
   * Checks if there is a body in the video frame that has a pose
   * @returns {boolean} true if there is a body pose, false otherwise
   */
  hasPose() {
    return this.poseState && this.poseState.keypoints && this.poseState.score > 0.01;
  }

  /**
   * Runs for the entire time the extension is running. Gets information about the video frame.
   * Estimates where the body is on the video frame. Creates a delay to prevent this function from constantly running,
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
        this.poseState = await this.estimatePoseOnImage(frame);
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }

  /**
   * Estimates where the body is on the video frame.
   * @param imageElement
   * @returns {Promise<AnnotatedPrediction[]>}
   */
  async estimatePoseOnImage(imageElement) {
    // load the posenet model from a checkpoint
    const bodyModel = await this.ensureBodyModelLoaded();
    return await bodyModel.estimateSinglePose(imageElement, {
      flipHorizontal: false
    });
  }

  /**
   * Gets the body model from posenet
   * @returns 
   */
  async ensureBodyModelLoaded() {

    this.bodyModel ??= await posenet.load();
    return this.bodyModel;
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
  setTransparency(transparency: number) {
    const trans = Math.max(Math.min(transparency, 100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }

  /**
   * Sets up the default settings for the extension. Gives information related to each of the extension's blocks
   * @returns The extension's blocks
   */
  defineBlocks(): PoseBody["BlockDefinitions"] {

    /**
     * Sets up the extension's default video settings
     */
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    this.projectStarted();
    this.bodyModel = null;

    /**
     * The options for each finger
     * @type {Array}
     */
    const handlerOptions: Array<string> = this.bodyOptions.map(part => part.value);

    const goToPart = legacyDefinition.goToPart({
      operation: (bodyPart: string, util) => {

        if (this.hasPose()) {
          const { x, y } = this.tfCoordsToScratch(this.poseState.keypoints.find(point => point.part === bodyPart).position);
          (util.target as any).setXY(x, y, false);
        }
      },
      argumentMethods: {
        0: {
          handler: (bodyPart: string) => {
            return handlerOptions.includes(bodyPart) ? bodyPart : 'nose';
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
        this.setTransparency(transparency);
      }
    });

    return {
      goToPart,
      videoToggle,
      setVideoTransparency
    }
  }
}