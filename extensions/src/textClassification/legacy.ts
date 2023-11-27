import { legacy } from "$common";
export const info = {
  "id": "textClassification",
  "name": "Text Classification",
  "blocks": [
    {
      "opcode": "ifTextMatchesClass",
      "text": "[TEXT] matches [CLASS_NAME] ?",
      "blockType": "Boolean",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "Enter text or answer block"
        },
        "CLASS_NAME": {
          "type": "string",
          "menu": "model_classes",
          "defaultValue": ""
        }
      }
    },
    {
      "opcode": "getModelPrediction",
      "text": "predict class for [TEXT]",
      "blockType": "reporter",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "Enter text or answer block"
        }
      }
    },
    {
      "opcode": "getModelConfidence",
      "text": "Confidence of predict class for [TEXT]",
      "blockType": "reporter",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "Enter text or answer block"
        }
      }
    },
    {
      "opcode": "confidenceTrue",
      "text": "probability that [TEXT] is [LABEL]",
      "blockType": "reporter",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "TEXT"
        },
        "LABEL": {
          "type": "string",
          "defaultValue": "toxicity",
          "menu": "toxicitylabels"
        }
      }
    },
    {
      "opcode": "sentimentScore",
      "text": "Sentiment Score for [TEXT]",
      "blockType": "reporter",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "TEXT"
        }
      }
    },
    {
      "opcode": "speakText",
      "text": "speak [TEXT]",
      "blockType": "command",
      "arguments": {
        "TEXT": {
          "type": "string",
          "defaultValue": "Hello"
        }
      }
    },
    {
      "opcode": "askSpeechRecognition",
      "text": "speak [PROMPT] then listen for response",
      "blockType": "command",
      "arguments": {
        "PROMPT": {
          "type": "string",
          "defaultValue": "How are you?"
        }
      }
    },
    {
      "opcode": "getRecognizedSpeech",
      "text": "response",
      "blockType": "reporter"
    },
    {
      "opcode": "setVoice",
      "text": "set voice to [VOICE]",
      "blockType": "command",
      "arguments": {
        "VOICE": {
          "type": "string",
          "menu": "voices",
          "defaultValue": "SQUEAK"
        }
      }
    },
    {
      "opcode": "onHeardSound",
      "text": "when heard sound > [THRESHOLD]",
      "blockType": "hat",
      "arguments": {
        "THRESHOLD": {
          "type": "number",
          "defaultValue": 10
        }
      }
    }
  ],
  "menus": {
    "voices": {
      "acceptReporters": true,
      "items": [
        {
          "text": "squeak",
          "value": "SQUEAK"
        },
        {
          "text": "tenor",
          "value": "TENOR"
        },
        {
          "text": "alto",
          "value": "ALTO"
        },
        {
          "text": "giant",
          "value": "GIANT"
        }
      ]
    },
    "model_classes": {
      "acceptReporters": false,
      "items": "getLabels"
    },
    "toxicitylabels": {
      "items": [
        {
          "value": "toxicity",
          "text": "toxic"
        },
        {
          "value": "severe_toxicity",
          "text": "severely toxic"
        },
        {
          "value": "identity_attack",
          "text": "an identity-based attack"
        },
        {
          "value": "insult",
          "text": "insulting"
        },
        {
          "value": "threat",
          "text": "threatening"
        },
        {
          "value": "obscene",
          "text": "profanity"
        }
      ],
      "acceptReporters": true
    }
  }
} as const;
export const legacyFullSupport = legacy(info);
export const legacyIncrementalSupport = legacy(info, { "incrementalDevelopment": true });