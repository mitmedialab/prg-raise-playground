import { ArgumentType } from './enums';
import type { ExtensionMenuDisplayDetails, ExtensionBlocks, ExtensionMetadata, BlockDefinitions, Environment, TypeByArgumentType, Translations } from './types';
import Runtime from "../engine/Runtime";
export declare type CodeGenArgs = {
    name: never;
    id: never;
    blockIconURI: never;
};
/**
 * Base class for all extensions implemented via the Typescript Extension Framework.
 * @template MenuDetails How the extension should display in the extensions menu
 * @template Blocks What kind of blocks this extension implements
 */
export declare abstract class Extension<MenuDetails extends ExtensionMenuDisplayDetails, Blocks extends ExtensionBlocks> {
    runtime: Runtime;
    readonly BlockFunctions: Blocks;
    readonly BlockDefinitions: BlockDefinitions<Blocks>;
    readonly Translations: Translations<Extension<MenuDetails, Blocks>>;
    private readonly internal_blocks;
    private readonly internal_menus;
    constructor(runtime: Runtime, codeGenArgs: CodeGenArgs);
    /**
     * Prevent users from defining their own extension ID (which will be filled in through code generation)
     */
    readonly id: never;
    /**
     * Prevent users from re-defining an extension Name (which is already defined through ExtensionMenuDisplayDetails)
     */
    readonly name: never;
    /**
     * Prevent users from re-defining the blockIconURI (the insetIconURI from ExtensionMenuDisplayDetails will be encoded and used)
     */
    readonly blockIconURI: never;
    /**
     * @summary This function will be called when a user adds your extension via the Extensions Menu (i.e. when your extension is instantiated)
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
     * For Scratch developers: The `runtime` property on env is the same as the runtime passed to Extension constructors
     */
    abstract init(env: Environment): void;
    /**
     * @example
     * // Returning an object with single block definition function for 'someBlock'
     * defineBlocks(): MyExtension["BlockDefinitions"] {
     *  return {
     *    // Using arrow function syntax
     *    someBlock: (self: MyExtension) => ({
     *      type: BlockType.Reporter,
     *      args: ArgumentType.String,
     *      text: (argument) => `Some text about ${argument}`,
     *      operation: (argument) => {
     *        // do something
     *      }
     *    })
     *  }
     * }
     * @example
     * // Returning an object with single block definition function for 'someBlock'
     * defineBlocks(): MyExtension["BlockDefinitions"] {
     *  return {
     *    // Using arrow function syntax
     *    someBlock: (self: MyExtension) => ({
     *      type: BlockType.Reporter,
     *      args: ArgumentType.String,
     *      text: (argument) => `Some text about ${argument}`,
     *      operation: (argument) => {
     *        // do something
     *      }
     *    })
     *  }
     * }
     * @see BlockDefinitions
     * @returns {BlockDefinitions<Blocks>} An object defining 'block definition' functions for each block associated with this Extension.
     */
    abstract defineBlocks(): BlockDefinitions<Blocks>;
    /**
     * Define the translations for this extension.
     *
     * Ignore this for now (but don't delete it)!
     *
     * Translations are still a work in progress, but will be supported.
     */
    abstract defineTranslations(): Translations<Extension<MenuDetails, Blocks>>;
    getInfo(): ExtensionMetadata;
    private addStaticMenu;
    private addDynamicMenu;
    private convertToInfo;
    private format;
    static TryCastToArgumentType: <T extends ArgumentType>(argumentType: T, value: any, onFailure: (value: any) => TypeByArgumentType[T]) => TypeByArgumentType[T];
    private static GetArgTranslationID;
    private static GetInternalKey;
    private static GetArgumentType;
    private static ToFlag;
    private static ToMatrix;
    private static CastToType;
    private static ConvertMenuItemsToString;
    private static IsPrimitive;
    private static IsFunction;
    private static IsString;
}
