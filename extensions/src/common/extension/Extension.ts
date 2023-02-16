import type Runtime from "$scratch-vm/engine/runtime";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import customSaveData from "$common/extension/mixins/customSaveData";
import scratchInfo, { getImplementationName } from "$common/extension/mixins/scratchInfo";
import customArgumentSupport from "$common/extension/mixins/customArguments";
import uiSupport from "$common/extension/mixins/ui";
import { BlockOperation, Block, BaseExtension, Environment, ExtensionMenuDisplayDetails, ExtensionBlocks, BlockDefinitions, Translations } from "$common/types";
import { isFunction } from "$common/utils";

export type BlockV2<Fn extends BlockOperation> = Parameters<Fn> extends [...infer R extends any[], BlockUtility]
  ? Omit<Block<BaseExtension, (...args: R) => ReturnType<Fn>>, "operation">
  : Omit<Block<BaseExtension, Fn>, "operation">;

export type CodeGenArgs = {
  name: never,
  id: never,
  blockIconURI: never,
}

type ExlcudeFirst<F> = F extends [any, ...infer R] ? R : never;
export type CodeGenParams = ExlcudeFirst<ConstructorParameters<typeof ExtensionBase>>;

export abstract class ExtensionBase {
  /**
   * @summary This member function (or 'method') will be called when a user adds your extension via the Extensions Menu (i.e. when your extension is instantiated)
   * @example
   * // Initialize class field(s)
   * private count: number;
   * 
   * init() {
   *  count = 0;
   * }
   * @example 
   * // Interact with environment's runtime 
   * init(env: Environment) {
   *  env.runtime.emit(RuntimeEvent.ProjectStart);
   * }
   * @example 
   * // Nothing to initialize
   * init() {}
   * @description This function is intended to behave exactly like a constructor, used to initialize the state of your extension.
   * 
   * The reason we use this function INSTEAD of a constructor is so that the base Extension class can manage the construction of this class.
   * @param {Environment} env An object that allows your Extension to interact with the Scratch Environment. Currently is a little bare, but will be expanded soon.
   * Can be ommitted if not needed.
   * 
   * For Scratch developers: The `runtime` property on env is the same as the runtime passed to non-Typescript-Framework Extension constructors
   */
  abstract init(env: Environment): void;

  protected internal_init() {
    this.init({ runtime: this.runtime, videoFeed: this.runtime.ioDevices?.video });
  }

  /**
   * 
   * @param runtime The 'runtime' connected to the scratch-vm that enables your extension to interact with the scratch workspace
   * @param name The name of this extension.
   * @param id The ID of this extension.
   * @param blockIconURI 
   */
  constructor(readonly runtime: Runtime, readonly name: string, readonly id: string, readonly blockIconURI: string) { }
}

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type NonAbstractConstructor<T> = new (...args: any[]) => T;
export type TypedConstructor<T> = new (...args: any[]) => T;
export type ExtensionBaseConstructor = AbstractConstructor<ExtensionBase>;

const applyAllMixins = (base: ExtensionBaseConstructor) =>
  scratchInfo(
    customSaveData(
      customArgumentSupport(
        uiSupport(
          (
            base
          )
        )
      )
    )
  );

export const extensionsMap = new Map<string, DecoratedExtension>();

export abstract class ExtensionCommon extends applyAllMixins(ExtensionBase) {
  /**
   * Prevent developers from implementing the constructor.
   * This must be controlled by the framework since Scratch is the one who calls the extension's constructor.
   * @param FORBIDDEN 
   */
  constructor(FORBIDDEN: never) {
    super(...arguments);
  }
}

export abstract class DecoratedExtension extends ExtensionCommon { }

export const getAlternativeOpcodeName = (opcode: string) => `__block_${opcode}`;

/**
 * @summary Base class for all extensions implemented via the Typescript Extension Framework.
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
export abstract class Extension
  <
    MenuDetails extends ExtensionMenuDisplayDetails,
    Blocks extends ExtensionBlocks
  > extends ExtensionCommon {

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
    for (const opcode in blocks) {
      const block = blocks[opcode];
      const validOpcode = opcode in this ? getAlternativeOpcodeName(opcode) : opcode;
      const { operation, text, arg, args, type } = isFunction(block) ? block.call(this, this) : block;;
      this.pushBlock(validOpcode, { text, arg, args, type }, operation);
      const internalFuncName = getImplementationName(validOpcode);
      (this as any)[validOpcode] = function () { return this[internalFuncName].call(this, ...arguments) };
    }
  }
};