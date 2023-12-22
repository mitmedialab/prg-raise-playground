import chalk from 'chalk';
import { extensionGlob, extensionPathIsValid, } from './utils/fileSystem';
import { sendToParent } from '$root/scripts/comms';
import options from "$root/scripts/options";
import bundleFramework from "./bundles/framework";
import { bundleExtension } from "./bundles";
import { hackToFilterOutUnhelpfulRollupLogs } from './utils/rollupHelper';

const specialGlobs = new Map([
  ["all", "!([.]|commo*)*/"], // all folders EXCEPT ".templates" & "common"
  ["examples", "*_example/"], // all folders ending with "_example"
]);

const { watch, include, parrallel } = options(process.argv);
const globs = (Array.isArray(include) ? include : [include])
  .map(pattern => specialGlobs.has(pattern) ? specialGlobs.get(pattern) : pattern);

hackToFilterOutUnhelpfulRollupLogs();

(async () => {
  await bundleFramework(watch);

  const extensionDirectories = Array.from(new Set((await Promise.all(globs.map(extensionGlob))).flat()));

  for (const dir of extensionDirectories) if (!extensionPathIsValid(dir)) throw new Error(`Invalid extension path: ${dir}`);

  const { length } = extensionDirectories;

  if (parrallel) await Promise.all(extensionDirectories.map(dir => bundleExtension(dir, length, watch)));
  else for (const dir of extensionDirectories) await bundleExtension(dir, length, watch)
})()
  .catch((e: any) => {
    console.error(chalk.red(e));
    sendToParent(process, { condition: "extensions error" })
  });