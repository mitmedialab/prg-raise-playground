import { Extension, ArgumentType, BlockType, Environment, extractLegacySupportFromOldGetInfo } from "$common";
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
      opcode: 'goToPart',
      text: 'go to [PART]',
      blockType: BlockType.Command,
      isTerminal: false,
      arguments: {
        PART: {
          type: ArgumentType.String,
          defaultValue: 'rightShoulder',
          menu: 'PART'
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
    PART: {
      acceptReporters: true,
      items: [
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