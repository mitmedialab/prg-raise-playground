import { fork, type ChildProcess } from 'child_process';
import path from "path";
import fs from "fs";
import { Message, Conditon } from './comms';
import { extensionsFolder, scratchPackages, root } from './paths';
import options, { convertToFlags, asFlags } from './options';

const { gui } = scratchPackages;

const { watch } = options(process.argv);

const getNodeModule = (dir: string, module: string) => path.join(dir, "node_modules", ".bin", module);

const [guiBuildDir, rootBuildDir] = [gui, root].map(dir => path.join(dir, "build"));

const clearBuildDirs = () => [guiBuildDir, rootBuildDir]
  .filter(fs.existsSync)
  .forEach(dir => fs.rmSync(dir, { force: true, recursive: true }));

const copyOverBuild = () => fs.existsSync(guiBuildDir)
  ? fs.renameSync(guiBuildDir, rootBuildDir)
  : console.error("Could not locate build");

const extensionsScripts = path.join(extensionsFolder, "scripts");
const bundleExtensionsScript = path.join(extensionsScripts, "bundle.ts");

const bundleExtensions = fork(bundleExtensionsScript, process.argv);

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