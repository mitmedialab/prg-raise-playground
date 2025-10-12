import fs from "fs";
import path from "path";

import { root, vmSrc } from "$root/scripts/paths";
import { commonDirectory } from "./fileSystem";

export const commonAlias = "$common";
export const scratchVmAlias = "$scratch-vm";
export const jiboThreeAlias = "@jibo/three";

const getCommonAliasEntry = () => getAlias(commonDirectory, commonAlias);
const getScratchVmAliasEntry = () => getAlias(vmSrc, scratchVmAlias);
const getJiboThreeAliasEntry = () => getAlias(path.join(root, "PRG-Virtual_Jibo", "threejs-r70", "three.js"), jiboThreeAlias);

const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location };
}

export const getAliasEntries = () => ({ ...getCommonAliasEntry(), ...getScratchVmAliasEntry(), ...getJiboThreeAliasEntry() });
