import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";
import tmImage from '@teachablemachine/image';
import tmPose from '@teachablemachine/pose';
import { create } from '@tensorflow-models/speech-commands';

const VideoState = {
  /** Video turned off. */
  OFF: 0,
  /** Video turned on with default y axis mirroring. */
  ON: 1,
  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
} as const;

const ModelType = {
  POSE: 'pose',
  IMAGE: 'image',
  AUDIO: 'audio',
};

type Details = {
  name: "Teachable Machine",
  description: "Use your Teachable Machine models in your Scratch project!"
  iconURL: "teachable-machine-blocks.png",
  insetIconURL: "teachable-machine-blocks-small.svg"
};

type Blocks = {
  useModel_Command(url: string): void;
  whenModelDetects_Hat(state: string): boolean;
  modelPrediction_Reporter(): string;
  predictionIs_Boolean(state: string): boolean;
  confidenceFor_Reporter(state: string): number;

  videoToggleCommand(state: number): void;
  setVideoTransparencyCommand(state: number): void;
}

export default class teachableMachine extends Extension<Details, Blocks> {

  lastUpdate: number;
  maxConfidence: number;
  modelConfidences: {};
  isPredicting: number;
  predictionState = {};
  teachableImageModel;
  latestAudioResults: any;

  test: string = "";

  init(env: Environment) {

    /**
     * The last millisecond epoch timestamp that the video stream was
     * analyzed.
     * @type {number}
     */
    this.lastUpdate = null;


    // What is the confidence of the latest prediction
    this.maxConfidence = null;
    this.modelConfidences = {};

    if (this.runtime.ioDevices) {
      // Configure the video device with values from globally stored locations.
      //  this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this));

      // Kick off looping the analysis logic.
      this._loop();
    }
  }

