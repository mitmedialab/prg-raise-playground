import type { Plugin, RollupOptions, SourceDescription } from 'rollup';
import { transpileAndWatch } from './transpile';

export default function ({ entry }: { entry: string }): Plugin {
  let tsWatcher: ReturnType<typeof transpileAndWatch>;

  return {
    name: 'custom',

    buildStart: () => {
      tsWatcher ??= transpileAndWatch([entry], () => {
        console.log("uh oh!")
      });
    },

    buildEnd() {
      if (this.meta.watchMode !== true) tsWatcher?.close();
    },
  }
}