import { watch, type RollupOptions, type Plugin } from "rollup";
import { FrameworkID } from "$common";
import { announceWrite, createExtensionMenuAssets, fillInConstructorArgs, setupExtensionBundleEntry, transpileExtensions } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, getOutputOptions, BundleInfo, logEvents, stringifyCodeGenArgs, optionalCloseOnBundleEnd } from ".";
import Transpiler from "../typeProbing/Transpiler";
import { printDiagnostics } from "../typeProbing/diagnostics";
import { retrieveExtensionDetails } from "../typeProbing";
import { sendToParent } from "$root/scripts/comms";
import chalk from "chalk";

const transpileComplete = (transpiler: Transpiler, { menuDetails, watch }: BundleInfo) => {
  const details = retrieveExtensionDetails(transpiler.program);
  for (const key in details) menuDetails[key] = details[key];
  if (!watch) transpiler.close();
}

const transpileFailed = (transpiler: Transpiler, { directory, watch }: BundleInfo) => {
  console.error(chalk.bgRed(`Typescript error in ${directory}`));
  printDiagnostics(transpiler.program, transpiler.program.getSemanticDiagnostics());
  sendToParent(process, { condition: "extensions error" });
  if (!watch) transpiler.close();
}

export default function (info: BundleInfo) {

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
  optionalCloseOnBundleEnd(watcher, info);
};