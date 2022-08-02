import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const relativePathToExtensionDir = ["..", "..", "src", "extensions"];
const relativePathToIndexFile = ["..", "..", "..", "scratch-gui", "src", "lib", "libraries", "extensions", "index.jsx"];
const relativePathToAssetsFolder = ["..", "..", "..", "scratch-gui", "src", "extension-gallery-assets"];
const guiIndexFile = path.resolve(__dirname, ...relativePathToIndexFile);

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
 * Adds the necessary imports for the extensions' icons to {@link guiIndexFile} and adds an object containing 
 * the extensions' info to the array of info exported by {@link guiIndexFile}.
 */
export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const guiFileContent = readFileSync(guiIndexFile, {encoding: "utf-8"});
  const lineArray : string[] = guiFileContent.split('\n');
  const includesSubstr = (pat:string) => ((x:string) => { return x.includes(pat) });
  const guards = [...iconImportGuards,...extensionInfoGuards];
  const indices = guards.map(pat => lineArray.findIndex(includesSubstr(pat)));
  /**
   * slices[0] is the code up to and including the first code guard, slices[1]
   * is the code between the second code guard and the third code guard (including both),
   * and slices[2] is the code from the last code guard (inclusive) to the end of the file
   */
  let slices = [lineArray.slice(0,indices[0]+1),lineArray.slice(indices[1],indices[2]+1),lineArray.slice(indices[3])];

  let newGUIFileLines = [...slices[0],...slices[1],...slices[2]];
  const shift = indices[1]-indices[0]-1;
  let importInsertIndex = indices[0]+1;
  let menuItemInsertIndex = indices[2] - shift + 1;

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
     * add icon imports and extension menu to {@link newGUIFileLines}
     */
    newGUIFileLines.splice(importInsertIndex,0,...iconImports);
    menuItemInsertIndex += 2;
    newGUIFileLines.splice(menuItemInsertIndex,0,menuItem);
  }

  const newGUIFileContent = newGUIFileLines.join('\n');
  writeFileSync(guiIndexFile,newGUIFileContent,{encoding: "utf-8"});
}
