import { fork, type ChildProcess } from 'child_process';
import path from "path";
import fs from "fs";
import { Message, Conditon } from './comms';
import { extensionsFolder, packages, root } from './paths';
import { flagByOption, processOptions } from './buildOptions';

const { gui } = packages;

const getNodeModule = (dir: string, module: string) => path.join(dir, "node_modules", ".bin", module);
const convertToArgs = (args: Record<string, any>) => Object.entries(args).map(([flag, value]) => `${flag}=${value}`);
const convertToFlags = (args: Record<string, string>) => Object.entries(args).map(([flag, value]) => [`--${flag}`, value]).flat();
const asFlags = (...names: string[]) => names.map(name => "--" + name);

const { watch, specifiedDir, individually, ...args } = processOptions();

const [guiBuildDir, rootBuildDir] = [gui, root].map(dir => path.join(dir, "build"));

const clearBuildDirs = () => [guiBuildDir, rootBuildDir]
  .filter(fs.existsSync)
  .forEach(dir => fs.rmSync(dir, { force: true, recursive: true }));

const copyOverBuild = () => fs.existsSync(guiBuildDir)
  ? fs.renameSync(guiBuildDir, rootBuildDir)
  : console.error("Could not locate build");

const extensionsScripts = path.join(extensionsFolder, "scripts");
const bundleExtensionsScript = path.join(extensionsScripts, "bundle.ts");

const bundleArgs = { watch, [flagByOption.specifiedDir]: specifiedDir, [flagByOption.individually]: individually };
const bundleExtensions = fork(bundleExtensionsScript, convertToArgs(bundleArgs));

const childProcesses: Record<string, ChildProcess> = {
  bundleExtensions,
  serveGui: undefined
}

bundleExtensions.on("message", (msg: Message) => {
  const { condition: flag } = msg;
  switch (flag) {
    case Conditon.ErrorBundlingExtensions:
      Object.values(childProcesses).forEach(child => child?.kill());
      break;
    case Conditon.ExtensionsSuccesfullyBundled:
      if (childProcesses.serveGui) return;
      const webpack = getNodeModule(gui, watch ? "webpack-dev-server" : "webpack");
      const config = path.join(gui, "webpack.config.js");
      const clearTsNodeArgs = [];
      const options = { cwd: gui, execArgv: clearTsNodeArgs };
      const flags = convertToFlags({ config });

      if (!watch) flags.push(...asFlags("progress", "colors", "bail"));
      if (!watch) clearBuildDirs();

      childProcesses.serveGui = fork(webpack, flags, options);

      if (!watch) childProcesses.serveGui.on("exit", copyOverBuild);

      break;
  }
});