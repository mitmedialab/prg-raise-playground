import BlockUtility from '../../engine/block-utility.js';
import Blocks from '../../engine/blocks.js';
import { blockIDKey } from '../../dist/globals.js';

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
 * @param {BlockUtility} util 
 * @param {string=} blockID 
 * @returns {string | null | undefined}
 */
export const getTopBlockID = (util, blockID = undefined) =>
    getBlockContainer(util).getTopLevelScript(blockID ?? util[blockIDKey]);

/**
 * Add a modifier to the given 'selfID' block's top block
 * @param {BlockUtility} util 
 * @param {string | number | symbol} modifierKey 
 * @param {any} value 
 * @param {string=} blockID 
 * @returns 
 */
export const addTopBlockModifier = (util, modifierKey, value, blockID = undefined) => {
    blockID ??= util[blockIDKey];
    const topBlockID = getTopBlockID(util, blockID);
    if (!topBlockID) return;
    const entry = { value, sourceID: blockID };
    util[topBlockModifiers]
        ? util[topBlockModifiers][topBlockID]
            ? util[topBlockModifiers][topBlockID][modifierKey] = entry
            : util[topBlockModifiers][topBlockID] = { [modifierKey]: entry }
        : util[topBlockModifiers] = { [topBlockID]: { [modifierKey]: entry } }
    let block_ids = Object.keys(getBlockContainer(util)._blocks);
    for (const mod in util[topBlockModifiers]) {
        // NOTE: The below check could likely use `getBlockContainer(util).isTopBlockID(mod)` instead. 
        // Check this later...
        if (!block_ids.includes(mod)) {
            delete util[topBlockModifiers][mod];
        }
    }
}

/**
 * Get the modifier (denoted by it's 'modifierKey') applicable to the given block associated with 'selfID'.
 * @param {BlockUtility} util 
 * @param {string | number | symbol} modifierKey 
 * @param {string=} blockID 
 * @returns 
 */
export const getTopBlockModifier = (util, modifierKey, blockID = undefined) => {
    blockID ??= util[blockIDKey];
    const topBlockID = getTopBlockID(util, blockID);
    if (!topBlockID) return undefined;
    if (!util[topBlockModifiers]) return undefined;
    if (!util[topBlockModifiers][topBlockID]) return undefined;

    const modifier = util[topBlockModifiers][topBlockID][modifierKey];
    if (!modifier || !getBlockContainer(util).isBlockAbove(blockID, modifier.sourceID)) return;

    return modifier.value;
}