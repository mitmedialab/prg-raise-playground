import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";


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
  goToFacePartCommand(facePart: number): void;
  whenExpressionDetectedHat(expression: string): boolean;
  amountOfExpressionDetectedReport(expression: string): number;
  isExpressionReport(expression: string): boolean;
  whenFeelingDetectedHat(feeling: string): boolean;
  levelOfFeelingReport(feeling: string): number;
  isFeelingReport(feeling: string): boolean;
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleBlock(state: number): void;
  setVideoTransparencyBlock(transparency: number): void;
}


export default class PoseFace extends Extension<Details, Blocks> {

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


  init(env: Environment) {

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
  defineBlocks(): PoseFace["BlockDefinitions"] {

    /**
     * Sets up the extension's default video settings
     */
    this.globalVideoState = VideoState.ON;
    this.globalVideoTransparency = 50;
    // this.projectStarted();
    // this._bodyModel = null;


    // FACE PART Block

    const faceParts = [
      { text: 'left ear', value: 0 },
      { text: 'left chin', value: 1 },
      { text: 'chin', value: 2 },
      { text: 'right chin', value: 3 },
      { text: 'right ear', value: 4 },
      { text: 'left outer eyebrow', value: 5 },
      { text: 'left eyebrow', value: 6 },
      { text: 'left inner eyebrow', value: 7 },
      { text: 'right inner eyebrow', value: 8 },
      { text: 'right eyebrow', value: 9 },
      { text: 'right outer eyebrow', value: 10 },
      { text: 'nose bridge', value: 11 },
      { text: 'nose tip', value: 12 },
      { text: 'left nostril', value: 13 },
      { text: 'nose tip', value: 14 },
      { text: 'right nostril', value: 15 },
      { text: 'left outer eye crease', value: 16 },
      { text: 'left inner eye crease', value: 17 },
      { text: 'right inner eye crease', value: 18 },
      { text: 'right outer eye crease', value: 19 },
      { text: 'left mouth crease', value: 20 },
      { text: 'left upper lip point', value: 21 },
      { text: 'upper lip', value: 22 },
      { text: 'right upper lip point', value: 23 },
      { text: 'right mouth crease', value: 24 },
      { text: 'right lower lip point', value: 25 },
      { text: 'lower lip', value: 26 },
      { text: 'left lower lip point', value: 27 },
      { text: 'upper lip bottom', value: 28 },
      { text: 'lower lip top', value: 29 },
      { text: 'left upper eyelid', value: 30 },
      { text: 'left lower eyelid', value: 31 },
      { text: 'right upper eyelid', value: 32 },
      { text: 'right lower eyelid', value: 33 }
    ];

    type DefineGoToFacePart = DefineBlock<PoseFace, Blocks["goToFacePartCommand"]>;
    const goToFacePartCommand: DefineGoToFacePart = () => ({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.Number,
        options: {
          acceptsReporters: true,
          items: faceParts,
          handler: (part: number) => {
            return Math.min(Math.max(part, 0), 33);
          }
        }
      },
      text: (part: number) => `go to ${part}`,
      operation: (part: number, util) => {
        console.log(part);

      }
    });

    // EXPRESSION BLOCKS

    const expressions = [
      { text: 'smile', value: 'smile' },
      { text: 'mouth open', value: 'mouthOpen' },
      { text: 'eye closure', value: 'eyeClosure' },
      { text: 'eyebrow raise', value: 'browRaise' },
      { text: 'whistling', value: 'lipPucker' },
      { text: 'eye widening', value: 'eyeWiden' },
      // {text:'innerBrowRaise', value: 'innerBrowRaise'},
      { text: 'eyebrow furrow', value: 'browFurrow' },
      { text: 'nose wrinkle', value: 'noseWrinkle' },
      { text: 'upper lip raise', value: 'upperLipRaise' },
      { text: 'lip corner pull', value: 'lipCornerDepressor' },
      { text: 'chin raise', value: 'chinRaise' },
      // {text:'lip press', value:  'lipPress'},
      // {text:'lip suck', value:  'lipSuck'},
      { text: 'smirk', value: 'smirk' },
      { text: 'attention', value: 'attention' },
      { text: 'eyelid tighten', value: 'lidTighten' },
      { text: 'jaw drop', value: 'jawDrop' },
      { text: 'cheek dimple', value: 'dimpler' },
      { text: 'cheek raise', value: 'cheekRaise' },
      { text: 'lip stretch', value: 'lipStretch' }
    ];
    const handlerExpressions = expressions.map(expression => expression.value);

    type DefineExpressDetect = DefineBlock<PoseFace, Blocks["whenExpressionDetectedHat"]>;
    const whenExpressionDetectedHat: DefineExpressDetect = () => ({
      type: BlockType.Hat,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: expressions,
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      },
      text: (expression: string) => `when ${expression} detected`,
      operation: (expression: string, util) => {
        return true;
      }
    });

