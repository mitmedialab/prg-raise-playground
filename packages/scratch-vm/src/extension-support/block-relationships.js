import BlockUtility from '../engine/block-utility.js';
import Blocks from '../engine/blocks.js';

export const internalIDKey = "internal_blockID";
const topBlockModifiers = 'topBlockModifiers';

/**
 * Retrieves the Blocks object attached to the util's thread object
 * @param {BlockUtilty} util 
 * @returns {Blocks}
 */
const getBlockContainer = (util) => util.thread.blockContainer;

/**
 * Get the ID of the block at the top of the 'chunk' that the block with ID = 'blockID' lives within
 * @param {string} blockID 
 * @param {BlockUtility} util 
 * @returns {string | null | undefined}
 */
export const getTopBlockID = (blockID, util) => getBlockContainer(util).getTopLevelScript(blockID);

/**
 * Add a modifier to the given 'selfID' block's top block
 * @param {BlockUtility} util 
 * @param {string} selfID 
 * @param {string | number | symbol} modifierKey 
 * @param {any} value 
 * @returns 
 */
export const addTopBlockModifier = (util, selfID, modifierKey, value) => {
  // TODO: @Dolev it would be nice to 'purge' stale Top Block IDs
  // You could do this by looping over the current keys of util[topBlockModifiers],
  // and removing elements that have a stale key.
  // NOTE: Use the (not yet implemented) function `getBlockContainer(util).isTopBlockID(...)`

  const topBlockID = getTopBlockID(selfID, util);
  if (!topBlockID) return;
  const entry = { value, sourceID: selfID };
  util[topBlockModifiers]
    ? util[topBlockModifiers][topBlockID]
      ? util[topBlockModifiers][topBlockID][modifierKey] = entry
      : util[topBlockModifiers][topBlockID] = { [modifierKey]: entry }
    : util[topBlockModifiers] = { [topBlockID]: { [modifierKey]: entry } }
}

/**
 * Get the modifier (denoted by it's 'modifierKey') applicable to the given block associated with 'selfID'.
 * @param {BlockUtility} util 
 * @param {string} selfID 
 * @param {string | number | symbol} modifierKey 
 * @returns 
 */
export const getTopBlockModifier = (util, selfID, modifierKey) => {
  const topBlockID = getTopBlockID(selfID, util);
  if (!topBlockID) return undefined;
  if (!util[topBlockModifiers]) return undefined;
  if (!util[topBlockModifiers][topBlockID]) return undefined;

  const modifier = util[topBlockModifiers][topBlockID][modifierKey];
  if (!modifier || !getBlockContainer(util).isBlockAbove(selfID, modifier.sourceID)) return;

  return modifier.value;
}