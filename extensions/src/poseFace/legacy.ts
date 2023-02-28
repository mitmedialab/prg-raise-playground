import { legacy } from "$common";
export const info = {
  "id": "poseFace",
  "name": "Face Sensing",
  "showStatusButton": true,
  "blocks": [
    {
      "opcode": "affdexGoToPart",
      "text": "go to [AFFDEX_POINT]",
      "blockType": "command",
      "isTerminal": false,
      "arguments": {
        "AFFDEX_POINT": {
          "type": "string",
          "defaultValue": "0",
          "menu": "AFFDEX_POINT"
        }
      }
    },
    {
      "opcode": "affdexWhenExpression",
      "text": "when [EXPRESSION] detected",
      "blockType": "hat",
      "isTerminal": true,
      "arguments": {
        "EXPRESSION": {
          "type": "string",
          "defaultValue": "smile",
          "menu": "EXPRESSION"
        }
      }
    },
    {
      "opcode": "affdexExpressionAmount",
      "text": "amount of [EXPRESSION]",
      "blockType": "reporter",
      "isTerminal": true,
      "arguments": {
        "EXPRESSION": {
          "type": "string",
          "defaultValue": "smile",
          "menu": "EXPRESSION"
        }
      }
    },
    {
      "opcode": "affdexIsExpression",
      "text": "expressing [EXPRESSION]",
      "blockType": "Boolean",
      "isTerminal": true,
      "arguments": {
        "EXPRESSION": {
          "type": "string",
          "defaultValue": "smile",
          "menu": "EXPRESSION"
        }
      }
    },
    {
      "opcode": "affdexWhenEmotion",
      "text": "when [EMOTION] feeling detected",
      "blockType": "hat",
      "isTerminal": true,
      "arguments": {
        "EMOTION": {
          "type": "string",
          "defaultValue": "joy",
          "menu": "EMOTION"
        }
      }
    },
    {
      "opcode": "affdexEmotionAmount",
      "text": "level of [EMOTION_ALL]",
      "blockType": "reporter",
      "isTerminal": true,
      "arguments": {
        "EMOTION_ALL": {
          "type": "string",
          "defaultValue": "joy",
          "menu": "EMOTION_ALL"
        }
      }
    },
    {
      "opcode": "affdexIsTopEmotion",
      "text": "feeling [EMOTION]",
      "blockType": "Boolean",
      "isTerminal": true,
      "arguments": {
        "EMOTION": {
          "type": "string",
          "defaultValue": "joy",
          "menu": "EMOTION"
        }
      }
    },
    {
      "opcode": "videoToggle",
      "text": "turn video [VIDEO_STATE]",
      "arguments": {
        "VIDEO_STATE": {
          "type": "number",
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
    "AFFDEX_POINT": {
      "items": [
        {
          "text": "left ear",
          "value": "0"
        },
        {
          "text": "left chin",
          "value": "1"
        },
        {
          "text": "chin",
          "value": "2"
        },
        {
          "text": "right chin",
          "value": "3"
        },
        {
          "text": "right ear",
          "value": "4"
        },
        {
          "text": "left outer eyebrow",
          "value": "5"
        },
        {
          "text": "left eyebrow",
          "value": "6"
        },
        {
          "text": "left inner eyebrow",
          "value": "7"
        },
        {
          "text": "right inner eyebrow",
          "value": "8"
        },
        {
          "text": "right eyebrow",
          "value": "9"
        },
        {
          "text": "right outer eyebrow",
          "value": "10"
        },
        {
          "text": "nose bridge",
          "value": "11"
        },
        {
          "text": "nose tip",
          "value": "12"
        },
        {
          "text": "left nostril",
          "value": "13"
        },
        {
          "text": "nose tip",
          "value": "14"
        },
        {
          "text": "right nostril",
          "value": "15"
        },
        {
          "text": "left outer eye crease",
          "value": "16"
        },
        {
          "text": "left inner eye crease",
          "value": "17"
        },
        {
          "text": "right inner eye crease",
          "value": "18"
        },
        {
          "text": "right outer eye crease",
          "value": "19"
        },
        {
          "text": "left mouth crease",
          "value": "20"
        },
        {
          "text": "left upper lip point",
          "value": "21"
        },
        {
          "text": "upper lip",
          "value": "22"
        },
        {
          "text": "right upper lip point",
          "value": "23"
        },
        {
          "text": "right mouth crease",
          "value": "24"
        },
        {
          "text": "right lower lip point",
          "value": "25"
        },
        {
          "text": "lower lip",
          "value": "26"
        },
        {
          "text": "left lower lip point",
          "value": "27"
        },
        {
          "text": "upper lip bottom",
          "value": "28"
        },
        {
          "text": "lower lip top",
          "value": "29"
        },
        {
          "text": "left upper eyelid",
          "value": "30"
        },
        {
          "text": "left lower eyelid",
          "value": "31"
        },
        {
          "text": "right upper eyelid",
          "value": "32"
        },
        {
          "text": "right lower eyelid",
          "value": "33"
        }
      ],
      "acceptReporters": false
    },
    "EMOTION": {
      "acceptReporters": true,
      "items": [
        {
          "text": "joyful",
          "value": "joy"
        },
        {
          "text": "sad",
          "value": "sadness"
        },
        {
          "text": "disgusted",
          "value": "disgust"
        },
        {
          "text": "angry",
          "value": "anger"
        },
        {
          "text": "fearful",
          "value": "fear"
        }
      ]
    },
    "EXPRESSION": {
      "acceptReporters": true,
      "items": [
        {
          "text": "smile",
          "value": "smile"
        },
        {
          "text": "mouth open",
          "value": "mouthOpen"
        },
        {
          "text": "eye closure",
          "value": "eyeClosure"
        },
        {
          "text": "eyebrow raise",
          "value": "browRaise"
        },
        {
          "text": "whistling",
          "value": "lipPucker"
        },
        {
          "text": "eye widening",
          "value": "eyeWiden"
        },
        {
          "text": "eyebrow furrow",
          "value": "browFurrow"
        },
        {
          "text": "nose wrinkle",
          "value": "noseWrinkle"
        },
        {
          "text": "upper lip raise",
          "value": "upperLipRaise"
        },
        {
          "text": "lip corner pull",
          "value": "lipCornerDepressor"
        },
        {
          "text": "chin raise",
          "value": "chinRaise"
        },
        {
          "text": "smirk",
          "value": "smirk"
        },
        {
          "text": "attention",
          "value": "attention"
        },
        {
          "text": "eyelid tighten",
          "value": "lidTighten"
        },
        {
          "text": "jaw drop",
          "value": "jawDrop"
        },
        {
          "text": "cheek dimple",
          "value": "dimpler"
        },
        {
          "text": "cheek raise",
          "value": "cheekRaise"
        },
        {
          "text": "lip stretch",
          "value": "lipStretch"
        }
      ]
    },
    "EMOTION_ALL": {
      "acceptReporters": true,
      "items": [
        {
          "text": "joy",
          "value": "joy"
        },
        {
          "text": "sadness",
          "value": "sadness"
        },
        {
          "text": "disgust",
          "value": "disgust"
        },
        {
          "text": "contempt",
          "value": "contempt"
        },
        {
          "text": "anger",
          "value": "anger"
        },
        {
          "text": "fear",
          "value": "fear"
        },
        {
          "text": "surprise",
          "value": "surprise"
        },
        {
          "text": "valence",
          "value": "valence"
        },
        {
          "text": "engagement",
          "value": "engagement"
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
export const legacyFullSupport = legacy(info).for;
export const legacyIncrementalSupport = legacy(info, { "incrementalDevelopment": true }).for;