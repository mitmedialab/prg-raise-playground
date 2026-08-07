import { transpileExtensionGlobals } from "./bundles/plugins";

/**
 * Emits `$common/globals.ts` to `extensions/dist/globals.js` and copies it into
 * `scratch-packages/scratch-{vm,gui}/src/dist/`, which those packages require at runtime
 * (see the "PRG ADDITION" blocks in e.g. scratch-vm's src/engine/execute.js).
 *
 * This normally happens as a side effect of bundling, but the test suite loads scratch-vm
 * directly and so needs it without a full build.
 */
const plugin = transpileExtensionGlobals();
(plugin.buildStart as () => void).call(plugin);
