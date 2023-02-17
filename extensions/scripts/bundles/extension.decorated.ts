import { type RollupOptions, type Plugin, watch } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, fillInConstructorArgs, finalizeDecoratedExtensionBundle, setupExtensionBundleEntry, v2CodeGenFlag } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, logEvents, optionalCloseOnBundleEnd } from ".";

export default function (info: BundleInfo) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    fillInConstructorArgs(info, () => v2CodeGenFlag),
    finalizeDecoratedExtensionBundle(info),
    announceWrite(info)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = {
    input: info.bundleEntry,
    plugins,
    external: [commonAlias]
  }

  const globals = { [commonAlias]: FrameworkID };
  const output = getOutputOptions(info, { globals });
  const watcher = watch({ ...options, output });
  logEvents(watcher, info);
  optionalCloseOnBundleEnd(watcher, info);
};