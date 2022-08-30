import type Runtime from '../engine/runtime';
import { ArgumentType } from './enums';
import type { ExtensionMenuDisplayDetails, ExtensionBlocks, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem, RGBObject, BlockDefinitions, VerboseArgument, Environment, Menu, DynamicMenu, MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters, TypeByArgumentType } from './types';
import Cast from '../util/cast';
import formatMessage = require('format-message');

export type CodeGenArgs = {
  name: never, 
  id: never,
  blockIconURI: never,
}

/**
 * 
 * @template MenuDetails How the extension should display in the extensions menu 
 * @template Blocks What kind of blocks this extension implements
 */
export abstract class Extension
  <
    MenuDetails extends ExtensionMenuDisplayDetails,
    Blocks extends ExtensionBlocks
  > {
  runtime: Runtime;

  readonly BlockDefinitions: BlockDefinitions<Blocks>;
  
  private readonly internal_blocks: ExtensionBlockMetadata[] = [];
  private readonly internal_menus: ExtensionMenuMetadata[] = [];

  constructor(runtime: Runtime, codeGenArgs: CodeGenArgs) {
    const { name, id, blockIconURI } = codeGenArgs;
    this.name = name;
    this.id = id;
    this.blockIconURI = blockIconURI;

    this.runtime = runtime;
    this.init({ runtime });
    const definitions = this.defineBlocks();
    const menus: Menu<any>[] = [];
    for (const key in definitions) {
      const block = definitions[key](this);
      const info = this.convertToInfo(this.name, key, block, menus);
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
        this.internal_menus.push({ acceptReporters, items: nonDynamic.items.map(Extension.ConvertMenuItemsToString) });
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

  abstract init(env: Environment);
  abstract defineBlocks(): BlockDefinitions<Blocks>;

  getInfo(): ExtensionMetadata  {
    const {id, internal_blocks: blocks, internal_menus: menus, name, blockIconURI} = this; 
    const info = {id, blocks, name, blockIconURI};
    if (menus) info['menus'] = Object.entries(this.internal_menus).reduce((obj, [key, value]) => {
      obj[key] = value; 
      return obj;
    }, {});

    return info;
  }

  addStaticMenu(items: MenuItem<any>[], acceptReporters: boolean) {
    this.internal_menus.push({ 
      acceptReporters, 
      items: items.map(Extension.ConvertMenuItemsToString) 
    });
  }

  addDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean) {
    const key = `internal_dynamic_${this.internal_menus.length}`;
    this[key] = () => {
      const items = getItems();
      return items.map(Extension.ConvertMenuItemsToString);
    };
    this.internal_menus.push({acceptReporters, items: key});
  }

  convertToInfo(extensionName: string, key: string, block: Block<any>, menusToAdd: MenuItem<any>[]): ExtensionBlockMetadata {
    const {type, text, operation, description} = block;
    const args: Argument<any>[] = block.args;


    const displayText = formatMessage({
      id: `${this.id}.${key}`,
      default: Extension.IsFunction(text) 
      ? (text as unknown as (...params: any[]) => string)(...args.map((_, index) => `[${index}]`)) 
      : text,
      description: description ?? `Description for '${key}' block (of '${extensionName}' extension)`,
    });

    type Handler = MenuThatAcceptsReporters<any>['handler'];
    const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
    const handlers = args ? new Array<Handler>(args.length).fill(undefined) : undefined;

    const argsInfo: Record<string, ExtensionArgumentMetadata> = args?.map((element, index) => {
      const entry = {} as ExtensionArgumentMetadata;
      entry.type = Extension.GetArgumentType(element);

      if (Extension.IsPrimitive(element)) return entry;

      const {defaultValue, options} = element as VerboseArgument<any>;

      if (defaultValue !== undefined) entry.defaultValue = defaultValue;
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

    return {
      opcode,
      text: displayText,
      blockType: type,
      arguments: argsInfo
    }
  }

  static TryCastToArgumentType = <T extends ArgumentType>(
    argumentType: T, 
    value: any, 
    onFailure: (value: any) => TypeByArgumentType[T]
  ): TypeByArgumentType[T] => {
    try {
      const casted = Extension.CastToType(argumentType, value);
      return casted as TypeByArgumentType[T];
    }
    catch {
      return onFailure(value);
    }
  }

  private static GetInternalKey = (key: string) => `internal_${key}`;

  private static GetArgumentType = <T>(arg: Argument<T>): ArgumentType => 
    Extension.IsPrimitive(arg) ? arg as ArgumentType : (arg as VerboseArgument<T>).type;

  private static ToFlag = (value: string) : boolean => parseInt(value) === 1;

  private static ToMatrix = (matrixString : string) : boolean[][] => {
    if (matrixString.length !== 25) return new Array(5).fill(new Array(5).fill(false));

    const entries = matrixString.split('');
    const matrix = entries.map(Extension.ToFlag).reduce((matrix, flag, index) => {
      const row = Math.floor(index / 5);
      const column = index % 5;
      (column === 0) ? matrix[row] = [flag]: matrix[row].push(flag);
      return matrix;
    }, new Array<boolean[]>(5));

    return matrix;
  }

  private static CastToType = (argumentType: ArgumentType, value: any) => {
    switch(argumentType) {
      case ArgumentType.String:
        return `${value}`;
      case ArgumentType.Number:
        return parseFloat(value);
      case ArgumentType.Boolean:
        return !!value;
      case ArgumentType.Note:
        return parseInt(value);
      case ArgumentType.Angle:
        return parseInt(value);
      case ArgumentType.Matrix:
        return Extension.ToMatrix(value);
      case ArgumentType.Color:
        return Cast.toRgbColorObject(value) as RGBObject;
      default:
        throw new Error("Method not implemented.");
    }
  }

  private static ConvertMenuItemsToString = (item: any | MenuItem<any>) => 
    Extension.IsPrimitive(item) ? `${item}` : {...item, value: `${item.value}`};

  private static IsPrimitive = (query) => query !== Object(query);
  private static IsFunction = (query) =>
    Object.prototype.toString.call(query) === "[object Function]" 
    || "function" === typeof query 
    || query instanceof Function;
  
  private static IsString = (query) => typeof query === 'string' || query instanceof String;
};
