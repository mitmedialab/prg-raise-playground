import { bundleBasedOnWatchMode, getBundleInfo, getOutputOptions, getThirdPartyPlugins, } from ".";
import { clearDestinationDirectories, onFrameworkBundle, setupFrameworkBundleEntry, transpileExtensionGlobals } from "./plugins";
import { commonDirectory } from "scripts/utils/fileSystem";
import { FrameworkID, untilCondition } from "$common";

export default async function (doWatch: boolean) {
  const info = getBundleInfo(commonDirectory, { id: FrameworkID, watch: doWatch });

  let bundleExists = false;

  const customPRGPlugins = [
    setupFrameworkBundleEntry(info),
    clearDestinationDirectories(),
    transpileExtensionGlobals(),
    onFrameworkBundle(() => bundleExists = true)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];

  await Promise.all([
    bundleBasedOnWatchMode({ plugins, info }),
    untilCondition(() => bundleExists)
  ]);
}