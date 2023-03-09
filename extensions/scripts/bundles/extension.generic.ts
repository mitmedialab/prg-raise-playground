import { announceWrite, createExtensionMenuAssets, fillInConstructorArgs, setupExtensionBundleEntry } from "../plugins";
import { getThirdPartyPlugins, BundleInfo, stringifyCodeGenArgs, bundleExtensionBasedOnWatchMode } from ".";
import { populateDisplayMenuDetailsTransformer } from "../typeProbing";

export default async function (info: BundleInfo) {

  const customPRGPlugins = [
    setupExtensionBundleEntry(info),
    createExtensionMenuAssets(info),
    fillInConstructorArgs(info, stringifyCodeGenArgs),
    announceWrite(info),
  ];

  const plugins = [
    ...customPRGPlugins,
    ...getThirdPartyPlugins({ tsTransformers: [populateDisplayMenuDetailsTransformer(info)] })
  ];

  await bundleExtensionBasedOnWatchMode({ plugins, info });
};