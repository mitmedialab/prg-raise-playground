/// <reference types="dom-speech-recognition" />
import { Environment, extension, ExtensionMenuDisplayDetails, block, wrapClamp, fetchWithTimeout, RuntimeEvent } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { legacyFullSupport, info } from "./legacy";
import { getState, setState, tryCopyStateToClone } from "./state";
import { getSynthesisURL } from "./services/synthesis";
import timer from "./timer";
import voices, { Voice } from "./voices";
import Sentiment from "sentiment";
import toxicity, { ToxicityClassifier } from "@tensorflow-models/toxicity";

const { legacyBlock } = legacyFullSupport.for<TextClassification>();
const { toxicitylabels: { items: toxicityLabelItems }, voices: { items: voiceItems } } = info.menus;

const details: ExtensionMenuDisplayDetails = { name: "Text Classification" };

export default class TextClassification extends extension(details, "legacySupport") {
  labels: string[];
  lastRecognizedSpeech: string;
  currentLoudness: number;
  loudnessTimer = timer();
  soundPlayers = new Map();
  sentiment = new Sentiment();
  currentSentiment: ReturnType<Sentiment["analyze"]>;
  toxicityModel: ToxicityClassifier;

  async init(env: Environment) {
    const { soundPlayers } = this;
    env.runtime.on(RuntimeEvent.ProjectStopAll, function () {
      soundPlayers.forEach((soundPlayer) => soundPlayer.stop())
    });
    env.runtime.on(RuntimeEvent.TargetWasCreated, tryCopyStateToClone);
    const threshold = 0.1;
    try {
      this.toxicityModel = await toxicity.load(threshold, toxicityLabelItems.map(({ value }) => value));
      console.log('loaded Toxicity model');
    }
    catch (error) {
      console.log('Failed to load toxicity model', error);
    }
  }

  onTargetCreated(newTarget, sourceTarget) {
    if (!sourceTarget) return; // not a clone
    const sourceState = getState(sourceTarget);
    if (!sourceState) return;
    setState(newTarget, { currentVoice: sourceState.currentVoice });
  }

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
        handler: (reported) => toxicityLabelItems
          .find(({ value, text }) => value === reported || text === reported)?.value
          ?? toxicityLabelItems[0].value
      }
    }
  })
  confidenceTrue(text: string, toxicityLabel: string) {
    return this.classifyText(text, toxicityLabel, true);
  }

  @legacyBlock.sentimentScore()
  sentimentScore(text: string) {
    this.currentSentiment = this.sentiment.analyze(text);
    return this.currentSentiment.comparative;
  }

  @legacyBlock.speakText()
  async speakText(text: string, { target }: BlockUtility) {
    const locale = 'en-US';
    const { audioEngine } = this.runtime;
    const { currentVoice } = getState(target);
    const { gender, playbackRate } = voices[currentVoice];
    const encoded = encodeURIComponent(JSON.stringify(text).substring(0, 128));
    const endpoint = getSynthesisURL({ gender, locale, text: encoded });

    await new Promise<void>(async (resolve) => {
      try {
        const response = await fetchWithTimeout(endpoint, { timeout: 40 });
        if (!response.ok) return console.warn(response.statusText);
        const sound = { data: response.body as unknown as Buffer };
        const soundPlayer = await audioEngine.decodeSoundPlayer(sound);
        this.soundPlayers.set(soundPlayer.id, soundPlayer);
        soundPlayer.setPlaybackRate(playbackRate);
        const chain = audioEngine.createEffectChain();
        chain.set('volume', 250);
        soundPlayer.connect(chain);
        soundPlayer.play();
        soundPlayer.on('stop', () => {
          this.soundPlayers.delete(soundPlayer.id);
          resolve();
        });
      }
      catch (error) {
        console.warn(error);
      }
    });
  }

  @legacyBlock.askSpeechRecognition()
  async askSpeechRecognition(prompt: string, util: BlockUtility) {
    await this.speakText(prompt, util);
    return this.recognizeSpeech();
  }

  @legacyBlock.getRecognizedSpeech()
  getRecognizedSpeech() {
    return this.lastRecognizedSpeech;
  }

  @legacyBlock.setVoice({
    argumentMethods: {
      0: {
        handler: (reported) => {
          const numberInput = parseInt(JSON.stringify(reported), 10);
          if (!isNaN(numberInput)) {
            const voiceIndex = wrapClamp(numberInput - 1, 0, voiceItems.length - 1);
            return voiceItems[voiceIndex].value;
          }

          return voiceItems.find(({ value, text }) => value === reported || text === reported)?.value
        }
      }
    }
  })
  setVoice(voice: Voice, { target }: BlockUtility) {
    const state = getState(target);
    state.currentVoice = voice ?? state.currentVoice;
  }

  @legacyBlock.onHeardSound()
  onHeardSound(threshold: number) {
    return this.getLoudness() > threshold;
  }

  private getLoudness() {
    const { audioEngine, currentStepTime } = this.runtime;
    if (!audioEngine || !currentStepTime) return -1;

    if (this.loudnessTimer.elapsed() > this.runtime.currentStepTime) {
      this.currentLoudness = audioEngine.getLoudness();
      this.loudnessTimer.start();
    }

    return this.currentLoudness;
  }

  private async recognizeSpeech() {
    const recognition = new webkitSpeechRecognition();

    const result = await new Promise<string>(resolve => {
      recognition.start();
      recognition.onresult = function (event) {
        if (event.results.length === 0) resolve(null);
        resolve(event.results[0][0].transcript);
      };
    });

    this.lastRecognizedSpeech = result ?? this.lastRecognizedSpeech;
    return result;
  }

  private async classifyText(text: string, label: string, returnPositive: boolean) {
    const { toxicityModel } = this;
    if (!this.toxicityModel || !text || !label) return;
    try {
      const predictions = await toxicityModel.classify([text]);

      const filtered = predictions
        .filter(prediction => prediction.label === label && prediction.results?.length > 0);

      return filtered?.length === 1
        ? Math.round(filtered[0].results[0].probabilities[returnPositive ? 1 : 0] * 100)
        : 0;
    }
    catch (error) {
      console.log('Failed to classify text', error);
    }
  }

}
