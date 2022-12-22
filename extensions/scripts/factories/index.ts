import path = require("path");
import { extensionsSrc, templatesFolder } from "scripts/utils/fileSystem";

export const getPathToTemplate = (name: string, extension: string = ".ts") => path.join(templatesFolder, `${name}${extension}`);
export const getPathToExtension = (extensionDirectory: string) => path.join(extensionsSrc, extensionDirectory);