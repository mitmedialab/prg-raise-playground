import type BlockUtility from '$scratch-vm/engine/block-utility.js';
import type Blocks from '$scratch-vm/engine/blocks.js';
import { blockIDKey } from './globals';
import { BlockUtilityWithID } from './types';

export const internalIDKey = "internal_blockID";
const topBlockModifiers = 'topBlockModifiers';

type BlockID = string;
type Block = { topLevel: boolean, parent: BlockID, id: string };
type BlockMap = Record<BlockID, Block>;
type Entry = { value: any, sourceID: BlockID }

const topBlockModifiers_ = new Map<string, Map<string, Entry>>();
const contexts = new Map<BlockID, Map<string, any>>();

const getBlockContainer = (util: BlockUtility): Blocks => util.thread.blockContainer;
const getBlocksMap = ({ _blocks }: Blocks): BlockMap => _blocks;
const getTopBlockIDs = (map: BlockMap) => Object.keys(map).filter(id => map[id].topLevel);
const isTopBlockID = (id: string, map: BlockMap): boolean => map[id].topLevel;
const getTopBlockID = (id: BlockID, blocks: Blocks) => blocks.getTopLevelScript(id);

/**
* NOTE: Also returns true if baseID === aboveID
*/
const isBlockAbove = (rereferenceID: string, queryID: string, map: BlockMap) => {
  if (rereferenceID === queryID) return true;
  let block = map[rereferenceID];
  if (typeof block === 'undefined') return null;
  while (block.parent !== null) {
    block = map[block.parent];
    if (block.id === queryID) return true;
  }
  return false;
}

export const setStackContext = <T>({ [blockIDKey]: id }: BlockUtilityWithID, key: string, value: T) =>
  (contexts.has(id) ? contexts.get(id) : contexts.set(id, new Map<string, any>())).set(key, value);

export const getStackContext = <T>(util: BlockUtilityWithID): Partial<T> => {
  const id = util[blockIDKey];
  console.log(id);
  const map = getBlocksMap(getBlockContainer(util));
  let block = map[id];
  if (typeof block === 'undefined') return null;

  let context = {};

  while (block.parent) {
    const { parent } = block;
    if (contexts.has(parent)) {
      for (const [key, value] of contexts.get(parent)) {
        if (key in context) continue;
        context[key] = value;
      }
    }
    block = map[parent];
  }

  return context;
}

/**
 * Add a modifier to the given 'selfID' block's top block
 * @param {BlockUtility} util 
 * @param {string} selfID 
 * @param {string | number | symbol} modifierKey 
 * @param {any} value 
 * @returns 
 */
export const addTopBlockModifier = <T>(util: BlockUtility, selfID: BlockID, modifierKey: string, value: T) => {
  const blocks = getBlockContainer(util)
  const topBlockID = getTopBlockID(selfID, blocks);
  if (!topBlockID) return;

  const entry = { value, sourceID: selfID };

  topBlockModifiers_.has(topBlockID)
    ? topBlockModifiers_.has(topBlockID)
      ? topBlockModifiers_.get(topBlockID).set(modifierKey, entry)
      : (topBlockModifiers_.set(topBlockID, new Map().set(modifierKey, entry)))
    : topBlockModifiers_.set(topBlockID, new Map().set(modifierKey, entry));

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
 * @param {string} selfID 
 * @param {string | number | symbol} modifierKey 
 * @returns 
 */
export const getTopBlockModifier = <T>(util: BlockUtility, id: BlockID, modifierKey: string): T => {
  const blocks = getBlockContainer(util)
  const topBlockID = getTopBlockID(id, blocks);
  if (!topBlockID) return undefined;
  if (!util[topBlockModifiers]) return undefined;
  if (!util[topBlockModifiers][topBlockID]) return undefined;

  const blockMap = getBlocksMap(blocks);
  const modifier = util[topBlockModifiers][topBlockID][modifierKey];
  if (!modifier || !isBlockAbove(id, modifier.sourceID, blockMap)) return;

  return modifier.value;
}