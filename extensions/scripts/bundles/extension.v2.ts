import { rollup, type RollupOptions, type Plugin, watch } from "rollup";
import { FrameworkID, V2FrameworkID } from "$common";
import { announceWrite, createExtensionMenuAssets, setupExtensionBundleEntry, transpileExtensions } from "../plugins";
import { commonAlias, v2Alias } from "../utils/aliases";
import { watchAllFilesInDirectoryAndCommon } from "../utils/rollupHelper";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, getBundleInfo } from ".";
import fs from 'fs';
import path from 'path';
import { v2Directory } from "scripts/utils/fileSystem";

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

  spoofDetails(info);

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    //transpileExtensions(info, { onSuccess: transpileComplete, onError: transpileFailed }),
    createExtensionMenuAssets(info),
    //fillInCodeGenArgs(info),
    announceWrite(info),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins("typescript")];
  const options: RollupOptions = {
    input: info.bundleEntry, plugins, external: [commonAlias, v2Alias]
  }

  const globals = { [commonAlias]: FrameworkID, [v2Alias]: V2FrameworkID };

  const output = getOutputOptions(info, { globals });

  const watcher = watch({ ...options, output });

  watcher.on("change", (e) => console.log("Change!! " + e));


  /*
  const bundled = await rollup(options);
  const globals = { [commonAlias]: FrameworkID, [v2Alias]: V2FrameworkID };

  const output = getOutputOptions(info, { globals });
  await bundled.write({ ...output });

  if (doWatch) watchAllFilesInDirectoryAndCommon(info, options, output);*/
};