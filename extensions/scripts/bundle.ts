import chalk from 'chalk';
import { getAllExtensionDirectories, getExtensionDirectory, watchForExtensionDirectoryAdded } from './utils/fileSystem';
import { sendToParent } from '$root/scripts/comms';
import { processOptions } from "$root/scripts/buildOptions";
import bundleFramework from "./bundles/framework";
import bundleV2Framework from "./bundles/framework.v2";
import bundleExtension from "./bundles/extension";
import bundleV2Extension, { isV2Extension } from './bundles/extension.v2';

const { watch, specifiedDir } = processOptions({ watch: false });

bundleFramework(watch);
bundleV2Framework(watch);

try {
  const soloDirectory = specifiedDir ? getExtensionDirectory(specifiedDir) : undefined;
  const extensionDirectories = soloDirectory ? [soloDirectory] : getAllExtensionDirectories();

  const { length } = extensionDirectories;
  extensionDirectories.forEach(dir => isV2Extension(dir)
    ? bundleV2Extension(dir, length, watch)
    : bundleExtension(dir, length, watch)
  );

  if (!soloDirectory && watch) {
    watchForExtensionDirectoryAdded(
      extensionDirectories,
      (path, stats) => isV2Extension(path)
        ? bundleV2Extension(path, extensionDirectories.length, true)
        : bundleExtension(path, extensionDirectories.length + 1, true)
    );
  }
}
catch (e) {
  console.error(chalk.red(e));
  sendToParent(process, { condition: "extensions error" })
}
