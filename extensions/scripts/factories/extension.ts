import path from "path";
import assert from "assert";
import fs from "fs";
import chalk from "chalk";
import { processArgs } from "$root/scripts/processArgs";
import { UnionToTuple } from "$common";
import { getPathToExtension, getPathToTemplate } from ".";

const alreadyExists = (directory: string) => fs.existsSync(getPathToExtension(directory));

const enum Operation {
  Default = "default",
  Minimal = "barebones"
};

const operations: UnionToTuple<Operation> = [Operation.Default, Operation.Minimal];

const templateByOperation: Record<Operation, string> = {
  [Operation.Default]: "default",
  [Operation.Minimal]: "index"
};

const translationsFile = getPathToTemplate("translations");

Object.values(templateByOperation)
  .map(template => getPathToTemplate(template))
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
const folder = getPathToExtension(directory);
const destination = path.join(folder, "index.ts");

fs.mkdirSync(folder);
fs.copyFileSync(template, destination);
fs.copyFileSync(translationsFile, path.join(folder, "translations.ts"));

const msg = [
  chalk.greenBright("Success! Your extension has been created at:"),
  chalk.cyan(`\n\n\t${destination}\n`)
];
console.log(...msg);