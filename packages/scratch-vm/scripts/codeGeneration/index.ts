import path = require("path");
import ts = require("typescript");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { fillInContentForExtensions } from "./extension";
import { generateGitIgnore } from "./gitingore";
import { populateMenuForExtensions } from "./menu";

export type ExtensionCodeGenerator = (extensions: Record<string, ExtensionMenuDisplayDetails>, getExtensionLocation: (id: string) => string) => void;

const pathToSrc = path.resolve(__dirname, "..", "..", "src");
const pathToExtensionsDir = path.join(pathToSrc, "extensions");
const getExtensionLocation = (extensionId: string) => path.join(pathToExtensionsDir, extensionId);

const extensionCodeGenerators: ExtensionCodeGenerator[] = [fillInContentForExtensions, populateMenuForExtensions];

export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>, program: ts.Program) => {
  extensionCodeGenerators.forEach(generator => generator(extensions, getExtensionLocation));
  generateGitIgnore(program, pathToSrc);
}