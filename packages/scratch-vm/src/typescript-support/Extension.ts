import type Runtime from '../engine/runtime';
import { ArgumentType } from './enums';
import type { ExtensionMenuDisplayDetails, ExtensionBlocks, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem, RGBObject, BlockDefinitions, VerboseArgument } from './types';
import Cast from '../util/cast';

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

  private readonly BlockDefinitions: BlockDefinitions<Blocks>;

  private internal_blocks: ExtensionBlockMetadata[];
  private internal_menus: ExtensionMenuMetadata[];

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    this.internal_blocks = [];
    this.internal_menus = [];
    const definitions = this.defineBlocks();
    const menuArrays: MenuItem<any>[] = [];
    for (const key in definitions) {
      const block = definitions[key](this);
      const info = this.convertToInfo(key, block, menuArrays);
      this.internal_blocks.push(info);
    }

    for (let index = 0; index < menuArrays.length; index++) {
      const items = menuArrays[index];
      this.internal_menus.push({
        acceptReporters: false,
        items: items.map(item => Extension.IsPrimitive(item) ? `${item}` : {...item, value: `${item.value}`})
      });
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

  abstract init(runtime: Runtime);
  abstract defineBlocks(): BlockDefinitions<Blocks>;

  getInfo(): ExtensionMetadata  {
    const {id, internal_blocks: blocks, internal_menus: menus, name, blockIconURI} = this; 
    const info = {id, blocks, name, blockIconURI};
    if (menus) info['menus'] = Object.entries(this.internal_menus).reduce((obj, [key, value]) => {
      obj[key] = value; return obj
    }, {});

    return info;
  }

  convertToInfo(key: string, block: Block<any>, menusToAdd: MenuItem<any>[]): ExtensionBlockMetadata {
    const {type, text, operation} = block;
    const args: Argument<any>[] = block.args;

    const displayText = text(...args.map((_, index) => `[${index}]`));
    const opcode = Extension.GetInternalKey(key);

    const bound = operation.bind(this);
    this[opcode] = (argsFromScratch, blockUtility) => {
      const { mutation } = argsFromScratch; // if you need it!
      // NOTE: Assumption is that args order will be correct since there keys are parsable as ints (i.e. '0', '1', ...)
      const uncasted = Object.values(argsFromScratch).slice(0, -1);
      const casted = uncasted.map((value, index) => {
        const type = Extension.GetArgumentType(args[index]);
        return Extension.CastToType(type, value)
      });
      return bound(...casted, blockUtility); // can add more util params as necessary
    }

    const argsInfo: Record<string, ExtensionArgumentMetadata> = args.map(element => {
      const entry = {} as ExtensionArgumentMetadata;
      entry.type = Extension.GetArgumentType(element);

      if (Extension.IsPrimitive(element)) return entry;

      const {defaultValue, options} = element as VerboseArgument<any>;

      if (defaultValue !== undefined) entry.defaultValue = defaultValue;

      if (options !== undefined && Array.isArray(options) && options.length > 0) {
        const alreadyAddedIndex = menusToAdd.indexOf(options);
        const index = alreadyAddedIndex >= 0 ? alreadyAddedIndex : menusToAdd.push(options) - 1;
        entry.menu = `${index}`;
      }
      
      return entry;
    })
    .reduce((accumulation, value, index) => {
      accumulation[`${index}`] = value;
      return accumulation;
    }, {});

    return {
      opcode,
      text: displayText,
      blockType: type,
      arguments: argsInfo
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

  private static IsPrimitive = (query) => query !== Object(query);
};
