import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";

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
  modelPredictionReporter(): string;
  predictionIs_Boolean(state: string): boolean;

  videoToggleCommand(state: number): void;
  setVideoTransparencyCommand(state: number): void;
}

export default class teachableMachine extends Extension<Details, Blocks> {

  detect: any;
  lastUpdate: number;
  maxConfidence: number;
  modelConfidences: object;
  isPredicting: number;
  predictionState: object;
  teachableImageModel: any;
  latestAudioResults: any;

  init(env: Environment) {
    /**
        * The runtime instantiating this block package.
        * @type {Runtime}
        */
    this.runtime = env.runtime;

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

  options() {
    return ['State 1']
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

    const useModel_Command: DefineBlock<teachableMachine, Blocks["useModel_Command"]> = () => ({
      type: BlockType.Command,
      arg: ArgumentType.String,
      text: (url) => `use model ${url}`,
      operation: (url) => {
        console.log(url)
      }
    });

    const whenModelDetects_Hat: DefineBlock<teachableMachine, Blocks["whenModelDetects_Hat"]> = () => ({
      type: BlockType.Hat,
      arg: {
        type: ArgumentType.String,
        options: () => this.options()
      },
      text: (state) => `when model detects ${state}`,
      operation: (state) => {
        console.log(state);
        return false;
      }
    });

    const modelPredictionReporter: DefineBlock<teachableMachine, Blocks["modelPredictionReporter"]> = () => ({
      type: BlockType.Reporter,
      text: `model prediction`,
      operation: () => {
        return 'string'
      }
    });

    const predictionIs_Boolean: DefineBlock<teachableMachine, Blocks["predictionIs_Boolean"]> = () => ({
      type: BlockType.Boolean,
      arg: { type: ArgumentType.String, options: ['State 1'] },
      text: (state) => `when model detects ${state}`,
      operation: (state) => {
        console.log(state);
        return false;
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
      modelPredictionReporter,
      predictionIs_Boolean,
      videoToggleCommand,
      setVideoTransparencyCommand,
    }
  }
}
