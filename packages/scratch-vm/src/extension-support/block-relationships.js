import BlockUtility from '../engine/block-utility.js';

export const internalIDKey = "internal_blockID";

/**
 * 
 * @param {string} blockID 
 * @param {BlockUtility} util 
 * @returns {string | null | undefined}
 */
export const getTopBlockID = (blockID, util) => util.thread.blockContainer.getTopLevelScript(blockID);