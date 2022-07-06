import type Runtime from '../engine/runtime';
import type { Block, Environment, Extension, Operation } from './types';

export default abstract class ExtensionBase<T> {
  runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    this.init({ runtime });
    const blocks = this.definition();
    for (const key in blocks) {
      const block = blocks[key](this);
      const info = this.convertToInfo(block);
    }
  }

  convertToInfo(block: Block<any>) {
    // do things with info
  }

  abstract init(env: Environment);

  abstract definition(): Record<keyof T, Operation> & { [k in keyof T]: T[k] }
};
}