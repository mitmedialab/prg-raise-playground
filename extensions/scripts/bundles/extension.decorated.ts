import { type RollupOptions, type Plugin, watch, rollup } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, fillInConstructorArgs, finalizeDecoratedExtensionBundle, setupExtensionBundleEntry, decoratorCodeGenFlag } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, logEvents, bundleExtensionBasedOnWatchMode } from ".";

export default async function (info: BundleInfo) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    fillInConstructorArgs(info, () => decoratorCodeGenFlag),
    finalizeDecoratedExtensionBundle(info),
    announceWrite(info)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  await bundleExtensionBasedOnWatchMode({ plugins, info });
};