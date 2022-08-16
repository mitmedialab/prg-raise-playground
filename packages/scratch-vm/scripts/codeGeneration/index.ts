import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import { fillInIDsForExtensions } from "./extensionID";

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

const newLine = "\n";
const tab = "\t";

const getExtensionLocation = (extensionId: string) => path.resolve(__dirname, ...relativePathToExtensionDir, extensionId);

const addTabs = (content: string) => content.split(newLine).map(line => tab + line).join(newLine);

const generateExport = (content: string[]) => {
  const indented = content.map(addTabs);
  return `
export default [
${indented.join(newLine)}
];`
}

/**
 * Copies the files from @param extensionId's extension folder with names 
 * specified by @param iconURL and @param insetIconURL to a folder 
 * specific to that extension in the 'extension-gallery-assets' folder.
 * Creates said folder if it doesn't exist.
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
  const items = new Array<string>();

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

    const menuItem = 
`{
  name: '${details.title}',
  extensionId: '${id}',
  iconURL: ${iconURLName},
  insetIconURL: ${insetIconURLName},
  description: '${details.description}',
  featured: true
},`;

    items.push(menuItem);
  }

  const content = [generatedFileWarning, ...imports, generateExport(items)].join(newLine);
  writeFileSync(generatedFile, content, {encoding: "utf-8"});
}
