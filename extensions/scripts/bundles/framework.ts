import { rollup, type RollupOptions, } from "rollup";
import { getBundleInfo, getOutputOptions, getThirdPartyPlugins } from ".";
import { clearDestinationDirectories, generateVmDeclarations, setupFrameworkBundleEntry, transpileExtensionGlobals } from "../plugins";
import { watchAllFilesInDirectoryAndCommon } from "scripts/utils/rollupHelper";
import { commonDirectory } from "scripts/utils/fileSystem";
import { FrameworkID } from "$common";

export default async function (doWatch: boolean) {
  const info = getBundleInfo(commonDirectory, { id: FrameworkID });

  const customPRGPlugins = [
    setupFrameworkBundleEntry(info),
    clearDestinationDirectories(),
    transpileExtensionGlobals(),
    generateVmDeclarations(),
  ];

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins("sucrase")];
  const options: RollupOptions = { input: info.bundleEntry, plugins };
  const bundled = await rollup(options);

  const output = getOutputOptions(info);
  await bundled.write(output);

  if (doWatch) watchAllFilesInDirectoryAndCommon(info, options, output);
}