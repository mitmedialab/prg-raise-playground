import { rollup, type RollupOptions, type Plugin } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, createExtensionMenuAssets, fillInCodeGenArgs, setupExtensionBundleEntry, transpileExtensions } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { watchAllFilesInDirectoryAndCommon } from "../utils/rollupHelper";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, getBundleInfo } from ".";
import Transpiler from "../typeProbing/Transpiler";
import { printDiagnostics } from "../typeProbing/diagnostics";
import { retrieveExtensionDetails } from "../typeProbing";
import { sendToParent } from "$root/scripts/comms";
import chalk from "chalk";

const transpileComplete = (ts: Transpiler, { menuDetails }: BundleInfo) => {
  const details = retrieveExtensionDetails(ts.program);
  for (const key in details) menuDetails[key] = details[key];
}

const transpileFailed = (ts: Transpiler, info: BundleInfo) => {
  console.error(chalk.bgRed(`Typescript error in ${info.directory}`));
  printDiagnostics(ts.program, ts.program.getSemanticDiagnostics());
  sendToParent(process, { condition: "extensions error" });
}

export default async function (dir: string, extensionCount: number, doWatch: boolean = true) {
  const info = getBundleInfo(dir, { totalNumberOfExtensions: extensionCount });

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    transpileExtensions(info, { onSuccess: transpileComplete, onError: transpileFailed }),
    createExtensionMenuAssets(info),
    fillInCodeGenArgs(info),
    announceWrite(info),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins()];
  const options: RollupOptions = { input: info.bundleEntry, plugins, external: commonAlias }
  const bundled = await rollup(options);
  const globals = { [commonAlias]: FrameworkID };

  const output = getOutputOptions(info, { globals });
  await bundled.write(output);

  if (doWatch) watchAllFilesInDirectoryAndCommon(info, options, output);
};