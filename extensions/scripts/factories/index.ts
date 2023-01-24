import path from "path";
import fs from "fs";
import { extensionsSrc, templatesDirectory } from "scripts/utils/fileSystem";
import chalk from "chalk";
import { processArgs } from "$root/scripts/processArgs";

export const getPathToTemplate = (name: string) => {
  const location = path.join(templatesDirectory, name);
  if (!fs.existsSync(location)) error(`The provided template (${name}) does not exist!`);
  return location;
};

export const getPathToExtension = (extensionDirectory: string, shouldExist: boolean = true) => {
  const location = path.join(extensionsSrc, extensionDirectory);
  if (shouldExist && !fs.existsSync(location)) error(`The provided extension directory (${extensionDirectory}) does not exist!`);
  return location;
};

export const getExtensionDestination = (extensionDirectory: string) => path.join(extensionsSrc, extensionDirectory);

export const copyTemplateToDestination = (extensionDirectory: string, filename: string, destinationName?: string) => {
  const folder = getPathToExtension(extensionDirectory);
  const template = getPathToTemplate(filename);
  const destination = path.join(folder, destinationName ?? filename);
  if (fs.existsSync(destination)) error(`Desired destination for template (${filename}) already exists: ${destination}`);
  fs.copyFileSync(template, destination);
  return destination;
}

export const copyTemplateToDestinationAndIncrementIfExists = (extensionDirectory: string, filename: string, destinationName?: string) => {
  const folder = getPathToExtension(extensionDirectory);
  const template = getPathToTemplate(filename);

  const extension = path.extname(destinationName ?? filename);
  const name = (destinationName ?? filename).replace(extension, "");

  const getFilename = (modifier: string = "") => `${name}${modifier}${extension}`;

  const getDestination = () => {
    let desired = path.join(folder, getFilename());
    for (let index = 2; index < Number.MAX_SAFE_INTEGER; index++) {
      if (!fs.existsSync(desired)) break;
      desired = path.join(folder, getFilename(`_${index}`));
    }
    return desired;
  }

  const destination = getDestination();
  fs.copyFileSync(template, destination);
  return destination;
}

export type DirectoryArg = {
  directory: string;
}

export const directoryFlag: DirectoryArg = { directory: "dir" };
export const directoryDefault: DirectoryArg = { directory: null };

export const error = (msg: string) => { throw new Error(chalk.redBright(msg)) };

export const processDirectoryArg = () => {
  const { directory } = processArgs<DirectoryArg>(directoryFlag, directoryDefault);
  if (!directory) error("An extension directory must be provided in order to add a ui to an extension.");
  return directory;
}
