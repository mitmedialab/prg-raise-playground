import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { fillInIDsForExtensions } from "./extensionID";
import { encode } from "../../src/extension-support/extension-id-factory";
import MenuItem from "./MenuItem";

const relativePathToExtensionDir = ["..", "..", "src", "extensions"];
const relativePathToGeneratedFile = ["..", "..", "..", "scratch-gui", "src", "lib", "libraries", "extensions", "generatedExtensionDetails.js"];
const relativePathToAssetsFolder = ["..", "..", "..", "scratch-gui", "src", "extension-gallery-assets"];
const generatedFile = path.resolve(__dirname, ...relativePathToGeneratedFile);

const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;

const getExtensionLocation = (extensionId: string) => path.resolve(__dirname, ...relativePathToExtensionDir, extensionId);

/**
 * @param extensions - a Record where the keys are strings representing the name of extensions to be added,
 * and the values are @type {ExtensionMenuDisplayDetails}. 
 * 
 * @param extensionId the name of the extension's folder 
 * @param iconURL name of file containing the extensions' icon URL
 * @param insetIconURL name of file containing the extensions' inset icon URL
 */
const copyIconsToAssetsDirectory = (extensionId: string, iconURL: string, insetIconURL: string) => {
  const assetsLocation = path.resolve(__dirname, ...relativePathToAssetsFolder, extensionId);
  const extensionLocation = path.resolve(__dirname, ...relativePathToExtensionDir, extensionId);
  
  const iconLocation = path.join(extensionLocation, iconURL);
  const insetIconLocation = path.join(extensionLocation, insetIconURL);

  if (!existsSync(assetsLocation)) mkdirSync(assetsLocation);

  //copy icons to new directory
  copyFileSync(iconLocation, path.join(assetsLocation, iconURL));
  copyFileSync(insetIconLocation, path.join(assetsLocation, insetIconURL));
}

export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  fillInIDsForExtensions(Object.keys(extensions), getExtensionLocation);

  const assetsFolder = path.resolve(__dirname, ...relativePathToAssetsFolder);
  if (!existsSync(assetsFolder)) mkdirSync(assetsFolder);

  const imports = new Array<string>();
  const items = new Array<MenuItem>();

  for (const id in extensions) {
    const details = extensions[id];
    const iconURL = details.iconURL;
    const insetIconURL = details.insetIconURL;

    copyIconsToAssetsDirectory(id, iconURL, insetIconURL);

    const iconURLName = `${id}_IconURL`;
    const insetIconURLName = `${id}_InsetIconURL`;
    const pathFromIndexJSXToAssets = `../../../extension-gallery-assets/${id}/`;
    const iconImports = [`import ${iconURLName} from '${pathFromIndexJSXToAssets + iconURL}';`,
                         `import ${insetIconURLName} from '${pathFromIndexJSXToAssets + insetIconURL}';`];

    imports.push(...iconImports);

    const menuItem = new MenuItem(details);
    menuItem.push('extensionId', encode(id));
    menuItem.push('iconURL', iconURLName, true);
    menuItem.push('insetIconURL', insetIconURLName, true);
    items.push(menuItem);
  }

  const content = [generatedFileWarning, ...imports, MenuItem.ConvertToExport(items)].join("\n");
  writeFileSync(generatedFile, content, {encoding: "utf-8"});
}
