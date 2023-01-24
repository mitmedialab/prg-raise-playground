import chalk from "chalk";
import path from "path";
import { copyTemplateToDestinationAndIncrementIfExists, processDirectoryArg } from ".";

const directory = processDirectoryArg();
const destination = copyTemplateToDestinationAndIncrementIfExists(directory, "UI.svelte");

const name = path.basename(destination).replace(path.extname(destination), "");
const invocation = `this.makeCustomArgument({
  component: "${name}",
  initial: { value: { anythingYouWant: "Some value" }, text: "String representation of value"}
})`;

const msg = [
  chalk.greenBright("Success! A new custom argument componenent has been added to your extension at:"),
  chalk.cyan(`\n\n\t${destination}\n`),
  chalk.greenBright(`Use it in your extension by calling`),
  chalk.cyan(`\n\n\t${invocation}\n\n`),
  chalk.greenBright("You should also change the name of the file to be more reflective of it's usage (which will affect the 'component' field of the object you give to the 'makeCustomArgument' function)")
];
console.log(...msg);