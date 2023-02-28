import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, untilExternalGlobalVariableLoaded, extractLegacySupportFromOldGetInfo, isString } from "$common";
import { info, legacyFullSupport, legacyIncrementalSupport } from "./legacy";

const { legacyExtension, legacyDefinition, ReservedNames } = legacyFullSupport<PoseFace>();

// import * as window from 'affdex.js';

/**
 * Dimensions the video stream is analyzed at after its rendered to the
 * sample canvas.
 * @type {Array.<number>}
 */
const dimensions = [480, 360];

/**
 * States what the video sensing activity can be set to.
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
 * Used for rounding
 * @param amount 
 * @returns {double} a double
 */
function friendlyRound(amount) {
  return parseFloat(Number(amount).toFixed(2));
}

/**
 * Contains details about the Face Sensing extension
 */
type Details = {
  name: "Face Sensing",
  description: "Sense face movement with the camera.",
  iconURL: "pose-face.png",
  insetIconURL: "pose-face-small.svg"
};

/**
 * Contains descriptions of the blocks of the Block Sensing extension
 */
type Blocks = {
  affdexGoToPart(facePart: string): void;
  affdexWhenExpression(expression: string): boolean;
  affdexExpressionAmount(expression: string): number;
  affdexIsExpression(expression: string): boolean;
  affdexWhenEmotion(feeling: string): boolean;
  affdexEmotionAmount(feeling: string): number;
  affdexIsTopEmotion(feeling: string): boolean;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggle(state: number): void;
  setVideoTransparency(transparency: number): void;
}

type Affdex = {
  PhotoDetector: new (imageElement, width: number, height: number, mode) => Detector,

  FaceDetectorMode: {
    LARGE_FACES: 0,
    SMALL_FACES: 1
  };
};

type Detector = {
  process: (imageElement: any, index: number) => void;
  addEventListener: (eventName: string, data: any) => void;
  detectAllEmotions();
  detectAllExpressions();
  start();
  removeEventListener: (eventName: string, toRemove: Function) => void;
}

@legacyExtension()
export default class PoseFace extends Extension<Details, Blocks> {

  /**
   * The state the face's points, expressions, and emotions
   */
  affdexState;

  hasResult: boolean;

  private affdexDetector: Detector;

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
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {
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

  projectStarted() {
    this.setTransparency(this.globalVideoTransparency);
    this.toggleVideo(this.globalVideoState);
  }

  /**
   * Converts the coordinates from the hand pose estimate to Scratch coordinates
   * @param x 
   * @param y
   * @returns enum
   */
  convertCoordsToScratch({ x, y }) {
    return { x: x - (dimensions[0] / 2), y: (dimensions[1] / 2) - y };
  }

  async _loop() {
    while (true) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: 'image-data',
        dimensions: dimensions
      });

      const time = +new Date();
      if (frame) {
        this.affdexState = await this.estimateAffdexOnImage(frame);
        /*
        if (this.affdexState) {
          this.hasResult = true;
          this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
        } else {
          this.hasResult = false;
          this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECTED);
        }
        */
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }

  isConnected() {
    return this.hasResult;
  }

  async estimateAffdexOnImage(imageElement) {
    const affdexDetector = await this.ensureAffdexLoaded(imageElement);

    affdexDetector.process(imageElement, 0);
    return new Promise((resolve, reject) => {
      const resultListener = function (faces, image, timestamp) {
        affdexDetector.removeEventListener("onImageResultsSuccess", resultListener);
        if (faces.length < 1) {
          resolve(null);
          return;
        }
        resolve(faces[0]);
      };
      affdexDetector.addEventListener("onImageResultsSuccess", resultListener);
    });
  }

  async ensureAffdexLoaded(imageElement) {
    if (this.affdexDetector) return this.affdexDetector

    const affdex: Affdex = await untilExternalGlobalVariableLoaded('https://download.affectiva.com/js/3.2.1/affdex.js', 'affdex');

    const affdexStarter = new Promise((resolve, reject) => {
      const width = dimensions[0];
      const height = dimensions[1];
      const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
      const detector = new affdex.PhotoDetector(imageElement, width, height, faceMode);
      detector.detectAllEmotions();
      detector.detectAllExpressions();
      detector.start();
      this.affdexDetector = detector;
      detector.addEventListener("onInitializeSuccess", resolve);
    });
    await affdexStarter;

    return this.affdexDetector;
  }

