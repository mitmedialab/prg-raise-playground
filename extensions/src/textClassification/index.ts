/// <reference types="dom-speech-recognition" />
import { Environment, extension, ExtensionMenuDisplayDetails, block, wrapClamp, fetchWithTimeout, RuntimeEvent } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { legacyFullSupport, info, legacyIncrementalSupport } from "./legacy";
import { getState, setState, tryCopyStateToClone } from "./state";
import { getSynthesisURL } from "./services/synthesis";
import timer from "./timer";
import voices, { Voice } from "./voices";
import Sentiment from "sentiment";
import toxicity, { ToxicityClassifier } from "@tensorflow-models/toxicity";
import encoder from '@tensorflow-models/universal-sentence-encoder';
import tf, { Tensor2D } from '@tensorflow/tfjs';
import { getTranslationToEnglish } from "./services/translation";

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
  currentClassificationInput: string;
  prediction = { label: 0, class: "", score: 0 };
  customLanguageModel: tf.Sequential;

  modelData = {
    textData: new Array<string>(),
    classifierData: new Array<string>(),
  }

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

    const model = await encoder.load();
    // try also [text] if doesn't work
    const testData = await model.embed(text);

    const result = await this.customLanguageModel.predict(testData as unknown as Tensor2D);
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

    let trainingData: Tensor2D;
    try {
      const model = await encoder.load();
      trainingData = await model.embed(samples.sentences) as unknown as Tensor2D;
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
}
