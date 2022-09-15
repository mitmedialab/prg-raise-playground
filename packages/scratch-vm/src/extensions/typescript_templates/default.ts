import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block, BlockDefinitions, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "../../typescript-support/types";
import defineTranslations from "./translations";

/**
 * @summary This type describes how your extension will display in the extensions menu. 
 * @description Like all Typescript type declarations, it looks and acts a lot like a javascript object. 
 * It will be passed as the first generic argument to the Extension class that your specific extension 'extends'
 * (see the class defintion below for more information on extending the Extension base class). 
 * @see ExtensionMenuDisplayDetails for all possible display menu properties.
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
type Details = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  /**
   * IMPORTANT! Place your icon image (typically a png) in the same directory as this index.ts file
   */
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  /**
   * IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
   * NOTE: This icon will also appear on all of your extension's blocks
   */
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/**
 * @summary This type describes all of the blocks your extension will/does implement. 
 * @description As you can see in the below example, each block is represented as a function.
 * The specific format is either:
 * 
 * - `nameOfFunction: (argument1Name: argument1Type, argument2Name: argument2Type, ...etc...) => returnType`
 * - `nameOfFunction(argument1Name: argument1Type, argument2Name: argument2Type, ...etc...): returnType`
 * - NOTE: The above are equivalent and which you use depends on your preference (the first uses 'arrow' syntax, and the second uses 'method' syntax)
 * 
 * The two included functions below show the two most common types of blocks: commands and reporters.
 * - Command functions/blocks take 0 or more arguments, and return nothing (indicated by the use of a `void` return type). 
 * - Reporter functions/blocks also take 0 or more arguments, but they must return a value (likely a `string` or `number`).
 * Feel free to delete these once you're ready to implement your own blocks.
 * 
 * This type will be passed as the second generic argument to the Extension class that your specific extension 'extends'
 * (see the class defintion below for more information on extending the Extension base class). 
 * @link https://www.typescriptlang.org/docs/handbook/2/functions.html Learn more about function types!
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
type Blocks = {
  exampleCommand_OneArgument(argument: string): void;
  exampleCommand_MultipleArguments(argument1: string, argument2: number): void;
  exampleReporter: () => number;
  exampleReporter_ArgumentWithOptions: (valueFromMenu: string) => string;
}

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from a base `Extension` class.
 * 
 * As mentioned above, this `Extension` class takes 2 generic type arguments, which tell us (and Typescript + the Extension Framework) what this extension is all about.
 * The first generic argument tells us how this extension should be displayed in the Extensions Menu;
 * and the second tells us what blocks this Extension will add to the Scratch environment.
 * 
 * By declaring that we're extending an `Extension` with our specific generic type arguments,
 * Typescript holds us accountable to implement exactly what we said we would (all in order to make a working extension).
 *  
 * This includes:
 * * Defining an `init` method (see below) which is used INSTEAD of a constructor
 * * Defining a `defineBlocks` method that does jsut that, defines this extension's blocks 
 * * Defining a `defineTranslations` method for internal support, ignore this for now, coming soon!
 */
class ExtensionNameGoesHere extends Extension<Details, Blocks> {
  /**
   * @summary A field to demonstrate how Typescript Class fields work
   * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
   */
  exampleField: number;

  init(env: Environment) {
    this.exampleField = 0;
  }

  // All examples below are syntactically equivalent, 
  // and which you use is just a matter of preference
  defineBlocks(): ExtensionNameGoesHere["BlockDefinitions"] {

    /* ---- Example definition #1 (using local variable) ---- */

    type DefineExampleCommand = DefineBlock<Blocks["exampleCommand_OneArgument"]>;

    const exampleCommand_OneArgument: DefineExampleCommand = () => ({
      type: BlockType.Command,
      args: ArgumentType.String,
      text: (argument) => `This is where the blocks display text goes. Here's where the argument goes --> ${argument}`,
      operation: (argument, util) => {
        alert(`This is a command! Here's the argument I was given ${argument}`); // Replace with what the block should do! 
        console.log(util.stackFrame); // just an example of using the BlockUtility
      }
    });

    /* ---- Example definition #2 (using local variable) ---- */

    type ExampleReporterDefinition = Block<Blocks["exampleReporter"]>;

    const exampleReporter = function (self: ExtensionNameGoesHere): ExampleReporterDefinition {
      return {
        type: BlockType.Reporter,
        text: "This is where the blocks display text goes",
        operation: () => {
          return ++self.exampleField;
        }
      }
    };

    return {
      exampleCommand_OneArgument,
      exampleReporter,

      /* ---- Example definition #3 (using property on returned object) ---- */
      exampleCommand_MultipleArguments: () => ({
        type: BlockType.Command,
        args: [{ type: ArgumentType.String, defaultValue: '🤷' }, ArgumentType.Angle],
        text: (argument1, argument2) => `First argument: ${argument1}. Second argument: ${argument2}`,
        operation: (argument1, argument2) => { // NOTE: The last 'util' parameter is optionally omitted
          alert(`This is a command! Here's the first argument I was given ${argument1}`);
          alert(`This is a command! Here's the second argument I was given ${argument2}`);
        }
      }),

      /* ---- Example definition #4 (using function defined elsewhere) ---- */
      exampleReporter_ArgumentWithOptions: pickFromOptions
    }
  }

  defineTranslations = defineTranslations as typeof this.defineTranslations;
}

type WithOptionsBlock = Blocks["exampleReporter_ArgumentWithOptions"];

const pickFromOptions = (): Block<WithOptionsBlock> => ({
  type: BlockType.Reporter,
  args: { type: ArgumentType.String, options: ['😊', '❤️', '✨'] },
  text: (argument1) => `Pick one: ${argument1}`,
  operation: function (argument1) {
    alert(`You chose ${argument1}`);
    return argument1;
  }
});

export = ExtensionNameGoesHere;