import { watch, type RollupOptions, } from "rollup";
import { getBundleInfo, getOutputOptions, getThirdPartyPlugins, logEvents } from ".";
import { setupFrameworkBundleEntry } from "../plugins";
import { v2Directory } from "scripts/utils/fileSystem";
import { FrameworkID, V2FrameworkID } from "$common";
import { commonAlias } from "scripts/utils/aliases";

export default async function (doWatch: boolean) {
  const info = getBundleInfo(v2Directory, { id: V2FrameworkID });

  const customPRGPlugins = [
    setupFrameworkBundleEntry(info),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins("typescript")];
  const options: RollupOptions = { input: info.bundleEntry, plugins, external: commonAlias };

  const globals = { [commonAlias]: FrameworkID };
  const output = getOutputOptions(info, { globals });

  const watcher = watch({ ...options, output });
  logEvents(watcher, info);
}