  /**
     * Occasionally step a loop to sample the video, stamp it to the preview
     * skin, and add a TypedArray copy of the canvas's pixel data.
     * @private
     */
  _loop() {
    setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, teachableMachine.INTERVAL));

    // Add frame to detector
    const time = Date.now();
    if (this.lastUpdate === null) {
      this.lastUpdate = time;
    }
    if (!this.isPredicting) {
      this.isPredicting = 0;
    }
    const offset = time - this.lastUpdate;

    // TOOD: Self-throttle interval if slow to run predictions
    if (offset > teachableMachine.INTERVAL && this.isPredicting === 0) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: 'image-data',
        dimensions: teachableMachine.DIMENSIONS
      });

      if (frame) {
        this.lastUpdate = time;
        this.isPredicting = 0;
        this.predictAllBlocks(frame);
      }
    }
  }

  async predictAllBlocks(frame) {
    for (let modelUrl in this.predictionState) {
      if (!this.predictionState[modelUrl].model) {
        continue;
      }
      if (this.teachableImageModel !== modelUrl) {
        continue;
      }
      ++this.isPredicting;
      const prediction = await this.predictModel(modelUrl, frame);
      this.predictionState[modelUrl].topClass = prediction;
      // this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
      --this.isPredicting;
    }
  }

  async predictModel(modelUrl, frame) {
    const predictions = await this.getPredictionFromModel(modelUrl, frame);
    if (!predictions) {
      return;
    }
    let maxProbability = 0;
    let maxClassName = "";
    for (let i = 0; i < predictions.length; i++) {
      const probability = predictions[i].probability.toFixed(2);
      const className = predictions[i].className;
      this.modelConfidences[className] = probability; // update for reporter block
      if (probability > maxProbability) {
        maxClassName = className;
        maxProbability = probability;
      }
    }
    this.maxConfidence = maxProbability; // update for reporter block
    return maxClassName;
  }

  async getPredictionFromModel(modelUrl, frame) {
    const { model, modelType } = this.predictionState[modelUrl];
    switch (modelType) {
      case ModelType.IMAGE:
        const imageBitmap = await createImageBitmap(frame);
        return await model.predict(imageBitmap);
      case ModelType.POSE:
        const { pose, posenetOutput } = await model.estimatePose(frame);
        return await model.predict(posenetOutput);
      case ModelType.AUDIO:
        if (this.latestAudioResults) {
          return model.wordLabels().map((label, i) => {
            return { className: label, probability: this.latestAudioResults.scores[i] }
          });
        } else {
          return null;
        }
    }
  }

  async startPredicting(modelDataUrl) {
    if (!this.predictionState[modelDataUrl]) {
      try {
        this.predictionState[modelDataUrl] = {};
        // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
        const { model, type } = await this.initModel(modelDataUrl);
        this.predictionState[modelDataUrl].modelType = type;
        this.predictionState[modelDataUrl].model = model;
        this.runtime.requestToolboxExtensionsUpdate();
      } catch (e) {
        this.predictionState[modelDataUrl] = {};
        console.log("Model initialization failure!", e);
      }
    }
  }

  /**
   * A scratch reporter that returns the top class seen in the current video frame
   * @returns {string} class name if video frame matched, empty string if model not loaded yet
   */
  modelPrediction() {
    const modelUrl = this.teachableImageModel;
    const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
    if (!predictionState) {
      return '';
    }
    return predictionState.topClass;
  }

  async initModel(modelUrl) {
    const modelURL = modelUrl + "model.json";
    const metadataURL = modelUrl + "metadata.json";
    const customMobileNet = await tmImage.load(modelURL, metadataURL);
    if ((customMobileNet as any)._metadata.hasOwnProperty('tfjsSpeechCommandsVersion')) {
      // customMobileNet.dispose(); // too early to dispose
      //console.log("We got a speech net yay")
      const recognizer = create("BROWSER_FFT", undefined, modelURL, metadataURL);
      await recognizer.ensureModelLoaded();
      await recognizer.listen(async result => {
        this.latestAudioResults = result;
        //console.log(result);
      }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
      });
      return { model: recognizer, type: ModelType.AUDIO };
    } else if ((customMobileNet as any)._metadata.packageName === "@teachablemachine/pose") {
      const customPoseNet = await tmPose.load(modelURL, metadataURL);
      return { model: customPoseNet, type: ModelType.POSE };
    } else {
      return { model: customMobileNet, type: ModelType.IMAGE };
    }
  }

  /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
  static get INTERVAL() {
    return 33;
  }

  /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
  static get DIMENSIONS() {
    return [480, 360];
  }

  useModel(url) {
    try {
      // console.log('trying model');
      const modelUrl = this.modelArgumentToURL(url);
      // console.log('1.1');
      this.getPredictionStateOrStartPredicting(modelUrl);
      // console.log('1.2');
      this.updateStageModel(modelUrl);
      // console.log('using model');
    } catch (e) {
      this.teachableImageModel = null;
    }
  }

  modelArgumentToURL(modelArg) {
    return modelArg.startsWith('https://teachablemachine.withgoogle.com/models/') ?
      modelArg :
      `https://teachablemachine.withgoogle.com/models/${modelArg}/`;
  }

  updateStageModel(modelUrl) {
    const stage = this.runtime.getTargetForStage();
    this.teachableImageModel = modelUrl;
    if (stage) {
      (stage as any).teachableImageModel = modelUrl;
    }
  }

  getPredictionStateOrStartPredicting(modelUrl) {
    // console.log('2 start');
    // console.log(this.predictionState);
    const hasPredictionState = this.predictionState.hasOwnProperty(modelUrl);
    // console.log('2.1');
    if (!hasPredictionState) {
      // console.log('start predicting');
      this.startPredicting(modelUrl);
      return null;
    }
    // console.log('get predict state');
    return this.predictionState[modelUrl];
  }

  getCurrentClasses() {
    if (
      !this.teachableImageModel ||
      !this.predictionState ||
      !this.predictionState[this.teachableImageModel] ||
      !this.predictionState[this.teachableImageModel].hasOwnProperty('model')
    ) {
      return ["Select a class"];
    }

    if (this.predictionState[this.teachableImageModel].modelType === ModelType.AUDIO) {
      return this.predictionState[this.teachableImageModel].model.wordLabels();
    }

    return this.predictionState[this.teachableImageModel].model.getClassLabels();
  }

  model_match(state) {
    const modelUrl = this.teachableImageModel;
    const className = state;

    const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
    if (!predictionState) {
      return false;
    }

    const currentMaxClass = predictionState.topClass;
    return (currentMaxClass === String(className));
  }

  classConfidence(args) {
    const className = args.CLASS_NAME;

    return this.modelConfidences[className];
  }

  /**
   * Turns the video camera off/on/on and flipped. This is called in the operation of videoToggleBlock
   * @param state 
   */
  toggleVideo(state: number) {
    if (state === VideoState.OFF) return this.runtime.ioDevices.video.disableVideo();

    this.runtime.ioDevices.video.enableVideo();
    // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
    this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
  }

  /**
   * Sets the video's transparency. This is called in the operation of setVideoTransparencyBlock
   * @param transparency 
   */
  setTransparency(transparency: number) {
    const trans = Math.max(Math.min(transparency, 100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }

  defineBlocks(): teachableMachine["BlockDefinitions"] {

    this.setTransparency(50);
    this.toggleVideo(VideoState.ON);

    const useModel_Command: DefineBlock<teachableMachine, Blocks["useModel_Command"]> = () => ({
      type: BlockType.Command,
      arg: { type: ArgumentType.String, defaultValue: 'Paste URL Here!' },
      text: (url) => `use model ${url}`,
      operation: (url) => {
        this.useModel(url);
      }
    });

    const whenModelDetects_Hat: DefineBlock<teachableMachine, Blocks["whenModelDetects_Hat"]> = () => ({
      type: BlockType.Hat,
      arg: {
        type: ArgumentType.String,
        options: () => this.getCurrentClasses()
      },
      text: (state) => `when model detects ${state}`,
      operation: (state) => {
        return this.model_match(state);
      }
    });

    const modelPrediction_Reporter: DefineBlock<teachableMachine, Blocks["modelPrediction_Reporter"]> = () => ({
      type: BlockType.Reporter,
      text: `model prediction`,
      operation: () => {
        return this.modelPrediction();
      }
    });

    const predictionIs_Boolean: DefineBlock<teachableMachine, Blocks["predictionIs_Boolean"]> = () => ({
      type: BlockType.Boolean,
      arg: {
        type: ArgumentType.String,
        options: () => this.getCurrentClasses()
      },
      text: (state) => `prediction is ${state}`,
      operation: (state) => {
        return this.model_match(state);
      }
    });

    // FIX FIX FIX
    const confidenceFor_Reporter: DefineBlock<teachableMachine, Blocks["confidenceFor_Reporter"]> = () => ({
      type: BlockType.Reporter,
      arg: {
        type: ArgumentType.String,
        options: () => this.getCurrentClasses()
      },
      text: (state) => `confidence for ${state}`,
      operation: (state) => {
        return this.classConfidence(state);
      }
    });

    const videoToggleCommand: DefineBlock<teachableMachine, Blocks["videoToggleCommand"]> = () => ({
      type: BlockType.Command,
      arg: {
        type: ArgumentType.Number,
        options: {
          acceptsReporters: true,
          items: [{ text: 'off', value: VideoState.OFF }, { text: 'on', value: VideoState.ON }, { text: 'on and flipped', value: VideoState.ON_FLIPPED }],
          handler: (video_state: number) => {
            return Math.min(Math.max(video_state, VideoState.OFF), VideoState.ON_FLIPPED);
          }
        }
      },
      text: (video_state: number) => `turn video ${video_state}`,
      operation: (video_state: number) => {
        this.toggleVideo(video_state);
      }
    });

    const setVideoTransparencyCommand: DefineBlock<teachableMachine, Blocks["videoToggleCommand"]> = () => ({
      type: BlockType.Command,
      arg: { type: ArgumentType.Number, defaultValue: 50 },
      text: (transparency: number) => `set video transparency to ${transparency}`,
      operation: (transparency: number) => {
        this.setTransparency(transparency);
      }
    });

    return {
      useModel_Command,
      whenModelDetects_Hat,
      modelPrediction_Reporter,
      predictionIs_Boolean,
      confidenceFor_Reporter,
      videoToggleCommand,
      setVideoTransparencyCommand,
    }
  }
}
