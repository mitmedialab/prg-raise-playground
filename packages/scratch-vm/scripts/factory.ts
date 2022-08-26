import path = require("path");
import assert = require("assert");
import fs = require("fs");
import chalk = require("chalk");
import { extensionsFolder } from "../../../scripts/paths";
import { processArgs } from "../../../scripts/processArgs";
import { UnionToTuple } from "../src/typescript-support/types";

const getPathToTemplate = (name: string) => path.join(extensionsFolder, "typescript_templates", `${name}.ts`);
const getPathToDirectory = (directory: string) => path.join(extensionsFolder, directory);
const alreadyExists = (directory: string) => fs.existsSync(getPathToDirectory(directory));

const enum Operation {
  Default = "default",
  Minimal = "barebones"
};

const operations: UnionToTuple<Operation> = [Operation.Default, Operation.Minimal];

const templateByOperation: Record<Operation, string> = {
  [Operation.Default]: "default",
  [Operation.Minimal]: "base"
};

Object.values(templateByOperation)
  .map(getPathToTemplate)
  .forEach(filepath => assert(fs.existsSync(filepath)));

type CommandLineArgs = {
  directory: string,
  operation: Operation,
}

const { directory, operation } = processArgs<CommandLineArgs>(
  { directory: "dir", operation: "op" }, 
  { directory: undefined, operation: Operation.Default }
);

const error = (msg: string) => { throw new Error(chalk.redBright(msg)) };

if (!directory) error("A directory must be provided in order to create an extension.");
if (alreadyExists(directory)) error(`An extension has already been created under the directory '${directory}'. Pick a different one!`);
if (!operations.includes(operation)) error(`The provided operation (${operation}) is not supported. The supported operations are: ${operations.join(", ")}`);

const template = getPathToTemplate(templateByOperation[operation]);
const folder = getPathToDirectory(directory);
const destination = path.join(folder, "index.ts");

fs.mkdirSync(folder);
fs.copyFileSync(template, destination);

const msg = [
  chalk.greenBright("Success! Your extension has been created at:"),
  chalk.cyan(`\n\n\t${destination}\n`)
];
console.log(...msg);