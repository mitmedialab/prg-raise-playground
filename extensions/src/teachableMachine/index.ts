import { Environment, buttonBlock, extension, scratch, versions } from "$common";
import tmImage from '@teachablemachine/image';
import tmPose from '@teachablemachine/pose';
import { create } from '@tensorflow-models/speech-commands';
import { legacyFullSupport, } from "./legacy";

const { legacyBlock, legacyExtension } = legacyFullSupport.for<teachableMachine>();
const VideoState = {
  /** Video turned off. */
  OFF: 'off',
  /** Video turned on with default y axis mirroring. */
  ON: 'on',
  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 'on-flipped',
} as const;

const dynamicClassMenu = (self: teachableMachine) => ({
  argumentMethods: { 0: { getItems: () => self.getClasses() } }
})

@legacyExtension()
export default class teachableMachine extends extension({
  name: "Teachable Machine",
  description: "Use your Teachable Machine models in your Scratch project!",
  iconURL: "teachable-machine-blocks.png",
  insetIconURL: "teachable-machine-blocks-small.svg",
  tags: ["Dancing with AI", "Made by PRG"]
}) {
  lastUpdate: number;
  maxConfidence: number;
  modelConfidences: {};
  isPredicting: number;
  predictionState = {};
  teachableImageModel;
  latestAudioResults: any;

  test: string = "";

  /**
   * Video refresh rate
   * @type {number}
   */
  INTERVAL = 33;
  /**
   * Dimensions of the video frame
   * @type {number[]}
   */
  DIMENSIONS = [480, 360];

  ModelType = {
    POSE: 'pose',
    IMAGE: 'image',
    AUDIO: 'audio',
  };

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
      // this.runtime.on(Runtime.PROJECT_LOADED, this.updateVideoDisplay.bind(this));

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
    setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, this.INTERVAL));

    // Add frame to detector
    const time = Date.now();
    if (this.lastUpdate === null) {
      this.lastUpdate = time;
    }
    if (!this.isPredicting) {
      this.isPredicting = 0;
    }
    const offset = time - this.lastUpdate;

    // TODO: Self-throttle interval if slow to run predictions
    if (offset > this.INTERVAL && this.isPredicting === 0) {
      const frame = this.runtime.ioDevices.video.getFrame({
        format: 'image-data',
        dimensions: this.DIMENSIONS
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
      case this.ModelType.IMAGE:
        const imageBitmap = await createImageBitmap(frame);
        return await model.predict(imageBitmap);
      case this.ModelType.POSE:
        const { pose, posenetOutput } = await model.estimatePose(frame);
        return await model.predict(posenetOutput);
      case this.ModelType.AUDIO:
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
  getModelPrediction() {
    const modelUrl = this.teachableImageModel;
    const predictionState: { topClass: string } = this.getPredictionStateOrStartPredicting(modelUrl);
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
      return { model: recognizer, type: this.ModelType.AUDIO };
    } else if ((customMobileNet as any)._metadata.packageName === "@teachablemachine/pose") {
      const customPoseNet = await tmPose.load(modelURL, metadataURL);
      return { model: customPoseNet, type: this.ModelType.POSE };
    } else {
      return { model: customMobileNet, type: this.ModelType.IMAGE };
    }
  }

  useModel(url) {
    try {
      const modelUrl = this.modelArgumentToURL(url);
      this.getPredictionStateOrStartPredicting(modelUrl);
      this.updateStageModel(modelUrl);
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
    const hasPredictionState = this.predictionState.hasOwnProperty(modelUrl);
    if (!hasPredictionState) {
      this.startPredicting(modelUrl);
      return null;
    }
    return this.predictionState[modelUrl];
  }

  getClasses() {
    if (
      !this.teachableImageModel ||
      !this.predictionState ||
      !this.predictionState[this.teachableImageModel] ||
      !this.predictionState[this.teachableImageModel].hasOwnProperty('model')
    ) {
      return ["Select a class"];
    }

    if (this.predictionState[this.teachableImageModel].modelType === this.ModelType.AUDIO) {
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

  getClassConfidence(state): number {
    return this.modelConfidences[state];
  }

  /**
   * Turns the video camera off/on/on and flipped. This is called in the operation of videoToggleBlock
   * @param state 
   */
  toggleVideo(state: string) {
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

  /**
   * Opens a new tab with the Google Teachable Machine website
   */
  @buttonBlock("Teachable Machine Site ↗")
  openTeachableMachine() {
    window.open('https://teachablemachine.withgoogle.com/train', '_blank');
  }

  @(scratch.command`use model ${"string"}`)
  @versions(
    ({ arg }) => [arg("MODEL_URL")],
  )
  useModelBlock(url: string) {
    this.useModel(url);
  }

  @legacyBlock.whenModelMatches(dynamicClassMenu)
  whenModelMatches(state: string) {
    return this.model_match(state);
  }

  @legacyBlock.modelPrediction()
  modelPrediction() {
    return this.getModelPrediction();
  }

  @legacyBlock.modelMatches(dynamicClassMenu)
  modelMatches(state: string) {
    return this.model_match(state);
  }

  @legacyBlock.classConfidence(dynamicClassMenu)
  classConfidence(state: string) {
    return this.getClassConfidence(state);
  }

  @legacyBlock.videoToggle({
    argumentMethods: {
      0: {
        handler: (video_state: string) => {
          return ['on', 'off', 'on-flipped'].includes(video_state) ? video_state : VideoState.ON;
        },
      }
    }
  })
  videoToggle(state: string) {
    this.toggleVideo(state);
  }

  @legacyBlock.setVideoTransparency()
  setVideoTransparency(transparency: number) {
    this.setTransparency(transparency);
  }

}
