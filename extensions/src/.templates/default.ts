import { ArgumentType, BlockType, BlockUtilityWithID, Environment, ExtensionMenuDisplayDetails, extension, scratch } from "$common";
import BlockUtility from "$scratch-vm/engine/block-utility";

/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be delete when you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part to get a popup that tells you more about the code.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
/** @see {ExplanationOfInitMethod} */
export default class ExtensionNameGoesHere extends extension(details) {

  init(env: Environment) {
    this.exampleField = 0;
  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  /** @see {ExplanationOfBlockType} */
  /** @see {ExplanationOfReporterBlock} */
  @(scratch.reporter`This increments an internal field and then reports it's value`)
  exampleReporter() {
    return ++this.exampleField;
  }
  
  /** @see {ExplanationOfCommandBlock} */
  @(scratch.command(
    (instance, $) => 
      /** @see {ExplanationOfBlockArg} */
      $`This is the block's display text with inputs here --> ${"string"} and here --> ${{type: "number", defaultValue: instance.exampleField}}`
  ))
  exampleCommand(exampleString: string, exampleNumber: number) {
    alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
  }

  /** @see {ExplanationOfHatBlock} */
  @(scratch.hat`Should the below block execute: ${"Boolean"}`)
  /** @see {ExplanationOfBlockUtilityWithID} */
  async exampleHat(condition: boolean, util: BlockUtilityWithID) {
    return util.stackFrame.isLoop === condition;
  }
}