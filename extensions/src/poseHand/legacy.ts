import { legacy } from "$common";
export const info = {
  "id": "poseHand",
  "name": "Hand Sensing",
  "showStatusButton": true,
  "blocks": [
    {
      "opcode": "goToHandPart",
      "text": "go to [HAND_PART] [HAND_SUB_PART]",
      "blockType": "command",
      "isTerminal": false,
      "arguments": {
        "HAND_PART": {
          "type": "string",
          "defaultValue": "thumb",
          "menu": "HAND_PART"
        },
        "HAND_SUB_PART": {
          "type": "number",
          "defaultValue": 3,
          "menu": "HAND_SUB_PART"
        }
      }
    },
    {
      "opcode": "returnHandPart",
      "text": "get [COORD] from [HAND_PART] [HAND_SUB_PART]",
      "blockType": "reporter",
      "isTerminal": false,
      "arguments": {
        "COORD": {
          "type": "string",
          "defaultValue": "x",
          "menu": "COORD"
        },
        "HAND_PART": {
          "type": "string",
          "defaultValue": "thumb",
          "menu": "HAND_PART"
        },
        "HAND_SUB_PART": {
          "type": "number",
          "defaultValue": 3,
          "menu": "HAND_SUB_PART"
        }
      }
    },
    {
      "opcode": "videoToggle",
      "text": "turn video [VIDEO_STATE]",
      "arguments": {
        "VIDEO_STATE": {
          "type": "string",
          "menu": "VIDEO_STATE",
          "defaultValue": "off"
        }
      },
      "blockType": "command"
    },
    {
      "opcode": "setVideoTransparency",
      "text": "set video transparency to [TRANSPARENCY]",
      "arguments": {
        "TRANSPARENCY": {
          "type": "number",
          "defaultValue": 50
        }
      },
      "blockType": "command"
    }
  ],
  "menus": {
    "HAND_PART": {
      "acceptReporters": true,
      "items": [
        {
          "text": "thumb",
          "value": "thumb"
        },
        {
          "text": "index finger",
          "value": "indexFinger"
        },
        {
          "text": "middle finger",
          "value": "middleFinger"
        },
        {
          "text": "ring finger",
          "value": "ringFinger"
        },
        {
          "text": "pinky",
          "value": "pinky"
        }
      ]
    },
    "HAND_SUB_PART": {
      "acceptReporters": true,
      "items": [
        {
          "text": "base",
          "value": 0
        },
        {
          "text": "first knuckle",
          "value": 1
        },
        {
          "text": "second knuckle",
          "value": 2
        },
        {
          "text": "tip",
          "value": 3
        }
      ]
    },
    "ATTRIBUTE": {
      "acceptReporters": true,
      "items": [
        {
          "text": "motion",
          "value": "motion"
        },
        {
          "text": "direction",
          "value": "direction"
        }
      ]
    },
    "SUBJECT": {
      "acceptReporters": true,
      "items": [
        {
          "text": "sprite",
          "value": "this sprite"
        },
        {
          "text": "stage",
          "value": "Stage"
        }
      ]
    },
    "COORD": {
      "acceptReporters": false,
      "items": [
        {
          "text": "x",
          "value": "x"
        },
        {
          "text": "y",
          "value": "y"
        }
      ]
    },
    "VIDEO_STATE": {
      "acceptReporters": true,
      "items": [
        {
          "text": "off",
          "value": "off"
        },
        {
          "text": "on",
          "value": "on"
        },
        {
          "text": "on flipped",
          "value": "on-flipped"
        }
      ]
    }
  }
} as const;
export const legacyFullSupport = legacy(info);
export const legacyIncrementalSupport = legacy(info, {"incrementalDevelopment":true});