import { extractLegacySupportFromGetInfo, mockFormatMessage as formatMessage, BlockType, ArgumentType } from "$common";

export default extractLegacySupportFromGetInfo({
  blocks: [
    {
      opcode: 'goToHandPart',
      text: 'go to [HAND_PART] [HAND_SUB_PART]',
      blockType: BlockType.Command,
      isTerminal: false,
      arguments: {
        HAND_PART: {
          type: ArgumentType.String,
          defaultValue: 'thumb',
          menu: 'HAND_PART'
        },
        HAND_SUB_PART: {
          type: ArgumentType.Number,
          defaultValue: 3,
          menu: 'HAND_SUB_PART'
        },
      },
    },
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
          defaultValue: 1
        }
      }
    },
    {
      blockType: BlockType.Command,
      opcode: 'setVideoTransparency',
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
    HAND_PART: {
      acceptReporters: true,
      items: [
        { text: 'thumb', value: 'thumb' },
        { text: 'index finger', value: 'indexFinger' },
        { text: 'middle finger', value: 'middleFinger' },
        { text: 'ring finger', value: 'ringFinger' },
        { text: 'pinky', value: 'pinky' },
        // {text: 'base of palm', value: 'palmBase'},
      ]
    },
    HAND_SUB_PART: {
      acceptReporters: true,
      items: [
        { text: 'base', value: 0 },
        { text: 'first knuckle', value: 1 },
        { text: 'second knuckle', value: 2 },
        { text: 'tip', value: 3 },
      ]
    },
    VIDEO_STATE: {
      acceptReporters: true,
      items: []
    }
  }
} as const);