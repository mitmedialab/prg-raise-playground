import type Runtime from '../engine/runtime';
import type { Block, Environment, ExtensionsBlocks, Operation } from './types';

export abstract class Extension<
  TTitle extends string,
  TDescription extends string,
  TIconURL extends string,
  TInsetIconURL extends string,
  TBlocks extends ExtensionsBlocks> {
  runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    const blocks = this.blockDefinitions();
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
  abstract blockDefinitions(): Record<keyof T, Operation> & { [k in keyof T]: T[k] }
};
