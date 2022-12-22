import { fork, type ChildProcess } from 'child_process';
import path from "path";
import { Message, Conditon } from './devComms';
import { extensionsFolder, packages } from './paths';

const { gui } = packages;

const getNodeModule = (dir: string, module: string) => path.join(dir, "node_modules", ".bin", module);
const argsToFlags = (args: Record<string, string>) => Object.entries(args).map(([flag, value]) => [`--${flag}`, value]).flat()

const extensionsScripts = path.join(extensionsFolder, "scripts");
const bundleExtensionsScript = path.join(extensionsScripts, "bundle.ts");
const bundleExtensions = fork(bundleExtensionsScript, ["watch=true"]);

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
      const webpack = getNodeModule(gui, "webpack-dev-server");
      const config = path.join(gui, "webpack.config.js");
      const clearTsNodeArgs = [];
      childProcesses.serveGui = fork(webpack, argsToFlags({ config }), { cwd: gui, execArgv: clearTsNodeArgs, })
      break;
  }
});