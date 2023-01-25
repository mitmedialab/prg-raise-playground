import chalk from "chalk";
import { processDirectoryArg, copyTemplateToDestination } from ".";

const directory = processDirectoryArg();
const destination = copyTemplateToDestination(directory, "translations.ts");

const msg = [
  chalk.greenBright("Success! A test file has added to your extension at:"),
  chalk.cyan(`\n\n\t${destination}\n`),
  chalk.gray("Translation usage is still a work in progress...")
];

console.log(...msg);