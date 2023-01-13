import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "$common";

/**
 * @summary This type describes how your extension will display in the extensions menu. 
 * @description Like all Typescript type declarations, it looks and acts a lot like a javascript object. 
 * It will be passed as the first generic argument to the Extension class that your specific extension `extends`
 * (see the class defintion below for more information on extending the Extension base class). 
 * @see ExtensionMenuDisplayDetails for all possible display menu properties.
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
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
  /* 
  exampleCommand(exampleString: string, exampleNumber: number): void;
  exampleReporter: () => number;
  exampleHat(condition: boolean): boolean;
  */
  goToHandPart(handPart: string, fingerPart: number): void; 
  // these video blocks are present in a few different extensions, perhaps making a file just for these?
  videoToggle(state: number): void;   
  setVideoTransparency(transparency: number): void;
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
  exampleField: number;

  init(env: Environment) {
    this.exampleField = 0;
  }

  // All example definitions below are syntactically equivalent, 
  // and which you use is just a matter of preference.
  defineBlocks(): PoseHand["BlockDefinitions"] {
    /*
    type DefineExampleCommand = DefineBlock<ExtensionNameGoesHere, Blocks["exampleCommand"]>;
    const exampleCommand: DefineExampleCommand = () => ({
      type: BlockType.Command,
      args: [ArgumentType.String, { type: ArgumentType.Number, defaultValue: 789 }],
      text: (exampleString, exampleNumber) => `This is where the blocks display text goes, with arguments --> ${exampleString} and ${exampleNumber}`,
      operation: (exampleString, exampleNumber, util) => {
        alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
        console.log(util.stackFrame.isLoop); // just an example of using the BlockUtility
      }
    });
    */
    const fingerOptions = 
    [{text: "thumb", value: "thumb"}, {text: "index finger", value: "index"},
    {text: "middle finger", value: "middle"}, {text: "ring finger", value: "ring"}, {text: "pinky finger", value: "pinky"}];
    
    const partOfFingerOptions = [{text: "tip", value: 0}, {text: "first knuckle", value: 1},
    {text: "second knuckle", value: 2}, {text: "base", value: 3}];;

    type DefineGoToHandPart = DefineBlock<PoseHand, Blocks["goToHandPart"]>;
    const goToHandPart: DefineGoToHandPart = () => ({
      type: BlockType.Command,
      args: [{type: ArgumentType.String, options: fingerOptions}, {type: ArgumentType.Number, options: partOfFingerOptions}],
      text: (handPart: string, fingerPart: number) => `go to ${handPart} ${fingerPart}`,
      operation: (handPart, fingerPart) => { 

        console.log(handPart+" with "+fingerPart) // Replace with what the block should do! 
        
      }
    });

    type DefineVideoToggle = DefineBlock<PoseHand, Blocks["videoToggle"]>;
    const videoToggle: DefineVideoToggle = () => ({
      type: BlockType.Command,
      arg: {type: ArgumentType.Number, options: [{text: 'off', value: 0}, {text: 'on', value: 1}, {text: 'on and flipped', value: 2}] },
      text: (state: number) => `turn video ${state}`,
      operation: (state) => {
         
        console.log("video state is "+state); // Replace with what the block should do!
      }
    });

    type DefineSetVideoTransparency = DefineBlock<PoseHand, Blocks["setVideoTransparency"]>;
    const setVideoTransparency: DefineSetVideoTransparency = () => ({
      type: BlockType.Command,
      arg: {type: ArgumentType.Number, defaultValue: 50},
      text: (transparency) => `set video transparency to ${transparency}`,
      operation: (transparency) => {
          let trans=transparency;
          if(transparency>100){
            trans=100
          }
          else if(transparency<0){
            trans=0
          }
        console.log("video transparency is "+trans); // Replace with what the block should do!
      }
    });

    return {
      goToHandPart,
      videoToggle,
      setVideoTransparency
    }
  }
}

