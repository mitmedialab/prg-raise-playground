import tmPose from '@teachablemachine/pose';
import tmImage from '@teachablemachine/image';
import * as speechCommands from '@tensorflow-models/speech-commands';



export default class TeachableMachine {
    latestAudioResults: any;
    predictionState;
    modelConfidences = {};
    maxConfidence: number = null;
    teachableImageModel;
    isPredicting: number = 0;
    ModelType = {
        POSE: 'pose',
        IMAGE: 'image',
        AUDIO: 'audio',
      };

    constructor() {
      this.predictionState = {};
    }
    
    useModel = async (url: string): Promise<{type: "success" | "error" | "warning", msg: string}> => {
        try {
          const modelUrl = this.modelArgumentToURL(url);
          console.log('Loading model from URL:', modelUrl);
    
          // Initialize prediction state if needed
          this.predictionState[modelUrl] = {};
    
          // Load and initialize the model
          const { model, type } = await this.initModel(modelUrl);

          this.predictionState[modelUrl].modelType = type;
          this.predictionState[modelUrl].model = model;
    
          // Update the current model reference
          this.teachableImageModel = modelUrl;
    
          return {
            type: "success",
            msg: "Model loaded successfully"
          };
        } catch (e) {
          console.error('Error loading model:', e);
          this.teachableImageModel = null;
          return {
            type: "error",
            msg: "Failed to load model"
          };
        }
      }
    
    
      modelArgumentToURL = (modelArg: string) => {
        // Convert user-provided model URL/ID to the correct format
        const endpointProvidedFromInterface = "https://teachablemachine.withgoogle.com/models/";
        const redirectEndpoint = "https://storage.googleapis.com/tm-model/";
    
        return modelArg.startsWith(endpointProvidedFromInterface)
          ? modelArg.replace(endpointProvidedFromInterface, redirectEndpoint)
          : redirectEndpoint + modelArg + "/";
      }
    
      initModel = async (modelUrl: string) => {
        const avoidCache = `?x=${Date.now()}`;
        const modelURL = modelUrl + "model.json" + avoidCache;
        const metadataURL = modelUrl + "metadata.json" + avoidCache;
    
        // First try loading as an image model
        try {
          const customMobileNet = await tmImage.load(modelURL, metadataURL);
    
          // Check if it's actually an audio model
          if ((customMobileNet as any)._metadata.hasOwnProperty('tfjsSpeechCommandsVersion')) {
            const recognizer = await speechCommands.create("BROWSER_FFT", undefined, modelURL, metadataURL);
            await recognizer.ensureModelLoaded();
    
            // Setup audio listening
            await recognizer.listen(async result => {
              this.latestAudioResults = result;
            }, {
              includeSpectrogram: true,
              probabilityThreshold: 0.75,
              invokeCallbackOnNoiseAndUnknown: true,
              overlapFactor: 0.50
            });
    
            return { model: recognizer, type: this.ModelType.AUDIO };
          }
          // Check if it's a pose model
          else if ((customMobileNet as any)._metadata.packageName === "@teachablemachine/pose") {
            const customPoseNet = await tmPose.load(modelURL, metadataURL);
            return { model: customPoseNet, type: this.ModelType.POSE };
          }
          // Otherwise it's an image model
          else {
            return { model: customMobileNet, type: this.ModelType.IMAGE };
          }
        } catch (e) {
          console.error("Failed to load model:", e);
          throw e;
        }
      }
    
    getPredictionFromModel = async (modelUrl: string, frame: ImageBitmap) => {
        const { model, modelType } = this.predictionState[modelUrl];
        switch (modelType) {
          case this.ModelType.IMAGE:
            if (!frame) return null;
            return await model.predict(frame);
          case this.ModelType.POSE:
            if (!frame) return null;
            const { pose, posenetOutput } = await model.estimatePose(frame);
            return await model.predict(posenetOutput);
          case this.ModelType.AUDIO:
            if (this.latestAudioResults) {
              return model.wordLabels().map((label, i) => ({
                className: label,
                probability: this.latestAudioResults.scores[i]
              }));
            }
            return null;
        }
      }

    private getPredictionStateOrStartPredicting(modelUrl: string) {
        if (!modelUrl || !this.predictionState || !this.predictionState[modelUrl]) {
          console.warn('No prediction state available for model:', modelUrl);
          return null;
        }
        return this.predictionState[modelUrl];
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
    
      getModelClasses(): string[] {
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
    
      getModelPrediction() {
        const modelUrl = this.teachableImageModel;
        const predictionState: { topClass: string } = this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
          console.error("No prediction state found");
          return '';
        }
        return predictionState.topClass;
      }

      async predictAllBlocks(frame: ImageBitmap) {
        for (let modelUrl in this.predictionState) {
          if (!this.predictionState[modelUrl].model) {
            console.log('No model found for:', modelUrl);
            continue;
          }
          if (this.teachableImageModel !== modelUrl) {
            console.log('Model URL mismatch:', modelUrl);
            continue;
          }
          ++this.isPredicting;
          const prediction = await this.predictModel(modelUrl, frame);
          this.predictionState[modelUrl].topClass = prediction;
          --this.isPredicting;
        }
      }

      private async predictModel(modelUrl: string, frame: ImageBitmap) {
          const predictions = await this.getPredictionFromModel(modelUrl, frame);
          if (!predictions) {
            return;
          }
          let maxProbability = 0;
          let maxClassName = "";
          for (let i = 0; i < predictions.length; i++) {
            const probability = predictions[i].probability.toFixed(2);
            const className = predictions[i].className;
            this.modelConfidences[className] = probability;
            if (probability > maxProbability) {
              maxClassName = className;
              maxProbability = probability;
            }
          }
          this.maxConfidence = maxProbability;
          return maxClassName;
        }
}
