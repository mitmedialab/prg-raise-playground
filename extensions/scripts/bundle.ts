import { rollup, type Plugin, type RollupOptions, type OutputOptions } from "rollup";
import alias from '@rollup/plugin-alias';
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import sucrase from '@rollup/plugin-sucrase';
import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import { terser } from "rollup-plugin-terser";
import autoPreprocess from 'svelte-preprocess';
import path from "path";
import chalk from 'chalk';
import { transpileExtensions, fillInCodeGenArgs, setupExtensionBundleEntry, clearDestinationDirectories, generateVmDeclarations, createExtensionMenuAssets, announceWrite, transpileExtensionGlobals, setupFrameworkBundleEntry } from "./plugins";
import type Transpiler from './typeProbing/Transpiler';
import { ExtensionMenuDisplayDetails, FrameworkID, encode } from '$common';
import { retrieveExtensionDetails } from './typeProbing';
import { commonDirectory, fileName, getAllExtensionDirectories, getBundleFile, getExtensionDirectory, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile, watchForExtensionDirectoryAdded } from './utils/fileSystem';
import { printDiagnostics } from './typeProbing/diagnostics';
import { sendToParent } from '$root/scripts/comms';
import { processArgs } from '$root/scripts/processArgs';
import { watchAllFilesInDirectoryAndCommon } from "./utils/rollupHelper";
import { commonAlias, getAliasEntries } from "./utils/aliases";

export type BundleInfo = {
  directory: string,
  name: string,
  totalNumberOfExtensions: number,
  indexFile: string,
  bundleEntry: string,
  bundleDestination: string,
  menuAssetsDestination: string,
  menuAssetsFile: string,
  id: string,
  menuDetails: ExtensionMenuDisplayDetails
}

const getFrameworkInfo = () => getBundleInfo(commonDirectory, { id: FrameworkID });
const getExtensionInfo = (directory: string, totalNumberOfExtensions: number) => getBundleInfo(directory, { totalNumberOfExtensions });

const getBundleInfo = (directory: string, { totalNumberOfExtensions, id }: { totalNumberOfExtensions?: number, id?: string }): BundleInfo => {
  id ??= encode(fileName(directory));
  totalNumberOfExtensions ??= 0;
  return {
    directory, id, totalNumberOfExtensions,
    name: fileName(directory),
    indexFile: path.join(directory, "index.ts"),
    bundleEntry: path.join(directory, ".filesToBundle.js"),
    bundleDestination: getBundleFile(id),
    menuAssetsDestination: getMenuDetailsAssetsDirectory(id),
    menuAssetsFile: getMenuDetailsAssetsFile(id),
    menuDetails: {} as ExtensionMenuDisplayDetails
  }
}

const transpileComplete = (ts: Transpiler, { menuDetails }: BundleInfo) => {
  const details = retrieveExtensionDetails(ts.program);
  for (const key in details) menuDetails[key] = details[key];
}

const transpileFailed = (ts: Transpiler, info: BundleInfo) => {
  console.error(chalk.bgRed(`Typescript error in ${info.directory}`));
  printDiagnostics(ts.program, ts.program.getSemanticDiagnostics());
  sendToParent(process, { condition: "extensions error" });
}

const getThirdPartyPlugins = (): Plugin[] => [
  alias({ entries: getAliasEntries() }),
  json(),
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

const getOutputOptions = ({ id: name, bundleDestination: file }: BundleInfo, overrides?: OutputOptions): OutputOptions =>
  ({ file, name, format: "iife", compact: true, sourcemap: true, ...(overrides || {}) });

const bundleFramework = async (doWatch: boolean) => {
  const info = getFrameworkInfo();

  const customPRGPlugins = [
    clearDestinationDirectories(),
    transpileExtensionGlobals(),
    generateVmDeclarations(),
    setupFrameworkBundleEntry(info),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = { input: info.bundleEntry, plugins };
  const bundled = await rollup(options);

  const output = getOutputOptions(info);
  await bundled.write(output);

  if (doWatch) watchAllFilesInDirectoryAndCommon(info, options, output);
}

const bundleExtension = async (dir: string, extensionCount: number, doWatch: boolean = true) => {
  const info = getExtensionInfo(dir, extensionCount);

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    transpileExtensions(info, { onSuccess: transpileComplete, onError: transpileFailed }),
    createExtensionMenuAssets(info),
    fillInCodeGenArgs(info),
    announceWrite(info),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = { input: info.bundleEntry, plugins, external: commonAlias }
  const bundled = await rollup(options);
  const globals = { [commonAlias]: FrameworkID };

  const output = getOutputOptions(info, { globals });
  await bundled.write(output);

  if (doWatch) watchAllFilesInDirectoryAndCommon(info, options, output);
};

const defaults = { doWatch: false };
const flagByOption = { doWatch: "watch" };
const { doWatch } = processArgs<typeof defaults>(flagByOption, defaults);

bundleFramework(doWatch);

const extensionDirectories = getAllExtensionDirectories();

const { length } = extensionDirectories;
extensionDirectories.forEach(dir => bundleExtension(dir, length, doWatch));

if (doWatch) {
  watchForExtensionDirectoryAdded(
    extensionDirectories,
    (path, stats) => bundleExtension(path, extensionDirectories.length + 1, true)
  );
}