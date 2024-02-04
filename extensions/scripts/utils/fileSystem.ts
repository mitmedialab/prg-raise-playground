import path from "path";
import fs from "fs";
import { glob, } from 'glob'
import { extensionsFolder, guiSrc, packages, } from "$root/scripts/paths";

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

export const deleteAllFilesInDir = (dir, exclude?: string[]) => fs.existsSync(dir)
  ? fs.readdirSync(dir)
    .filter(file => (!exclude || !exclude?.includes(file)) && file !== "." && file !== "..")
    .forEach(file => fs.rmSync(path.join(dir, file), { recursive: true, force: true }))
  : {};

export const fileName = (file) => path.basename(file).replace(path.extname(file), "");

export const extensionsSrc = path.join(extensionsFolder, "src");
export const commonDirectory = path.join(extensionsSrc, "common");
export const componentsDirectory = path.join(commonDirectory, "components");

export const extensionGlob = (query: string) => glob(path.join(extensionsSrc, query));

const hasIndex = (dirPath: string) => fs.existsSync(path.join(dirPath, "index.ts"));

export const extensionPathIsValid = (dir: string) => {
  const invalidDirs = [extensionsSrc, commonDirectory, templatesDirectory];
  if (invalidDirs.includes(dir)) return false;
  if (path.dirname(dir) !== extensionsSrc) return false;
  if (dir.startsWith(commonDirectory) || dir.startsWith(templatesDirectory)) return false;
  if (!hasIndex(dir)) return false;
  return true;
}

export const tsToJs = (tsFile: string) => path.join(path.dirname(tsFile), path.basename(tsFile).replace(".ts", ".js"));

export const getDirectoryAndFileName = (pathToFile: string, root: string) => {
  const relativeToRoot = path.relative(root, pathToFile);
  return { directory: path.dirname(relativeToRoot), fileName: path.basename(relativeToRoot) };
}