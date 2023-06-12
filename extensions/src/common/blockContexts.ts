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

export const setStackContext = <TKey extends string, TValue>({ [blockIDKey]: id }: BlockUtilityWithID, key: TKey, value: TValue) =>
  (contexts.has(id) ? contexts.get(id) : contexts.set(id, new Map<string, any>())).set(key, value);

export const getStackContext = <T>(util: BlockUtilityWithID, keys?: Array<keyof T>): Partial<T> => {
  const map = getBlocksMap(getBlockContainer(util));
  const id = util[blockIDKey];
  let block = map[id];
  if (typeof block === 'undefined') return null;

  let context = {};
  const useKeys = keys !== undefined;

  while (block.parent) {
    const { parent } = block;
    if (contexts.has(parent)) {
      for (const [key, value] of contexts.get(parent)) {
        console.log(key, value);
        if (key in context) continue;

        const indexOfKey = useKeys ? keys.indexOf(key as any) : -1;
        if (useKeys && indexOfKey < 0) continue;

        context[key] = value;

        if (useKeys) {
          keys.splice(indexOfKey, 1);
          if (keys.length === 0) return context;
        }
      }
    }
    block = map[parent];
  }

  return context;
}

// --------------------------------------------------
const getTopBlockID = (id: BlockID, blocks: Blocks) => blocks.getTopLevelScript(id);
const getTopBlockIDs = (map: BlockMap) => Object.keys(map).filter(id => map[id].topLevel);
const isTopBlockID = (id: string, map: BlockMap): boolean => map[id].topLevel;

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