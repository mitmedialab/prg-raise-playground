/// <reference types="dom-speech-recognition" />
import { Environment, extension, ExtensionMenuDisplayDetails, block, wrapClamp, fetchWithTimeout, RuntimeEvent, buttonBlock } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { legacyFullSupport, info, } from "./legacy";
import { getState, setState, tryCopyStateToClone } from "./state";
import { getSynthesisURL } from "./services/synthesis";
import timer from "./timer";
import voices, { Voice } from "./voices";
import Sentiment from "sentiment";
import { ToxicityClassifier, load as loadToxicity } from "@tensorflow-models/toxicity";
import { load as loadEncoder } from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { getTranslationToEnglish } from "./services/translation";

const { legacyBlock, } = legacyFullSupport.for<TextClassification>();
const { toxicitylabels: { items: toxicityLabelItems }, voices: { items: voiceItems } } = info.menus;

const details: ExtensionMenuDisplayDetails = {
  name: "Text Classification",
  tags: ["Made by PRG"],
  insetIconURL: "icon.svg",
  iconURL: "menu.png",
  description: "Create a text classification model for use in a Scratch project!",
};

const defaultLabel = "No labels";

export default class TextClassification extends extension(details, "legacySupport", "ui") {
  labels: string[] = [];
  lastRecognizedSpeech: string;
  currentLoudness: number;
  loudnessTimer = timer();
  soundPlayers = new Map();
  sentiment = new Sentiment();
  currentSentiment: ReturnType<Sentiment["analyze"]>;
  toxicityModel: ToxicityClassifier;
  currentClassificationInput: string;
  prediction = { label: 0, class: "", score: 0 };
  customLanguageModel: tf.Sequential;

  modelData = new Map<string, string[]>();

  async init(env: Environment) {
    const { soundPlayers } = this;
    env.runtime.on(RuntimeEvent.ProjectStopAll, function () {
      soundPlayers.forEach((soundPlayer) => soundPlayer.stop())
    });
    env.runtime.on(RuntimeEvent.TargetWasCreated, tryCopyStateToClone);
    const threshold = 0.1;
    try {
      //this.toxicityModel = await loadToxicity(threshold, toxicityLabelItems.map(({ value }) => value));
      console.log('loaded Toxicity model');
    }
    catch (error) {
      console.log('Failed to load toxicity model', error);
    }
  }

  protected getLegacyInfo() { return info }

  @buttonBlock("Edit Model")
  editButton() { this.openUI("Editor", "Edit Text Model") }

  @legacyBlock.ifTextMatchesClass((self) => ({
    argumentMethods: {
      1: {
        getItems: () => {
          const { labels } = self;
          return labels?.length > 0 ? labels : [defaultLabel];
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
    this.recognizeSpeech();
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

  private async getConfidence(text: string) {
    const translation = await getTranslationToEnglish(text);
    await this.predictScore(translation);
    return this.prediction.score;
  }

  /**
    * Embeds text and either adds examples to classifier or returns the predicted label
    * @param text - the text inputted
    * @param label - the label to add the example to
    * @param direction - is either "example" when an example is being inputted or "predict" when a word to be classified is inputted
    * @returns if the direction is "predict" returns the predicted label for the text inputted
    */
  private async predictScore(text) {
    const { prediction, currentClassificationInput, labels } = this;
    if (currentClassificationInput === text) return this.logPrediction();

    this.currentClassificationInput = text;

    const model = await loadEncoder();
    // try also [text] if doesn't work
    const testData = await model.embed(text) as unknown as tf.Tensor2D;

    const result = await this.customLanguageModel.predict(testData);
    const singular = Array.isArray(result) ? result[0] : result;
    const predict = await singular.data();
    prediction.label = await singular.as1D().argMax().dataSync()[0];
    prediction.class = labels[prediction.label];
    prediction.score = predict[prediction.label];
    this.logPrediction();
  }

  private logPrediction() {
    const { label, class: _class, score } = this.prediction;
    console.log('Classification done')
    console.log('Predicted Label', label);
    console.log('Predicted Class', _class);
    console.log('Predicted Score', score);
  }

  private async buildCustomDeepModel() {
    const { labels, modelData } = this;
    const { length } = labels;

    if (length < 2) return "No classes inputted";

    this.runtime.emit(RuntimeEvent.Say, this.runtime.executableTargets[1], 'think', 'wait .. loading model');

    this.customLanguageModel = tf.sequential();

    const samples = {
      sentences: new Array<string>(),
      labels: new Array<string>(),
    }

    for (let label of labels) {
      for (let sentence of modelData[label]) {
        samples.sentences.push(sentence);
        samples.labels.push(label);
      }
    }

    const ys = tf.oneHot(
      tf.tensor1d(samples.labels.map((a) => labels.findIndex(e => e === a)), 'int32'), length);

    let trainingData: tf.Tensor2D;
    try {
      const model = await loadEncoder();
      trainingData = await model.embed(samples.sentences) as unknown as tf.Tensor2D;
    }
    catch (error) {
      console.error('Fit Error:', error);
    }

    // Add layers to the model
    this.customLanguageModel.add(tf.layers.dense({
      inputShape: [512],
      activation: 'sigmoid',
      kernelInitializer: 'ones',
      units: length,//number of label classes
    }));

    // Compile the model
    this.customLanguageModel.compile({
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(.06), // This is a standard compile config
    });


    const info = await this.customLanguageModel.fit(trainingData, ys, {
      epochs: 100,
      batchSize: 4,
      shuffle: true,
      validationSplit: 0.15,
      callbacks: [
        tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 50 })
      ]
    });

    console.log('Final accuracy', info);
    this.runtime.emit(RuntimeEvent.Say, this.runtime.executableTargets[1], 'say', 'The model is ready');
  }

  private async getEmbeddings(text) {
    const newText = await getTranslationToEnglish(text); //translates text from any language to english
    if (this.labels.length === 0 || !this.labels[0]) return;

    await this.predictScore(newText);
    return this.prediction.class;

  }

  private uiEventsTODO() {
    /*
    // Listen for model editing events emitted by the text modal
    this.runtime.on('NEW_EXAMPLES', (examples, label) => {
      this.newExamples(examples, label);
    });
    this.runtime.on('NEW_LABEL', (label) => {
      this.newLabel(label);
    });
    this.runtime.on('DELETE_EXAMPLE', (label, exampleNum) => {
      this.deleteExample(label, exampleNum);
    });
    this.runtime.on('RENAME_LABEL', (oldName, newName) => {
      this.renameLabel(oldName, newName);
    });
    this.runtime.on('DELETE_LABEL', (label) => {
      this.clearAllWithLabel({ LABEL: label });
    });
    this.runtime.on('CLEAR_ALL_LABELS', () => {
      if (!this.labelListEmpty && confirm('Are you sure you want to clear all labels?')) {    //confirm with alert dialogue before clearing the model
        let labels = [...this.labelList];
        for (var i = 0; i < labels.length; i++) {
          this.clearAllWithLabel({ LABEL: labels[i] });
        }
        //this.clearAll(); this crashed Scratch for some reason
      }
    });

    //Listen for model editing events emitted by the classifier modal
    this.runtime.on('EXPORT_CLASSIFIER', () => {
      this.exportClassifier();
    });
    this.runtime.on('LOAD_CLASSIFIER', () => {
      console.log("load");
      this.loadClassifier();

    });

    this.runtime.on('DONE', () => {
      console.log("DONE");
      this.buildCustomDeepModel();
    });*/
  }
}
