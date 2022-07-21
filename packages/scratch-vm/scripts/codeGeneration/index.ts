import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const relativePathToExtensionDir = ["..", "..", "src", "extensions"];
const baseExtensionsDir = path.resolve(__dirname, ...relativePathToExtensionDir);

const relativePathToIndexFile = ["..", "..", "..", "scratch-gui", "src", "lib", "libraries", "extensions", "index.jsx"];
const relativePathToAssetsFolder = ["..", "..", "..", "scratch-gui", "src", "extension-gallery-assets"];
const guiIndexFile = path.resolve(__dirname, ...relativePathToIndexFile);

const guardFlagStart = "/* CODE GEN GUARD START:";
const guardFlagEnd = "/* CODE GEN GUARD END:";
const codeGuardStringEnd = '-- Please do not edit code within guards */';

const getGuards = (identifier: string): [string,string] => [`${guardFlagStart} ${identifier} ${codeGuardStringEnd}`, `${guardFlagEnd} ${identifier} ${codeGuardStringEnd}`];

const iconImportGuards = getGuards("Icon Import");
const extensionInfoGuards = getGuards("Extension Info");

/**
 * TODO: complete...
 * @param extensions 
 */
export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const guiFileContent = readFileSync(guiIndexFile, {encoding: "utf-8"});

  /**
   * Finds the indices of the code guards, splits the gui file into chunks such 
   * that slices[0] is the code up to and including the first code guard, slices[1]
   * id the code between the second code guard and the third code guard (including both),
   * and slices[2] is the code from the last code guard (inclusive) to the end of the file
   */
  const lineArray : string[] = guiFileContent.split('\n');
  const findString = (pat:string) => ((x:string) => { return x.includes(pat)});
  const guards = [...iconImportGuards,...extensionInfoGuards];
  const indices = guards.map(pat => lineArray.findIndex(findString(pat)));
  const slices = [lineArray.slice(0,indices[0]+1),lineArray.slice(indices[1],indices[2]+1),lineArray.slice(indices[3])];

  for (const str in extensions) {
    const ext = extensions[str];
    const iconURL = ext.iconURL;
    const insetIconURL = ext.insetIconURL;
    const extensionId : string = str;

    const relativePathToAssetsForExt = [...relativePathToAssetsFolder, extensionId];
    const relativePathToExtension = [...relativePathToExtensionDir,extensionId];
    const currPathToIconURL = path.resolve(__dirname,...relativePathToExtension,iconURL);
    const currPathToInsetIconURL = path.resolve(__dirname,...relativePathToExtension,insetIconURL);
    const newPathForIcons = path.resolve(__dirname, ...relativePathToAssetsForExt) + '/';


    if (!existsSync(newPathForIcons)) mkdirSync(newPathForIcons);

    //move icons to new directory
    renameSync(currPathToIconURL,newPathForIcons + iconURL);
    renameSync(currPathToInsetIconURL,newPathForIcons + insetIconURL);

    const iconURLName = extensionId + 'IconURL';
    const insetIconURLName = extensionId + 'InsetIconURL';
    const pathFromIndexJSXToAssets = '../../../extension-gallery-assets/';
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

    const newGUIFileSlices = [...slices[0],...iconImports,...slices[1],menuItem,...slices[2]];
    const newGUIFile = newGUIFileSlices.join('\n');
    writeFileSync(guiIndexFile,newGUIFile,{encoding: "utf-8"});
  }
 // 4. BONUS! Add suport for additional non-required properties in the ExtensionMenuDisplayDetails type (like 'collaborator', 'featured', 'bluetoothRequired') so that, if they are defined, they are incorporated into the code generation
}
