import path from "path";
import fs from "fs";
import { extensionsFolder, guiSrc, packages, vmSrc } from "$root/scripts/paths";

export const extensionBundlesDir = path.join(packages.gui, "static", "extension-bundles");
export const generatedMenuDetailsDir = path.join(guiSrc, "generated");

export const getBundleFile = (extensionID: string) => path.join(extensionBundlesDir, extensionID);

export const generatedDetailsFileName = "details.generated.js";
export const getMenuDetailsAssetsDirectory = (extensionID: string) => path.join(generatedMenuDetailsDir, extensionID);
export const getMenuDetailsAssetsFile = (extensionID: string) => path.join(generatedMenuDetailsDir, extensionID, generatedDetailsFileName);
export const menuDetailsRootFile = path.join(generatedMenuDetailsDir, generatedDetailsFileName);

export const deleteAllFilesInDir = (dir, exclude?: string[]) =>
  fs.readdirSync(dir)
    .filter(file => (!exclude || !exclude?.includes(file)) && file !== "." && file !== "..")
    .forEach(file => fs.rmSync(path.join(dir, file), { recursive: true, force: true }));

export const fileName = (file) => path.basename(file).replace(path.extname(file), "");

export const commonDirectory = path.join(extensionsFolder, "src", "common");
const getCommonAlias = () => getAlias(commonDirectory, "$common");
const getScratchVmAlias = () => getAlias(vmSrc, "$scratch-vm");

const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location }
}

export const getAliases = () => ({ ...getCommonAlias(), ...getScratchVmAlias() });