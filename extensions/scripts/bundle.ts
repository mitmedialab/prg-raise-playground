import * as rollup from 'rollup';
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import path from "path";
import svelte from 'rollup-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import commonjs from "@rollup/plugin-commonjs";
import sucrase from '@rollup/plugin-sucrase';
import alias from '@rollup/plugin-alias';
import { transpileExtensions, fillInCodeGenArgs, setupBundleEntry, cleanup, clearDestinationDirectories, generateVmDeclarations, createExtensionMenuAssets } from "./plugins";
import { guiSrc, packages } from '$root/scripts/paths';
import type Transpiler from './typeProbing/Transpiler';
import { ExtensionMenuDisplayDetails, encode } from '$common';
import { retrieveExtensionDetails } from './typeProbing';
import { deleteAllFilesInDir, fileName, getAliases, getBundleFile, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile } from './utils/fileSystem';


//const __dirname = path.dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

/*
const announceError = (semanticProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram) => {
  console.log("here");
  printDiagnostics(semanticProgram.getProgram(), semanticProgram.getSemanticDiagnostics());
  sendToParent(process, { condition: "typescript error" });
}

const announceTranspilation = () => sendToParent(process, { condition: "transpile complete" });
*/

export type ExtensionInfo = {
  directory: string,
  indexInProcess: number,
  indexFile: string,
  bundleEntry: string,
  bundleDestination: string,
  menuAssetsDestination: string,
  menuAssetsFile: string,
  id: string,
  menuDetails: ExtensionMenuDisplayDetails
}

const getExtensionInfo = (dir: string, index: number): ExtensionInfo => {
  const id = encode(fileName(dir));
  return {
    id,
    directory: dir,
    indexInProcess: index,
    indexFile: path.join(dir, "index.ts"),
    bundleEntry: path.join(dir, ".filesToBundle.js"),
    bundleDestination: getBundleFile(id),
    menuAssetsDestination: getMenuDetailsAssetsDirectory(id),
    menuAssetsFile: getMenuDetailsAssetsFile(id),
    menuDetails: {} as ExtensionMenuDisplayDetails
  }
}

const transpileComplete = (ts: Transpiler, { menuDetails }: ExtensionInfo) => {
  const details = retrieveExtensionDetails(ts.program);
  for (const key in details) menuDetails[key] = details[key];
}

const transpileFailed = (ts: Transpiler, info: ExtensionInfo) => {

}


const bundleExtension = async (dir: string, index: number, watch: boolean = true) => {
  const info = getExtensionInfo(dir, index);
  const { bundleEntry, bundleDestination, id, directory } = info;

  const plugins = [
    alias({ entries: getAliases() }),
    clearDestinationDirectories(info),
    generateVmDeclarations(info),
    setupBundleEntry(info),
    transpileExtensions({
      onSuccess: (ts) => transpileComplete(ts, info),
      onError: (ts) => transpileFailed(ts, info),
      ...info
    }),
    createExtensionMenuAssets(info),
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    sucrase({
      transforms: ['typescript']
    }),
    fillInCodeGenArgs(info),
    nodeResolve(),
    commonjs(),
    css(),
    terser(),
    cleanup(info),
  ];

  const options: rollup.RollupOptions = { input: bundleEntry, plugins }
  const bundled = await rollup.rollup(options);

  const output: rollup.OutputOptions = {
    file: bundleDestination,
    format: "iife",
    compact: true,
    name: id,
    sourcemap: 'inline',
  };

  await bundled.write(output);

  if (!watch) return;

  const watcher = rollup.watch({
    ...options,
    output: [output],
    watch: { include: [path.join(directory, "**", "*.{ts,svelte}")] }
  });

  watcher.on('event', (event) => {
    console.log(event.code);
    if (event.code === "ERROR") console.error(event.error);
    if (event.code === "BUNDLE_END") event.result?.close();
  });
};

bundleExtension(path.resolve(__dirname, "..", "src", "typescript_framework_simple"), 0);

export const bundle = (dir) => {
  bundleExtension(dir, 0);
}