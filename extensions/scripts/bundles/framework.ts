import { watch, type RollupOptions, } from "rollup";
import { getBundleInfo, getOutputOptions, getThirdPartyPlugins, logEvents } from ".";
import { clearDestinationDirectories, generateVmDeclarations, onFrameworkBundle, setupFrameworkBundleEntry, transpileExtensionGlobals } from "../plugins";
import { commonDirectory } from "scripts/utils/fileSystem";
import { FrameworkID } from "$common";

export default async function (doWatch: boolean, afterFirstBundle: () => void) {
  const info = getBundleInfo(commonDirectory, { id: FrameworkID });

  const customPRGPlugins = [
    setupFrameworkBundleEntry(info),
    clearDestinationDirectories(),
    transpileExtensionGlobals(),
    generateVmDeclarations(),
    onFrameworkBundle(afterFirstBundle)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = { input: info.bundleEntry, plugins };
  const output = getOutputOptions(info);
  const watcher = watch({ ...options, output });
  logEvents(watcher, info);
  if (!doWatch) watcher.close();
}