import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const relativePathToExtensionDir = ["..", "..", "src", "extensions"];
const relativePathToIndexFile = ["..", "..", "..", "scratch-gui", "src", "lib", "libraries", "extensions", "index.jsx"];
const relativePathToAssetsFolder = ["..", "..", "..", "scratch-gui", "src", "extension-gallery-assets"];
const menuIndexFile = path.resolve(__dirname, ...relativePathToIndexFile);

/**
 * has to match the code generation guards in the file specified by
 * the path in {@link relativePathToIndexFile}
 */
const guardFlagStart = "/* CODE GEN GUARD START:";
const guardFlagEnd = "/* CODE GEN GUARD END:";

const getGuards = (identifier: string): [start:string,end:string] => [`${guardFlagStart} ${identifier}`, `${guardFlagEnd} ${identifier}`];
const iconImportGuards = getGuards("Icon Import");
const extensionInfoGuards = getGuards("Extension Info");

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
const copyIconsToAssetsDirectory = (extensionId : string, iconURL : string, insetIconURL : string) => {
  const relativePathToAssetsForExt = [...relativePathToAssetsFolder, extensionId];
  const relativePathToExtension = [...relativePathToExtensionDir,extensionId];
  const currPathToIconURL = path.resolve(__dirname,...relativePathToExtension,iconURL);
  const currPathToInsetIconURL = path.resolve(__dirname,...relativePathToExtension,insetIconURL);
  const newPathForIcons = path.resolve(__dirname, ...relativePathToAssetsForExt) + '/';

  if (!existsSync(newPathForIcons)) mkdirSync(newPathForIcons);

  //copy icons to new directory
  copyFileSync(currPathToIconURL,newPathForIcons + iconURL);
  copyFileSync(currPathToInsetIconURL,newPathForIcons + insetIconURL);
}

/**
 * @param extensions - a Record where the keys are strings representing the name of extensions to be added,
 * and the values are @type {ExtensionMenuDisplayDetails}. 
 * 
 * Adds the necessary imports for the extensions' icons to {@link menuIndexFile} and adds an object containing 
 * the extensions' info to the array of info exported by {@link menuIndexFile}.
 */
export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const menuFileContent = readFileSync(menuIndexFile, {encoding: "utf-8"});
  const lineArray : string[] = menuFileContent.split('\n');
  const includesSubstr = (pat:string) => ((x:string) => { return x.includes(pat) });
  const guards = [...iconImportGuards,...extensionInfoGuards];
  const [iconStartIndex, iconEndIndex, extensionStartIndex, extensionEndIndex] = guards.map(pat => lineArray.findIndex(includesSubstr(pat)));
  /**
   * {@link throughToFirstGuard} includes {@link iconImportGuards[0]}
   * {@link betweenSecondAndThirdGuard} includes {@link iconImportGuards[1]} and {@link iconImportGuards[2]}
   * {@link fromFourthGuard} includes {@link iconImportGuards[3]}.
   */
  let [throughToFirstGuard,betweenSecondAndThirdGuard,fromFourthGuard] = [lineArray.slice(0,iconStartIndex+1),lineArray.slice(iconEndIndex,extensionStartIndex+1),lineArray.slice(extensionEndIndex)];
  let newMenuFileLines = [...throughToFirstGuard,...betweenSecondAndThirdGuard,...fromFourthGuard];
  const shift = iconEndIndex-iconStartIndex-1;
  let importInsertIndex = iconStartIndex+1;
  let menuItemInsertIndex = extensionStartIndex - shift + 1;

  const assetsFolder = path.resolve(__dirname,...relativePathToAssetsFolder);
  if (!existsSync(assetsFolder)) mkdirSync(assetsFolder);

  for (const str in extensions) {
    const ext = extensions[str];
    const iconURL = ext.iconURL;
    const insetIconURL = ext.insetIconURL;
    const extensionId : string = str;

    copyIconsToAssetsDirectory(extensionId,iconURL,insetIconURL);

    const iconURLName = extensionId + 'IconURL';
    const insetIconURLName = extensionId + 'InsetIconURL';
    const pathFromIndexJSXToAssets = `../../../extension-gallery-assets/${str}/`;
    const iconImports = [`import ${iconURLName} from '${pathFromIndexJSXToAssets + iconURL}';`,
                         `import ${insetIconURLName} from '${pathFromIndexJSXToAssets + insetIconURL}';`];

    const menuItem = `    {
      name: '${ext.title}',
      extensionId: '${extensionId}',
      iconURL: ${iconURLName},
      insetIconURL: ${insetIconURLName},
      description: '${ext.description}',
      featured: true
    },`;

    /**
     * add icon imports and extension menu to {@link newMenuFileLines}
     */
    newMenuFileLines.splice(importInsertIndex,0,...iconImports);
    menuItemInsertIndex += 2;
    newMenuFileLines.splice(menuItemInsertIndex,0,menuItem);
  }

  const newMenuFileContent = newMenuFileLines.join('\n');
  writeFileSync(menuIndexFile,newMenuFileContent,{encoding: "utf-8"});
}
