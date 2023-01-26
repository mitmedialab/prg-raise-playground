import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent } from "$common";

// import Video from '../../../packages/scratch-vm/src/io/video';
import * as posenet from '../../../packages/scratch-vm/node_modules/@tensorflow-models/posenet';

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const VideoState = {
  /** Video turned off. */
  OFF: 0,

  /** Video turned on with default y axis mirroring. */
  ON: 1,

  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
};

/**
 * Contains descriptions of the blocks of the Body Sensing extension
 */
type Details = {
  name: "Body Sensing",
  description: "Sense body position with the camera.",
  iconURL: "pose-body.png",
  insetIconURL: "pose-body-small.svg"
};

/**
 * Contains descriptions of the blocks of the Block Sensing extension
 */
type Blocks = {
  goToBodyPartBlock(bodyPart: string): void;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleBlock(state: number): void;
  setVideoTransparencyBlock(transparency: number): void;
};

export default class PoseBody extends Extension<Details, Blocks> {
  /**
   * The state of where the body and its parts are estimated to be
   */
  poseState;

  /**
   * Flag to determine if the extension has been installed before
   * @type {boolean}
   */
  firstInstall: boolean;

  /**
   * The body model from posenet
   */
  bodyModel;

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

  /**
   * Acts like class PoseBody's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {

    this.runtime = env.runtime;
    const EXTENSION_ID = 'poseBody';

    /* Unused but possibly needed in the future */
    // this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    // this.runtime.connectPeripheral(EXTENSION_ID, 0);
    // this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);


    this.firstInstall = true;

    if (this.runtime.ioDevices) {
      // Possibly unnecessary, keep commented just in case
      // this.runtime.on(RuntimeEvent.ProjectLoaded, this.projectStarted.bind(this));
      // this.runtime.on(RuntimeEvent.ProjectRunStart, this.reset.bind(this)); 

      this._loop();
    }
  }

  /**
   * Dimensions the video stream is analyzed at after its rendered to the
   * sample canvas.
   * @type {Array.<number>}
   */
  static get DIMENSIONS() {
    return [480, 360];
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
    this.setVideoTransparency(this.globalVideoTransparency);
    this.videoToggle(this.globalVideoState);
  }

  /**
   * init() binds to this function, but it is never called, so this may be unimportant
   */
  // reset() {
  // }

  /**
   * Checks if the body pose estimate is ready to be used
   * @returns {boolean} true if connected, false if not connected
   */
  isConnected() {
    return this.hasPose();
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
        // format: Video.FORMAT_IMAGE_DATA,
        dimensions: PoseBody.DIMENSIONS
      });

      const time = +new Date();
      if (frame) {
        this.poseState = await this.estimatePoseOnImage(frame);

        // if (this.isConnected()) {
        //   this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
        // } else {
        //   this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECTED);
        // }

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
  videoToggle(state: number) {
    if (state === VideoState.OFF) return this.runtime.ioDevices.video.disableVideo();

    this.runtime.ioDevices.video.enableVideo();
    // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
    this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
  }

  /**
   * Sets the video's transparency. This is called in the operation of setVideoTransparencyBlock
   * @param transparency 
   */
  setVideoTransparency(transparency: number) {
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
    if (this.firstInstall) {
      this.globalVideoState = VideoState.ON;
      this.globalVideoTransparency = 50;
      this.projectStarted();
      this.firstInstall = false;
      this.bodyModel = null;
    }

    /**
     * The options for each finger
     * @type {Array}
     */
    const bodyOptions =
      [
        { text: 'nose', value: 'nose' },
        { text: 'right eye', value: 'leftEye' },
        { text: 'left eye', value: 'rightEye' },
        { text: 'right ear', value: 'leftEar' },
        { text: 'left ear', value: 'rightEar' },
        { text: 'right shoulder', value: 'leftShoulder' },
        { text: 'left shoulder', value: 'rightShoulder' },
        { text: 'right elbow', value: 'leftElbow' },
        { text: 'left elbow', value: 'rightElbow' },
        { text: 'right wrist', value: 'leftWrist' },
        { text: 'left wrist', value: 'rightWrist' },
        { text: 'right hip', value: 'leftHip' },
        { text: 'left hip', value: 'rightHip' },
        { text: 'right knee', value: 'leftKnee' },
        { text: 'left knee', value: 'rightKnee' },
        { text: 'right ankle', value: 'leftAnkle' },
        { text: 'left ankle', value: 'rightAnkle' },
      ];

    const handlerOptions = bodyOptions.map(part => part.value);

    type DefineGoToBodyPart = DefineBlock<PoseBody, Blocks["goToBodyPartBlock"]>;
    const goToBodyPartBlock: DefineGoToBodyPart = () => ({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: bodyOptions,
          handler: (bodyPart: string) => {
            return handlerOptions.includes(bodyPart) ? bodyPart : 'nose';
          }
        }
      },
      text: (bodyPart: string) => `go to ${bodyPart}`,
      operation: (bodyPart: string, util) => {

        if (this.hasPose()) {
          const { x, y } = this.tfCoordsToScratch(this.poseState.keypoints.find(point => point.part === bodyPart).position);
          (util.target as any).setXY(x, y, false);
        }
      }
    });

    type DefineVideoToggle = DefineBlock<PoseBody, Blocks["videoToggleBlock"]>;
    const videoToggleBlock: DefineVideoToggle = () => ({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.Number,
        options: {
          acceptsReporters: true,
          items: [{ text: 'off', value: VideoState.OFF }, { text: 'on', value: VideoState.ON }, { text: 'on and flipped', value: VideoState.ON_FLIPPED }],
          handler: (video_state: number) => {
            return Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED);
          }
        }
      },
      text: (video_state: number) => `turn video ${video_state}`,
      operation: (video_state: number) => {
        this.videoToggle(video_state);
      }
    });

    type DefineSetVideoTransparency = DefineBlock<PoseBody, Blocks["setVideoTransparencyBlock"]>;
    const setVideoTransparencyBlock: DefineSetVideoTransparency = () => ({
      type: BlockType.Command,
      arg: { type: ArgumentType.Number, defaultValue: 50 },
      text: (transparency: number) => `set video transparency to ${transparency}`,
      operation: (transparency: number) => {
        this.setVideoTransparency(transparency);
      }
    });

    return {
      goToBodyPartBlock,
      videoToggleBlock,
      setVideoTransparencyBlock
    }
  }
}