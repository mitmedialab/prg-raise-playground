import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import ts = require("typescript");

const codeGenGuard = "CODE GEN GUARD";
const newLine = "\n";
const encoding = "utf-8";

export const generateGitIgnore = (program: ts.Program, pathToVmSrc: string) => {
  const gitIgnoreFile = path.join(pathToVmSrc, ".gitignore");

  const ignoreFiles = program.getSourceFiles()
    .filter(({fileName}) => !fileName.includes("node_modules"))
    .map(({fileName}) => path.relative(pathToVmSrc, fileName))
    .map(path => path.replace(".ts", ".js"));

  const content = readFileSync(gitIgnoreFile, encoding).split(newLine);
  const codeGenIndex = content.findIndex(line => line.includes(codeGenGuard));
  content.splice(codeGenIndex + 1);
  
  content.push(...ignoreFiles);
  writeFileSync(gitIgnoreFile, content.join(newLine), encoding)
}