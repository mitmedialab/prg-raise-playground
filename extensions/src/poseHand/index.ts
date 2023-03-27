import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent } from "$common";
import { legacyIncrementalSupport, legacyFullSupport, info } from "./legacy";

// import Video from '../../../packages/scratch-vm/src/io/video'; // Save for now
import * as handpose from '@tensorflow-models/handpose';
const { legacyExtension, legacyDefinition } = legacyIncrementalSupport.for<PoseHand>();

/**
 * States what the video state can be set to.
 * @readonly
 */
const VideoState = {
  /** Video turned off. */
  OFF: 0,

  /** Video turned on with default y axis mirroring. */
  ON: 1,

  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
} as const;

/**
 * Contains the details about the Hand Sensing extension
 */
type Details = {
  name: "Hand Sensing",
  description: "Sense hand movement with the camera.",
  iconURL: "pose-hand.png",
  insetIconURL: "pose-hand-small-3.svg"
};

/**
 * Contains descriptions of the blocks of the Hand Sensing extension
 */
type Blocks = {
  goToHandPart(handPart: string, fingerPart: number): void;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggle(state: number): void;
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
   * @type {number}
   */
  globalVideoState: number;

  /**
   * The current transparency of the video
   * @type {number}
   */
  globalVideoTransparency: number;

  DIMENSIONS = [480, 360];

  /**
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {

    const EXTENSION_ID = 'PoseHand';

    /* Unused but possibly needed in the future
    this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    this.runtime.connectPeripheral(EXTENSION_ID, 0);
    this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
    */

    if (this.runtime.ioDevices) {
      /* Possibly unnecessary, keep commented just in case
      this.runtime.on(RuntimeEvent.ProjectLoaded, this.projectStarted.bind(this));
      this.runtime.on(RuntimeEvent.ProjectRunStart, this.reset.bind(this)); 
      */
      this._loop();
    }
  }

  // /**
  //  * Dimensions the video stream is analyzed at after its rendered to the
  //  * sample canvas.
  //  * @type {Array.<number>}
  //  */
  // static get DIMENSIONS() {
  //   return [480, 360];
  // }

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
   * init() binds to this function, but it is never called, so this may be unimportant
   */
  // reset() {
  // }

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
        // format: Video.FORMAT_IMAGE_DATA,
        dimensions: this.DIMENSIONS
      });

      const time = +new Date();
      if (frame) {
        this.handPoseState = await this.estimateHandPoseOnImage(frame);
        /*
        if (this.isConnected()) {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
        } else {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECTED);
        }
        */
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
  toggleVideo(state: number) {
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


    /**
     * The options for each finger
     * @type {Array}
     */
    const fingerOptions =
      [{ text: "thumb", value: "thumb" }, { text: "index finger", value: "indexFinger" },
      { text: "middle finger", value: "middleFinger" }, { text: "ring finger", value: "ringFinger" }, { text: "pinky finger", value: "pinky" }];

    const handlerFingerOptions = fingerOptions.map(finger => finger.value);
    /**
     * The options for the part of a finger
     * @type {Array}
     */
    const partOfFingerOptions = [{ text: "tip", value: 3 }, { text: "first knuckle", value: 2 },
    { text: "second knuckle", value: 1 }, { text: "base", value: 0 }];


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
      operation: (video_state: number) => {
        this.toggleVideo(video_state);
      },
      argumentMethods: {
        0: {
          handler: (video_state: number) => {
            return Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED);
          }
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



