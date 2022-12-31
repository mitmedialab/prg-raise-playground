import { ArgumentType, BlockType, Language } from './enums';
import type { ExtensionMenuDisplayDetails, ExtensionBlocks, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem, RGBObject, BlockDefinitions, VerboseArgument, Environment, Menu, DynamicMenu, MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters, TypeByArgumentType, AllText, Translations, BlockOperation, ValueOf } from './types';
import Cast from '$scratch-vm/util/cast';
//import * as formatMessage from 'format-message';
import Runtime from "$scratch-vm/engine/runtime";
import { openUI, registerButtonCallback } from './ui';
import { isFunction } from './utils';

export type CodeGenArgs = {
  name: never,
  id: never,
  blockIconURI: never,
}

export type PopulateCodeGenArgs = { [k in keyof CodeGenArgs]: CodeGenArgs[k] extends never ? string : never };

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
 *  defineTranslations(): MyExtension["Translations"] { return ... }
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
 * * Defining a `defineTranslations` method for international support -- ignore this for now, coming soon!
 * @template MenuDetails How the extension should display in the extensions menu 
 * @template Blocks What kind of blocks this extension implements
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
export abstract class Extension
  <
    MenuDetails extends ExtensionMenuDisplayDetails,
    Blocks extends ExtensionBlocks
  > {
  runtime: Runtime;

  readonly BlockFunctions: Blocks;
  readonly BlockDefinitions: BlockDefinitions<Blocks>;
  readonly Translations: Translations<Extension<MenuDetails, Blocks>>;

  private readonly internal_blocks: ExtensionBlockMetadata[] = [];
  private readonly internal_menus: ExtensionMenuMetadata[] = [];

  openUI(component: string, label?: string) {
    const { id, name, runtime } = this;
    openUI(runtime, { id, name, component: component.replace(".svelte", ""), label });
  }

  constructor(runtime: Runtime, codeGenArgs: CodeGenArgs) {
    const { name, id, blockIconURI } = codeGenArgs;
    this.name = name;
    this.id = id;
    this.blockIconURI = blockIconURI;
    this.runtime = runtime;
    Extension.ExtensionsByID.set(id, this);
  }

  private internal_init() {
    this.init({ runtime: this.runtime, videoFeed: this.runtime.ioDevices?.video });
    const definitions = this.defineBlocks();
    const menus: Menu<any>[] = [];
    for (const key in definitions) {
      const block = definitions[key](this);
      const info = this.convertToInfo(key, block, menus);
      this.internal_blocks.push(info);
    }

    const reporterItemsKey: keyof MenuThatAcceptsReporters<any> = "items";
    const reporterItemsGetterKey: keyof DynamicMenuThatAcceptsReporters<any> = "getItems";
    for (const menu of menus) {
      let acceptReporters = false;

      if (Array.isArray(menu)) {
        const items: any[] | MenuItem<any>[] = menu;
        this.addStaticMenu(items, acceptReporters);
        continue;
      }

      if (Extension.IsFunction(menu)) {
        const getItems = menu as DynamicMenu<any>;
        this.addDynamicMenu(getItems, acceptReporters);
        continue;
      }

      acceptReporters = true;

      if (reporterItemsKey in menu) {
        const nonDynamic = menu as MenuThatAcceptsReporters<any>;
        this.addStaticMenu(nonDynamic.items, acceptReporters);
        continue;
      }

      if (reporterItemsGetterKey in menu) {
        const dynamicMenu = menu as DynamicMenuThatAcceptsReporters<any>;
        this.addDynamicMenu(dynamicMenu.getItems, acceptReporters);
        continue;
      }
    }
  }

  /**
   * The ID of this extension.
   * NOTE: The `never` type is used to prevent users from defining their own extension ID (which will be filled in through code generation).
   */
  readonly id: string & never;

  /**
   * The name of this extension.
   * NOTE: The `never` type is used to prevent users from re-defining an extension Name (which is already defined through ExtensionMenuDisplayDetails)
   */
  readonly name: string & never;

  /**
   * NOTE: The `never` type is used to prevent users from re-defining the blockIconURI (the insetIconURI from ExtensionMenuDisplayDetails will be encoded and used)
   */
  private readonly blockIconURI: never;

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

  /**
   * @summary This member function (or 'method') will be called to 
   * @example
   * // Returning an object with two block definition function for 'someBlock'
   * defineBlocks(): ExampleExtension["BlockDefinitions"] {
   *  return {
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
   * @returns {BlockDefinitions<Blocks>} An object defining 'block definition' functions for each block associated with this Extension.
   */
  abstract defineBlocks(): BlockDefinitions<Blocks>;

  /**
   * @summary Define the translations for this extension.
   * 
   * @description Ignore this for now (but don't delete it)! 
   * 
   * Translations are still a work in progress, but will be supported.
   */
  abstract defineTranslations(): Translations<Extension<MenuDetails, Blocks>>;

  private getInfo(): ExtensionMetadata {
    const { id, internal_blocks: blocks, internal_menus: menus, name, blockIconURI } = this;
    const info = { id, blocks, name, blockIconURI };
    if (menus) info['menus'] = Object.entries(this.internal_menus).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

    return info;
  }

  private addStaticMenu(items: MenuItem<any>[], acceptReporters: boolean) {
    this.internal_menus.push({
      acceptReporters,
      items: items.map(item => item /**TODO figure out how to format */).map(Extension.ConvertMenuItemsToString)
    });
  }

  private addDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean) {
    const key = `internal_dynamic_${this.internal_menus.length}`;
    this[key] = () => {
      const items = getItems();
      return items.map(item => item).map(Extension.ConvertMenuItemsToString);
    };
    this.internal_menus.push({ acceptReporters, items: key });
  }

  private convertToInfo(key: string, block: Block<BlockOperation>, menusToAdd: MenuItem<any>[]): ExtensionBlockMetadata {
    const { type, text, operation } = block;
    const args: Argument<any>[] = block.arg ? [block.arg] : block.args;

    const defaultText: string = Extension.IsFunction(text)
      ? (text as unknown as (...params: any[]) => string)(...args.map((_, index) => `[${index}]`))
      : text as string;

    const displayText = this.format(defaultText, key, `Block text for '${key}'`);

    type Handler = MenuThatAcceptsReporters<any>['handler'];
    const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
    const handlers = args ? new Array<Handler>(args.length).fill(undefined) : undefined;

    const argsInfo: Record<string, ExtensionArgumentMetadata> = args?.map((element, index) => {
      const entry = {} as ExtensionArgumentMetadata;
      entry.type = Extension.GetArgumentType(element);

      if (Extension.IsPrimitive(element)) return entry;

      const { defaultValue, options } = element as VerboseArgument<any>;

      if (defaultValue !== undefined) entry.defaultValue =
        Extension.IsString(entry)
          ? this.format(defaultValue, Extension.GetArgTranslationID(key, index), `Default value for arg ${index + 1} of ${key} block`)
          : defaultValue;

      if (!options) return entry;

      const alreadyAddedIndex = menusToAdd.indexOf(options);
      const menuIndex = alreadyAddedIndex >= 0 ? alreadyAddedIndex : menusToAdd.push(options) - 1;
      entry.menu = `${menuIndex}`;

      if (handlerKey in options) {
        const { handler } = options as MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any>;
        handlers[index] = handler;
      }

      return entry;
    })
      .reduce((accumulation, value, index) => {
        accumulation[`${index}`] = value;
        return accumulation;
      }, {});

    const opcode = Extension.GetInternalKey(key);
    const bound = operation.bind(this);

    const isButton = type === BlockType.Button;
    const buttonID = isButton ? Extension.GetButtonID(this.id, opcode) : undefined;

    if (isButton) {
      registerButtonCallback(this.runtime, buttonID, bound)
    }
    else {
      this[opcode] = (argsFromScratch, blockUtility) => {
        const { mutation } = argsFromScratch; // if we need it...
        // NOTE: Assumption is that args order will be correct since their keys are parsable as ints (i.e. '0', '1', ...)
        const uncasted = Object.values(argsFromScratch).slice(0, -1);
        const casted = uncasted.map((value, index) => {
          const handled = handlers[index] ? handlers[index](value) : value;
          const type = Extension.GetArgumentType(args[index]);
          return Extension.CastToType(type, handled)
        });
        return bound(...casted, blockUtility); // can add more util params as necessary
      }
    }

    return {
      opcode,
      text: displayText,
      blockType: type,
      arguments: argsInfo,
      func: buttonID,
    }
  }

  private format(text: string, identifier: string, description: string): string {
    return text;
    /** 
    return formatMessage({
      id: `extension.${this.id}.${identifier}`,
      default: text,
      description: `${description} (of '${this.name}' extension)`,
    });
    */
  }

  /*
    addTranslations(map: Record<Language, string>) {
      const translations = this.getTranslations();
      if (!translations) return;
  
      for (const key in map) {
        if (!(key in translations)) continue;
  
        const forLocale = translations[key as Language];
        if (!forLocale) continue;
  
        for (const translationID in forLocale) {
          map[translationID] = forLocale[translationID];
        }
      }
    }
  */

  static GetExtensionByID = <T extends Extension<any, any>>(id: string): T => {
    if (Extension.ExtensionsByID.has(id)) return Extension.ExtensionsByID.get(id) as T;
    console.error(`Could not find extension with id '${id}'`);
    return undefined;
  }

  static TryCastToArgumentType = <T extends ValueOf<typeof ArgumentType>>(
    argumentType: T,
    value: any,
    onFailure: (value: any) => TypeByArgumentType<T>
  ): TypeByArgumentType<T> => {
    try {
      const casted = Extension.CastToType(argumentType, value);
      return casted as TypeByArgumentType<T>;
    }
    catch {
      return onFailure(value);
    }
  }

  static GetKeyFromOpcode = (opcode: string) => opcode.replace(Extension.GetInternalKey(""), "");

  private static GetArgTranslationID = (blockname: string, index: number) => {
    return `${blockname}-arg${index}-default`;
  }

  private static GetInternalKey = (key: string) => `internal_${key}`;
  private static GetButtonID = (id: string, opcode: string) => `${id}_${opcode}`;

  private static GetArgumentType = <T>(arg: Argument<T>): ValueOf<typeof ArgumentType> =>
    Extension.IsPrimitive(arg) ? arg as ValueOf<typeof ArgumentType> : (arg as VerboseArgument<T>).type;

  private static ToFlag = (value: string): boolean => parseInt(value) === 1;

  private static ToMatrix = (matrixString: string): boolean[][] => {
    if (matrixString.length !== 25) return new Array(5).fill(new Array(5).fill(false));

    const entries = matrixString.split('');
    const matrix = entries.map(Extension.ToFlag).reduce((matrix, flag, index) => {
      const row = Math.floor(index / 5);
      const column = index % 5;
      (column === 0) ? matrix[row] = [flag] : matrix[row].push(flag);
      return matrix;
    }, new Array<boolean[]>(5));

    return matrix;
  }

  private static CastToType = (argumentType: ValueOf<typeof ArgumentType>, value: any) => {
    switch (argumentType) {
      case ArgumentType.String:
        return `${value}`;
      case ArgumentType.Number:
        return parseFloat(value);
      case ArgumentType.Boolean:
        return JSON.parse(value);
      case ArgumentType.Note:
        return parseInt(value);
      case ArgumentType.Angle:
        return parseInt(value);
      case ArgumentType.Matrix:
        return Extension.ToMatrix(value);
      case ArgumentType.Color:
        return Cast.toRgbColorObject(value) as RGBObject;
      default:
        throw new Error(`Method not implemented for value of ${value} and type ${argumentType}`);
    }
  }

  private static ConvertMenuItemsToString = (item: any | MenuItem<any>) =>
    Extension.IsPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };

  private static IsPrimitive = (query) => query !== Object(query);
  private static IsFunction = (query) => isFunction(query);

  private static IsString = (query) => typeof query === 'string' || query instanceof String;

  private static ExtensionsByID = new Map<string, Extension<any, any>>();

  static TestGetInfo = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["getInfo"]>) => ext.getInfo(...params);
  static TestGetBlocks = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["getInfo"]>) => ext.getInfo(...params).blocks as ExtensionBlockMetadata[];
  static TestInit = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["internal_init"]>) => ext.internal_init(...params);
};
