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
const packageJson = getPathToTemplate("package", ".json");
const testFile = getPathToTemplate("index", ".test.ts");

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

const convertToPackageName = (name: string) => name; // TODO replace capital letters with -lowercase

const fillInPackageDetails = (location: string, name: string) => {
  const encoding = "utf-8";
  const text = fs.readFileSync(location, { encoding });
  const packageNameIdentifier = "replace-with-package-name";
  const directoryNameIdentifier = "replace-with-directory-name";
  text.replace(packageNameIdentifier, convertToPackageName(name));
  text.replace(directoryNameIdentifier, name);
  fs.writeFileSync(location, text, { encoding });
}

const packageDesination = path.join(folder, "package.json");
fs.copyFileSync(packageJson, packageDesination);
fillInPackageDetails(packageDesination, directory);

fs.copyFileSync(testFile, path.join(folder, "index.test.ts"));

const msg = [
  chalk.greenBright("Success! Your extension has been created at:"),
  chalk.cyan(`\n\n\t${destination}\n`)
];
console.log(...msg);