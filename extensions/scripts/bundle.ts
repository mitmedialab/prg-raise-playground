import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import path from "path";
import fs from "fs";
import { default as glob } from 'glob';
import svelte from 'rollup-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import commonjs from "@rollup/plugin-commonjs";
import sucrase from '@rollup/plugin-sucrase';
import alias from '@rollup/plugin-alias';
import { transpileExtensions, fillInCodeGenArgs } from "./plugins";
import { vmSrc } from '$root/scripts/paths';
import type Transpiler from './typeProbing/Transpiler';
import { ExtensionMenuDisplayDetails, encode } from '$common';
import { retrieveExtensionDetails } from './typeProbing';


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

const getBuildDirectory = (dir) => path.join(dir, "build");

const toNamedDefaultExport = (details: { path: string, name: string }) => `export { default as ${details.name} } from '${details.path}';`;

const deleteAllFilesInDir = (dir) => fs.readdirSync(dir).forEach(file => fs.unlinkSync(path.join(dir, file)));

const fileName = (file) => path.basename(file).replace(path.extname(file), "");

const transpileComplete = (ts: Transpiler, dir: string, menuDetailsContainer: object) => {
  const record = retrieveExtensionDetails(ts.program);
  for (const id in record) {
    if (id !== dir) continue;
    const details = record[id];
    for (const key in details) {
      menuDetailsContainer[key] = details[key];
    }
  }
}

const transpileFailed = (ts: Transpiler, dir: string) => {

}

const FrameworkDirectory = path.resolve(__dirname, "..", "src", "common");

if (!fs.existsSync(FrameworkDirectory)) throw new Error("Could not find framework directory at specified path");

const bundleExtension = async (dir) => {
  const indexFile = path.join(dir, "index.ts");

  const filesToBundle = [toNamedDefaultExport({ path: indexFile, name: "Extension" })];

  const svelteFiles = glob.sync(`${dir}/**/*.svelte`);
  filesToBundle.push(
    ...svelteFiles
      .map(file => ({ path: file, name: fileName(file) }))
      .map(toNamedDefaultExport)
  );

  const generatedFileName = "filesToBundle.js";
  const generatedFilePath = path.join(dir, generatedFileName);
  fs.writeFileSync(generatedFilePath, filesToBundle.join("\n"));

  const menuDetails = {} as ExtensionMenuDisplayDetails;
  const id = encode(path.basename(dir));

  const plugins = [
    alias({
      entries: {
        $common: FrameworkDirectory,
        "$scratch-vm": vmSrc
      }
    }),
    transpileExtensions({
      entry: indexFile,
      onSuccess: (ts) => transpileComplete(ts, dir, menuDetails),
      onError: (ts) => transpileFailed(ts, dir)
    }),
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    sucrase({
      transforms: ['typescript']
    }),
    fillInCodeGenArgs({ id, dir, menuDetails }),
    nodeResolve(),
    commonjs(),
    css(),
    terser(),
  ];

  const options: rollup.RollupOptions = {
    input: generatedFilePath,
    plugins,
    watch: false,
  }

  const bundled = await rollup.rollup(options);
  const buildDirectory = getBuildDirectory(dir);

  fs.existsSync(buildDirectory)
    ? deleteAllFilesInDir(buildDirectory)
    : fs.mkdirSync(buildDirectory);

  const bundleFile = path.join(buildDirectory, 'bundle.js');

  const output: rollup.OutputOptions = {
    file: bundleFile,
    format: "iife",
    compact: true,
    name: id,
    sourcemap: 'inline'
  };

  await bundled.write(output);

  fs.rmSync(generatedFilePath);

  // Delete empty assets svelte generates
  fs.rmSync(path.join(buildDirectory, "assets"), { recursive: true, force: true });
}

bundleExtension(path.resolve(__dirname, "..", "src", "typescript_framework_simple"));

export const bundle = (dir) => {
  bundleExtension(dir);
}

export const bundlee = async (watch) => {
  const app = path.resolve(__dirname, "..");
  const src = path.join(app, 'src');
  const site = path.join(app, 'site');
  const entry = path.join(src, 'index.ts');

  const plugins = [
    typescript(),
    nodeResolve(),
    commonjs(),
    terser(),
  ];

  const options: rollup.RollupOptions = {
    input: entry,
    plugins,
    watch: false,
  }

  const bundled = await rollup.rollup(options);

  const file = path.join(site, 'js', 'bundle.js');
  const output: rollup.OutputOptions = { file, format: 'es', compact: true, sourcemap: 'inline' };

  await bundled.write(output);

  if (!watch) return;

  const watcher = rollup.watch({
    ...options,
    output: [output],
    watch: { include: [path.join(src, "**", "*"), path.join(site, "**", "*")] }
  });

  watcher.on('event', (event) => {
    console.log(event.code);
    if (event.code === "BUNDLE_END") event.result?.close();
  });
};

