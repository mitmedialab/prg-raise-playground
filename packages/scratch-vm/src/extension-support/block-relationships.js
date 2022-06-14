import BlockUtility from '../engine/block-utility.js';

export const internalIDKey = "internal_blockID";
const topBlockModifiers = 'topBlockModifiers';

/**
 * 
 * @param {string} blockID 
 * @param {BlockUtility} util 
 * @returns {string | null | undefined}
 */
export const getTopBlockID = (blockID, util) => util.thread.blockContainer.isBlockAbove(blockID);

/**
 * 
 * @param {BlockUtility} util 
 * @param {string} topBlockID 
 * @param {string | number | symbol} modifierKey 
 * @param {any} value 
 * @returns 
 */
export const addTopBlockModifierToUtils = (util, topBlockID, modifierKey, value) => {
    // should purge stall ids on utils
    if (!topBlockID) return;
    util[topBlockModifiers]
                ? util[topBlockModifiers][topBlockID] 
                    ? util[topBlockModifiers][topBlockID][modifierKey] = value
                    : util[topBlockModifiers][topBlockID] = { [modifierKey]: value }
                : util[topBlockModifiers] = { [topBlockID]: {[modifierKey]: value} }
}

/**
 * 
 * @param {BlockUtility} util 
 * @param {string} topBlockID 
 * @param {string | number | symbol} modifierKey 
 * @returns 
 */
export const getTopBlockModifier = (util, topBlockID, modifierKey) => {
    if (!topBlockID) return undefined;
    if (!util[topBlockModifiers]) return undefined;
    if (!util[topBlockModifiers][topBlockID]) return undefined;
    // must validate that the source of the modifier is still in the block chain
    return util[topBlockModifiers][topBlockID][modifierKey];
}