import chalk from "chalk";
import path from "path";
import fs from "fs";
import { getPathToExtension, getPathToTemplate, processDirectoryArg } from ".";

const directory = processDirectoryArg();

const extensionDirectory = getPathToExtension(directory);

const uiTemplate = "UI";
const extension = ".svelte";
const template = getPathToTemplate(uiTemplate + extension);

const getFilename = (modifier: string = "") => `${uiTemplate}${modifier}${extension}`;

const getDestination = () => {
  let desired = path.join(extensionDirectory, getFilename());
  for (let index = 2; index < Number.MAX_SAFE_INTEGER; index++) {
    if (fs.existsSync(desired)) break;
    desired = path.join(extensionDirectory, getFilename(`_${index}`));
  }
  return desired;
}

const destination = getDestination();
const name = path.basename(destination).replace(extension, "");
const invocation = `this.openUI("${name}");`;

fs.copyFileSync(template, destination);

const msg = [
  chalk.greenBright("Success! A new ui componenent has been added to your extension at:"),
  chalk.cyan(`\n\n\t${destination}\n`),
  chalk.greenBright(`Use it in your extension by calling`),
  chalk.cyan(`\n\n\t${invocation}\n\n`),
  chalk.greenBright("You should also change the name of the file to be more reflective of it's usage (which will affect the first argument you give to the 'openUI' function)")
];
console.log(...msg);