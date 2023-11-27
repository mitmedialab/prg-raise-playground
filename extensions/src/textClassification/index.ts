/// <reference types="dom-speech-recognition" />
import { Environment, extension, ExtensionMenuDisplayDetails, wrapClamp, fetchWithTimeout, RuntimeEvent, buttonBlock, } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { legacyFullSupport, info, } from "./legacy";
import { State, getState, setState, tryCopyStateToClone } from "./state";
import { getSynthesisURL } from "./services/synthesis";
import timer from "./timer";
import voices, { Voice } from "./voices";
import Sentiment from "sentiment";
import { ToxicityClassifier, load as loadToxicity } from "@tensorflow-models/toxicity";
import { getTranslationToEnglish } from "./services/translation";
import { Predictor, build, failure, success } from "./model";

const { legacyBlock, } = legacyFullSupport.for<TextClassification>();
const { toxicitylabels: { items: toxicityLabelItems }, voices: { items: voiceItems } } = info.menus;

const details: ExtensionMenuDisplayDetails = {
  name: "Text Classification",
  tags: ["Made by PRG"],
  insetIconURL: "icon.svg",
  iconURL: "menu.png",
  description: "Create a text classification model for use in a Scratch project!",
};

const defaultLabels = ["No labels"];

export default class TextClassification extends extension(details, "legacySupport", "ui", "indicators") {
  labels: string[] = [];
  lastRecognizedSpeech: string;
  currentLoudness: number;
  loudnessTimer = timer();
  soundPlayers = new Map();
  sentiment = new Sentiment();
  currentSentiment: ReturnType<Sentiment["analyze"]>;
  toxicityModel: ToxicityClassifier;
  customPredictor: Predictor["predict"];
  modelData = new Map<string, string[]>();
  currentModelIdentifier: symbol;

  async init(env: Environment) {
    const { soundPlayers } = this;
    env.runtime.on(RuntimeEvent.ProjectStopAll, function () {
      soundPlayers.forEach((soundPlayer) => soundPlayer.stop())
    });
    env.runtime.on(RuntimeEvent.TargetWasCreated, tryCopyStateToClone);
  }

  protected getLegacyInfo() { return info }
  protected getCurrentModelIdentifier() { return this.currentModelIdentifier }

  /** Begin Block Methods */

  @buttonBlock("Edit Model")
  editButton() { this.openUI("Editor", "Edit Text Model") }

  @buttonBlock("Load / Save Model")
  saveLoadButton() { this.openUI("ImportExport", "Save / Load Text Model") }

  @legacyBlock.ifTextMatchesClass((self) => ({
    argumentMethods: {
      1: {
        getItems: () => {
          const { labels } = self;
          return labels?.length > 0 ? labels : defaultLabels;
        }
      }
    }
  }))
  async ifTextMatchesClass(text: string, className: string) {
    const predictionState = await this.getEmbeddings(text);
    return predictionState && predictionState === className;
  }

  @legacyBlock.getModelPrediction()
  async getModelPrediction(text: string) {
    return await this.getEmbeddings(text);
  }

  @legacyBlock.getModelConfidence()
  async getModelConfidence(text: string) {
    const predictionConfidence = await this.getConfidence(text);
    return predictionConfidence;
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
    await this.speak(text, getState(target));
  }

