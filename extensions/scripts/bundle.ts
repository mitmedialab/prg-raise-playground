import chalk from 'chalk';
import { getAllExtensionDirectories, getExtensionDirectory, watchForExtensionDirectoryAdded } from './utils/fileSystem';
import { sendToParent } from '$root/scripts/comms';
import { processOptions } from "$root/scripts/buildOptions";
import bundleFramework from "./bundles/framework";
import { bundleExtension } from "./bundles";

const { watch, specifiedDir } = processOptions({ watch: false });

bundleFramework(watch, () => {
  try {
    const soloDirectory = specifiedDir ? getExtensionDirectory(specifiedDir) : undefined;
    const extensionDirectories = soloDirectory ? [soloDirectory] : getAllExtensionDirectories();

    const { length } = extensionDirectories;
    extensionDirectories.forEach(dir => bundleExtension(dir, length, watch));

    if (!soloDirectory && watch) {
      watchForExtensionDirectoryAdded(
        extensionDirectories,
        (path, stats) => bundleExtension(path, extensionDirectories.length + 1, true)
      );
    }
  }
  catch (e) {
    console.error(chalk.red(e));
    sendToParent(process, { condition: "extensions error" })
  }
});

