import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, extension, block } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

/**
 * @summary This object describes how your extension will display in the extensions menu. 
 * @description These details will be passed as the first argument to the `extension` function that your specific Extension class `extends`
 * (see the class defintion below for more information on extending the `extension` function). 
 * 
 * Hover over any of the fields below to get a description about what it is/does.
 */
const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the class returned by the `extension` function.
 * 
 * Hover over `extension` to get a more in-depth explanation of how it returns a base class for your extension to extend / inherit from.
 */
export default class ExtensionNameGoesHere extends extension(details) {

  /**
   * @summary A field to demonstrate how Typescript Class fields work
   * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
   */
  exampleField: number;

  defaultValue = 789;

  /**
   * 
   * @param env 
   */
  init(env: Environment) {
    this.exampleField = 0;
  }

  // #region Reporter Example

  @block({
    type: "reporter",
    text: "This increments an internal field and then reports it's value",
  })
  exampleReporter_Bare(): number {
    return ++this.exampleField;
  }

  /** 
   * Below is an example of a 'Reporter' block, which is a block that takes 0 or more arguments, 
   * and returns a value (likely a `string` or `number`). 
   * 
   * We turn the `exampleReporter` method into a method tied to a Block by "decorating" the method with the `block` decorator function 
   * (the use of the '@' tell us that it is a decorator).
   * 
   * The `block` function takes a single argument as input, which provides all the necessary information
   * for the Block Programming environment to create a Block tied to our method. 
   * */
  @block({
    type: "reporter",
    text: "This increments an internal field and then reports it's value",
  })
  /** The below method is a  */
  exampleReporter_Documented() {
    return ++this.exampleField;
  }

  // #endregion

  // #region Command Example

  @block((self) => ({
    type: BlockType.Command,
    text: (exampleString, exampleNumber) => `This is the block's display text with arguments here --> ${exampleString} and here --> ${exampleNumber}`,
    args: [ArgumentType.String, { type: ArgumentType.Number, defaultValue: self.defaultValue }],
  }))
  exampleCommand_Bare(exampleString: string, exampleNumber: number) {
    alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
  }

  /** 
   * Below, we define a method `exampleCommand_Documented` and decorate it with the `@block` function (similiar to above). 
   * This is an example of a "Command" block, as the underlying method takes 0 or more arguments, and returns nothing (void).
   * 
   * NOTE: Here, instead of passing an object to the `@block` decorator function (as above), we pass another function to it.
   * This function must take a single parameter, which will be a reference to our specific Extension (hover over `self` if you don't believe me). 
   * As you can see in the definition of the `defaultValue` of our second argument, 
   * this allows us to pull values off of our extension when defining our block.
  */
  @block((self) => ({
    /**
     * We can either use the string for our blockType, like above, 
     * or refernce a specific entry on the `BlockType` object, like below.
     */
    type: "command",
    /**
     * Because the underlying `exampleCommand` method takes arguments, 
     * our `text` field must implement a function, which accepts the same number of arguments. 
     * In the implementation of this function, we should create a Template String (see link below) that references our arguments,
     * which will auto-magically cause the resulting Blocks to have input fields at the positions of the templated arguments.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals Info on Template Strings
     */
    text: (exampleString, exampleNumber) => `This is the block's display text with arguments here --> ${exampleString} and here --> ${exampleNumber}`,
    args: [ArgumentType.String, { type: ArgumentType.Number, defaultValue: self.defaultValue }],
  }))
  /** */
  exampleCommand_Documented(exampleString: string, exampleNumber: number) {
    alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
  }

  // #endregion

  @block({
    type: "hat",
    text: `Should the below block execute? `,
  })
  async exampleHat(util: BlockUtility) {
    return util.stackFrame.isLoop;
  }
}


