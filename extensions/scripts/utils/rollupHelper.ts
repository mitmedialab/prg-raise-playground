import path from "path";
import chalk from 'chalk';
import { watch, type RollupOptions, type OutputOptions } from "rollup";
import { commonDirectory } from "./fileSystem";

export const watchAllFilesInDirectoryAndCommon = ({ directory, name }: { directory: string, name: string }, options: RollupOptions, output: OutputOptions) => {
  const watcher = watch({
    ...options,
    output: [output],
    watch: { include: [path.join(directory, "**", "*"), path.join(commonDirectory, "**", "*")] }
  });

  watcher.on('event', (event) => {
    const prefix = "[rollup]";
    event.code === "ERROR"
      ? console.error(chalk.bgRed(`${prefix} ${name}:`) + chalk.red(`${event.error}`))
      : console.log(chalk.bgGreen(`${prefix} ${name}:`) + chalk.cyan(` ${event.code}`));
    if (event.code === "BUNDLE_END") event.result?.close();
  });
};

export const runOncePerBundling = (): { check: () => boolean, internal?: any } =>
  ({ internal: 0, check() { return 0 === (this.internal++ as number) } });