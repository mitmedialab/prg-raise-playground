import { legacy } from "$common";
export const info = {
  "id": "poseBody",
  "name": "Body Pose Sensing",
  "showStatusButton": true,
  "blocks": [
    {
      "opcode": "goToPart",
      "text": "go to [PART]",
      "blockType": "command",
      "isTerminal": false,
      "arguments": {
        "PART": {
          "type": "string",
          "defaultValue": "rightShoulder",
          "menu": "PART"
        }
      }
    },
    {
      "opcode": "returnPart",
      "text": "get [COORD] of [PART]",
      "blockType": "reporter",
      "isTerminal": false,
      "arguments": {
        "COORD": {
          "type": "string",
          "defaultValue": "x",
          "menu": "COORD"
        },
        "PART": {
          "type": "string",
          "defaultValue": "rightShoulder",
          "menu": "PART"
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
    "PART": {
      "acceptReporters": true,
      "items": [
        {
          "text": "nose",
          "value": "nose"
        },
        {
          "text": "right eye",
          "value": "leftEye"
        },
        {
          "text": "left eye",
          "value": "rightEye"
        },
        {
          "text": "right ear",
          "value": "leftEar"
        },
        {
          "text": "left ear",
          "value": "rightEar"
        },
        {
          "text": "right shoulder",
          "value": "leftShoulder"
        },
        {
          "text": "left shoulder",
          "value": "rightShoulder"
        },
        {
          "text": "right elbow",
          "value": "leftElbow"
        },
        {
          "text": "left elbow",
          "value": "rightElbow"
        },
        {
          "text": "right wrist",
          "value": "leftWrist"
        },
        {
          "text": "left wrist",
          "value": "rightWrist"
        },
        {
          "text": "right hip",
          "value": "leftHip"
        },
        {
          "text": "left hip",
          "value": "rightHip"
        },
        {
          "text": "right knee",
          "value": "leftKnee"
        },
        {
          "text": "left knee",
          "value": "rightKnee"
        },
        {
          "text": "right ankle",
          "value": "leftAnkle"
        },
        {
          "text": "left ankle",
          "value": "rightAnkle"
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
export const legacyFullSupport = legacy(info);
export const legacyIncrementalSupport = legacy(info, {"incrementalDevelopment":true});