import { ArgumentType, BlockType, Language } from './enums';
import type { ExtensionMenuDisplayDetails, ExtensionBlocks, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem, RGBObject, BlockDefinitions, VerboseArgument, Environment, Menu, DynamicMenu, MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters, TypeByArgumentType, AllText, Translations, BlockOperation, ValueOf, BaseExtension, ExtensionMenuItems } from './types';
import Cast from '$scratch-vm/util/cast';
//import * as formatMessage from 'format-message';
import Runtime from "$scratch-vm/engine/runtime";
import { openUI, registerButtonCallback } from './ui';
import { identity, isFunction, isPrimitive, isString } from './utils';
import { isCustomArgumentHack, processCustomArgumentHack } from './customArguments';
import { customArgumentCheck, customArgumentFlag } from './globals';
import CustomArgumentManager, { ArgumentEntry } from './customArguments/CustomArgumentManager';
import { SaveDataHandler } from './SavaDataHandler';

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
  > {
  runtime: Runtime;

  /**
   * Optional field that can be defined if you need to save custom data for an extension 
   * (like some extension specific variable, or an API endpoint).
   * @example
   * class Example extends Extension<..., ...> {
   *    someValue = 5;
   *    ...
   *    saveDataHandler = new SaveDataHandler({
   *      Extension: Example,
   *      // NOTE: The type info for 'instance' could be left off in the line below
   *      onSave: (instance: Example) => ({ valueToSave: instance.someValue }),
   *      onLoad: (instance, data) => instance.someValue = data.valueToSave
   *    })
   * }
   * @see Extension.MakeSaveDataHandler
   */
  protected saveDataHandler: SaveDataHandler<typeof this, any> = undefined;

  readonly BlockFunctions: Blocks;
  readonly BlockDefinitions: BlockDefinitions<typeof this>;
  readonly Translations: Translations<typeof this>;

  private readonly internal_blocks: ExtensionBlockMetadata[] = [];
  private readonly internal_menus: (ExtensionMenuItems & { name: string })[] = [];

  private keyByLegacyName: Record<keyof Blocks, string> = undefined;

  private argumentManager: CustomArgumentManager = null;

  public get customArgumentManager(): CustomArgumentManager {
    return this.argumentManager
  }

  /**
   * WARNING! If you change this key, it will affect already saved projects.
   * Do not rename this without first developing a mechanism for searching for previously used keys.
   */
  private static SaveDataKey = "customSaveDataPerExtension" as const;

  /**
   * Save function called 'internally' by the VM when serializing a project.
   * @param toSave 
   * @param extensionIDs 
   * @returns 
   */
  private save(toSave: { [Extension.SaveDataKey]: Record<string, any> }, extensionIDs: Set<string>) {
    const { saveDataHandler, id, argumentManager } = this;
    const saveData = saveDataHandler?.hooks.onSave(this) ?? {};
    argumentManager?.saveTo(saveData);
    if (Object.keys(saveData).length === 0) return;
    const container = toSave[Extension.SaveDataKey];
    container ? (container[id] = saveData) : (toSave[Extension.SaveDataKey] = { [id]: saveData });
    extensionIDs.add(id);
  }

  /**
   * Load function called 'internally' by the VM when loading a project.
   * Will be invoked on an extension immediately after it is constructed.
   * @param saved 
   * @returns 
   */
  private load(saved: { [Extension.SaveDataKey]: Record<string, any> }) {
    if (!saved) return;
    const { saveDataHandler, id } = this;
    const saveData = Extension.SaveDataKey in saved ? saved[Extension.SaveDataKey][id] : null;
    if (!saveData) return;
    saveDataHandler?.hooks.onLoad(this, saveData);
    (this.argumentManager ??= new CustomArgumentManager()).loadFrom(saveData);
  }


  openUI(component: string, label?: string) {
    const { id, name, runtime } = this;
    openUI(runtime, { id, name, component: component.replace(".svelte", ""), label });
  }

  constructor(runtime: never, codeGenArgs?: CodeGenArgs) {
    const { name, id, blockIconURI } = codeGenArgs ?? this[Extension.InternalCodeGenArgsGetterKey]() as CodeGenArgs;
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
    const menuNames: string[] = [];
    for (const key in definitions) {
      const block = isFunction(definitions[key]) ? (definitions[key] as Function)(this) : definitions[key];
      const info = this.convertToInfo(key, block, menus, menuNames);
      this.internal_blocks.push(info);
    }

    const reporterItemsKey: keyof MenuThatAcceptsReporters<any> = "items";
    const reporterItemsGetterKey: keyof DynamicMenuThatAcceptsReporters<any> = "getItems";
    for (const [index, menu] of menus.entries()) {
      let acceptReporters = false;
      const name = menuNames[index];

      if (Array.isArray(menu)) {
        const items: any[] | MenuItem<any>[] = menu;
        this.addStaticMenu(items, acceptReporters, name);
        continue;
      }

      if (isFunction(menu)) {
        const getItems = menu as DynamicMenu<any>;
        this.addDynamicMenu(getItems, acceptReporters, name);
        continue;
      }

      acceptReporters = true;

      if (reporterItemsKey in menu) {
        const nonDynamic = menu as MenuThatAcceptsReporters<any>;
        this.addStaticMenu(nonDynamic.items, acceptReporters, name);
        continue;
      }

      if (reporterItemsGetterKey in menu) {
        const dynamicMenu = menu as DynamicMenuThatAcceptsReporters<any>;
        this.addDynamicMenu(dynamicMenu.getItems, acceptReporters, name);
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

  /**
   * @summary Define the translations for this extension.
   * 
   * @description Ignore this for now (but don't delete it)! 
   * 
   * Translations are still a work in progress, but will be supported.
   */
  defineTranslations?(): Translations<Extension<MenuDetails, Blocks>>;

  private getInfo(): ExtensionMetadata {
    const { id, internal_blocks: blocks, internal_menus: menus, name, blockIconURI } = this;
    const info = { id, blocks, name, blockIconURI };
    if (menus) info['menus'] = Object.values(this.internal_menus).reduce((obj, { name, ...value }) => {
      obj[name] = value;
      return obj;
    }, {});

    return info;
  }

  private addStaticMenu(items: MenuItem<any>[], acceptReporters: boolean, name: string) {
    this.internal_menus.push({
      name,
      acceptReporters,
      items: items.map(item => item /**TODO figure out how to format */).map(Extension.ConvertMenuItemsToString)
    });
  }

  private addDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean, name: string) {
    // this key might need to be adapted for legacy extensions
    const key = `internal_dynamic_${this.internal_menus.length}`;
    this[key] = () => {
      const items = getItems();
      return items.map(item => item).map(Extension.ConvertMenuItemsToString);
    };
    this.internal_menus.push({ acceptReporters, items: key, name });
  }

  private convertToInfo(key: keyof Blocks & string, block: Block<this, BlockOperation>, menusToAdd: MenuItem<any>[], menuNames: string[]): ExtensionBlockMetadata {
    const { type, text, operation } = block;
    const args: Argument<any>[] = block.arg ? [block.arg] : block.args;

    const legacyInfo = Extension.ExtractLegacyInformation(block);
    const isLegacy = legacyInfo !== undefined;

    if (isLegacy) this.keyByLegacyName
      ? this.keyByLegacyName[key] = legacyInfo.name
      : this.keyByLegacyName = { [key]: legacyInfo.name } as Record<keyof Blocks, string>;

    const { displayText, orderedNames } = Extension.ConvertToDisplayText(this, key, text, args, isLegacy);
    const { argumentsInfo, handlers } = Extension.ConvertToArgumentInfo(this, key, args, menusToAdd, menuNames) ?? { argumentsInfo: undefined, handlers: undefined };

    const opcode = isLegacy ? legacyInfo.name : Extension.GetInternalKey(key);
    const bound = operation.bind(this);

    const { id } = this;

    const isButton = type === BlockType.Button;
    const buttonID = isButton ? Extension.GetButtonID(id, opcode) : undefined;

    isButton
      ? registerButtonCallback(this.runtime, buttonID, bound)
      : this.registerOpcode(opcode, bound, args, handlers, orderedNames, isLegacy);

    return {
      opcode,
      text: displayText,
      blockType: type,
      arguments: argumentsInfo,
      func: buttonID,
    }
  }

  private [customArgumentCheck] = isCustomArgumentHack.bind(this) as typeof isCustomArgumentHack;
  private processCustomArgumentHack = processCustomArgumentHack.bind(this) as typeof processCustomArgumentHack<Extension<MenuDetails, Blocks>>;

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

  private registerOpcode(opcode: string, bound: Function, args: Argument<any>[], handlers: Function[], orderedNames: string[], isLegacy: boolean,) {
    const { customArgumentManager } = this;
    this[opcode] = (argsFromScratch, blockUtility) => {
      const { mutation } = argsFromScratch; // if we need it...

      const uncasted = isLegacy
        ? orderedNames.map(name => argsFromScratch[name])
        // NOTE: Assumption is that args order will be correct since their keys are parsable as ints (i.e. '0', '1', ...)
        : Object.values(argsFromScratch).slice(0, -1);

      const casted = uncasted.map((param: any, index) => {
        const type = Extension.GetArgumentType(args[index]);
        const handler = handlers[index] ?? identity;

        return type !== ArgumentType.Custom
          ? Extension.CastToType(type, handler(param))
          : !(isString(param) && CustomArgumentManager.IsIdentifier(param))
            ? handler(param)
            : handler(customArgumentManager.getEntry(param).value)
      });

      return bound(...casted, blockUtility); // can add more util params as necessary
    }
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

  protected makeCustomArgument = <T>({ component, initial, acceptReportersHandler: handler }: { component: string, initial: ArgumentEntry<T>, acceptReportersHandler?: (x: any) => ArgumentEntry<T> }): Argument<T> => {
    this.argumentManager ??= new CustomArgumentManager();
    const id = this.argumentManager.add(initial);
    const getItems = () => [{ text: customArgumentFlag, value: JSON.stringify({ component, id }) }];
    return {
      type: ArgumentType.Custom,
      defaultValue: id,
      options: handler === undefined ? getItems : { acceptsReports: true, getItems, handler },
    } as Argument<T>
  }

  static GetKeyFromOpcode = (opcode: string) => opcode.replace(Extension.GetInternalKey(""), "");

  private static ConvertToDisplayText<T extends BaseExtension>(ext: T, key: string, text: string | ((...args: any[]) => string), args: Argument<any>[], isLegacy: boolean) {
    const orderedNames = isLegacy ? [] : undefined;

    type TextFunc = (...params: any[]) => string;
    const resolvedText: string = isFunction(text)
      ? (text as TextFunc)(...args.map((arg, index) => {
        const name = isLegacy ? Extension.ExtractLegacyInformation(arg).name : index;
        if (isLegacy) orderedNames.push(name);
        return `[${name}]`
      }))
      : text as string;

    // Once translations supported, replace with 'format'
    return { displayText: ext.format(resolvedText, key, `Block text for '${key}'`), orderedNames };
  }

  private static ConvertToArgumentInfo<T extends BaseExtension>(ext: T, key: string, args: Argument<any>[], menusToAdd: MenuItem<any>[], menuNames: string[]) {
    if (!args) return undefined;

    type Handler = MenuThatAcceptsReporters<any>['handler'];
    const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
    const handlers = args ? new Array<Handler>(args.length).fill(undefined) : undefined;

    type Entry = ExtensionArgumentMetadata & { name: string };

    const argumentsInfo = args
      .map((element, index) => {
        const entry = {} as Entry;
        entry.type = Extension.GetArgumentType(element);
        entry.name = Extension.ExtractLegacyInformation(element)?.name ?? `${index}`;

        if (isPrimitive(element)) return entry;

        const { defaultValue, options } = element as VerboseArgument<any>;

        if (defaultValue !== undefined)
          entry.defaultValue = isString(entry)
            ? ext.format(defaultValue, Extension.GetArgTranslationID(key, index), `Default value for arg ${index + 1} of ${key} block`)
            : defaultValue;

        if (!options) return entry;

        const alreadyAddedIndex = menusToAdd.indexOf(options);
        const alreadyAdded = alreadyAddedIndex >= 0;
        const menuIndex = alreadyAdded ? alreadyAddedIndex : menusToAdd.push(options) - 1;
        const name = Extension.ExtractLegacyInformation(options)?.name ?? `${menuIndex}`;

        if (!alreadyAdded) menuNames.push(name);

        entry.menu = name;

        if (handlerKey in options) {
          const { handler } = options as MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any>;
          handlers[index] = handler;
        }

        return entry;
      })
      .reduce((accumulation, { name, ...value }) => {
        accumulation[name] = value;
        return accumulation;
      }, {});

    return { argumentsInfo, handlers };
  }

  private static GetArgTranslationID = (blockname: string, index: number) => {
    return `${blockname}-arg${index}-default`;
  }

  private static GetInternalKey = (key: string) => `internal_${key}`;
  private static GetButtonID = (id: string, opcode: string) => `${id}_${opcode}`;

  private static GetArgumentType = <T>(arg: Argument<T>): ValueOf<typeof ArgumentType> =>
    isPrimitive(arg) ? arg as ValueOf<typeof ArgumentType> : (arg as VerboseArgument<T>).type;

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
    isPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };

  private static ExtensionsByID = new Map<string, Extension<any, any>>();

  static InternalCodeGenArgsGetterKey = "internal_getCodeGenArgs";

  static TestGetInfo = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["getInfo"]>) => ext.getInfo(...params);
  static TestGetBlocks = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["getInfo"]>) => ext.getInfo(...params).blocks as ExtensionBlockMetadata[];
  static TestInit = <T extends Extension<any, any>>(ext: T, ...params: Parameters<Extension<any, any>["internal_init"]>) => ext.internal_init(...params);

  static ExtractLegacyInformation = (item) => !isPrimitive(item) && "name" in item ? ({ name: item["name"] as string | undefined }) : undefined;

  static GetLegacyName = <Blocks extends ExtensionBlocks, T extends Extension<any, Blocks>>(ext: T, key: keyof Blocks) => ext.keyByLegacyName?.[key];
};
