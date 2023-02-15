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
  name: "Teachable Machine",
  description: "Use your Teachable Machine models in your Scratch project!"
  iconURL: "teachable-machine-blocks.png",
  insetIconURL: "teachable-machine-blocks-small.svg"
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
  exampleCommand(exampleString: string, exampleNumber: number): void;
  exampleReporter: () => number;
  exampleHat(condition: boolean): boolean;
}

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the base `Extension` class.
 * 
 * Hover over `Extension` to get a more in depth explanation of the base class, and what it means to `extend it`.
 */
export default class ExtensionNameGoesHere extends Extension<Details, Blocks> {
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
  defineBlocks(): ExtensionNameGoesHere["BlockDefinitions"] {

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

    return {
      exampleCommand,

      exampleReporter: function (self: ExtensionNameGoesHere): Block<ExtensionNameGoesHere, Blocks["exampleReporter"]> {
        return {
          type: BlockType.Reporter,
          text: "This increments an internal field and then reports it's value",
          operation: () => {
            return ++self.exampleField;
          }
        }
      },

      exampleHat: pickFromOptions
    }
  }
}

type WithOptionsBlock = Blocks["exampleHat"];
const pickFromOptions = (): Block<ExtensionNameGoesHere, WithOptionsBlock> => ({
  type: BlockType.Hat,
  arg: { type: ArgumentType.Boolean, options: [{ text: 'Yes', value: true }, { text: 'No', value: false }] },
  text: (argument1) => `Should the below block execute? ${argument1}`,
  operation: function (argument1) {
    return argument1;
  }
});