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
import { fillInCodeGenArgs, extractMenuDetailsFromType } from "./plugins";
import customTs from "./plugins/typescript";

//const __dirname = path.dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

const getBuildDirectory = (dir) => path.join(dir, "build");
const toNamedDefaultExport = ({ path, name }: { path: string, name: string }) =>
  `export { default as ${name} } from '${path}';`

const bundleExtension = (dir) => {

}

const bundleMenuDetails = (dir) => {

}

const FrameworkDirectory = path.resolve(__dirname, "..", "..", "packages", "scratch-vm", "src", "typescript-support");

if (!fs.existsSync(FrameworkDirectory)) throw new Error("Could not find framework directory at specified path");

const bundleUI = async (dir) => {
  const svelteFiles = glob.sync(`${dir}/*.svelte`);

  const filesToBundle = svelteFiles
    .map(file => ({ path: file, name: path.basename(file).replace(path.extname(file), "") }))
    .map(toNamedDefaultExport);

  const indexFile = path.join(dir, "index.ts");

  filesToBundle.push(toNamedDefaultExport({ path: indexFile, name: "Extension" }));

  const generatedFileName = "filesToBundle.js";
  const generatedFilePath = path.join(dir, generatedFileName);
  fs.writeFileSync(generatedFilePath, filesToBundle.join("\n"));

  const plugins = [
    alias({
      entries: {
        $ExtensionFramework: FrameworkDirectory
      }
    }),
    customTs({ entry: indexFile }),
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    extractMenuDetailsFromType(),
    sucrase({
      transforms: ['typescript']
    }),
    fillInCodeGenArgs(),
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

  if (!fs.existsSync(buildDirectory)) fs.mkdirSync(buildDirectory);

  const id = "test"

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

bundleUI(path.resolve(__dirname, "..", "src", "typescript_framework_simple"));

export const bundle = (dir) => {
  bundleExtension(dir);
  bundleMenuDetails(dir);
  bundleUI(dir);
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

