import { copyFileSync, existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "$common";
import MenuDetailItem from "./MenuDetailItem";
import { ExtensionInfo } from "scripts/bundle";
import { importStatement } from "scripts/utils/importExport";
import { generatedDetailsFileName, getMenuDetailsAssetsFile, menuDetailsRootFile } from "scripts/utils/fileSystem";

export const detailFileName = "details.generated";

export const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;


export const populateMenuFileForExtension = ({ menuDetails, id, directory, menuAssetsDestination, menuAssetsFile }: ExtensionInfo) => {
  if (!existsSync(menuAssetsDestination)) mkdirSync(menuAssetsDestination);
  const succesfullyCopiedAssets = copyIconsToAssetsDirectory(directory, menuAssetsDestination, menuDetails);

  const imports = generateIconImports(id, menuDetails, succesfullyCopiedAssets);

  const statements = Object.values(imports).map(({ statement }) => statement);
  statements.push(importStatement("React", 'react'));
  statements.push(importStatement("{ FormattedMessage }", 'react-intl'));

  const menuItem = new MenuDetailItem(menuDetails, id);
  menuItem.append('extensionId', id, false, true);

  Object.entries(imports).forEach(([key, { variable }]) => menuItem.append(key, variable, true));

  const menuContent = [generatedFileWarning, ...statements, MenuDetailItem.ConvertToSingleExport(menuItem)].join("\n");
  writeFileSync(menuAssetsFile, menuContent, { encoding: "utf-8" });
}

const copyIconsToAssetsDirectory = (source: string, destination: string, { iconURL, insetIconURL }: ExtensionMenuDisplayDetails): string[] =>
  [iconURL, insetIconURL]
    .filter(file => !(file === "" || !file))
    .map(file => ({ file, location: path.join(source, file) }))
    .filter(({ location }) => existsSync(location))
    .map(({ file, location }) => {
      const destinationLocation = path.join(destination, path.basename(location));
      copyFileSync(location, destinationLocation);
      return file;
    });

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

const codeGenIdentifier = "//CODE GENERATION IDENTIFIER:";
const makeIdentifier = (title: string) => `${codeGenIdentifier}: ${title}`;
const importsIdentifier = makeIdentifier("Imports above");
const exportsIdentifier = makeIdentifier("Exports above");

const generateFileSkeleton = `${generatedFileWarning}
${importsIdentifier}
export default [
  ${exportsIdentifier}
];`

export const appendToRootDetailsFile = ({ id }: ExtensionInfo) => {
  const encoding = "utf-8";
  if (!existsSync(menuDetailsRootFile)) writeFileSync(menuDetailsRootFile, generateFileSkeleton, encoding);

  const lines = readFileSync(menuDetailsRootFile, encoding).split("\n");

  const importIndex = lines.findIndex(line => line.includes(importsIdentifier));
  const exportIndex = lines.findIndex(line => line.includes(exportsIdentifier));

  lines.splice(importIndex, 0, importStatement(id, `./${id}/${generatedDetailsFileName}`));
  lines.splice(exportIndex + 1, 0, `\t${id},`);

  writeFileSync(menuDetailsRootFile, lines.join("\n"), encoding);
}