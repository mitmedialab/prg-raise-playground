import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import path = require("path");
import { encode } from "../../src/extension-support/extension-id-factory";
import { ExtensionCodeGenerator } from ".";
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import MenuItem from "./MenuItem";

const pathToGuiSrc = path.resolve(__dirname, "..", "..", "..", "scratch-gui", "src");
const generatedFile = path.join(pathToGuiSrc, "lib", "libraries", "extensions", "generatedExtensionDetails.js");
const assetsFolder = path.join(pathToGuiSrc, "extension-gallery-assets");

const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;

export const populateMenuForExtensions: ExtensionCodeGenerator = (extensions, getExtensionLocation) => {
  console.time('make menu');
  if (!existsSync(assetsFolder)) mkdirSync(assetsFolder);

  const importStatements = new Array<string>();
  const items = new Array<MenuItem>();

  for (const id in extensions) {
    const details = extensions[id];
    const location = getExtensionLocation(id);

    copyIconsToAssetsDirectory(id, location, details);

    const imports = generateImports(id, details);
    const statements = Object.values(imports).map(({statement}) => statement);
    importStatements.push(...statements);

    const menuItem = new MenuItem(details);
    menuItem.push('extensionId', encode(id));
    Object.entries(imports).map(([key, {variable}]) => menuItem.push(key, variable, true));

    items.push(menuItem);
  }

  const content = [generatedFileWarning, ...importStatements, MenuItem.ConvertToExport(items)].join("\n");
  writeFileSync(generatedFile, content, {encoding: "utf-8"});
  console.timeEnd('make menu');
}

const copyIconsToAssetsDirectory = (extensionId: string, extensionLocation: string, {iconURL, insetIconURL}: ExtensionMenuDisplayDetails) => {
  const assetsLocation = path.join(assetsFolder, extensionId);
  if (!existsSync(assetsLocation)) mkdirSync(assetsLocation);

  [iconURL, insetIconURL].forEach(fileName => {
    const currentLocation = path.join(extensionLocation, fileName);
    const destination = path.join(assetsLocation, fileName);
    copyFileSync(currentLocation, destination);
  });
}

const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;

type Import = { variable: string, statement: string };
type MenuImports = { [k in keyof Partial<ExtensionMenuDisplayDetails>]: Import };

const generateImports = (id: string, {iconURL, insetIconURL}: ExtensionMenuDisplayDetails): MenuImports => {
  const pathFromIndexJSXToAssets = `../../../extension-gallery-assets/${id}/`;
  const iconURLName = `${id}_IconURL`;
  const insetIconURLName = `${id}_InsetIconURL`;
  return {
    iconURL: {variable: iconURLName, statement: importStatement(iconURLName, pathFromIndexJSXToAssets + iconURL)},
    insetIconURL: {variable: insetIconURLName, statement: importStatement(insetIconURLName, pathFromIndexJSXToAssets + insetIconURL)}
  };
}