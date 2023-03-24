import fs from "fs";

import { vmSrc } from "$root/scripts/paths";
import { commonDirectory } from "./fileSystem";

export const commonAlias = "$common";
export const scratchVmAlias = "$scratch-vm";

const getCommonAliasEntry = () => getAlias(commonDirectory, commonAlias);
const getScratchVmAliasEntry = () => getAlias(vmSrc, scratchVmAlias);

const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location };
}

export const getAliasEntries = () => ({ ...getCommonAliasEntry(), ...getScratchVmAliasEntry() });
