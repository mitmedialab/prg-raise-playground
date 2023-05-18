import { Extension, Environment, untilExternalGlobalVariableLoaded, validGenericExtension, RuntimeEvent } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { legacyFullSupport, info } from "./legacy";

const { legacyExtension, legacyDefinition } = legacyFullSupport.for<PoseFace>();

// TODO: Implement extension's health check (peripheral)

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
  videoToggle(state: string): void;
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
@validGenericExtension()
export default class PoseFace extends Extension<Details, Blocks> {

  /**
   * The state the face's points, expressions, and emotions
   */
  affdexState;

  private affdexDetector: Detector;

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

  INTERVAL = 33;
  DIMENSIONS = [480, 360];

  expressions = info.menus.EXPRESSION.items
  emotions = info.menus.EMOTION.items
  all_emotions = info.menus.EMOTION_ALL.items

  /**
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {
    if (this.runtime.ioDevices) {
      this.runtime.on(RuntimeEvent.ProjectStart, this.projectStarted.bind(this));
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
    return { x: x - (this.DIMENSIONS[0] / 2), y: (this.DIMENSIONS[1] / 2) - y };
  }

  async _loop() {
    while (true) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: 'image-data',
        dimensions: this.DIMENSIONS
      });

      const time = +new Date();
      if (frame) {
        this.affdexState = await this.estimateAffdexOnImage(frame);
        // TODO: Once indicators are implemented, indicate the state of the extension based on this.affdexState
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
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
      const width = this.DIMENSIONS[0];
      const height = this.DIMENSIONS[1];
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
   * Moves the target to a body part
   * @param part 
   * @param util 
   * @returns None
   */
  goToPart(part, util) {
    if (!this.affdexState || !this.affdexState.featurePoints) return;

    const featurePoint = this.affdexState.featurePoints[part];
    const { x, y } = this.convertCoordsToScratch(featurePoint);
    (util.target as any).setXY(x, y, false);
  }

  /**
   * If an expression is being expressed
   * @param expression 
   * @returns {boolean}
   */
  isExpression(expression) {
    if (!this.affdexState || !this.affdexState.expressions) {
      return false;
    }
    return this.affdexState.expressions[expression] > .5;
  }

  /**
   * How much of an expression is being expressed
   * @param expression 
   * @returns {number}
   */
  expressionAmount(expression) {
    if (!this.affdexState || !this.affdexState.expressions) {
      return 0;
    }
    return friendlyRound(this.affdexState.expressions[expression]);
  }

  /**
   * Is an emotion is being expressed
   * @param felt_emotion 
   * @param emotions 
   * @returns {boolean}
   */
  isTopEmotion(felt_emotion, emotions) {
    if (!this.affdexState || !this.affdexState.emotions) {
      return false;
    }
    let maxEmotionValue = -Number.MAX_VALUE;
    let maxEmotion = null;
    emotions.forEach((emotion) => {
      const emotionValue = this.affdexState.emotions[emotion.value];
      if (emotionValue > maxEmotionValue) {
        maxEmotionValue = emotionValue;
        maxEmotion = emotion;
      }
    });
    return felt_emotion == maxEmotion.value;
  }

  /**
   * How much of an emotion is being expressed
   * @param emotion 
   * @returns {number}
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
  defineBlocks(): PoseFace["BlockDefinitions"] {

    /**
     * Sets up the extension's default video settings
     */
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    this.projectStarted();

    const handlerExpressions: Array<string> = this.expressions.map(expression => expression.value);
    const handlerEmotionsShort: Array<string> = this.emotions.map(emotion => emotion.value);
    const allEmotionValues: Array<string> = this.all_emotions.map(emotion => emotion.value);


    const affdexGoToPart = legacyDefinition.affdexGoToPart({
      operation: (part: string, util: BlockUtility) => {
        this.goToPart(part, util)
      }
    });

    const affdexWhenExpression = legacyDefinition.affdexWhenExpression({
      operation: (expression: string) => {
        return this.isExpression(expression);
      },
      argumentMethods: {
        0: {
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      }
    });

    const affdexExpressionAmount = legacyDefinition.affdexExpressionAmount({
      operation: (expression: string) => {
        return this.expressionAmount(expression);
      },
      argumentMethods: {
        0: {
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      }
    });

    const affdexIsExpression = legacyDefinition.affdexIsExpression({
      operation: (expression: string) => {
        return this.isExpression(expression);
      },
      argumentMethods: {
        0: {
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      }
    });

    const affdexWhenEmotion = legacyDefinition.affdexWhenEmotion({
      operation: (emotion: string) => {
        return this.isTopEmotion(emotion, this.emotions);
      },
      argumentMethods: {
        0: {
          handler: (emotion: string) => {
            return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
          }
        }
      }
    });

    const affdexEmotionAmount = legacyDefinition.affdexEmotionAmount({
      operation: (emotion: string) => {
        return this.emotionAmount(emotion)
      },
      argumentMethods: {
        0: {
          handler: (emotion: string) => {
            return allEmotionValues.includes(emotion) ? emotion : 'joy';
          }
        }
      }
    });

    const affdexIsTopEmotion = legacyDefinition.affdexIsTopEmotion({
      operation: (emotion: string) => {
        return this.isTopEmotion(emotion, this.emotions);
      },
      argumentMethods: {
        0: {
          handler: (emotion: string) => {
            return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
          }
        }
      }
    });

    // VIDEO BLOCKS

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
      affdexGoToPart,
      affdexWhenExpression,
      affdexExpressionAmount,
      affdexIsExpression,
      affdexWhenEmotion,
      affdexEmotionAmount,
      affdexIsTopEmotion,
      videoToggle,
      setVideoTransparency
    }
  }
}
