import type Runtime from '../engine/runtime';
import type { BlockBuilder, ExtensionMenuDisplayDetails, Environment, ExtensionBlocks, BlockOperation, Block } from './types';

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

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    const blocks = this.blockBuilders();
    for (const key in blocks) {
      const block = blocks[key](this);
      const info = this.convertToInfo(block);

    }
  }

  getInfo() {

  }

  convertToInfo(block: Block<any>) {
    // do things with info
  }

  abstract init(env: Environment);
  abstract blockBuilders(): Record<keyof TBlocks, BlockBuilder<BlockOperation>> & { [k in keyof TBlocks]: BlockBuilder<TBlocks[k]> }
};
