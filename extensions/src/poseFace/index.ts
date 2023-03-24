import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, untilExternalGlobalVariableLoaded } from "$common";
import { legacyIncrementalSupport, legacyFullSupport, info } from "./legacy";
const { legacyExtension, legacyDefinition } = legacyIncrementalSupport.for<PoseFace>();

// import * as window from 'affdex.js';

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
  goToFacePartCommand(facePart: string): void;
  whenExpressionDetectedHat(expression: string): boolean;
  amountOfExpressionDetectedReport(expression: string): number;
  isExpressionReport(expression: string): boolean;
  whenFeelingDetectedHat(feeling: string): boolean;
  levelOfFeelingReport(feeling: string): number;
  isFeelingReport(feeling: string): boolean;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleCommand(state: number): void;
  setVideoTransparencyCommand(transparency: number): void;
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
    // this.runtime = env.runtime;
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
  // static get DIMENSIONS() {
  //   return [480, 360];
  // }

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


    // FACE PART Block

    // const faceParts = [
    //   { text: 'left ear', value: 0 },
    //   { text: 'left chin', value: 1 },
    //   { text: 'chin', value: 2 },
    //   { text: 'right chin', value: 3 },
    //   { text: 'right ear', value: 4 },
    //   { text: 'left outer eyebrow', value: 5 },
    //   { text: 'left eyebrow', value: 6 },
    //   { text: 'left inner eyebrow', value: 7 },
    //   { text: 'right inner eyebrow', value: 8 },
    //   { text: 'right eyebrow', value: 9 },
    //   { text: 'right outer eyebrow', value: 10 },
    //   { text: 'nose bridge', value: 11 },
    //   { text: 'nose tip', value: 12 },
    //   { text: 'left nostril', value: 13 },
    //   { text: 'nose tip', value: 14 },
    //   { text: 'right nostril', value: 15 },
    //   { text: 'left outer eye crease', value: 16 },
    //   { text: 'left inner eye crease', value: 17 },
    //   { text: 'right inner eye crease', value: 18 },
    //   { text: 'right outer eye crease', value: 19 },
    //   { text: 'left mouth crease', value: 20 },
    //   { text: 'left upper lip point', value: 21 },
    //   { text: 'upper lip', value: 22 },
    //   { text: 'right upper lip point', value: 23 },
    //   { text: 'right mouth crease', value: 24 },
    //   { text: 'right lower lip point', value: 25 },
    //   { text: 'lower lip', value: 26 },
    //   { text: 'left lower lip point', value: 27 },
    //   { text: 'upper lip bottom', value: 28 },
    //   { text: 'lower lip top', value: 29 },
    //   { text: 'left upper eyelid', value: 30 },
    //   { text: 'left lower eyelid', value: 31 },
    //   { text: 'right upper eyelid', value: 32 },
    //   { text: 'right lower eyelid', value: 33 }
    // ];

    //type DefineGoToFacePart = DefineBlock<PoseFace, Blocks["goToFacePartCommand"]>;
    const goToFacePartCommand = legacyDefinition.affdexGoToPart({
      // type: BlockType.Command,
      // arg: {
      //   type: ArgumentType.Number,
      //   options: faceParts
      // },
      // text: (part: number) => `go to ${part}`,
      operation: (part: string, util) => {
        this.goToPart(part, util)
      }
    });

    // EXPRESSION BLOCKS

    // const expressions = [
    //   { text: 'smile', value: 'smile' },
    //   { text: 'mouth open', value: 'mouthOpen' },
    //   { text: 'eye closure', value: 'eyeClosure' },
    //   { text: 'eyebrow raise', value: 'browRaise' },
    //   { text: 'whistling', value: 'lipPucker' },
    //   { text: 'eye widening', value: 'eyeWiden' },

    //   // {text:'innerBrowRaise', value: 'innerBrowRaise'},

    //   { text: 'eyebrow furrow', value: 'browFurrow' },
    //   { text: 'nose wrinkle', value: 'noseWrinkle' },
    //   { text: 'upper lip raise', value: 'upperLipRaise' },
    //   { text: 'lip corner pull', value: 'lipCornerDepressor' },
    //   { text: 'chin raise', value: 'chinRaise' },

    //   // {text:'lip press', value:  'lipPress'},
    //   // {text:'lip suck', value:  'lipSuck'},

    //   { text: 'smirk', value: 'smirk' },
    //   { text: 'attention', value: 'attention' },
    //   { text: 'eyelid tighten', value: 'lidTighten' },
    //   { text: 'jaw drop', value: 'jawDrop' },
    //   { text: 'cheek dimple', value: 'dimpler' },
    //   { text: 'cheek raise', value: 'cheekRaise' },
    //   { text: 'lip stretch', value: 'lipStretch' }
    // ];
    // const handlerExpressions = expressions.map(expression => expression.value);



    // type DefineExpressDetect = DefineBlock<PoseFace, Blocks["whenExpressionDetectedHat"]>;
    const whenExpressionDetectedHat = legacyDefinition.affdexWhenExpression({
      // type: BlockType.Hat,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: expressions,
      //     handler: (expression: string) => {
      //       return handlerExpressions.includes(expression) ? expression : 'smile';
      //     }
      //   }
      // },
      // text: (expression: string) => `when ${expression} detected`,
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

    // type DefineAmountExpress = DefineBlock<PoseFace, Blocks["amountOfExpressionDetectedReport"]>;
    const amountOfExpressionDetectedReport = legacyDefinition.affdexExpressionAmount({
      // type: BlockType.Reporter,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: expressions,
      //     handler: (expression: string) => {
      //       return handlerExpressions.includes(expression) ? expression : 'smile';
      //     }
      //   }
      // },
      // text: (expression: string) => `amount of ${expression}`,
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

    // type DefineExpressReport = DefineBlock<PoseFace, Blocks["isExpressionReport"]>;
    const isExpressionReport = legacyDefinition.affdexIsExpression({
      // type: BlockType.Boolean,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: expressions,
      //     handler: (expression: string) => {
      //       return handlerExpressions.includes(expression) ? expression : 'smile';
      //     }
      //   }
      // },
      // text: (expression: string) => `expressing ${expression}`,
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

    // EMOTION BLOCKS

    // const emotions = [
    //   { text: 'joyful', value: 'joy' },
    //   { text: 'sad', value: 'sadness' },
    //   { text: 'disgusted', value: 'disgust' },
    //   { text: 'angry', value: 'anger' },
    //   { text: 'fearful', value: 'fear' }
    // ];
    // const handlerEmotionsShort = emotions.map(emotion => emotion.value);


    // const emotions2 = [
    //   { text: 'contempt', value: 'contempt' },
    //   { text: 'surprise', value: 'surprise' },
    //   { text: 'valence', value: 'valence' },
    //   { text: 'engagement', value: 'engagement' }
    // ];
    // const allEmotionValues = emotions.concat(emotions2).map(emotion => emotion.value);


    // type DefineFeelingDetect = DefineBlock<PoseFace, Blocks["whenFeelingDetectedHat"]>;
    const whenFeelingDetectedHat = legacyDefinition.affdexWhenEmotion({
      // type: BlockType.Hat,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: emotions,
      //     handler: (emotion: string) => {
      //       return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
      //     }
      //   }
      // },
      // text: (emotion: string) => `when ${emotion} feeling detected`,
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

    // type DefineLevelFeeling = DefineBlock<PoseFace, Blocks["levelOfFeelingReport"]>;
    const levelOfFeelingReport = legacyDefinition.affdexEmotionAmount({
      // type: BlockType.Reporter,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: allEmotionValues,
      //     handler: (emotion: string) => {
      //       return allEmotionValues.includes(emotion) ? emotion : 'joy';
      //     }
      //   }
      // },
      // text: (emotion: string) => `level of ${emotion}`,
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

    // type DefineIsFeeling = DefineBlock<PoseFace, Blocks["isFeelingReport"]>;
    const isFeelingReport = legacyDefinition.affdexIsTopEmotion({
      // type: BlockType.Boolean,
      // arg: {
      //   type: ArgumentType.String,
      //   options: {
      //     acceptsReporters: true,
      //     items: emotions,
      //     handler: (emotion: string) => {
      //       return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
      //     }
      //   }
      // },
      // text: (emotion: string) => `feeling ${emotion}`,
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

    const videoToggleCommand = legacyDefinition.videoToggle({
      operation: (video_state) => {
        this.toggleVideo(video_state);
      },
      argumentMethods: {
        0: {
          handler: (video_state: number) => {
            return Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED);
          },
        }
      }
    })

    const setVideoTransparencyCommand = legacyDefinition.setVideoTransparency({
      operation: (transparency: number) => {
        this.setTransparency(transparency);
      }
    })
    return {
      goToFacePartCommand,
      whenExpressionDetectedHat,
      amountOfExpressionDetectedReport,
      isExpressionReport,
      whenFeelingDetectedHat,
      levelOfFeelingReport,
      isFeelingReport,
      videoToggleCommand,
      setVideoTransparencyCommand
    }
  }
}
