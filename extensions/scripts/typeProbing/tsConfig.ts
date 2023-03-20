import path from "path";
import ts from "typescript";
import { extensionsFolder } from "$root/scripts/paths";

const srcDir = path.join(extensionsFolder, "src");

export const getTsConfigFile = () => path.join(srcDir, "tsconfig.json");

export const getSrcCompilerOptions = () => {
  const configFile = getTsConfigFile();
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, srcDir, undefined, configFile).options;
}

export const getSrcCompilerHost = (overrides?: ts.CompilerOptions) => {
  const options: ts.CompilerOptions = overrides
    ? { ...getSrcCompilerOptions(), ...overrides }
    : getSrcCompilerOptions();
  return { options, host: ts.createCompilerHost(options) };
}