import { type Plugin } from "rollup";
import { announceWrite, fillInConstructorArgs, finalizeCommonExtensionBundle, setupExtensionBundleEntry, decoratorCodeGenFlag } from "../plugins";
import { getThirdPartyPlugins, BundleInfo, bundleExtensionBasedOnWatchMode } from ".";

export default async function (info: BundleInfo) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    fillInConstructorArgs(info, () => decoratorCodeGenFlag),
    finalizeCommonExtensionBundle(info),
    announceWrite(info)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  await bundleExtensionBasedOnWatchMode({ plugins, info });
};