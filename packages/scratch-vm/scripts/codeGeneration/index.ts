import path = require("path");
import ts = require("typescript");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { fillInContentForExtensions } from "./extension";
import { generateGitIgnore } from "./gitingore";
import { populateMenuForExtensions } from "./menu";

export type GenerationCache = ExtensionMenuDisplayDetails & {
  extensionId: string,
  ignoreFiles: string[],
};

export type ExtensionCodeGenerator = (
  extensions: Record<string, ExtensionMenuDisplayDetails>, 
  getExtensionLocation: (id: string) => string, 
  cache?: GenerationCache
) => void;

const pathToSrc = path.resolve(__dirname, "..", "..", "src");
const pathToExtensionsDir = path.join(pathToSrc, "extensions");
const getExtensionLocation = (extensionId: string) => path.join(pathToExtensionsDir, extensionId);

const extensionCodeGenerators: ExtensionCodeGenerator[] = [
  fillInContentForExtensions, 
  populateMenuForExtensions
];

export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>, program: ts.Program, invalidateCaches: boolean = false) => {
  // check for cache file and pass it to each generator so they can decide what to do with it
  // (if no cache file, then just pass undefined which each generator should handle)
  extensionCodeGenerators.forEach(generate => generate(extensions, getExtensionLocation));

  // Update gitignore to exist in each extension dir, 
  // so that if cached ignore files change, only that file needs to be re-written.
  // This means that probably the gitignore function can be come a generator
  generateGitIgnore(program, pathToSrc);
}