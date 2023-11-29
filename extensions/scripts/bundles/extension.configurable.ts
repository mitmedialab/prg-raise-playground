import { type Plugin } from "rollup";
import { announceWrite, finalizeConfigurableExtensionBundle, setupExtensionBundleEntry } from "./plugins";
import { getThirdPartyPlugins, BundleInfo, bundleExtensionBasedOnWatchMode } from ".";
import { extractMethodTypesFromExtension } from "scripts/typeProbing";

export default async function (info: BundleInfo) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    finalizeConfigurableExtensionBundle(info),
    announceWrite(info)
  ];

  const plugins = [
    ...customPRGPlugins,
    ...getThirdPartyPlugins({
      tsTransformers: [extractMethodTypesFromExtension(info)]
    })
  ];

  await bundleExtensionBasedOnWatchMode({ plugins, info });
};