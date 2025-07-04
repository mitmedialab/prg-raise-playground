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
  name: "RAISE Conference",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
export default class ExtensionNameGoesHere extends extension(details) {

  password: string;
  stage;
  /** @see {ExplanationOfInitMethod} */
  init(env: Environment) {
    this.exampleField = 0;
    this.password = "";
    for (const target of env.runtime.targets) {
      if (target.isStage) {
        this.stage = target;
      }
    }

  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  getPosition(utility: BlockUtilityWithID) {
    return [utility.thread.target.x, utility.thread.target.y];
  }

  getCostumeName(target) {
    const costumeIndex = target.currentCostume;
    const costumes = target.sprite.costumes;
    return costumes[costumeIndex];
  }

  /** @see {ExplanationOfExampleReporter}*/
  @(scratch.reporter`Show password`)
  showPassword(utility: BlockUtilityWithID) {
    console.log("utility", utility);
    console.log("currentcostume", this.getCostumeName(this.stage));
    const position = this.getPosition(utility);
    if (position[0] == 20 && position[1] == 100) {
      return "HEY";
    } else {
      return "NO";
    }
  }

}