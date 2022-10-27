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
  glob(`${extensionsFolder}/!(typescript_templates)/**/index.ts`, (err, files) => {
    if (err) return console.error(chalk.red(err));
    if (!files) return console.error(chalk.red("No files found"));

    const watcher = profile(() => transpileAndWatch(
      options.useCaches,
      srcDir,
      files,
      () => {
        if (!watcher) return console.error(chalk.gray("(No watcher to close)"));
        watcher.close();
        console.error(chalk.red("Closing watcher due to error."));
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