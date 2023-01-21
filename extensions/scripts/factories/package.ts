import fs from "fs";
import chalk from "chalk";
import { processDirectoryArg, copyTemplateToDestination } from ".";
import { splitOnCapitals } from "$common";

const convertToPackageName = (name: string) =>
  splitOnCapitals(name).map(name => name.toLowerCase()).join("-")
  + "-extension";

const fillInPackageDetails = (location: string, name: string) => {
  const encoding = "utf-8";
  const packageNameIdentifier = "replace-with-package-name";
  const directoryNameIdentifier = "replace-with-directory-name";
  const text = fs.readFileSync(location, { encoding })
    .replaceAll(packageNameIdentifier, convertToPackageName(name))
    .replaceAll(directoryNameIdentifier, name);

  fs.writeFileSync(location, text, { encoding });
}

const directory = processDirectoryArg();
const file = copyTemplateToDestination(directory, "package.json");
fillInPackageDetails(file, directory);

const msg = [
  chalk.greenBright("Success! A package.json file has been create for your extension."),
  chalk.cyan(`\n\n\t${file}\n`),
];

console.log(...msg);