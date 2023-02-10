import fs from "fs";

import { vmSrc } from "$root/scripts/paths";
import { commonDirectory, v2Directory } from "./fileSystem";

export const commonAlias = "$common";
export const scratchVmAlias = "$scratch-vm";
export const v2Alias = "$v2";

const getCommonAliasEntry = () => getAlias(commonDirectory, commonAlias);
const getScratchVmAliasEntry = () => getAlias(vmSrc, scratchVmAlias);
const getV2AliasEntry = () => getAlias(v2Directory, v2Alias);


const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location };
}

export const getAliasEntries = () => ({ ...getCommonAliasEntry(), ...getScratchVmAliasEntry(), ...getV2AliasEntry() });
