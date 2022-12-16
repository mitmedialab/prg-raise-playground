import { copyFileSync, existsSync, writeFileSync } from "fs";
import path = require("path");
import { encode } from "$ExtensionFramework";
import { ExtensionCodeGenerator, GenerationDetails } from ".";
import { ExtensionMenuDisplayDetails } from "$ExtensionFramework";
import MenuDetailItem from "./MenuDetailItem";

export const detailFileName = "details.generated";

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

    const succesfullyCopied = copyIconsToAssetsDirectory(extensions[id], details, cacheMismatch);

    const imports = generateImports(id, details, succesfullyCopied);
    const statements = Object.values(imports).map(({ statement }) => statement);
    statements.push(importStatement("React", 'react'));
    statements.push(importStatement("{ FormattedMessage }", 'react-intl'));

    const encodedId = encode(id);
    const menuItem = new MenuDetailItem(details, encodedId);
    menuItem.push('extensionId', encodedId, false, true);
    Object.entries(imports).map(([key, { variable }]) => menuItem.push(key, variable, true));

    const menuContent = [generatedFileWarning, ...statements, MenuDetailItem.ConvertToSingleExport(menuItem)].join("\n");
    const file = path.join(assetsDirectory, `${detailFileName}.js`);
    writeFileSync(file, menuContent, { encoding: "utf-8" });

    extensions[id].cacheUpdates = { ...updates, ...details };
  }
}

const copyIconsToAssetsDirectory = (
  { implementationDirectory, assetsDirectory }: GenerationDetails,
  { iconURL, insetIconURL }: ExtensionMenuDisplayDetails,
  mismatchKeys: (keyof ExtensionMenuDisplayDetails)[]
): string[] => {
  const valid = [];
  Object.entries({ iconURL, insetIconURL }).forEach(([key, file]) => {
    if (file === "" || !file) return;
    const currentLocation = path.join(implementationDirectory, file);
    if (!existsSync(currentLocation)) return;
    if (!mismatchKeys.includes(key as keyof ExtensionMenuDisplayDetails)) return valid.push(file);
    const destination = path.join(assetsDirectory, file);
    copyFileSync(currentLocation, destination);
    valid.push(file);
  });
  return valid;
}

const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;

type Import = { variable: string, statement: string };
type MenuImports = { [k in keyof Partial<ExtensionMenuDisplayDetails>]: Import };

const generateImports = (id: string, { iconURL, insetIconURL }: ExtensionMenuDisplayDetails, validURLs: string[]): MenuImports => {
  const iconURLName = `${id}_IconURL`;
  const insetIconURLName = `${id}_InsetIconURL`;
  const doesntExist = { variable: "\"none\"", statement: "" };
  return {
    iconURL: validURLs.includes(iconURL) ? { variable: iconURLName, statement: importStatement(iconURLName, `./${iconURL}`) } : doesntExist,
    insetIconURL: validURLs.includes(insetIconURL) ? { variable: insetIconURLName, statement: importStatement(insetIconURLName, `./${insetIconURL}`) } : doesntExist
  };
}