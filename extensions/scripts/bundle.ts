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
import alias from 'rollup-plugin-alias';
import includePaths from 'rollup-plugin-includepaths';
import { fileURLToPath } from 'url';
import typescript2 from 'rollup-plugin-typescript2';


//const __dirname = path.dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

const getBuildDirectory = (dir) => path.join(dir, "build");

const bundleExtension = (dir) => {

}

const bundleMenuDetails = (dir) => {

}

const bundleUI = async (dir) => {
  const svelteFiles = glob.sync(`${dir}/*.svelte`);

  const exportAllUI = svelteFiles
    .map(file => ({ path: file, name: path.basename(file).replace(path.extname(file), "") }))
    .map(({ path, name }) => `export { default as ${name} } from '${path}';`)
    .join("\n");

  const generatedFileName = "ui.js";
  const generatedFilePath = path.join(dir, generatedFileName);
  fs.writeFileSync(generatedFilePath, exportAllUI);

  const plugins = [
    svelte({
      preprocess: autoPreprocess(),
      emitCss: false,
    }),
    typescript2({
      /*include: [
        path.resolve(__dirname, "..", "src", "**", "*.ts"),
        path.resolve("..", "..", "packages", "scratch-vm", "src", "**", "*.ts")
      ]*/
    }),

    nodeResolve(),
    commonjs(),
    css(),
    //terser(),
  ];

  const options: rollup.RollupOptions = {
    input: generatedFilePath,
    plugins,
    watch: false,
  }

  const bundled = await rollup.rollup(options);
  const buildDirectory = getBuildDirectory(dir);

  if (!fs.existsSync(buildDirectory)) fs.mkdirSync(buildDirectory);

  const id = "typescriptprg95grpframeworkprg95grpsimple"

  const bundleFile = path.join(buildDirectory, id, 'ui.bundle.js');

  const output: rollup.OutputOptions = {
    file: bundleFile,
    format: "iife",
    compact: true,
    name: `${id}_UI`,
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

