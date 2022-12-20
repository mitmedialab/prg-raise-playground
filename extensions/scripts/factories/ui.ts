import { processArgs } from "$root/scripts/processArgs";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import { getPathToExtension, getPathToTemplate } from ".";

type CommandLineArgs = {
  directory: string,
}

const { directory } = processArgs<CommandLineArgs>(
  { directory: "dir" },
  { directory: undefined }
);

const error = (msg: string) => { throw new Error(chalk.redBright(msg)) };

if (!directory) error("An extension directory must be provided in order to add a ui to an extension.");

const extensionDirectory = getPathToExtension(directory);
if (!fs.existsSync(extensionDirectory)) error(`The provided extension directory (${directory}) does not exist!`);

const uiTemplate = "UI";
const extension = ".svelte";
const filename = (modifier: string = "") => `${uiTemplate}${modifier}${extension}`;
const template = getPathToTemplate(uiTemplate, extension);

const getDestination = () => {
  let desired = path.join(extensionDirectory, filename());
  let i = 2;
  while (fs.existsSync(desired)) {
    desired = path.join(extensionDirectory, filename(`_${i}`));
    i++;
  }
  return desired;
}

const destination = getDestination();
const name = path.basename(destination).replace(path.extname(destination), "");
const invocation = `this.openUI("${name}");`;

fs.copyFileSync(template, destination);

const msg = [
  chalk.greenBright("Success! A new ui componenent has been added to your extension at:"),
  chalk.cyan(`\n\n\t${destination}\n`),
  chalk.greenBright(`Use it in your extension by calling`),
  chalk.cyan(`\n\n\t${invocation}\n\n`),
  chalk.greenBright("You should also change the name of the file to be more reflective of it's usage (which will effect the first argument you give to the 'openUI' function)")
];
console.log(...msg);