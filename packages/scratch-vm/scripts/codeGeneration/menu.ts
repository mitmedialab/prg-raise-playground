import { copyFileSync, writeFileSync } from "fs";
import path = require("path");
import { encode } from "../../src/extension-support/extension-id-factory";
import { ExtensionCodeGenerator, GenerationDetails } from ".";
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import MenuItem from "./MenuItem";

export const detailFileName = "details";

export const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;

export const populateMenuForExtensions: ExtensionCodeGenerator = (extensions) => {
  for (const id in extensions) {
    const { details, cached, assetsDirectory, cacheUpdates: updates } = extensions[id];
    const cacheMismatch = Object.entries(details)
      .filter(([key, value]) => cached === undefined || value !== cached[key])
      .map(([key, _]) => key as keyof ExtensionMenuDisplayDetails);

    if (cacheMismatch.length === 0) continue;

    copyIconsToAssetsDirectory(extensions[id], details, cacheMismatch);

    const imports = generateImports(id, details);
    const statements = Object.values(imports).map(({statement}) => statement);

    const menuItem = new MenuItem(details);
    menuItem.push('extensionId', encode(id));
    Object.entries(imports).map(([key, {variable}]) => menuItem.push(key, variable, true));

    const menuContent = [generatedFileWarning, ...statements, MenuItem.ConvertToSingleExport(menuItem)].join("\n");
    const file = path.join(assetsDirectory, `${detailFileName}.js`);
    writeFileSync(file, menuContent, {encoding: "utf-8"});

    extensions[id].cacheUpdates = {...updates, ...details};
  }
}

const copyIconsToAssetsDirectory = (
  {implementationDirectory, assetsDirectory}: GenerationDetails,
  {iconURL, insetIconURL}: ExtensionMenuDisplayDetails, 
  mismatchKeys: (keyof ExtensionMenuDisplayDetails)[]
) => {
  Object.entries({iconURL, insetIconURL}).forEach(([key, file]) => {
    if (!mismatchKeys.includes(key as keyof ExtensionMenuDisplayDetails)) return;
    const currentLocation = path.join(implementationDirectory, file);
    const destination = path.join(assetsDirectory, file);
    copyFileSync(currentLocation, destination);
  });
}

const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;

type Import = { variable: string, statement: string };
type MenuImports = { [k in keyof Partial<ExtensionMenuDisplayDetails>]: Import };

const generateImports = (id: string, {iconURL, insetIconURL}: ExtensionMenuDisplayDetails): MenuImports => {
  const iconURLName = `${id}_IconURL`;
  const insetIconURLName = `${id}_InsetIconURL`;
  return {
    iconURL: {variable: iconURLName, statement: importStatement(iconURLName, `./${iconURL}`)},
    insetIconURL: {variable: insetIconURLName, statement: importStatement(insetIconURLName, `./${insetIconURL}`)}
  };
}