import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";

const VideoState = {
  /** Video turned off. */
  OFF: 0,
  /** Video turned on with default y axis mirroring. */
  ON: 1,
  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
} as const;

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

  init(env: Environment) {

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


  // All example definitions below are syntactically equivalent, 
  // and which you use is just a matter of preference.
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
      arg: { type: ArgumentType.String, options: ['State 1'] },
      text: (state) => `when model detects ${state}`,
      operation: (state) => {
        console.log(state);
        return false;
      }
    });

    const modelPredictionReporter: DefineBlock<teachableMachine, Blocks["modelPredictionReporter"]> = () => ({
      type: BlockType.Reporter,
      text: () => `model prediction`,
      operation: () => {
        console.log();
        return null
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
