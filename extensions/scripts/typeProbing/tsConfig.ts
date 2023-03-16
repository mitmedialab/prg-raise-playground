import path from "path";
import ts from "typescript";
import { extensionsFolder } from "$root/scripts/paths";

export const getTsConfigFile = () => {
  const srcDir = path.join(extensionsFolder, "src");
  return path.join(srcDir, "tsconfig.json");
}

export const getSrcCompilerOptions = () => {
  const srcDir = path.join(extensionsFolder, "src");
  const configFile = path.join(srcDir, "tsconfig.json");
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, srcDir, undefined, configFile).options;
}

export const getSrcCompilerHost = (overrides?: ts.CompilerOptions) => {
  const options: ts.CompilerOptions = overrides
    ? { ...getSrcCompilerOptions(), ...overrides }
    : getSrcCompilerOptions();
  return { options, host: ts.createCompilerHost(options) };
}