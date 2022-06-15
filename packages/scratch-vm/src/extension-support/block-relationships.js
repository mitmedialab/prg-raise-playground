import BlockUtility from '../engine/block-utility.js';
import Blocks from '../engine/blocks.js';

export const internalIDKey = "internal_blockID";
const topBlockModifiers = 'topBlockModifiers';

/**
 * 
 * @param {BlockUtilty} util 
 * @returns {Blocks}
 */
const getBlockContainer = (util) => util.thread.blockContainer;


/**
 * 
 * @param {string} blockID 
 * @param {BlockUtility} util 
 * @returns {string | null | undefined}
 */
export const getTopBlockID = (blockID, util) => getBlockContainer(util).getTopLevelScript(blockID);

/**
 * 
 * @param {BlockUtility} util 
 * @param {string} selfID 
 * @param {string} topBlockID 
 * @param {string | number | symbol} modifierKey 
 * @param {any} value 
 * @returns 
 */
export const addTopBlockModifierToUtils = (util, selfID, topBlockID, modifierKey, value) => {
    // should purge stall ids on utils
    if (!topBlockID) return;
    const entry = {value, sourceID: selfID};
    util[topBlockModifiers]
                ? util[topBlockModifiers][topBlockID] 
                    ? util[topBlockModifiers][topBlockID][modifierKey] = entry
                    : util[topBlockModifiers][topBlockID] = { [modifierKey]: entry }
                : util[topBlockModifiers] = { [topBlockID]: {[modifierKey]: entry} }
}

/**
 * 
 * @param {BlockUtility} util 
 * @param {string} selfID 
 * @param {string} topBlockID 
 * @param {string | number | symbol} modifierKey 
 * @returns 
 */
export const getTopBlockModifier = (util, selfID, topBlockID, modifierKey) => {
    if (!topBlockID) return undefined;
    if (!util[topBlockModifiers]) return undefined;
    if (!util[topBlockModifiers][topBlockID]) return undefined;

    const modifier = util[topBlockModifiers][topBlockID][modifierKey];
    if (!modifier || !getBlockContainer(util).isBlockAbove(selfID, modifier.sourceID)) return;

    return modifier.value;
}