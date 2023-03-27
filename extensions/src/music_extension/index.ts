import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

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
  name: "GANSynth",
  description: "Created with Magenta's GanSynth library, fuse together different types of sounds to create new types of sounds",
  iconURL: "extension-icon.png",
  insetIconURL: "extension-icon.png"
};

/** @see {ExplanationOfClass} */
/** @see {ExplanationOfInitMethod} */
export default class GANSynth extends extension(details) {

  init(env: Environment) {
    this.exampleField = 0;
  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  // /** @see {ExplanationOfReporterBlock} */
  // @block({ type: "reporter", text: "This increments an internal field and then reports it's value" })
  // exampleReporter() {
  //   return ++this.exampleField;
  // }

  // This is the way the block shows up in the interface
  /** @see {ExplanationOfCommandBlock} */
  @block((self) => ({
    /** @see {ExplanationOfBlockType} */
    type: BlockType.Command,
    /** @see {ExplanationOfBlockTextFunction} */
    text: (note, exampleString, exampleNumber) => `play note ${note} with ${exampleNumber} % sound ${exampleString} and ${exampleNumber} % sound ${exampleString}`,
    /** @see {ExplanationOfBlockArgs} */
    args: [ArgumentType.Note, {type: ArgumentType.String,options: ["timber", "piano"], defaultValue: "timber"}, { type: ArgumentType.Number, defaultValue: self.exampleField }],
  }))
  
  /** This is the function! What the block does */
  exampleCommand(note: number, exampleString: string, exampleNumber: number) {
    alert(`This is a command! Here's what it received:  ${note} and ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
  }

    // /** @see {ExplanationOfCommandBlock} */
    // @block((self) => ({
    //   /** @see {ExplanationOfBlockType} */
    //   type: BlockType.Command,
    //   /** @see {ExplanationOfBlockTextFunction} */
    //   text: (note, firstnum, soundone, secondnum, soundtwo) => `play note ${note} with ${firstnum} %
    //          sound ${soundone} and ${secondnum} % sound ${soundtwo}`,
    //   /** @see {ExplanationOfBlockArgs} */
    //   args: [ArgumentType.String, {type: ArgumentType.Number, defaultValue: self.exampleField},
    //         {type: ArgumentType.String, options: ["timber", "piano"], defaultValue: "timber"},
    //         {type: ArgumentType.Number, defaultValue: self.exampleField}, {type: ArgumentType.String,
    //            options: ["timber", "piano"], defaultValue: "timber"}],
    // }))
    // exampleCommand(exampleString: string, exampleNumber: number) {
    //   alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
    // }

  /** @see {ExplanationOfHatBlock} */
  /** @see {ExplanationOfBlockUtility} */
  @block({
    type: "hat",
    text: (condition) => `Should the below block execute: ${condition}`,
    /** @see {ExplanationOfBlockArg} */
    arg: "Boolean"
  })
  async exampleHat(condition: boolean, util: BlockUtility) {
    return util.stackFrame.isLoop === condition;
  }
}