import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, RuntimeEvent } from "$common";

import Video from '../../../packages/scratch-vm/src/io/video';
// import Runtime from '../../../packages/scratch-vm/src/engine/runtime';
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
 * 
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
 * 
 */
type Blocks = {
  goToHandPartBlock(handPart: string, fingerPart: number): void; 
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggleBlock(state: number): void;   
  setVideoTransparencyBlock(transparency: number): void;
};


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

  /**
   * Acts like class PoseHand's constructor (instead of a child class constructor)
   * @param env 
   */
  init(env: Environment) {

    this.runtime = env.runtime;
    const EXTENSION_ID = 'PoseHand';

    /*
    this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    this.runtime.connectPeripheral(EXTENSION_ID, 0);
    this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
    */

    /**
     * A flag to determine if this extension has been installed in a project.
     * It is set to false the first time getInfo is run.
     * @type {boolean}
     */
    this.firstInstall = true;
    
    if (this.runtime.ioDevices) {
      //console.log('check 1');
        this.runtime.on(RuntimeEvent.ProjectLoaded, this.projectStarted.bind(this));
        this.runtime.on(RuntimeEvent.ProjectRunStart, this.reset.bind(this));
        this._loop();
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

  /**
   * init() does something with this? Don't know if this is important to keep still.
   */
  reset () {
  }

  /**
   * Checks if something is connected ???
   * @returns {boolean} true if connected, false if not connected
   */
  isConnected() {
    return !!this.handPoseState && this.handPoseState.length > 0;
  }

  /**
   * 
   */
  async _loop () {
    while (true) {
        const frame = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: PoseHand.DIMENSIONS
        });

        const time = +new Date();
        if (frame) {
          //console.log('check 2');
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
        //console.log('check 3');
        this._handModel = await handpose.load();
    }
    return this._handModel;
  }

  /**
   * Turns the video camera off/on/on and flipped
   * @param state 
   */
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

  /**
   * 
   * @param transparency 
   */
  setVideoTransparency (transparency: number) {
    const trans = Math.max(Math.min(transparency,100), 0);
    this.runtime.ioDevices.video.setPreviewGhost(trans);
  }

  /**
   * 
   * @returns  
   */
  defineBlocks(): PoseHand["BlockDefinitions"] {
    
    /**
     * Sets up the extension's video
     */
    if (this.firstInstall) {
      this.globalVideoState = VideoState.ON;
      this.globalVideoTransparency = 50;
      this.projectStarted();
      this.firstInstall = false;
      this._handModel = null;
    }
    
    const fingerOptions = 
    [{text: "thumb", value: "thumb"}, {text: "index finger", value: "indexFinger"},
    {text: "middle finger", value: "middleFinger"}, {text: "ring finger", value: "ringFinger"}, {text: "pinky finger", value: "pinky"}];

    const partOfFingerOptions = [{text: "tip", value: 3}, {text: "first knuckle", value: 2},
    {text: "second knuckle", value: 1}, {text: "base", value: 0}];

    type DefineGoToHandPart = DefineBlock<PoseHand, Blocks["goToHandPartBlock"]>;
    const goToHandPartBlock: DefineGoToHandPart = () => ({
      type: BlockType.Command,
      args: [{type: ArgumentType.String, 
              options: {acceptsReporters: true, 
                        items: fingerOptions, 
                        handler: (part: string) => {
                          console.log(part);
                          if (["thumb","indexFinger","middleFinger","ringFinger","pinky"].indexOf(part) != -1){
                            return part;
                          }
                          else return "thumb";
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

        // console.log(this.handPoseState);
        
        if (this.isConnected()) {
          //console.log('last check');
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



