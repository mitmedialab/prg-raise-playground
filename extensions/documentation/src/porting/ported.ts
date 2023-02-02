import { DefaultDisplayDetails } from "$testing/defaults";
import { codeSnippet } from "../../";

export const extension = codeSnippet();

import { BlockDefinitions, Environment, Extension, BlockType, ArgumentType } from "$common";
// Import the object returned by our invocation of the 'extractLegacySupportFromOldGetInfo' function
import { legacy } from "./legacy";

type Block = (someArg: string, someArgWithOptions: number) => number;

export default class ExampleExtension extends Extension<DefaultDisplayDetails, {
  /**
   * This represents the block that our new extension will implement that 'replaces' / supercedes
   * the block from our old extension 
   * (while still preserving the ability to load-in projects saved using the old extension).
   */
  exampleUpdatedBlock: Block
}> {
  init(env: Environment): void { }

  defineBlocks(): BlockDefinitions<ExampleExtension> {
    return {
      /**
       * When defining our block in the new Extension format, we'll make use of the 'legacy' object.
       * This will ensure our new block definition matches the old block definition in such a way that
       * projects saved using the old extension work with the new extension.
       * 
       * First, we locate the "opcode" of the block we want to replace on the 'legacy' object
       * (if you need help remembering which opcode is tied to which block, 
       * consult the old extension's 'getInfo' method).
       * 
       * Each old "opcode" will be a function on the 'legacy' object that accepts our new block definition.
       * 
       * Typescript will ensure that the types of the old & new block match, along with their arguemnts.
       * Typescript will also ensure that, if an argument previously used a 'menu', 
       * an 'options' value must be provided when defining the corresponding arg / args entry.
       * 
       * At runtime, this function it will attach 'names' to the blocks, their arguments, and their menus 
       * to ensure old saved projects can interop with our new extension.
       * 
       * Also, at runtime, the 'options' values will be compared against the values in their corresponding 'menu' 
       * (if the menu was provided in the object given to the 'extractLegacySupportFromOldGetInfo' function)
       */
      exampleUpdatedBlock: legacy.exampleLegacyBlock({
        type: BlockType.Reporter,
        args: [
          { type: ArgumentType.String, options: ["A", "B", "C"] },
          { type: ArgumentType.Number, options: [0, 1, 2] },
        ],
        text: (someArg, someArgWithOptions) => `New dummy text ${someArg} ${someArgWithOptions}`,
        operation: (someArg, someArgWithOptions) => {
          // do something
          return 0;
        }
      })
    }
  }
}

extension.end;