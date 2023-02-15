import { type RollupOptions, type Plugin, watch } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, fillInConstructorArgs, finalizeDecoratedExtensionBundle, setupExtensionBundleEntry, transpileExtensions, v2CodeGenFlag } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, getBundleInfo, logEvents } from ".";
import fs from 'fs';
import path from 'path';

export const isV2Extension = (dir: string) => fs.existsSync(path.join(dir, "index.v2.ts"));

export default async function (info: BundleInfo, doWatch: boolean = true) {

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
  if (!doWatch) watcher.close();
};