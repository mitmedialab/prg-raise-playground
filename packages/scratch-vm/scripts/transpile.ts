import glob = require("glob");
import chalk = require("chalk");
import path = require("path");
import { profile } from "../../../scripts/profile";
import { processArgs } from "../../../scripts/processArgs";
import { extensionsFolder, packages } from "../../../scripts/paths";
import { transpileAndWatch } from "./tsWatcher";

export type TranspileOptions = { doWatch: boolean; useCaches: boolean; };
const srcDir = path.resolve(packages.vm, "src");

const transpileAllTsExtensions = (options: TranspileOptions) => {
  glob(`${extensionsFolder}/**/index.ts`, (err, files) => {
    if (err) return console.error(chalk.red(err));
    if (!files) return console.error(chalk.red("No files found"));
    
    const watcher = profile(() => transpileAndWatch(
      options.useCaches, 
      srcDir, 
      files, 
      () => {
        console.error(chalk.red("Closing watcher due to error."));
        watcher.close();
      }
    ), "Completed initial transpile in");

    const { doWatch } = options;
    if (!doWatch) watcher.close();
  });
}

const defaults: TranspileOptions = { 
  doWatch: false, 
  useCaches: false,
};

const flagByOption = {
  doWatch: "watch", 
  useCaches: "cache"
};

const options = processArgs<TranspileOptions>(flagByOption, defaults);
transpileAllTsExtensions(options);