import { copyFileSync, existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "$common";
import MenuDetailItem from "./MenuDetailItem";
import { BundleInfo } from "../bundles";
import { importStatement } from "scripts/utils/importExport";
import { generatedDetailsFileName, generatedMenuDetailsDirectory, getMenuDetailsAssetsFile, menuDetailsRootFile, prgLogo, raiseLogo } from "scripts/utils/fileSystem";
import { PathToIcons, copyIconsToAssetsDirectory } from "./icons";

export const generatedFileWarning = `/* 
--- DEVELOPER WARNING ---
This is a generated file.
Any changes you make to this file will not be saved nor git tracked. 
*/
`;

export const populateMenuFileForExtension = ({ menuDetails, id, directory, menuAssetsDestination, menuAssetsFile }: BundleInfo) => {
  if (!existsSync(menuAssetsDestination)) mkdirSync(menuAssetsDestination);
  const pathToIcons = copyIconsToAssetsDirectory(directory, menuAssetsDestination, menuDetails);
  const iconImports = generateIconImports(id, pathToIcons);

  const statements = Object.values(iconImports).map(({ statement }) => statement);
  const reactImports = [importStatement("React", 'react'), importStatement("{ FormattedMessage }", 'react-intl')];
  statements.push(...reactImports);

  const menuItem = new MenuDetailItem(menuDetails, id);
  menuItem.append('extensionId', id, false, true);

  Object.entries(iconImports).forEach(([key, { variable }]) => menuItem.append(key, variable, true));

  const menuContent = [generatedFileWarning, ...statements, MenuDetailItem.ConvertToSingleExport(menuItem)].join("\n");
  writeFileSync(menuAssetsFile, menuContent, { encoding: "utf-8" });
}

type Import = { variable: string, statement: string };
type MenuImports = { [k in keyof Partial<ExtensionMenuDisplayDetails>]: Import };

const generateIconImports = (id: string, { iconURL, insetIconURL }: PathToIcons): MenuImports => {
  const iconURLName = `${id}_IconURL`;
  const insetIconURLName = `${id}_InsetIconURL`;
  return {
    iconURL: { variable: iconURLName, statement: importStatement(iconURLName, iconURL) },
    insetIconURL: { variable: insetIconURLName, statement: importStatement(insetIconURLName, insetIconURL) }
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

export const appendToRootDetailsFile = ({ id }: BundleInfo) => {
  const encoding = "utf-8";

  if (!existsSync(generatedMenuDetailsDirectory)) mkdirSync(generatedMenuDetailsDirectory);
  if (!existsSync(menuDetailsRootFile)) writeFileSync(menuDetailsRootFile, generateFileSkeleton, encoding);

  const lines = readFileSync(menuDetailsRootFile, encoding).split("\n");

  const importIndex = lines.findIndex(line => line.includes(importsIdentifier));
  const exportIndex = lines.findIndex(line => line.includes(exportsIdentifier));

  lines.splice(importIndex, 0, importStatement(id, `./${id}/${generatedDetailsFileName}`));
  lines.splice(exportIndex + 1, 0, `\t${id},`);

  writeFileSync(menuDetailsRootFile, lines.join("\n"), encoding);
}