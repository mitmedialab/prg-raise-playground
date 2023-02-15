import { watch, type RollupOptions, } from "rollup";
import { getBundleInfo, getOutputOptions, getThirdPartyPlugins, logEvents } from ".";
import { clearDestinationDirectories, generateVmDeclarations, setupFrameworkBundleEntry, transpileExtensionGlobals } from "../plugins";
import { commonDirectory } from "scripts/utils/fileSystem";
import { FrameworkID } from "$common";

export default async function (doWatch: boolean) {
  const info = getBundleInfo(commonDirectory, { id: FrameworkID });

  const customPRGPlugins = [
    setupFrameworkBundleEntry(info),
    clearDestinationDirectories(),
    transpileExtensionGlobals(),
    generateVmDeclarations(),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = { input: info.bundleEntry, plugins };
  const output = getOutputOptions(info);
  const watcher = watch({ ...options, output });
  logEvents(watcher, info);
}