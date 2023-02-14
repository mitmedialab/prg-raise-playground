import { type RollupOptions, type Plugin, watch } from "rollup";
import { FrameworkID, V2FrameworkID } from "$common";
import { announceWrite, createExtensionMenuAssets, fillInCodeGenArgs, finalizeV2Bundle, setupExtensionBundleEntry, transpileExtensions } from "../plugins";
import { commonAlias, v2Alias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, getBundleInfo, logEvents } from ".";
import fs from 'fs';
import path from 'path';

export const isV2Extension = (dir: string) => fs.existsSync(path.join(dir, "index.v2.ts"));

const spoofDetails = ({ menuDetails }: BundleInfo) => {
  const details = {
    name: "Super Simple Typescript Extension!",
    description: "Skeleton for a typescript extension",
  };
  for (const key in details) menuDetails[key] = details[key];
}

export default async function (dir: string, extensionCount: number, doWatch: boolean = true) {
  const info = getBundleInfo(dir, { totalNumberOfExtensions: extensionCount }, "index.v2.ts");

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    finalizeV2Bundle(info)
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins("typescript")];
  const options: RollupOptions = {
    input: info.bundleEntry,
    plugins,
    external: [commonAlias, v2Alias]
  }

  const globals = { [commonAlias]: FrameworkID, [v2Alias]: V2FrameworkID };
  const output = getOutputOptions(info, { globals });
  const watcher = watch({ ...options, output });
  logEvents(watcher, info);
};