    type DefineAmountExpress = DefineBlock<PoseFace, Blocks["amountOfExpressionDetectedReport"]>;
    const amountOfExpressionDetectedReport: DefineAmountExpress = () => ({
      type: BlockType.Reporter,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: expressions,
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      },
      text: (expression: string) => `amount of ${expression}`,
      operation: (expression: string, util) => {
        return 0;
      }
    });

    type DefineExpressReport = DefineBlock<PoseFace, Blocks["isExpressionReport"]>;
    const isExpressionReport: DefineExpressReport = () => ({
      type: BlockType.Reporter,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: expressions,
          handler: (expression: string) => {
            return handlerExpressions.includes(expression) ? expression : 'smile';
          }
        }
      },
      text: (expression: string) => `expressing ${expression}`,
      operation: (expression: string, util) => {
        return true;
      }
    });

    // EMOTION BLOCKS

    const emotions = [
      { text: 'joyful', value: 'joy' },
      { text: 'sad', value: 'sadness' },
      { text: 'disgusted', value: 'disgust' },
      { text: 'angry', value: 'anger' },
      { text: 'fearful', value: 'fear' }
    ];
    const handlerEmotionsShort = emotions.map(emotion => emotion.value);

    const emotions2 = [
      { text: 'contempt', value: 'contempt' },
      { text: 'surprise', value: 'surprise' },
      { text: 'valence', value: 'valence' },
      { text: 'engagement', value: 'engagement' }
    ];
    const allEmotionValues = emotions.concat(emotions2).map(emotion => emotion.value);

    type DefineFeelingDetect = DefineBlock<PoseFace, Blocks["whenFeelingDetectedHat"]>;
    const whenFeelingDetectedHat: DefineFeelingDetect = () => ({
      type: BlockType.Hat,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: emotions,
          handler: (emotion: string) => {
            return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
          }
        }
      },
      text: (emotion: string) => `when ${emotion} feeling detected`,
      operation: (emotion: string, util) => {
        return true;
      }
    });

    type DefineLevelFeeling = DefineBlock<PoseFace, Blocks["levelOfFeelingReport"]>;
    const levelOfFeelingReport: DefineLevelFeeling = () => ({
      type: BlockType.Reporter,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: allEmotionValues,
          handler: (emotion: string) => {
            return allEmotionValues.includes(emotion) ? emotion : 'joy';
          }
        }
      },
      text: (emotion: string) => `level of ${emotion}`,
      operation: (emotion: string, util) => {
        return 0;
      }
    });

    type DefineIsFeeling = DefineBlock<PoseFace, Blocks["isFeelingReport"]>;
    const isFeelingReport: DefineIsFeeling = () => ({
      type: BlockType.Reporter,
      arg: {
        type: ArgumentType.String,
        options: {
          acceptsReporters: true,
          items: emotions,
          handler: (emotion: string) => {
            return handlerEmotionsShort.includes(emotion) ? emotion : 'joy';
          }
        }
      },
      text: (emotion: string) => `feeling ${emotion}`,
      operation: (emotion: string, util) => {
        return true;
      }
    });

    // VIDEO BLOCKS

    type DefineVideoToggle = DefineBlock<PoseFace, Blocks["videoToggleBlock"]>;
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

    type DefineSetVideoTransparency = DefineBlock<PoseFace, Blocks["setVideoTransparencyBlock"]>;
    const setVideoTransparencyBlock: DefineSetVideoTransparency = () => ({
      type: BlockType.Command,
      arg: { type: ArgumentType.Number, defaultValue: 50 },
      text: (transparency: number) => `set video transparency to ${transparency}`,
      operation: (transparency: number) => {
        this.setVideoTransparency(transparency);
      }
    });

    return {
      goToFacePartCommand,
      whenExpressionDetectedHat,
      amountOfExpressionDetectedReport,
      isExpressionReport,
      whenFeelingDetectedHat,
      levelOfFeelingReport,
      isFeelingReport,
      videoToggleBlock,
      setVideoTransparencyBlock
    }
  }
}
