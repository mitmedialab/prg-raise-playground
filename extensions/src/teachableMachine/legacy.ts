import { legacy } from "$common";
export const info = {
  "id": "teachableMachine",
  "name": "Teachable Machine",
  "showStatusButton": true,
  "blocks": [
    {
      "opcode": "openTeachableMachine",
      "func": "OPEN_TEACHABLE_MACHINE",
      "blockType": "button",
      "text": "Teachable Machine Site ↗"
    },
    {
      "opcode": "useModelBlock",
      "text": "use model [MODEL_URL]",
      "arguments": {
        "MODEL_URL": {
          "type": "string",
          // "defaultValue": "https://teachablemachine.withgoogle.com/models/knrpLxv8N/"
          "defaultValue": "Paste URL here!"
        }
      },
      "blockType": "command"
    },
    {
      "opcode": "whenModelMatches",
      "text": "when model detects [CLASS_NAME]",
      "blockType": "hat",
      "arguments": {
        "CLASS_NAME": {
          "type": "string",
          // "defaultValue": "Class 1",
          "defaultValue": "Select a class",
          "menu": "CLASS_NAME"
        }
      }
    },
    {
      "opcode": "modelPrediction",
      "text": "model prediction",
      "blockType": "reporter",
      "isTerminal": true
    },
    {
      "opcode": "modelMatches",
      "text": "prediction is [CLASS_NAME]",
      "blockType": "Boolean",
      "arguments": {
        "CLASS_NAME": {
          "type": "string",
          // "defaultValue": "Class 1",
          "defaultValue": "Select a class",
          "menu": "CLASS_NAME"
        }
      }
    },
    {
      "opcode": "classConfidence",
      "text": "confidence for [CLASS_NAME]",
      "blockType": "reporter",
      "isTerminal": true,
      "arguments": {
        "CLASS_NAME": {
          "type": "string",
          // "defaultValue": "Class 1",
          "defaultValue": "Select a class",
          "menu": "CLASS_NAME"
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
          "defaultValue": "on"
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
    "CLASS_NAME": "getCurrentClasses",
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
export const legacyIncrementalSupport = legacy(info, { "incrementalDevelopment": true });