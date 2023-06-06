import { announceWrite, finalizeGenericExtensionBundle, setupExtensionBundleEntry } from "./plugins";
import { getThirdPartyPlugins, BundleInfo, bundleExtensionBasedOnWatchMode } from ".";
import { populateDisplayMenuDetailsTransformer } from "../typeProbing";

export default async function (info: BundleInfo) {

  const customPRGPlugins = [
    setupExtensionBundleEntry(info),
    finalizeGenericExtensionBundle(info),
    announceWrite(info),
  ];

  const plugins = [
    ...customPRGPlugins,
    ...getThirdPartyPlugins({ tsTransformers: [populateDisplayMenuDetailsTransformer(info)] })
  ];

  await bundleExtensionBasedOnWatchMode({ plugins, info });
};