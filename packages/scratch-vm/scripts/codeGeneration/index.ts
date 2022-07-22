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
const codeGuardStringEnd = '-- Please do not edit code within guards */';

const getGuards = (identifier: string): [string,string] => [`${guardFlagStart} ${identifier} ${codeGuardStringEnd}`, `${guardFlagEnd} ${identifier} ${codeGuardStringEnd}`];

const iconImportGuards = getGuards("Icon Import");
const extensionInfoGuards = getGuards("Extension Info");

/**
 * @param extensions - a Record where the keys are strings representing the name of extensions to be added,
 * and the values are @type {ExtensionMenuDisplayDetails}. 
 * 
 * Adds the necessary imports for the extensions' icons to {@link guiIndexFile} and adds an object containing 
 * the extensions' info to the array of info exported by {@link guiIndexFile}.
 */
export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const guiFileContent = readFileSync(guiIndexFile, {encoding: "utf-8"});

  /**
   * Finds the indices of the code guards, splits the gui file into chunks such 
   * that slices[0] is the code up to and including the first code guard, slices[1]
   * is the code between the second code guard and the third code guard (including both),
   * and slices[2] is the code from the last code guard (inclusive) to the end of the file
   */
  let lineArray : string[] = guiFileContent.split('\n');
  const includesSubstr = (pat:string) => ((x:string) => { return x.includes(pat) });
  const guards = [...iconImportGuards,...extensionInfoGuards];
  const indices = guards.map(pat => lineArray.findIndex(includesSubstr(pat)));
  let slices = [lineArray.slice(0,indices[0]+1),lineArray.slice(indices[1],indices[2]+1),lineArray.slice(indices[3])];

  let extensionsAdded = 0;
  let currGuiFileContent = guiFileContent;
  const numExtensions = Object.keys(extensions).length;

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

    //copy icons to new directory
    copyFileSync(currPathToIconURL,newPathForIcons + iconURL);
    copyFileSync(currPathToInsetIconURL,newPathForIcons + insetIconURL);

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

    /* First extension added: remove all code between code guards.
     * All others: add to the code that's already been added between the
     * code guards.
     */
    if (extensionsAdded !== 0) {
      lineArray = currGuiFileContent.split('\n');
      //only care about the ends of the code guards to add code before them
      const indices = [lineArray.findIndex(includesSubstr(guards[1])),lineArray.findIndex(includesSubstr(guards[3]))];
      slices = [lineArray.slice(0,indices[0]),lineArray.slice(indices[0],indices[1]),lineArray.slice(indices[1])];
    }

    const newGUIFileSlices = [...slices[0],...iconImports,...slices[1],menuItem,...slices[2]];
    currGuiFileContent = newGUIFileSlices.join('\n');

    if (extensionsAdded + 1 === numExtensions) writeFileSync(guiIndexFile,currGuiFileContent,{encoding: "utf-8"});
    extensionsAdded++;
  }
 // 4. BONUS! Add suport for additional non-required properties in the ExtensionMenuDisplayDetails type (like 'collaborator', 'featured', 'bluetoothRequired') so that, if they are defined, they are incorporated into the code generation
}
