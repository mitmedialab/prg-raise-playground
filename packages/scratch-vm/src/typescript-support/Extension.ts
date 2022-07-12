import type Runtime from '../engine/runtime';
import { ArgumentType } from './enums';
import type { BlockBuilder, ExtensionMenuDisplayDetails, Environment, ExtensionBlocks, BlockOperation, Block, ExtensionArgumentMetadata, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, Argument } from './types';

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

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    this.blocks = [];
    const builders = this.blockBuilders();
    for (const key in builders) {
      const block = builders[key](this);
      const info = this.convertToInfo(key, block);
      this.blocks.push(info);
    }
    console.log(this.blocks);
  }

  getInternalKey = (key: string) => `internal_${key}`;

  getInfo(): ExtensionMetadata  {
    const id = this.constructor.name;
    return {
      id,
      blocks: this.blocks
    }
  }

  convertToInfo(key: string, block: Block<any>): ExtensionBlockMetadata {
    const {type, text, operation} = block;
    const args: Argument<any>[] = block.args;

    const displayText = text(...args.map((_, index) => `[${index}]`));
    const opcode = this.getInternalKey(key);

    this[opcode] = (argsFromScratch, blockUtility) => {
      const { mutation } = argsFromScratch;
      // NOTE: Need to gurantee that the args order will be correct
      const uncasted = Object.entries(argsFromScratch)
      .filter(([key, _]) => key !== 'mutation')
      .map(([_, value]) => value);
      
      console.log(uncasted);
      const casted = uncasted.map((value, index) => this.castToType(args[index].type, value));
      operation(...casted, blockUtility);
    }

    const argsInfo: Record<string, ExtensionArgumentMetadata> = args.map(element => {
      const entry = {} as ExtensionArgumentMetadata;
      const {type, defaultValue, options} = element;
      entry.type = type;

      if (defaultValue !== undefined) entry.defaultValue = defaultValue;

      if (options !== undefined && options.length > 0) {
        // convert options to menu
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

  castToType = (argumentType: ArgumentType, value: any) => {
    console.log(argumentType);
    switch(argumentType) {
      case ArgumentType.String:
        return `${value}`;
      case ArgumentType.Number:
        return parseFloat(value);
      default:
        throw new Error("Method not implemented.");
    }
  }

  abstract init(env: Environment);
  abstract blockBuilders(): Record<keyof TBlocks, BlockBuilder<BlockOperation>> & { [k in keyof TBlocks]: BlockBuilder<TBlocks[k]> }
};
