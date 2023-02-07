import { ArgumentType, BlockType, extractLegacySupportFromOldGetInfo } from "$common";
import { mockFormatMessage as formatMessage } from "$common";


/**
 * Copy and paste over the of the object returned by the old extension's 'getInfo' method 
 * (making the necessary changes outlined below, and note that only the 'blocks' and 'menus' fields are required)
 * and pass it as an argument to the 'extractLegacySupportFromOldGetInfo' function.
 * If you're doing this in a seperate file from your Extension, make sure to export the return value.
 * NOTE: The object makes use of the 'as const' assertion applied to the argument object 
 * (see below, at the end of the function call).
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
 */
export default extractLegacySupportFromOldGetInfo({
  blocks: [
    {
      opcode: 'affdexGoToPart',
      text: 'go to [AFFDEX_POINT]',
      blockType: BlockType.Command,
      isTerminal: false,
      arguments: {
        AFFDEX_POINT: {
          type: ArgumentType.Number,
          defaultValue: 0,
          menu: 'AFFDEX_POINT'
        },
      },
    },
    //'---',
    {
      opcode: 'affdexWhenExpression',
      text: 'when [EXPRESSION] detected',
      blockType: BlockType.Hat,
      isTerminal: true,
      arguments: {
        EXPRESSION: {
          type: ArgumentType.String,
          defaultValue: 'smile',
          menu: 'EXPRESSION'
        },
      }
    },
    {
      opcode: 'affdexExpressionAmount',
      text: 'amount of [EXPRESSION]',
      blockType: BlockType.Reporter,
      isTerminal: true,
      arguments: {
        EXPRESSION: {
          type: ArgumentType.String,
          defaultValue: 'smile',
          menu: 'EXPRESSION'
        },
      }
    },
    {
      opcode: 'affdexIsExpression',
      text: 'expressing [EXPRESSION]',
      blockType: BlockType.Boolean,
      isTerminal: true,
      arguments: {
        EXPRESSION: {
          type: ArgumentType.String,
          defaultValue: 'smile',
          menu: 'EXPRESSION'
        },
      }
    },
    //'---',
    {
      opcode: 'affdexWhenEmotion',
      text: 'when [EMOTION] feeling detected',
      blockType: BlockType.Hat,
      isTerminal: true,
      arguments: {
        EMOTION: {
          type: ArgumentType.String,
          defaultValue: 'joy',
          menu: 'EMOTION'
        },
      }
    },
    {
      opcode: 'affdexEmotionAmount',
      text: 'level of [EMOTION_ALL]',
      blockType: BlockType.Reporter,
      isTerminal: true,
      arguments: {
        EMOTION_ALL: {
          type: ArgumentType.String,
          defaultValue: 'joy',
          menu: 'EMOTION_ALL'
        },
      },
    },
    {
      opcode: 'affdexIsTopEmotion',
      text: 'feeling [EMOTION]',
      blockType: BlockType.Boolean,
      isTerminal: true,
      arguments: {
        EMOTION: {
          type: ArgumentType.String,
          defaultValue: 'joy',
          menu: 'EMOTION'
        },
      },
    },
    //'---',
    {
      opcode: 'videoToggle',
      blockType: BlockType.Command,
      text: formatMessage({
        id: 'videoSensing.videoToggle',
        default: 'turn video [VIDEO_STATE]',
        description: 'Controls display of the video preview layer'
      }),
      arguments: {
        VIDEO_STATE: {
          type: ArgumentType.Number,
          menu: 'VIDEO_STATE',
          defaultValue: 0
        }
      }
    },
    {
      opcode: 'setVideoTransparency',
      blockType: BlockType.Command,
      text: formatMessage({
        id: 'videoSensing.setVideoTransparency',
        default: 'set video transparency to [TRANSPARENCY]',
        description: 'Controls transparency of the video preview layer'
      }),
      arguments: {
        TRANSPARENCY: {
          type: ArgumentType.Number,
          defaultValue: 50
        }
      }
    },
  ],
  menus: {
    AFFDEX_POINT: {
      acceptReporters: false,
      items: [
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
      ]
    },
    EMOTION: {
      acceptReporters: true,
      items: [
        { text: 'joyful', value: 'joy' },
        { text: 'sad', value: 'sadness' },
        { text: 'disgusted', value: 'disgust' },
        // {text: 'contempt', value: 'contempt'},
        { text: 'angry', value: 'anger' },
        { text: 'fearful', value: 'fear' },
        // {text: 'surprise', value: 'surprise'},
        // {text: 'valence', value: 'valence'},
        // {text: 'engagement', value: 'engagement'},
      ]
    },
    EXPRESSION: {
      acceptReporters: true,
      items: [
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
        { text: 'lip stretch', value: 'lipStretch' },
      ]
    },
    EMOTION_ALL: {
      acceptReporters: true,
      items: [
        { text: 'joy', value: 'joy' },
        { text: 'sadness', value: 'sadness' },
        { text: 'disgust', value: 'disgust' },
        { text: 'contempt', value: 'contempt' },
        { text: 'anger', value: 'anger' },
        { text: 'fear', value: 'fear' },
        { text: 'surprise', value: 'surprise' },
        { text: 'valence', value: 'valence' },
        { text: 'engagement', value: 'engagement' },
      ]
    },
    ATTRIBUTE: {
      acceptReporters: true,
      items: [
        {
          text: formatMessage({
            id: 'videoSensing.motion',
            default: 'motion',
            description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
          }),
          value: 'motion'
        },
        {
          text: formatMessage({
            id: 'videoSensing.direction',
            default: 'direction',
            description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
          }),
          value: 'direction'
        }
      ]
    },
    SUBJECT: {
      acceptReporters: true,
      items: [
        {
          text: formatMessage({
            id: 'videoSensing.sprite',
            default: 'sprite',
            description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
          }),
          value: 'this sprite'
        },
        {
          text: formatMessage({
            id: 'videoSensing.stage',
            default: 'stage',
            description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
          }),
          value: 'Stage'
        }
      ]
    },
    VIDEO_STATE: {
      acceptReporters: true,
      items: [
        {
          text: formatMessage({
            id: 'videoSensing.off',
            default: 'off',
            description: 'Option for the "turn video [STATE]" block'
          }),
          value: 0
        },
        {
          text: formatMessage({
            id: 'videoSensing.on',
            default: 'on',
            description: 'Option for the "turn video [STATE]" block'
          }),
          value: 1
        },
        {
          text: formatMessage({
            id: 'videoSensing.onFlipped',
            default: 'on and flipped',
            description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
              ' horizontally (reversed as in a mirror)'
          }),
          value: 2
        }
      ]
    }
  },
} as const); // VERY IMPORTANT! Note the use of 'as const' on the object passed to the function

/**
 * By using 'as const', 
 * we ensure typescript is able to extract as much information from the old getInfo object as possible
 */


