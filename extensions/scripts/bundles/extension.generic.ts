import { watch, type RollupOptions, type Plugin } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, createExtensionMenuAssets, fillInConstructorArgs, setupExtensionBundleEntry, transpileExtensions } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, getBundleInfo, logEvents, stringifyCodeGenArgs } from ".";
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

export default async function (info: BundleInfo, doWatch: boolean = true) {

  const customPRGPlugins: Plugin[] = [
    setupExtensionBundleEntry(info),
    transpileExtensions(info, { onSuccess: transpileComplete, onError: transpileFailed }),
    createExtensionMenuAssets(info),
    fillInConstructorArgs(info, stringifyCodeGenArgs),
    announceWrite(info),
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