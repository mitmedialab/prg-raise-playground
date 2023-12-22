import path from "path";
import assert from "assert";
import fs from "fs";
import chalk from "chalk";
import { ValueOf } from "$common";
import { getPathToExtension, getPathToTemplate, directoryArg } from ".";
import { parsePositionalArgs } from "$root/scripts/options";

const OperationMap = {
  Default: "default",
  Minimal: "barebones",
  Generic: "generic"
} as const;

type Operation = ValueOf<typeof OperationMap>;

const operations = Object.values(OperationMap);

const templateByOperation: Record<Operation, string> = {
  [OperationMap.Default]: "default.ts",
  [OperationMap.Minimal]: "index.ts",
  [OperationMap.Generic]: "generic.ts"
};

Object.values(templateByOperation)
  .map(template => getPathToTemplate(template))
  .forEach(filepath => assert(fs.existsSync(filepath)));

const { directory, operation } = parsePositionalArgs(directoryArg,
  ["operation", { type: "string", default: OperationMap.Default, choices: operations }]
);

const alreadyExists = (directory: string) => fs.existsSync(getPathToExtension(directory, false));

const error = (msg: string) => { throw new Error(chalk.redBright(msg)) };

if (!directory) error("A directory must be provided in order to create an extension.");
if (alreadyExists(directory)) error(`An extension has already been created under the directory '${directory}'. Pick a different one!`);
if (!operations.includes(operation)) error(`The provided operation (${operation}) is not supported. The supported operations are: ${operations.join(", ")}`);

const template = getPathToTemplate(templateByOperation[operation]);
const folder = getPathToExtension(directory, false);
const destination = path.join(folder, "index.ts");

fs.mkdirSync(folder);
fs.copyFileSync(template, destination);

import("./package");
import("./test");

const msg = [
  chalk.greenBright("Success! Your extension has been created at:"),
  chalk.cyan(`\n\n\t${folder}\n`),
];
console.log(...msg);

