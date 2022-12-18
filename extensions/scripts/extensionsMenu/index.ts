import { copyFileSync, existsSync, writeFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "$common";
import MenuDetailItem from "./MenuDetailItem";

export const detailFileName = "details.generated";

export const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;

// Need to handle appending info

export const populateMenuForExtensions = (id: string, details: ExtensionMenuDisplayDetails, dir: string, assetsDirectory: string) => {
  const succesfullyCopied = copyIconsToAssetsDirectory(dir, assetsDirectory, details);

  const imports = generateIconImports(id, details, succesfullyCopied);
  const statements = Object.values(imports).map(({ statement }) => statement);
  statements.push(importStatement("React", 'react'));
  statements.push(importStatement("{ FormattedMessage }", 'react-intl'));

  const menuItem = new MenuDetailItem(details, id);
  menuItem.push('extensionId', id, false, true);
  Object.entries(imports).map(([key, { variable }]) => menuItem.push(key, variable, true));

  const menuContent = [generatedFileWarning, ...statements, MenuDetailItem.ConvertToSingleExport(menuItem)].join("\n");
  const file = path.join(assetsDirectory, `${detailFileName}.js`);
  writeFileSync(file, menuContent, { encoding: "utf-8" });
}

const copyIconsToAssetsDirectory = (
  source: string,
  destination: string,
  { iconURL, insetIconURL }: ExtensionMenuDisplayDetails,
): string[] => {
  const valid = [];
  Object.entries({ iconURL, insetIconURL }).forEach(([_, file]) => {
    if (file === "" || !file) return;
    const currentLocation = path.join(source, file);
    if (!existsSync(currentLocation)) return;
    const destinationLocation = path.join(destination, file);
    copyFileSync(currentLocation, destinationLocation);
    valid.push(file);
  });
  return valid;
}

const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;

type Import = { variable: string, statement: string };
type MenuImports = { [k in keyof Partial<ExtensionMenuDisplayDetails>]: Import };

const generateIconImports = (id: string, { iconURL, insetIconURL }: ExtensionMenuDisplayDetails, validURLs: string[]): MenuImports => {
  const iconURLName = `${id}_IconURL`;
  const insetIconURLName = `${id}_InsetIconURL`;
  const doesntExist = { variable: "\"none\"", statement: "" };
  return {
    iconURL: validURLs.includes(iconURL) ? { variable: iconURLName, statement: importStatement(iconURLName, `./${iconURL}`) } : doesntExist,
    insetIconURL: validURLs.includes(insetIconURL) ? { variable: insetIconURLName, statement: importStatement(insetIconURLName, `./${insetIconURL}`) } : doesntExist
  };
}