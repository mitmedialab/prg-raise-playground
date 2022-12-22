import { watch, rollup, type Plugin, type RollupOptions, type OutputOptions } from "rollup";
import alias from '@rollup/plugin-alias';
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import sucrase from '@rollup/plugin-sucrase';
import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import { terser } from "rollup-plugin-terser";
import autoPreprocess from 'svelte-preprocess';
import path from "path";
import chalk from 'chalk';
import { transpileExtensions, fillInCodeGenArgs, setupBundleEntry, cleanup, clearDestinationDirectories, generateVmDeclarations, createExtensionMenuAssets, announceWrite, transpileExtensionEvents } from "./plugins";
import type Transpiler from './typeProbing/Transpiler';
import { ExtensionMenuDisplayDetails, encode } from '$common';
import { retrieveExtensionDetails } from './typeProbing';
import { fileName, getAliases, getAllExtensionDirectories, getBundleFile, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile, watchForExtensionDirectoryAdded } from './utils/fileSystem';
import { printDiagnostics } from './typeProbing/diagnostics';
import { sendToParent } from '$root/scripts/devComms';
import { processArgs } from '$root/scripts/processArgs';

export type ExtensionInfo = {
  directory: string,
  name: string,
  indexInProcess: number,
  totalNumberOfExtensions: number,
  indexFile: string,
  bundleEntry: string,
  bundleDestination: string,
  menuAssetsDestination: string,
  menuAssetsFile: string,
  id: string,
  menuDetails: ExtensionMenuDisplayDetails
}

const getExtensionInfo = (directory: string, indexInProcess: number, totalNumberOfExtensions: number): ExtensionInfo => {
  const id = encode(fileName(directory));
  return {
    id, directory, indexInProcess, totalNumberOfExtensions,
    name: fileName(directory),
    indexFile: path.join(directory, "index.ts"),
    bundleEntry: path.join(directory, ".filesToBundle.js"),
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
  console.error(chalk.bgRed(`Typescript error in ${info.directory}`));
  printDiagnostics(ts.program, ts.program.getSemanticDiagnostics());
  sendToParent(process, { condition: "extensions error" });
}

const bundleExtension = async (dir: string, index: number, extensionCount: number, doWatch: boolean = true) => {
  const info = getExtensionInfo(dir, index, extensionCount);
  const { bundleEntry, bundleDestination, id, directory, name } = info;

  const customPRGPlugins: Plugin[] = [
    clearDestinationDirectories(info),
    transpileExtensionEvents(info),
    generateVmDeclarations(info),
    setupBundleEntry(info),
    transpileExtensions({
      ...info,
      onSuccess: (ts) => transpileComplete(ts, info),
      onError: (ts) => transpileFailed(ts, info)
    }),
    createExtensionMenuAssets(info),
    fillInCodeGenArgs(info),
    announceWrite(info),
    cleanup(info)
  ];

  const thirdPartyPlugins: Plugin[] = [
    alias({ entries: getAliases() }),
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    sucrase({
      transforms: ['typescript']
    }),
    nodeResolve(),
    commonjs(),
    css(),
    terser(),
  ];

  const plugins = [...customPRGPlugins, ...thirdPartyPlugins];

  const options: RollupOptions = { input: bundleEntry, plugins }
  const bundled = await rollup(options);

  const output: OutputOptions = {
    file: bundleDestination,
    format: "iife",
    compact: true,
    name: id,
    sourcemap: 'inline',
  };

  await bundled.write(output);

  if (!doWatch) return;

  const watcher = watch({
    ...options,
    output: [output],
    watch: { include: [path.join(directory, "**", "*.{ts,svelte}")] }
  });

  watcher.on('event', (event) => {
    const prefix = "[rollup]";
    event.code === "ERROR"
      ? console.error(chalk.bgRed(`${prefix} ${name}:`) + chalk.red(`${event.error}`))
      : console.log(chalk.bgGreen(`${prefix} ${name}:`) + chalk.cyan(` ${event.code}`));
    if (event.code === "BUNDLE_END") event.result?.close();
  });
};

const defaults = { doWatch: false };
const flagByOption = { doWatch: "watch", };
const { doWatch } = processArgs<typeof defaults>(flagByOption, defaults);

const extensionDirectories = getAllExtensionDirectories();

const { length } = extensionDirectories;
extensionDirectories.forEach((dir, index) => bundleExtension(dir, index, length, doWatch));

if (doWatch) {
  watchForExtensionDirectoryAdded(extensionDirectories, (path, stats) => {
    const index = extensionDirectories.length;
    bundleExtension(path, index, index + 1, true);
  });
}