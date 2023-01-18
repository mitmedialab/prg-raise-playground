import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";

import Video from '../../../packages/scratch-vm/src/io/video';
import Runtime from '../../../packages/scratch-vm/src/engine/runtime';
// import type RenderedTarget from '../../../packages/scratch-vm/src/sprites/rendered-target';
import * as handpose from '../../../packages/scratch-vm/node_modules/@tensorflow-models/handpose';

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const VideoState = {
  /** Video turned off. */
  OFF: 0,

  /** Video turned on with default y axis mirroring. */
  ON: 1,

  /** Video turned on without default y axis mirroring. */
  ON_FLIPPED: 2
};

/**
 * @summary This type describes how your extension will display in the extensions menu. 
 * @description Like all Typescript type declarations, it looks and acts a lot like a javascript object. 
 * It will be passed as the first generic argument to the Extension class that your specific extension `extends`
 * (see the class defintion below for more information on extending the Extension base class). 
 */
type Details = {
  name: "Hand Sensing",
  description: "Sense hand movement with the camera.",
  /**
   * IMPORTANT! Place your icon image (typically a png) in the same directory as this index.ts file
   */
  iconURL: "Typescript_logo.png",  //REPLACE WITH ORIGINAL ICON
  /**
   * IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
   * NOTE: This icon will also appear on all of your extension's blocks
   */
  insetIconURL: "typescript-logo.svg"   //REPLACE WITH ORIGINAL INSET ICON
};

/**
 * @summary This type describes all of the blocks your extension will/does implement. 
 * @description As you can see, each block is represented as a function.
 * In typescript, you can specify a function in either of the following ways (and which you choose is a matter of preference):
 * - Arrow syntax: `nameOfFunction: (argument1Name: argument1Type, argument2Name: argument2Type, ...etc...) => returnType;`
 * - 'Method' syntax: `nameOfFunction(argument1Name: argument1Type, argument2Name: argument2Type, ...etc...): returnType;`
 * 
 * The three included functions demonstrate some of the most common types of blocks: commands, reporters, and hats.
 * - Command functions/blocks take 0 or more arguments, and return nothing (indicated by the use of a `void` return type). 
 * - Reporter functions/blocks also take 0 or more arguments, but they must return a value (likely a `string` or `number`).
 * - Hat functions/blocks also take 0 or more arguments, but they must return a boolean value.
 * 
 * Feel free to delete these once you're ready to implement your own blocks.
 * 
 * This type will be passed as the second generic argument to the Extension class that your specific extension 'extends'
 * (see the class defintion below for more information on extending the Extension base class). 
 * @link https://www.typescriptlang.org/docs/handbook/2/functions.html Learn more about function types!
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
type Blocks = {
  goToHandPartBlock(handPart: string, fingerPart: number): void; 
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleBlock(state: number): void;   
  setVideoTransparencyBlock(transparency: number): void;
}

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the base `Extension` class.
 * 
 * Hover over `Extension` to get a more in depth explanation of the base class, and what it means to `extend it`.
 */
export default class PoseHand extends Extension<Details, Blocks> {
  /**
   * @summary A field to demonstrate how Typescript Class fields work
   * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
   */
  
  handPoseState;
  firstInstall: boolean;
  _handModel;
  globalVideoState: number;
  globalVideoTransparency: number;

