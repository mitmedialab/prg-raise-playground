import path from "path";
import fs from "fs";
import { CodeGenParams, ExtensionMenuDisplayDetails, FrameworkID, encode } from "$common"
import { fileName, getBundleFile, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile } from "../utils/fileSystem";
import { type Plugin, type RollupOptions, type OutputOptions, type RollupWatcher, rollup, watch } from "rollup";
import alias from "@rollup/plugin-alias";
import { commonAlias, getAliasEntries } from "scripts/utils/aliases";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import typescript from "@rollup/plugin-typescript";
import { getSrcCompilerOptions } from "scripts/typeProbing/tsConfig";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import babel from "@rollup/plugin-babel";
import chalk from "chalk";
import { getBlockIconURI } from "scripts/utils/URIs";
import bundleConfigurable from "./extension.configurable";
import bundleGeneric from "./extension.generic";
import { root } from "$root/scripts/paths";
import ts, { CustomTransformerFactory } from "typescript";

export type BundleInfo = {
  directory: string,
  name: string,
  totalNumberOfExtensions: number,
  indexFile: string,
  bundleEntry: string,
  bundleDestination: string,
  menuAssetsDestination: string,
  menuAssetsFile: string,
  extensionVersion: "generic" | "configurable" | "none",
  id: string,
  menuDetails: ExtensionMenuDisplayDetails,
  watch: boolean,
}

export const getBundleInfo = (directory: string, { totalNumberOfExtensions, id, watch }: { totalNumberOfExtensions?: number, id?: string, watch: boolean }, extensionVersion: BundleInfo["extensionVersion"] = "none"): BundleInfo => {
  id ??= encode(fileName(directory));
  totalNumberOfExtensions ??= 0;
  return {
    directory, id, totalNumberOfExtensions, extensionVersion, watch,
    name: fileName(directory),
    indexFile: path.join(directory, "index.ts"),
    bundleEntry: path.join(directory, ".filesToBundle.js"),
    bundleDestination: getBundleFile(id),
    menuAssetsDestination: getMenuDetailsAssetsDirectory(id),
    menuAssetsFile: getMenuDetailsAssetsFile(id),
    menuDetails: {} as ExtensionMenuDisplayDetails
  }
}

export type ProgramBasedTransformer = (program: ts.Program) => CustomTransformerFactory;

export const getThirdPartyPlugins = (customizations?: { tsTransformers?: ProgramBasedTransformer[] }): Plugin[] => [
  alias({ entries: getAliasEntries() }),
  json(),
  nodePolyfills(),
  svelte({
    preprocess: autoPreprocess(),
    emitCss: false,
  }),
  typescript({
    ...getSrcCompilerOptions(),
    ...(customizations?.tsTransformers?.length ?? 0) > 0
      ? {
        transformers: {
          before: customizations.tsTransformers.map(factory => ({ type: "program", factory })),
        }
      }
      : {}
  }),
  nodeResolve({ browser: true }),
  commonjs(),
  babel({
    include: ["**.js", "node_modules/**"],
    babelHelpers: "bundled",
  }),
  css(),
  terser(),
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

const getExtensionType = (dir: string) => {
  const indexFile = path.join(dir, "index.ts");
  const indexContent = fs.readFileSync(indexFile, "utf-8");

  // Match: extends [one or more whitespace or new line character] extension [zero or more whitespace or new line character] (
  const matchConfigurable = new RegExp(/extends[\n\r\s]+extension[\n\r\s]*\(/gm);

  // Match: extends [one or more whitespace or new line character] Extension [zero or more whitespace or new line character] <
  const matchGeneric = new RegExp(/extends[\n\r\s]+Extension[\n\r\s]*</gm);

  const foundConfigurable = indexContent.search(matchConfigurable) >= 0;
  const foundGeneric = indexContent.search(matchGeneric) >= 0;

  if (foundConfigurable && !foundGeneric) return "configurable";
  if (!foundConfigurable && foundGeneric) return "generic";

  throw new Error(`Unable to identify extension type (generic or configurable) for '${path.relative(root, dir)}' --- generic: ${foundGeneric} vs configurable: ${foundConfigurable}`);
}

export const bundleExtensionBasedOnWatchMode = async ({ plugins, info }: { plugins: Plugin[], info: BundleInfo }) =>
  bundleBasedOnWatchMode({ plugins, info, globals: { [commonAlias]: FrameworkID }, external: [commonAlias] });

type BundleOptions = { plugins: Plugin[], info: BundleInfo, external?: RollupOptions["external"], globals?: OutputOptions["globals"] };

export const bundleBasedOnWatchMode = async ({ plugins, info, globals, external }: BundleOptions) => {
  const { bundleEntry, watch: doWatch, name, directory } = info;
  const watchableFileExtensions = ["ts", "svelte", "png", "svg"];
  const filesToWatch = [...watchableFileExtensions.map(ext => `**/*.${ext}`)].map(file => path.join(directory, file));
  const options: RollupOptions = { input: bundleEntry, plugins, external, watch: { include: filesToWatch } };
  const output = getOutputOptions(info, { globals });

  if (doWatch) return logEvents(watch({ ...options, output }), info);

  const bundled = await rollup(options);
  await bundled.write(output);
  console.log(chalk.green(`${name} bundle succesfully written!`));
}

export const bundleExtension = (dir: string, totalNumberOfExtensions: number, doWatch: boolean) => {
  const version = getExtensionType(dir);
  const info = getBundleInfo(dir, { totalNumberOfExtensions, watch: doWatch });
  return version === "configurable" ? bundleConfigurable(info) : bundleGeneric(info);
}