import { scratch, extension, type ExtensionMenuDisplayDetails, type BlockUtilityWithID, type Environment } from "$common";

/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be deleted whenever you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part (the text inside of the {...} curly brackets) 
to get a popup that tells you more about that concept.

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
export default class ExtensionNameGoesHere extends extension(details) {

  /** @see {ExplanationOfInitMethod} */
  init(env: Environment) {
    this.exampleField = 0;
  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  /** @see {ExplanationOfExampleReporter}*/
  @(scratch.reporter`This is the block's display text (so replace me with what you want the block to say)`)
  exampleReporter() {
    return ++this.exampleField;
  }

  /** @see {ExplanationOfReporterWithArguments}*/
  @(scratch.reporter`This is the block's display text with inputs here --> ${"string"} and here --> ${{ type: "number", defaultValue: 1 }}`)
  reporterThatTakesTwoArguments(exampleString: string, exampleNumber: number) {
    return exampleString + exampleNumber;
  }

  /** @see {ExplanationOfExampleCommand} */
  @(scratch.command`This is the block's display text`)
  exampleCommand() {
    alert("This is a command!");
  }

  /** @see {ExplanationOfCommandWithExtendDefinition} */
  @(scratch.command((instance, tag) => {
    console.log("Creating a block for extension: ", instance.id);
    return tag`This is the block's display text`;
  }))
  exampleCommandWithExtendedDefinition() {
    alert("This is a command defined using the extended definition strategy!");
  }

  /** @see {ExplanationOfExampleHatAndBlockUtility} */
  @(scratch.hat`Should the below block execute: ${"Boolean"}`)
  async exampleHatThatUsesBlockUtility(condition: boolean, util: BlockUtilityWithID) {
    return util.stackFrame.isLoop === condition;
  }
}