  // ASK ABOUT INIT FUNCTION AND WHAT SHOULD GO IN IT
  init(env: Environment) {

    if (this.firstInstall) {
      this.globalVideoState = VideoState.ON;
      this.globalVideoTransparency = 50;
      this.projectStarted();
      this.firstInstall = false;
      this._handModel = null;

    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = env.runtime;
    const EXTENSION_ID = 'PoseHand';
    // ASK ABOUT THIS
    this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    this.runtime.connectPeripheral(EXTENSION_ID, 0);
    // this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
    

    /**
     * A flag to determine if this extension has been installed in a project.
     * It is set to false the first time getInfo is run.
     * @type {boolean}
     */
    this.firstInstall = true;
    
    if (this.runtime.ioDevices) {
        // ASK ABOUT THIS
        this.runtime.on(Runtime.PROJECT_LOADED, this.projectStarted.bind(this));
        this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));
        this._loop();
    }
    }
  }

  /**
   * Dimensions the video stream is analyzed at after its rendered to the
   * sample canvas.
   * @type {Array.<number>}
   */
  static get DIMENSIONS () {
      return [480, 360];
  }

  tfCoordsToScratch({x, y, z}) {
      return {x: x - 250, y: 200 - y};
  }

  /**
     * Get the latest values for video transparency and state,
     * and set the video device to use them.
     */
  projectStarted () {
    this.setVideoTransparency(this.globalVideoTransparency);
    this.videoToggle(this.globalVideoState);
  }

  reset () {
  }

  /**
   * Checks if something is connected ???
   * @returns {boolean} true if connected, false if not connected
   */
  isConnected() {
    return !!this.handPoseState && this.handPoseState.length > 0;
  }

  async _loop () {
    while (true) {
        const frame = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: PoseHand.DIMENSIONS
        });

        const time = +new Date();
        if (frame) {
            this.handPoseState = await this.estimateHandPoseOnImage(frame);
            /*
            if (this.isConnected()) {
                this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
            } else {
                this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECTED);
            }
            */
        }
        const estimateThrottleTimeout = (+new Date() - time) / 4;
        await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }
  
  /**
   * @param imageElement
   * @returns {Promise<AnnotatedPrediction[]>}
   */
  async estimateHandPoseOnImage(imageElement) {
    const handModel = await this.getLoadedHandModel();
    return await handModel.estimateHands(imageElement, {
        flipHorizontal: false
    });
  }

  async getLoadedHandModel() {
    if (!this._handModel) {
        this._handModel = await handpose.load();
    }
    return this._handModel;
  }

  videoToggle (state: number) {
    if (state === VideoState.OFF) {
      this.runtime.ioDevices.video.disableVideo();
    } 
    else {
      this.runtime.ioDevices.video.enableVideo();
      // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
      this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
    }
  }

  setVideoTransparency (transparency: number) {
    const trans = Math.max(Math.min(transparency,100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }


  defineBlocks(): PoseHand["BlockDefinitions"] {
    
    const fingerOptions = 
    [{text: "thumb", value: "thumb"}, {text: "index finger", value: "index"},
    {text: "middle finger", value: "middle"}, {text: "ring finger", value: "ring"}, {text: "pinky finger", value: "pinky"}];

    const partOfFingerOptions = [{text: "tip", value: 0}, {text: "first knuckle", value: 1},
    {text: "second knuckle", value: 2}, {text: "base", value: 3}];;

    type DefineGoToHandPart = DefineBlock<PoseHand, Blocks["goToHandPartBlock"]>;
    const goToHandPartBlock: DefineGoToHandPart = () => ({
      type: BlockType.Command,
      args: [{type: ArgumentType.String, 
              options: {acceptsReporters: true, 
                        items: fingerOptions, 
                        handler: (part: string) => {
                          if (!(part in ["thumb", "index", "middle", "ring", "pinky"])){
                            // console.log("Error: 'go to' block only accepts 'thumb', 'index', 'middle', 'ring', or 'pinky', and '0', '1', '2', or '3'");
                            return "thumb"
                          }
                        }
                       }
              }, 
             {type: ArgumentType.Number, 
              options: {acceptsReporters: true, 
                        items: partOfFingerOptions, 
                        handler: (part: number) => {
                          return Math.max(Math.min(part, 3), 0)
                        }
                       }
             }],
      text: (handPart: string, fingerPart: number) => `go to ${handPart} ${fingerPart}`,
      operation: (handPart, fingerPart, util) => { 
        console.log(util.target);
        
        if (this.isConnected()) {
          const [x, y, z] = this.handPoseState[0].annotations[handPart][fingerPart];
          const {x: scratchX, y: scratchY} = this.tfCoordsToScratch({x, y, z});
          (util.target as any).setXY(scratchX, scratchY, false); 
        }
      }
    });

    type DefineVideoToggle = DefineBlock<PoseHand, Blocks["videoToggleBlock"]>;
    const videoToggleBlock: DefineVideoToggle = () => ({
      type: BlockType.Command,
      arg: {type: ArgumentType.Number, 
            options: {acceptsReporters: true, 
                      items: [{text: 'off', value: 0}, {text: 'on', value: 1}, {text: 'on and flipped', value: 2}],
                      handler: (x: number) => {
                        return Math.min(Math.max(x, 0), 2);
                      }
                     }
           },
      text: (state: number) => `turn video ${state}`,
      operation: (state) => {
        this.videoToggle(state);
      }
    });

    type DefineSetVideoTransparency = DefineBlock<PoseHand, Blocks["setVideoTransparencyBlock"]>;
    const setVideoTransparencyBlock: DefineSetVideoTransparency = () => ({
      type: BlockType.Command,
      arg: {type: ArgumentType.Number, defaultValue: 50},
      text: (transparency) => `set video transparency to ${transparency}`,
      operation: (transparency) => {
        this.setVideoTransparency(transparency);
      }
    });

    return {
      goToHandPartBlock,
      videoToggleBlock,
      setVideoTransparencyBlock
    }
  }
}



