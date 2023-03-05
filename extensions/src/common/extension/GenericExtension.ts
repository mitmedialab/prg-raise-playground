import { ExtensionMenuDisplayDetails, ExtensionBlocks, BlockDefinitions, Translations } from "$common/types";
import { isFunction } from "$common/utils";
import { extension } from "./index";
import { getImplementationName } from "./mixins/required/scratchInfo/index";

export const getAlternativeOpcodeName = (opcode: string) => `__block_${opcode}`;

/**
 * @summary Base class for extensions implemented via the Typescript Extension Framework (using the "generic" strategy).
 * @example
 * class MyExtension extends Extension<
 *  { // Display details
 *    name: "My Extension",
 *    description: "This is my extension",
 *    iconURL: "example.png",
 *    insetIconURL: "example.svg"
 *  },
 *  { // Blocks
 *    myBlock: (someArg: number) => void;
 *  }
 * > {
 *  init(env: Environment): { ... };
 *  defineBlocks(): MyExtension["BlockDefinitions"] { return ... }
 * }
 * @description Extension developers will create Typescript classes that `extend` (or 'inherit', or 'implement') this `Extension` class.
 *
 * In order to `extend` this class, you must first specify 2 generic type arguments, which effectively describe what kind of Extension you're implementing.
 *
 * More specifically, the 2 generic type arguments describe how this extension is presented to the user (by specifyng the details displayed in the Extensions Menu),
 * and what this Extension actually does (by specifying the blocks it will define).
 *
 * By declaring that we're extending an `Extension` with our specific generic type arguments,
 * Typescript holds us accountable to implement exactly what we said we would (all in order to make a working extension).
 *
 * This includes:
 * * Defining an `init` method, which is used INSTEAD of a constructor
 * * Defining a `defineBlocks` method that does just that: defines this extension's blocks
 * @template MenuDetails How the extension should display in the extensions menu
 * @template Blocks What kind of blocks this extension implements
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics!
 */

export abstract class Extension<
  MenuDetails extends ExtensionMenuDisplayDetails,
  Blocks extends ExtensionBlocks
> extends extension(undefined, "ui", "customSaveData", "customArguments") {

  readonly BlockFunctions: Blocks;
  readonly BlockDefinitions: BlockDefinitions<typeof this>;
  readonly Translations: Translations<typeof this>;

  /**
   * @summary Extension member method that returns an object defining all blocks that belong to the extension.
   * @description Every block your extension implements (defined by the second generic argument of the Extension class), will have an entry in the object return by this function.
   * Each entry will either be an object or a function that returns an object that provides the:
   * - type: the type of block
   * - text: what is displayed on the block
   * - arg or args: the arguments the block accepts
   * - operation: the function that is called when the blocked is executed
   * @example
   * // Returning an object with two block definition function for 'someBlock'
   * defineBlocks(): ExampleExtension["BlockDefinitions"] {
   *  return {
   *    // Using object syntax
   *    someBlock: {
   *      type: BlockType.Reporter,
   *      arg: ArgumentType.String,
   *      text: (argument) => `Some text about ${argument}`,
   *      operation: (argument) => {
   *        // do something
   *      }
   *    },
   *    // Using arrow function syntax
   *    someBlock: (self: MyExtension) => ({
   *      type: BlockType.Reporter,
   *      arg: ArgumentType.String,
   *      text: (argument) => `Some text about ${argument}`,
   *      operation: (argument) => {
   *        // do something
   *      }
   *    }),
   *    // Using method function syntax
   *    someOtherBlock(self: MyExtension) {
   *      const type = BlockType.Reporter;
   *      const arg = ArgumentType.String;
   *      return {
   *        arg, type,
   *        text: (argument) => `Some text about ${argument}`,
   *        operation: (argument) => {
   *          // do something
   *        }
   *      }
   *    }
   *  }
   * }
   * @see BlockDefinitions
   * @returns {BlockDefinitions<Blocks>} An object defining 'block definition' objects / functions for each block associated with this Extension.
   */
  abstract defineBlocks(): BlockDefinitions<Extension<MenuDetails, Blocks>>;

  protected internal_init(): void {
    super.internal_init();
    const blocks = this.defineBlocks();
    const self = this;
    for (const opcode in blocks) {
      const block = blocks[opcode];
      const validOpcode = opcode in this ? getAlternativeOpcodeName(opcode) : opcode;
      const { operation, text, arg, args, type } = isFunction(block) ? block.call(this, this) : block;;
      this.pushBlock(validOpcode, { text, arg, args, type }, operation);
      const internalFuncName = getImplementationName(validOpcode);
      (this as any)[validOpcode] = function () { return self[internalFuncName].call(self, ...arguments); };
    }
  }
}
