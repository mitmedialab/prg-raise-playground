import path = require("path");
import { extensionsFolder } from "../../../../scripts/paths";

const templatesFolder = path.join(extensionsFolder, "typescript_templates");

export const getPathToTemplate = (name: string, extension: string = ".ts") => path.join(templatesFolder, `${name}${extension}`);
export const getPathToExtension = (extensionDirectory: string) => path.join(extensionsFolder, extensionDirectory);