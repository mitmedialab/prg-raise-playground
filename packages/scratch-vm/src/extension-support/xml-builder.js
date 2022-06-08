const Runtime = require('../engine/runtime.js');
const uid = require('../util/uid.js');

/// <reference path="./extension-metadata.js" />

/**
 * @param {Runtime} runtime
 * @param {{getInfo: () => ExtensionMetadata}} extension 
 * @param {string} opcode
 * @returns {string}
 */
export const getXMLForOpcode = (extension, runtime, opcode) => {
  const { id, blocks } = extension.getInfo();
  // do some error checking
  const categoryInfo = runtime._blockInfo.find(i => i.id === id);
  const block = blocks.find(block => block.opcode === opcode);
  return runtime._convertBlockForScratchBlocks(block, categoryInfo).xml;
}