  @legacyBlock.askSpeechRecognition()
  async askSpeechRecognition(prompt: string, { target }: BlockUtility) {
    await this.speak(prompt, getState(target));
    await this.recognizeSpeech();
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

          return voiceItems.find(({ value, text }) => value === reported || text === reported)?.value ?? "SQUEAK";
        }
      }
    }
  })
  setVoice(voice: Voice, { target }: BlockUtility) {
    const state = getState(target);
    state.currentVoice = voice ?? state.currentVoice;
    setState(target, state);
  }

  @legacyBlock.onHeardSound()
  onHeardSound(threshold: number) {
    return this.getLoudness() > threshold;
  }

  /** End Block Methods */

  /** Begin UI Methods */

  addLabel(label: string) {
    this.labels.push(label);
    this.modelData.set(label, new Array<string>());
  }

  deleteLabel(label: string, index: number) {
    this.labels.splice(index, 1);
    this.modelData.delete(label);
  }

  renameLabel(oldName: string, newName: string, index: number) {
    if (this.modelData.has(newName)) return alert(`Could not rename ${oldName} to ${newName}, as that label already exists`);
    this.labels[index] = newName;
    this.modelData.set(newName, this.modelData.get(oldName));
    this.modelData.delete(oldName);
  }

  clearLabels() {
    this.labels = [];
    this.modelData.clear();
  }

  async buildCustomDeepModel() {
    const indicator = await this.indicate({ msg: "wait .. loading model", type: "warning", });
    const identifier = Symbol();
    this.currentModelIdentifier = identifier;
    const isCurrent = () => this.currentModelIdentifier === identifier;
    const result = await build(this.labels, this.modelData, isCurrent);

    if (success(result)) {
      this.customPredictor = result.predict;
      indicator.close();
      await this.indicateFor({ msg: "The model is ready!" }, 2);
    }
    else if (failure(result)) {
      indicator.close();
      await this.indicateFor({ msg: result.error, type: "error", }, 2);
    }
  }

  importClassifier(file: File) {
    return new Promise<boolean>((resolve) => {
      if (!file) return resolve(false);
      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        console.log(result);
        try {
          const data = JSON.parse(result as string) as Record<string, string[]>;
          this.modelData = new Map(Object.entries(data));
          this.labels = [...this.modelData.keys()];
          resolve(true);
        } catch (err) {
          console.error(`Incorrect document form: ${file.name}: ${err}`);
          this.modelData = new Map();
          this.labels = [];
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }

  exportClassifier() {
    const serialized = JSON.stringify(Object.fromEntries(this.modelData));
    const data = `text/json;charset=utf-8,${encodeURIComponent(serialized)}`;
    const anchor = document.createElement('a');
    anchor.setAttribute("href", "data:" + data);
    anchor.setAttribute("download", "classifier-info.json");
    anchor.click();
  }

  /** End UI Methods */

  /** Begin Private Methods */

  private async speak(text: string, { currentVoice }: State) {
    const locale = 'en-US';
    const { audioEngine } = this.runtime;
    const { gender, playbackRate } = voices[currentVoice];
    const encoded = encodeURIComponent(text.substring(0, 128));
    const endpoint = getSynthesisURL({ gender, locale, text: encoded });

    await new Promise<void>(async (resolve) => {
      try {
        const response = await fetchWithTimeout(endpoint, { timeoutMs: 40000 });
        if (!response.ok) return console.warn(response.statusText);
        const buffer = await response.arrayBuffer();
        const soundPlayer = await audioEngine.decodeSoundPlayer({ data: { buffer } });
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

  private async getToxicityModel() {
    if (this.toxicityModel) return this.toxicityModel;
    const msg = await this.indicate({ msg: "Loading toxicity model", type: "warning", });
    try {
      this.toxicityModel = await loadToxicity(0.1, toxicityLabelItems.map(({ value }) => value));
      msg.close();
      this.indicateFor({ msg: "Toxicity model loaded!", type: "success", }, 2);
      return this.toxicityModel;
    }
    catch (error) {
      msg.close();
      this.indicateFor({ msg: "Failed to load toxicity model", type: "error", }, 2);
    }
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
      recognition.onresult =
        (event) => resolve(event.results.length === 0 ? null : event.results[0][0].transcript);
    });

    this.lastRecognizedSpeech = result ?? this.lastRecognizedSpeech;
    return result;
  }

  private async classifyText(text: string, label: string, returnPositive: boolean) {
    const model = await this.getToxicityModel();
    if (!model || !text || !label) return;
    try {
      const predictions = await model.classify([text]);

      const filtered = predictions
        .filter(prediction => prediction.label === label && prediction.results?.length > 0);

      return filtered?.length === 1
        ? Math.round(filtered[0].results[0].probabilities[returnPositive ? 1 : 0] * 100)
        : 0;
    }
    catch (error) { console.error('Failed to classify text', error); }
  }

  private async getConfidence(text: string) {
    const translation = await getTranslationToEnglish(text);
    const { score } = await this.customPredictor(translation);
    return score;
  }

  private async getEmbeddings(text) {
    const newText = await getTranslationToEnglish(text); //translates text from any language to english
    if (this.labels.length === 0 || !this.labels[0] || !this.customPredictor) return;
    const { label } = await this.customPredictor(newText);
    return label;
  }
}
