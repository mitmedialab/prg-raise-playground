import { type Plugin } from "rollup";
import { announceWrite, finalizeConfigurableExtensionBundle, setupExtensionBundleEntry, mp3Bundler } from "./plugins";
import { getThirdPartyPlugins, BundleInfo, bundleExtensionBasedOnWatchMode } from ".";
import { extractMethodTypesFromExtension } from "scripts/typeProbing";

export default async function (info: BundleInfo) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    finalizeConfigurableExtensionBundle(info),
    mp3Bundler(info),
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