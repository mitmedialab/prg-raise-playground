import path = require("path");
import { extensionsSrc, templatesDirectory } from "scripts/utils/fileSystem";

export const getPathToTemplate = (name: string, extension: string = ".ts") => path.join(templatesDirectory, `${name}${extension}`);
export const getPathToExtension = (extensionDirectory: string) => path.join(extensionsSrc, extensionDirectory);