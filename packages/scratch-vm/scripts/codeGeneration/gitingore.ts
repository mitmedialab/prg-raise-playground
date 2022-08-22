import { writeFileSync } from "fs";
import path = require("path");
import { cacheFile, ExtensionCodeGenerator } from ".";

const newLine = "\n";
const encoding = "utf-8";

export const generateGitIgnoresForExtensions: ExtensionCodeGenerator = (extensions) => {
  for (const id in extensions) {
    const { tsProgramFiles, cached, cacheUpdates, implementationDirectory } = extensions[id];
    const stringified = JSON.stringify(tsProgramFiles);
    if (stringified === cached?.tsProgramFiles) continue;

    const ignoreFiles = tsProgramFiles.map(file => file.replace(".ts", ".js"));
    
    const gitIgnoreFile = path.join(implementationDirectory, ".gitignore");
    writeFileSync(gitIgnoreFile, [...ignoreFiles, cacheFile].join(newLine), encoding);
    
    cacheUpdates.tsProgramFiles = stringified;
  }
}