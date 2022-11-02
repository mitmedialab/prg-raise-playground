import { MakeWatcher, Watcher } from ".";
import chokidar = require('chokidar');
import { extensionsFolder } from "../../../../scripts/paths";
import path = require("path");
import { glob } from "glob";
import chalk = require("chalk");

export default function (triggerRefresh: Parameters<MakeWatcher>[0]): Watcher {
  const svelteGlob = path.join(extensionsFolder, "**", "*.svelte");
  const initialComponents = glob.sync(svelteGlob);

  const watcher = chokidar.watch(svelteGlob);
  watcher.on("add", (path) => {
    if (initialComponents.includes(path)) return;
    console.log(chalk.green(`New svelte file: ${path}`));
    console.log(chalk.green(`Triggering re-transpile...`));
    initialComponents.push(path);
    triggerRefresh();
  });

  return {
    close: () => watcher.close()
  }
};