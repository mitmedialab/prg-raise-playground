const Runtime = require('../../engine/runtime.js');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

/// <reference path="./extension-metadata.js" />

/**
 * @param {{getInfo: () => ExtensionMetadata}} extension The extension from which the blocks to be created are from
 * @param {Runtime} runtime
 * @param {string[]} opcodes The opcodes to generate new blocks for
 * @param {any[]} args The arguments to pass to the generated blocks
 * @returns {string}
 */
export const generateXMLForBlockChunk = (extension, runtime, opcodes, args) => {
    if (!validateOpcodesAndArgs(opcodes, args)) return '';

    const { id, blocks, name } = extension.getInfo();
    const categoryInfo = runtime._blockInfo.find(info => info.id === id);

    if (!validateCategoryInfo(categoryInfo, name ? name : id)) return '';

    const blocksByOpcode = generateBlockMap(opcodes, blocks);

    if (!validateBlockMap(blocksByOpcode)) return '';

    const options = { ignoreAttributes: false };
    const parser = new XMLParser(options);

    const getXMLForOpcode = (opcode) => {
        const block = blocksByOpcode[opcode];
        const { xml } = runtime._convertBlockForScratchBlocks(block, categoryInfo);
        return parser.parse(xml);
    };

    let root;
    let previous;
    for (let index = 0; index < opcodes.length; index++) {
        const xmlObj = getXMLForOpcode(opcodes[index]);
        applyArgs(xmlObj, args[index]);
        (index === 0) ? root = xmlObj : previous['block']['next'] = xmlObj;
        previous = xmlObj;
    }

    const builder = new XMLBuilder({ ...options, format: true });
    const xmlContent = builder.build(root);
    return xmlContent;
}

/**
 * 
 * @param {any[]} opcodes 
 * @param {any[]} args 
 */
const validateOpcodesAndArgs = (opcodes, args) => {
    if (!opcodes || opcodes.length === 0) {
        console.error(`No opcodes given`);
        return false;
    }

    if (opcodes.length !== args.length) {
        console.error(`Given length of opcodes (${opcodes.length}) doesn't match given length of args (${args.length})`);
        return false;
    }

    return true;
}

const validateCategoryInfo = (categoryInfo, categoryName) => {
    if (categoryInfo === undefined) {
        console.error(`Could not locate category info on runtime for extension: ${categoryName}`);
        return false;
    }

    return true;
}

/**
 * @typedef {Object<string, ExtensionBlockMetadata>} BlockMap
 */

/**
 * 
 * @param {string[]} opcodes 
 * @param {ExtensionBlockMetadata[]} blocks
 * @returns {BlockMap} 
 */
const generateBlockMap = (opcodes, blocks) => {
    return [...new Set(opcodes)]
        .map(op => {
            const block = blocks.find(block => block.opcode === op);
            return { opocde: op, block };
        })
        .reduce((acc, cur) => {
            acc[cur.opocde] = cur.block;
            return acc;
        }, {});
}

/**
 * 
 * @param {BlockMap} blockMap 
 */
const validateBlockMap = (blockMap) => {
    for (const opcode in blockMap) {
        if (blockMap[opcode] === undefined) {
            console.error(`No block with the opcode '${opcode}' could be found.`);
            return false;
        }
    }

    return true;
}

/**
 * Add arguments in the appropriate fields of the XML-based js object
 * @param {*} obj 
 * @param {*} args 
 */
const applyArgs = (obj, args) => {
    const nameKey = '@_name';
    const textKey = '#text';
    for (const key in args) {
        const value = obj.block.value.find(o => o[nameKey] === key);
        if (value) {
            value.shadow.field[textKey] = args[key];
        }
    }
}