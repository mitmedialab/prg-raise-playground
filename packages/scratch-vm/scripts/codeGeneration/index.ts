import { readFileSync } from "fs";
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const relativePathToIndexFile = ["..", "..", "..", "scratch-gui", "src", "lib", "libraries", "extensions", "index.jsx"]; 
const guiIndexFile = path.resolve(__dirname, ...relativePathToIndexFile);

const guardFlagStart = "/* CODE GEN GUARD START: ";
const guardFlagEnd = "/* CODE GEN GUARD END: ";

const getGuards = (identifier: string) => [`${guardFlagStart} ${identifier}`, `${guardFlagEnd} ${identifier}`, ]

const iconImportGuards = getGuards("Icon Import");
const extensionInfoGuards = getGuards("Extension Info");

export const generateCodeForExtensions = (extensions: Record<string, ExtensionMenuDisplayDetails>) => {
  const guiFileContent = readFileSync(guiIndexFile, {encoding: "utf-8"});

  // Remove all lines from guiFileContent within the guards

  // Loop over the entries of extensions to:
  // 1. Add import lines for the necessary icons within the iconImportGuards. These lines should reference a location within 'packages/scratch-gui/src/extension-gallery-assets'
  // 2. Add declaration for a minimal minimal menuItem object like the following (NOTE: the key of the entry within the extensions object is to be used as the 'extensionId'):
  /*
    {
        name: "Typescript Realistic Example",
        extensionId: 'typescript_framework_complex',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        description: "Example of how to use typescript",
        featured: true
    },
  */
 // 3. BONUS! Add suport for additional non-required properties in the ExtensionMenuDisplayDetails type (like 'collaborator', 'featured', 'bluetoothRequired') so that, if they are defined, they are incorporated into the code generation

 // Once you've update the files contents, write it back out to the guiIndexFile location
}