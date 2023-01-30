import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ValueOf, } from "$common";

// import Video from '../../../packages/scratch-vm/src/io/video'; // Save for now
import * as handpose from '@tensorflow-models/handpose';

import legacy from "./legacy";

const VideoState = {
  OFF: 0,
  /** Video turned on with default y axis mirroring. */
  ON: 1,
  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
} as const;

type Details = {
  name: "Hand Sensing",
  description: "Sense hand movement with the camera.",
  iconURL: "pose-hand.png",
  insetIconURL: "pose-hand-small-3.svg"
};

type Blocks = {
  goToHandPartBlock(handPart: string, fingerPart: number): void;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleBlock(state: ValueOf<typeof VideoState>): void;
  setVideoTransparencyBlock(transparency: number): void;
};

export default class PoseHand extends Extension<Details, Blocks> {
  /**
   * The state of where the hand and its parts are estimated to be
   */
  handPoseState;

  private handModel: handpose.HandPose;

  globalVideoState: ValueOf<typeof VideoState>;

  globalVideoTransparency: number;

  /**
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {

    this.runtime = env.runtime;
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

  /**
   * Dimensions the video stream is analyzed at after its rendered to the
   * sample canvas.
   * @type {Array.<number>}
   */
  static get DIMENSIONS() {
    return [480, 360];
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
    this.setVideoTransparency(this.globalVideoTransparency);
    this.videoToggle(this.globalVideoState);
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
        // format: Video.FORMAT_IMAGE_DATA,
        dimensions: PoseHand.DIMENSIONS
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

  async estimateHandPoseOnImage(imageElement) {
    const handModel = await this.getLoadedHandModel();
    return await handModel.estimateHands(imageElement, false);
  }

  async getLoadedHandModel(): Promise<handpose.HandPose> {
    this.handModel ??= await handpose.load();
    return this.handModel;
  }

  videoToggle(state: ValueOf<typeof VideoState>) {
    if (state === VideoState.OFF) return this.runtime.ioDevices.video.disableVideo();

    this.runtime.ioDevices.video.enableVideo();
    // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
    this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
  }

  setVideoTransparency(transparency: number) {
    const trans = Math.max(Math.min(transparency, 100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }

  setDefaults() {
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    this.projectStarted();
    this.handModel = null;
  }

  /**
   * Sets up the default settings for the extension. Gives information related to each of the extension's blocks
   * @returns The extension's blocks
   */
  defineBlocks(): PoseHand["BlockDefinitions"] {
    this.setDefaults();

    const fingerOptions =
      [{ text: "thumb", value: "thumb" }, { text: "index finger", value: "indexFinger" },
      { text: "middle finger", value: "middleFinger" }, { text: "ring finger", value: "ringFinger" }, { text: "pinky finger", value: "pinky" }];

    const handlerFingerOptions = fingerOptions.map(finger => finger.value);

    const partOfFingerOptions = [{ text: "tip", value: 3 }, { text: "first knuckle", value: 2 },
    { text: "second knuckle", value: 1 }, { text: "base", value: 0 }];

    type DefineGoToHandPart = DefineBlock<PoseHand, Blocks["goToHandPartBlock"]>;

    const goToHandPartBlock: DefineGoToHandPart = legacy.goToHandPart({
      type: BlockType.Command,
      args: [
        {
          type: ArgumentType.String,
          options: {
            acceptsReporters: true,
            items: fingerOptions,
            handler: (finger: string) => handlerFingerOptions.includes(finger) ? finger : "thumb"
          }
        },
        {
          type: ArgumentType.Number,
          options: {
            acceptsReporters: true,
            items: partOfFingerOptions,
            handler: (part: number) => Math.max(Math.min(part, 3), 0)
          }
        }
      ],
      text: (handPart: string, fingerPart: number) => `go to ${handPart} ${fingerPart}`,
      operation: (handPart: string, fingerPart: number, util) => {
        if (this.isConnected()) {
          console.log('connected 2');
          const [x, y, z] = this.handPoseState[0].annotations[handPart][fingerPart];
          const { x: scratchX, y: scratchY } = this.tfCoordsToScratch({ x, y, z });
          (util.target as any).setXY(scratchX, scratchY, false);
        }
      }
    });

    return {
      goToHandPartBlock: goToHandPartBlock,

      videoToggleBlock: legacy.videoToggle({
        type: BlockType.Command,
        arg: {
          type: ArgumentType.Number,
          options: {
            acceptsReporters: true,
            items: [
              { text: 'off', value: VideoState.OFF },
              { text: 'on', value: VideoState.ON },
              { text: 'on and flipped', value: VideoState.ON_FLIPPED }
            ],
            handler: (video_state: any) => Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED) as ValueOf<typeof VideoState>
          }
        },
        text: (video_state: ValueOf<typeof VideoState>) => `turn video ${video_state}`,
        operation: (video_state: ValueOf<typeof VideoState>) => this.videoToggle(video_state)
      }),

      setVideoTransparencyBlock: legacy.setVideoTransparency({
        type: BlockType.Command,
        arg: { type: ArgumentType.Number, defaultValue: 50 },
        text: (transparency: number) => `set video transparency to ${transparency}`,
        operation: (transparency: number) => {
          this.setVideoTransparency(transparency);
        }
      })
    }
  }
}



