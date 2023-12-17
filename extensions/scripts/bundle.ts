import chalk from 'chalk';
import { getAllExtensionDirectories, getExtensionDirectory, watchForExtensionDirectoryAdded } from './utils/fileSystem';
import { sendToParent } from '$root/scripts/comms';
import { processOptions } from "$root/scripts/buildOptions";
import bundleFramework from "./bundles/framework";
import { bundleExtension } from "./bundles";
import { hackToFilterOutUnhelpfulRollupLogs } from './utils/rollupHelper';

const { watch, specifiedDir, individually } = processOptions({ watch: false });

hackToFilterOutUnhelpfulRollupLogs();

(async () => {
  await bundleFramework(watch);

  const soloDirectory = specifiedDir ? getExtensionDirectory(specifiedDir) : undefined;
  const extensionDirectories = soloDirectory ? [soloDirectory] : getAllExtensionDirectories();

  const { length } = extensionDirectories;

  if (individually) {
    await Promise.all(extensionDirectories.map((dir) => {
      return bundleExtension(dir, length, watch);
    }));
  } else {
    extensionDirectories.forEach(dir => bundleExtension(dir, length, watch));
  }

  if (soloDirectory || !watch) return;

  watchForExtensionDirectoryAdded(
    extensionDirectories,
    (path, stats) => bundleExtension(path, extensionDirectories.length + 1, true)
  );
})()
  .catch((e: any) => {
    console.error(chalk.red(e));
    sendToParent(process, { condition: "extensions error" })
  });