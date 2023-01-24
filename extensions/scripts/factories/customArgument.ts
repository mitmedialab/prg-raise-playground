import chalk from "chalk";
import path from "path";
import { copyTemplateToDestinationAndIncrementIfExists, processDirectoryArg } from ".";

const directory = processDirectoryArg();
const destination = copyTemplateToDestinationAndIncrementIfExists(directory, "CustomArgument.svelte");

const name = path.basename(destination).replace(path.extname(destination), "");
const invocation = `this.openUI("${name}");`;

const msg = [
  chalk.greenBright("Success! A new ui componenent has been added to your extension at:"),
  chalk.cyan(`\n\n\t${destination}\n`),
  chalk.greenBright(`Use it in your extension by calling`),
  chalk.cyan(`\n\n\t${invocation}\n\n`),
  chalk.greenBright("You should also change the name of the file to be more reflective of it's usage (which will affect the first argument you give to the 'openUI' function)")
];
console.log(...msg);