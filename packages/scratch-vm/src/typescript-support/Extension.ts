import type Runtime from '../engine/runtime';
import type { Block, Environment, Operation } from './types';

export abstract class Extension<T> {
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
