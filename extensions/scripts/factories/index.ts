import path = require("path");
import { extensionsFolder } from "$root/scripts/paths";

const templatesFolder = path.join(extensionsFolder, "src", ".templates");

export const getPathToTemplate = (name: string, extension: string = ".ts") => path.join(templatesFolder, `${name}${extension}`);
export const getPathToExtension = (extensionDirectory: string) => path.join(extensionsFolder, extensionDirectory);