import path from "path";
import { ExtensionMenuDisplayDetails, encode } from "$common"
import { extensionsSrc, fileName, getBundleFile, getMenuDetailsAssetsDirectory, getMenuDetailsAssetsFile } from "../utils/fileSystem";
import { type Plugin, type OutputOptions } from "rollup";
import alias from "@rollup/plugin-alias";
import { getAliasEntries } from "scripts/utils/aliases";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import typescript2 from 'rollup-plugin-typescript2';
import { getSrcCompilerOptions } from "scripts/typeProbing/tsConfig";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';

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

const ts = () => typescript({ ...getSrcCompilerOptions() });
const ts2 = () => typescript2({ tsconfig: path.join(extensionsSrc, "tsconfig.json") });

export const getThirdPartyPlugins = (transpilerPlugin: "sucrase" | "typescript" = "sucrase"): Plugin[] => [
  alias({ entries: getAliasEntries() }),
  svelte({
    preprocess: autoPreprocess(),
    emitCss: false,
  }),
  (
    transpilerPlugin === "sucrase"
      ? sucrase({ transforms: ['typescript'] })
      : ts()
  ),
  nodeResolve(),
  commonjs(),
  css(),
  //terser(),
];

export const getOutputOptions = ({ id: name, bundleDestination: file }: BundleInfo, overrides?: OutputOptions): OutputOptions =>
  ({ file, name, format: "iife", compact: true, sourcemap: true, ...(overrides || {}) });