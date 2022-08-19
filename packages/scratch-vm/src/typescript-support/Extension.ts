import type Runtime from '../engine/runtime';
import { ArgumentType } from './enums';
import type { ExtensionMenuDisplayDetails, Environment, ExtensionBlocks, BlockOperation, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem, RGBObject, BlockDefinitions, DefineBlock } from './types';
import Cast from '../util/cast';

/**
 * 
 * @template TMenuDetails How the extension should display in the extensions menu 
 * @template TBlocks What kind of blocks this extension implements
 */
export abstract class Extension
  <
    TMenuDetails extends ExtensionMenuDisplayDetails,
    TBlocks extends ExtensionBlocks
  > {
  runtime: Runtime;

  private blocks: ExtensionBlockMetadata[];
  private menus: ExtensionMenuMetadata[];

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    this.blocks = [];
    this.menus = [];
    const definitions = this.defineBlocks();
    const menuArrays: MenuItem<any>[] = [];
    for (const key in definitions) {
      const block = definitions[key](this);
      const info = this.convertToInfo(key, block, menuArrays);
      this.blocks.push(info);
    }

    for (let index = 0; index < menuArrays.length; index++) {
      const items = menuArrays[index];
      this.menus.push({
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

  abstract init(env: Environment);
  abstract defineBlocks(): BlockDefinitions<TBlocks>;

  getInfo(): ExtensionMetadata  {
    const {id, blocks, menus, name} = this; 
    const info = {id, blocks, name};
    if (menus) info['menus'] = Object.entries(this.menus).reduce((obj, [key, value]) => {
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
      const casted = uncasted.map((value, index) => Extension.CastToType(args[index].type, value));
      return bound(...casted, blockUtility); // can add more util params as necessary
    }

    const argsInfo: Record<string, ExtensionArgumentMetadata> = args.map(element => {
      const entry = {} as ExtensionArgumentMetadata;
      const {type, defaultValue, options} = element;
      entry.type = type;

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
