import { Environment, extension, ExtensionMenuDisplayDetails, block } from "$common";
import { legacyFullSupport, info } from "./legacy";

const { legacyBlock } = legacyFullSupport.for<TextClassification>();

const details: ExtensionMenuDisplayDetails = { name: "Text Classification" };

export default class TextClassification extends extension(details, "legacySupport") {
  init(env: Environment): void { }

  labels: string[];

  protected getLegacyInfo() { return info }

  @legacyBlock.ifTextMatchesClass((self) => ({
    argumentMethods: {
      1: { getItems: () => self.labels }
    }
  }))
  ifTextMatchesClass(text: string, className: string) {
    return true;
  }

  @legacyBlock.getModelPrediction()
  getModelPrediction(text: string) {
    return "";
  }

  @legacyBlock.getModelConfidence()
  getModelConfidence(text: string) {
    return 0;
  }

  @legacyBlock.confidenceTrue({
    argumentMethods: {
      1: {
        handler: (reported) => {
          const toxicitylabels = info.menus.toxicitylabels.items;
          // check for if this should be value or text
          if (toxicitylabels.some(({ value }) => value === reported)) return reported as string;
          return toxicitylabels[0].value;
        }
      }
    }
  })
  confidenceTrue(text: string, toxicityLabel: string) {
    return 0;
  }

  @legacyBlock.sentimentScore()
  sentimentScore(text: string) {
    return 0;
  }

  @legacyBlock.speakText()
  speakText(text: string) {

  }

  @legacyBlock.askSpeechRecognition()
  askSpeechRecognition(prompt: string) {

  }

  @legacyBlock.getRecognizedSpeech()
  getRecognizedSpeech() {
    return "";
  }

  @legacyBlock.setVoice({
    argumentMethods: {
      0: {
        handler: (reported) => {
          const voices = info.menus.voices.items;
          // check for if this should be value or text
          if (voices.some(({ value }) => value === reported)) return reported as string;
          return voices[0].value;
        }
      }
    }
  })
  setVoice(voice: string) {

  }

  @legacyBlock.onHeardSound()
  onHeardSound(threshold: number) {
    return true;
  }
}
