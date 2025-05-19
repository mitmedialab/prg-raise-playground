import fs from "fs";

import { vmSrc, blocksSrc } from "$root/scripts/paths";
import { commonDirectory } from "./fileSystem";

export const commonAlias = "$common";
export const scratchVmAlias = "$scratch-vm";
export const scratchBlocksAlias = "$scratch-blocks"

const getCommonAliasEntry = () => getAlias(commonDirectory, commonAlias);
const getScratchVmAliasEntry = () => getAlias(vmSrc, scratchVmAlias);
const getScratchBlocksAliasEntry = () => getAlias(blocksSrc, scratchBlocksAlias);

const getAlias = (location: string, alias: string) => {
  if (!fs.existsSync(location)) throw new Error(`Could not form alias '${alias}' because location didn't exist: ${location}`);
  return { [alias]: location };
}

export const getAliasEntries = () => ({ ...getCommonAliasEntry(), ...getScratchVmAliasEntry(), ...getScratchBlocksAliasEntry() });
