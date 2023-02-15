import path from "path";
import { CodeGenParams, ExtensionMenuDisplayDetails, encode } from "$common"
import { fileName, getBundleFile, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile } from "../utils/fileSystem";
import { type Plugin, type OutputOptions, type RollupWatcher } from "rollup";
import alias from "@rollup/plugin-alias";
import { getAliasEntries } from "scripts/utils/aliases";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import { getSrcCompilerOptions } from "scripts/typeProbing/tsConfig";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';
import chalk from "chalk";
import { getBlockIconURI } from "scripts/utils/URIs";

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

export const getBundleInfo = (directory: string, { totalNumberOfExtensions, id }: { totalNumberOfExtensions?: number, id?: string }, indexFile: "index.ts" | "index.v2.ts" = "index.ts"): BundleInfo => {
  id ??= encode(fileName(directory));
  totalNumberOfExtensions ??= 0;
  return {
    directory, id, totalNumberOfExtensions,
    name: fileName(directory),
    indexFile: path.join(directory, indexFile),
    bundleEntry: path.join(directory, ".filesToBundle.js"),
    bundleDestination: getBundleFile(id),
    menuAssetsDestination: getMenuDetailsAssetsDirectory(id),
    menuAssetsFile: getMenuDetailsAssetsFile(id),
    menuDetails: {} as ExtensionMenuDisplayDetails
  }
}

export const getThirdPartyPlugins = (): Plugin[] => [
  alias({ entries: getAliasEntries() }),
  svelte({
    preprocess: autoPreprocess(),
    emitCss: false,
  }),
  typescript({ ...getSrcCompilerOptions(), ignoreDeprecations: "5.0" }),
  nodeResolve(),
  commonjs(),
  css(),
  //terser(),
];

export const getOutputOptions = ({ id: name, bundleDestination: file }: BundleInfo, overrides?: OutputOptions): OutputOptions =>
  ({ file, name, format: "iife", compact: true, sourcemap: true, ...(overrides || {}) });

export const logEvents = (watcher: RollupWatcher, { name }: BundleInfo) => {
  const prefix = `[rollup] ${name}: `;


  watcher.on('event',
    (event) => {
      event.code === "ERROR"
        ? console.error(chalk.bgRed(prefix) + chalk.red(`${event.error}`))
        : console.log(chalk.bgGreen(prefix) + chalk.cyan(` ${event.code}`));
      if (event.code === "BUNDLE_END") event.result?.close();
    });

  watcher.on("change", (id, { event }) => console.log(chalk.bgGreen(prefix) + chalk.cyan(`${event} on ${id}`)));
}


export const stringifyCodeGenArgs = ({ menuDetails, directory, id }: BundleInfo) => {
  const { name } = menuDetails;
  const blockIconURI = getBlockIconURI(menuDetails, directory);
  const codeGenArgs: CodeGenParams = [name, id, blockIconURI];
  return "..." + JSON.stringify(codeGenArgs);
}