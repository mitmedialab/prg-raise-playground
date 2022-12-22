import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import { extensionsFolder, guiSrc, packages, vmSrc } from "$root/scripts/paths";

export const extensionBundlesDirectory = path.join(packages.gui, "static", "extension-bundles");
export const generatedMenuDetailsDirectory = path.join(guiSrc, "generated");
export const templatesDirectory = path.join(extensionsFolder, "src", ".templates");

export const raiseLogo = path.join(templatesDirectory, "RAISE_Logo.png");
export const prgLogo = path.join(templatesDirectory, "PRG_Logo.png")

export const getBundleFile = (extensionID: string) => path.join(extensionBundlesDirectory, `${extensionID}.js`);

export const generatedDetailsFileName = "details.generated.js";
export const getMenuDetailsAssetsDirectory = (extensionID: string) => path.join(generatedMenuDetailsDirectory, extensionID);
export const getMenuDetailsAssetsFile = (extensionID: string) => path.join(generatedMenuDetailsDirectory, extensionID, generatedDetailsFileName);
export const menuDetailsRootFile = path.join(generatedMenuDetailsDirectory, generatedDetailsFileName);

export const deleteAllFilesInDir = (dir, exclude?: string[]) =>
  fs.readdirSync(dir)
    .filter(file => (!exclude || !exclude?.includes(file)) && file !== "." && file !== "..")
    .forEach(file => fs.rmSync(path.join(dir, file), { recursive: true, force: true }));

export const fileName = (file) => path.basename(file).replace(path.extname(file), "");

export const extensionsSrc = path.join(extensionsFolder, "src");
export const commonDirectory = path.join(extensionsSrc, "common");

const getCommonAlias = () => getAlias(commonDirectory, "$common");
const getScratchVmAlias = () => getAlias(vmSrc, "$scratch-vm");

const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location }
}

export const getAliases = () => ({ ...getCommonAlias(), ...getScratchVmAlias() });

const isDirectory = (file: fs.Dirent) => file.isDirectory();
const getName = ({ name }: fs.Dirent) => name;
const isValidName = (dirName: string) => !["..", ".", "common", ".templates"].includes(dirName);
const getPath = (dirName: string) => path.join(extensionsSrc, dirName);
const hasIndex = (dirPath: string) => fs.existsSync(path.join(dirPath, "index.ts"));

export const getAllExtensionDirectories = () => fs.readdirSync(extensionsSrc, { withFileTypes: true })
  .filter(isDirectory)
  .map(getName)
  .filter(isValidName)
  .map(getPath)
  .filter(hasIndex);

const pathIsValid = (path: string) => {
  const invalidDirs = [extensionsSrc, commonDirectory, templatesDirectory];
  if (invalidDirs.includes(path)) return false;
  if (path.startsWith(commonDirectory) || path.startsWith(templatesDirectory)) return false;
  return true;
}

export const watchForExtensionDirectoryAdded = (alreadyAddedExtensions: string[], callback: (path: string, stats: fs.Stats) => void) =>
  chokidar.watch(extensionsSrc).on("addDir", (path, stats) => {
    if (!pathIsValid(path) || alreadyAddedExtensions.includes(path)) return;
    callback(path, stats);
    alreadyAddedExtensions.push(path);
  });

export const tsToJs = (tsFile: string) => path.join(path.dirname(tsFile), path.basename(tsFile).replace(".ts", ".js"));

export const getDirectoryAndFileName = (pathToFile: string, root: string) => {
  const relativeToRoot = path.relative(root, pathToFile);
  return { directory: path.dirname(relativeToRoot), fileName: path.basename(relativeToRoot) };
}