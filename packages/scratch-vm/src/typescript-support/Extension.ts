import type Runtime from '../engine/runtime';
import { ArgumentType } from './enums';
import type { BlockBuilder, ExtensionMenuDisplayDetails, Environment, ExtensionBlocks, BlockOperation, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument, MenuItem } from './types';

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
    const builders = this.blockBuilders();
    const menuArrays: MenuItem<any>[] = [];
    for (const key in builders) {
      const block = builders[key](this);
      const info = this.convertToInfo(key, block, menuArrays);
      this.blocks.push(info);
    }

    for (let index = 0; index < menuArrays.length; index++) {
      const items = menuArrays[index];
      this.menus.push({
        acceptReporters: false,
        items: items.map(value => `${value}`)
      });
    }
  }

  getInternalKey = (key: string) => `internal_${key}`;

  getInfo(): ExtensionMetadata  {
    const id = this.constructor.name;
    const {blocks, menus} = this; 
    const info = {id, blocks};
    if (menus) info['menus'] = Object.entries(this.menus).reduce((obj, [key, value]) => {
      obj[key] = value; return obj
    }, {});

    return info;
  }

  convertToInfo(key: string, block: Block<any>, menusToAdd: MenuItem<any>[]): ExtensionBlockMetadata {
    const {type, text, operation} = block;
    const args: Argument<any>[] = block.args;

    const displayText = text(...args.map((_, index) => `[${index}]`));
    const opcode = this.getInternalKey(key);

    this[opcode] = (argsFromScratch, blockUtility) => {
      const { mutation } = argsFromScratch; // if you need it!
      // NOTE: Assumption is that args order will be correct since there keys are parsable as ints (i.e. '0', '1', ...)
      const uncasted = Object.values(argsFromScratch).slice(0, -1);
      const casted = uncasted.map((value, index) => this.castToType(args[index].type, value));
      return operation(...casted, blockUtility);
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

    console.log(args);

    return {
      opcode,
      text: displayText,
      blockType: type,
      arguments: argsInfo
    }
  }

  castToType = (argumentType: ArgumentType, value: any) => {
    switch(argumentType) {
      case ArgumentType.String:
        return `${value}`;
      case ArgumentType.Number:
        return parseFloat(value);
      case ArgumentType.Boolean:
        return !!value;
      case ArgumentType.Note:
        return parseInt(value);
      default:
        throw new Error("Method not implemented.");
    }
  }

  abstract init(env: Environment);
  abstract blockBuilders(): Record<keyof TBlocks, BlockBuilder<BlockOperation>> & { [k in keyof TBlocks]: BlockBuilder<TBlocks[k]> }
};
