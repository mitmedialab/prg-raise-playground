import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { fillInContentForExtensions } from "./extension";
import { populateMenuForExtensions } from "./menu";

export type ExtensionCodeGenerator = (extensions: Record<string, ExtensionMenuDisplayDetails>, getExtensionLocation: (id: string) => string) => void;

const relativePathToExtensionDir = ["..", "..", "src", "extensions"];
const getExtensionLocation = (extensionId: string) => path.resolve(__dirname, ...relativePathToExtensionDir, extensionId);

const codeGenerators: ExtensionCodeGenerator[] = [fillInContentForExtensions, populateMenuForExtensions];

export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  codeGenerators.forEach(generator => generator(extensions, getExtensionLocation));
}