  /**
   * 
   * @param part 
   * @param util 
   * @returns 
   */
  goToPart(part, util) {
    if (!this.affdexState || !this.affdexState.featurePoints) return;

    const featurePoint = this.affdexState.featurePoints[part];
    const { x, y } = this.convertCoordsToScratch(featurePoint);
    (util.target as any).setXY(x, y, false);
  }

  /**
   * 
   * @param expression 
   * @returns 
   */
  isExpression(expression) {
    if (!this.affdexState || !this.affdexState.expressions) {
      return false;
    }
    return this.affdexState.expressions[expression] > .5;
  }

  /**
   * 
   * @param expression 
   * @returns 
   */
  expressionAmount(expression) {
    if (!this.affdexState || !this.affdexState.expressions) {
      return 0;
    }
    return friendlyRound(this.affdexState.expressions[expression]);
  }

  /**
   * 
   * @param felt_emotion 
   * @param emotions 
   * @returns 
   */
  isTopEmotion(felt_emotion, emotions) {
    if (!this.affdexState || !this.affdexState.emotions) {
      return false;
    }
    let maxEmotionValue = -Number.MAX_VALUE;
    let maxEmotion = null;
    emotions.forEach((emotion) => {
      // console.log(emotion);
      const emotionValue = this.affdexState.emotions[emotion.value];
      // console.log(emotionValue)
      if (emotionValue > maxEmotionValue) {
        maxEmotionValue = emotionValue;
        maxEmotion = emotion;
      }
    });
    // console.log(maxEmotion.value + " "+ felt_emotion);
    return felt_emotion == maxEmotion.value;
  }

  /**
   * 
   * @param emotion 
   * @returns 
   */
  emotionAmount(emotion) {
    if (!this.affdexState || !this.affdexState.emotions) {
      return 0;
    }
    return friendlyRound(this.affdexState.emotions[emotion]);
  }

  /**
   * Turns the video camera off/on/on and flipped. This is called in the operation of videoToggleBlock
   * @param state 
   */
  toggleVideo(state: number): void {
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
  defineBlocks(): PoseFace["BlockDefinitions"] {

    /**
     * Sets up the extension's default video settings
     */
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    this.projectStarted();

    const handlerExpressions = info.menus.EXPRESSION.items.map(
      ({ value }) => value satisfies string as string
    );

    const handleExpression = {
      handler: (expression: unknown) =>
        isString(expression) && handlerExpressions.includes(expression)
          ? expression : 'smile'
    }

    const allEmotions = info.menus.EMOTION_ALL.items.map(
      ({ value }) => value satisfies string as string
    );

    const emotionHandler = {
      handler: (emotion: unknown) => isString(emotion) && allEmotions.includes(emotion) ? emotion : "joy"
    };

    return {
      affdexGoToPart: legacyDefinition.affdexGoToPart({
        operation: (part: string, util) => this.goToPart(part, util)
      }),

      affdexWhenExpression: legacyDefinition.affdexWhenExpression({
        operation: (expression: string) => this.isExpression(expression),
        argumentMethods: { 0: handleExpression }
      }),

      affdexExpressionAmount: legacyDefinition.affdexExpressionAmount({
        operation: (expression: string) => this.expressionAmount(expression),
        argumentMethods: { 0: handleExpression }
      }),

      affdexIsExpression: legacyDefinition.affdexIsExpression({
        operation: (expression: string) => this.isExpression(expression),
        argumentMethods: { 0: handleExpression }
      }),

      affdexWhenEmotion: legacyDefinition.affdexWhenEmotion({
        operation: (emotion: string) => this.isTopEmotion(emotion, info.menus.EMOTION.items),
        argumentMethods: { 0: emotionHandler }
      }),

      affdexEmotionAmount: legacyDefinition.affdexEmotionAmount({
        operation: (emotion: string) => this.emotionAmount(emotion),
        argumentMethods: { 0: emotionHandler }
      }),

      affdexIsTopEmotion: legacyDefinition.affdexIsTopEmotion({
        operation: (emotion: string) => this.isTopEmotion(emotion, info.menus.EMOTION.items),
        argumentMethods: { 0: emotionHandler }
      }),

      videoToggle: legacyDefinition.videoToggle({
        operation: (video_state: number) => this.toggleVideo(video_state),
        argumentMethods: {
          0: {
            handler: (video_state: number) =>
              Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED)
          }
        }
      }),

      setVideoTransparency: legacyDefinition.setVideoTransparency({
        operation: (transparency: number) => this.setTransparency(transparency),
      })
    }
  }
}
