import { BaseScratchExtensionConstuctor } from "..";

/**
 * Mixin the ability for extensions to have their blocks 'versioned', 
 * so that projects serialized with past versions of blocks can be loaded.
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */

type BlockType = "reporter" | "command"; // etc, use actual version
type ArgValue = any;
type ArgIdentifier = string | number;
type ArgEntry = { 
    /** If no id is provided, we can assume that the associated value does not correspond to any previously serialized argument */
    readonly id?: ArgIdentifier, 
    value: ArgValue
}



type VersionArgTransformMechanism = {
    arg: (identifier: ArgIdentifier) => ArgEntry,
    args: () => ArgEntry[]
}

type VersionedArgTransformer = (mechanism: VersionArgTransformMechanism) => ArgEntry[];

type VersionedOptions = {
  transform?: VersionedArgTransformer;
  previousType?: BlockType;
  previousName?: string;
};

const CORE_EXTENSIONS = [
    'argument',
    'colour',
    'control',
    'data',
    'event',
    'looks',
    'math',
    'motion',
    'operator',
    'procedures',
    'sensing',
    'sound'
];

// Constants referring to 'primitive' blocks that are usually shadows,
// or in the case of variables and lists, appear quite often in projects
// math_number
const MATH_NUM_PRIMITIVE = 4; // there's no reason these constants can't collide
// math_positive_number
const POSITIVE_NUM_PRIMITIVE = 5; // with the above, but removing duplication for clarity
// math_whole_number
const WHOLE_NUM_PRIMITIVE = 6;
// math_integer
const INTEGER_NUM_PRIMITIVE = 7;
// math_angle
const ANGLE_NUM_PRIMITIVE = 8;
// colour_picker
const COLOR_PICKER_PRIMITIVE = 9;
// text
const TEXT_PRIMITIVE = 10;
// event_broadcast_menu
const BROADCAST_PRIMITIVE = 11;
// data_variable
const VAR_PRIMITIVE = 12;
// data_listcontents
const LIST_PRIMITIVE = 13;

// Map block opcodes to the above primitives and the name of the field we can use
// to find the value of the field
const primitiveOpcodeInfoMap = {
    math_number: [MATH_NUM_PRIMITIVE, 'NUM'],
    math_positive_number: [POSITIVE_NUM_PRIMITIVE, 'NUM'],
    math_whole_number: [WHOLE_NUM_PRIMITIVE, 'NUM'],
    math_integer: [INTEGER_NUM_PRIMITIVE, 'NUM'],
    math_angle: [ANGLE_NUM_PRIMITIVE, 'NUM'],
    colour_picker: [COLOR_PICKER_PRIMITIVE, 'COLOUR'],
    text: [TEXT_PRIMITIVE, 'TEXT'],
    event_broadcast_menu: [BROADCAST_PRIMITIVE, 'BROADCAST_OPTION'],
    data_variable: [VAR_PRIMITIVE, 'VARIABLE'],
    data_listcontents: [LIST_PRIMITIVE, 'LIST']
};


const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */
const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

export default function (Ctor: BaseScratchExtensionConstuctor) {
    abstract class ExtensionWithConfigurableSupport extends Ctor {
        
        alterJSON(projectJSON) {
            const targetObjects = projectJSON.targets
            .map((t, i) => Object.assign(t, { targetPaneOrder: i }))
            .sort((a, b) => a.layerOrder - b.layerOrder);

            const newTargets = [];
            for (const object of targetObjects) {
                const newBlocks = {};
                for (const blockId in object.blocks) {
                    
                    let blockJSON = object.blocks[blockId];
                    let version = 0;
                    const blockOpcode = blockJSON.opcode;

                    // Check if version name is included
                    const regex = /_v(\d+)/g;
                    const matches = blockOpcode.match(regex); // Get all matches

                    if (matches) {
                        const lastMatch = matches[matches.length - 1]; 
                        const versionMatch = lastMatch.match(/_v(\d+)/); 

                        if (versionMatch) {
                            version = parseInt(versionMatch[1], 10); // Extract and parse the version number
                        }
                        blockJSON.opcode = blockOpcode.replace(regex, ""); // Remove all version numbers from the opcode
                    }

                    const extensionID = this.getExtensionIdForOpcode(blockJSON.opcode);
                    const blocksInfo = this.getInfo().blocks.reduce((acc, tempBlock: any) => {
                        acc[tempBlock.opcode] = tempBlock;
                        return acc;
                    }, {});
                    if (extensionID == this.getInfo().id) {
                        const block = object.blocks[blockId];
                        let blockInfoIndex = block.opcode.replace(`${block.opcode.split("_")[0]}_`, "");
                        let oldIndex = blockInfoIndex;
                        const nameMap = this.createNameMap(blocksInfo);
                        if (nameMap[version] && nameMap[version][blockInfoIndex]) {
                            blockInfoIndex = nameMap[version][blockInfoIndex];
                        }
                        block.opcode = block.opcode.replace(oldIndex, blockInfoIndex);
                        const versions = this.getVersion(blockInfoIndex);
                        if (versions && version < versions.length) {
                            const blockArgs = this.removeImageEntries(blocksInfo[blockInfoIndex].arguments);
                            let { inputs, variables } = this.gatherInputs(object.blocks, block);
                            let fields = this.gatherFields(block, blockArgs);
                            let totalList = this.addInputsAndFields(inputs, fields);
                            const newInputs = {};
                            const newFields = {};
                            let changed = false;
                            let moveToSay = false;
                            for (let i = version; i < versions.length; i++) {
                                if (versions[i].transform) {
                                    const map = new Map();
                                    for (let i = 0; i < totalList.length; i++) {
                                        map.set(totalList[i].id, totalList[i]);
                                    }
                                    const mechanism: VersionArgTransformMechanism = {
                                        arg: (identifier: ArgIdentifier) => map.get(identifier),
                                        args: () => Array.from(map.values()),
                                    }
                                    const entries: ArgEntry[] = versions[i].transform(mechanism);
                                    const { newEntries, mappings } = this.updateEntries(entries);
                                    totalList = newEntries;
                                    variables = this.updateDictionary(variables, mappings)
                                }
                                if (versions[i].previousType) {
                                    if (versions[i].previousType == "reporter" && blocksInfo[blockInfoIndex].blockType == "command") { // reporter to command
                                        changed = !changed;
                                        if (moveToSay) {
                                            moveToSay = false;
                                        } 
                                    } else { // command to reporter
                                        changed = !changed;
                                        if (!moveToSay) {
                                            moveToSay = true;
                                        }
                                    }
                                }
                            }

                            for (let i = 0; i < Object.keys(blockArgs).length; i++) {
                                const argIndex = Object.keys(blockArgs)[i];
                                if (Object.keys(variables).includes(argIndex)) {
                                    newInputs[argIndex] = variables[argIndex];
                                } else if (blockArgs[argIndex].menu) {
                                    let fieldValue = totalList[argIndex];
                                    if (typeof fieldValue == "number") {
                                        fieldValue = String(fieldValue);  
                                    }
                                    newFields[argIndex] = {
                                        name: String(argIndex),
                                        value: fieldValue,
                                        id: null
                                    }
                                    
                                } else {
                                    const primitiveBlock = this.createInputBlock(object.blocks, blockArgs[argIndex].type, totalList[argIndex].value, block.id);
                                    newInputs[argIndex] = [
                                        1, [
                                            primitiveOpcodeInfoMap[primitiveBlock.opcode][0],
                                            String(totalList[argIndex].value)
                                        ]
                                    ]
                                }
                                
                            }
            
                            // Re-assign fields and inputs
                            block.inputs = newInputs;
                            block.fields = newFields;
                            const regex = /_v(\d+)/g;
            
                            if (moveToSay && changed) {
                                const oldID = blockId;
                                const next = block.next;
                                block.id = uid();
                                //blockJSON.topLevel = false;
                                const newBlock = Object.create(null);
                                newBlock.id = oldID;
                                newBlock.parent = block.parent;
                                block.parent = newBlock.id;
                                newBlock.fields = {};
                                newBlock.inputs = {
                                    MESSAGE: [
                                        3, 
                                        block.id,
                                        [
                                            10, 
                                            "Hello"
                                        ]
                                    ]
                                }
                                newBlock.next = next;
                                block.next = null;
                                newBlock.opcode = "looks_say";
                                newBlock.shadow = false;
                                //newBlock.topLevel = true;
                                for (const key of Object.keys(block.inputs)) {
                                    if (block.inputs[key].block) {
                                        let inputBlock = block.inputs[key].block;
                                        if (object.blocks[inputBlock]) {
                                            object.blocks[inputBlock].parent = block.id;
                                            block.inputs[key].shadow = block.inputs[key].block;
                                        }
            
                                    }
                                }
                                newBlocks[block.id] = block;
                                newBlocks[newBlock.id] = newBlock;
                            } else if (!moveToSay && changed) {
                                if (object.blocks[block.parent]) {
                                    const parentBlock = object.blocks[block.parent];
                                    if (parentBlock) {
                                        let parentIndex = parentBlock.opcode;
                                        parentIndex = parentIndex.replace(`${parentIndex.split("_")[0]}_`, "");
                                        parentIndex = parentIndex.replace(regex, "");
                                        for (let key of Object.keys(parentBlock.inputs)) {
                                            let values = [];
                                            let index = 0;
                                            for (const value of parentBlock.inputs[key]) {
                                                if (value != blockId) {
                                                    if (index == 0) {
                                                        values.push(1);
                                                    } else {
                                                        values.push(value);
                                                    }
                                                }
                                                index = index + 1;
                                            }
                                            parentBlock.inputs[key] = values; 
                                        }
                                        block.parent = null;
                                        block.topLevel = true;
                                    } 
                                } 
                            } 
                        }
                        if (!Object.keys(newBlocks).includes(blockId)) {
                            newBlocks[blockId] = block;
                        }
                        
                    } 
                }
                object.blocks = newBlocks;
                newTargets.push(object);
            }
            projectJSON.targets = newTargets;
            return projectJSON;
        }

        getExtensionIdForOpcode(opcode) {
            // Allowed ID characters are those matching the regular expression [\w-]: A-Z, a-z, 0-9, and hyphen ("-").
            const index = opcode.indexOf('_');
            const forbiddenSymbols = /[^\w-]/g;
            const prefix = opcode.substring(0, index).replace(forbiddenSymbols, '-');
            if (CORE_EXTENSIONS.indexOf(prefix) === -1) {
                if (prefix !== '') return prefix;
            }
        };

        updateEntries(entries) {
            const mappings = {};
            let newEntries = [];
            for (let i = 0; i < entries.length; i++) {
                mappings[entries[i].id] = String(i);
                newEntries.push({id: String(i), value: entries[i].value});
            }
            return { newEntries, mappings };

        }

        createInputBlock(blocks, type, value, parentId) {
            value = String(value);
            const primitiveObj = Object.create(null);
            const newId = uid();
            primitiveObj.id = newId;
            primitiveObj.next = null;
            primitiveObj.parent = parentId;
            primitiveObj.shadow = true;
            primitiveObj.inputs = Object.create(null);
            // need a reference to parent id
            switch (type) {
                case "number": {
                    if (value == "undefined") {
                        value = 0;
                    }
                    primitiveObj.opcode = 'math_number';
                    primitiveObj.fields = {
                        NUM: {
                            name: 'NUM',
                            value: value
                        }
                    };
                    primitiveObj.topLevel = false;
                    break;
                }
                case "angle": {
                    if (value == "undefined") {
                        value = 0;
                    }
                    primitiveObj.opcode = 'math_angle';
                    primitiveObj.fields = {
                        NUM: {
                            name: 'NUM',
                            value: value
                        }
                    };
                    primitiveObj.topLevel = false;
                    break;
                }
                case "color": {
                    if (value == "undefined") {
                        value = 0;
                    }
                    primitiveObj.opcode = 'colour_picker';
                    primitiveObj.fields = {
                        COLOUR: {
                            name: 'COLOUR',
                            value: value
                        }
                    };
                    primitiveObj.topLevel = false;
                    break;
                }
                case "string": {
                    primitiveObj.opcode = 'text';
                    primitiveObj.fields = {
                        TEXT: {
                            name: 'TEXT',
                            value: value
                        }
                    };
                    primitiveObj.topLevel = false;
                    break;
                }
                default: {
                    //log.error(`Found unknown primitive type during deserialization: ${JSON.stringify(inputDescOrId)}`);
                    return null;
                }
            }
            //blocks[newId] = primitiveObj;
            //blockLib.createBlock(primitiveObj);
            return primitiveObj;
        };

        createNameMap(blocksInfo) {
            const versionMap = new Map();
            for (const opcode of Object.keys(blocksInfo)) {
                const versions = this.getVersion(opcode);
                if (versions && versions.length > 0) {
                    let tempName = opcode;
                    for (let index = versions.length - 1; index >= 0; index--) { // loop through each version entry
                        if (!versionMap.has(index)) {
                            versionMap[index] = {};
                        }
                        const version = versions[index];
                        if (typeof version == "object" && version.previousName) { // check if the version entry has a name
                            const oldName = version.previousName;
                            tempName = oldName;
                        }
                        if (tempName != opcode) {
                            versionMap[index][tempName] = opcode;
                        }
                    }
                }
            }
            return versionMap;
        }


        /**
         * Remove image entries from the passed-in arguments for each block from the extension
         * @param {object} dict The arguments of the block
         * @return {object} The arguments of the block with the static images removed
         */
        removeImageEntries(dict: any) {
            const filteredDict = {};

            for (const [key, value] of Object.entries(dict)) {
                if ((value as any).type !== 'image') {
                    filteredDict[key] = value;
                }
            }

            return filteredDict;
        }

        /**
         * Gather the primitive values from the 'inputs' property of a block as well as the block's variables
         * 
         * @param {object} blocks The blocks related to the Scratch object
         * @param {object} blockJSON The block to gather the inputs from
         * @return {object} return.inputs - A dictionary of the inputs, with each value a primitive object
         * @return {object} return.variables - A dictionary with all th block's variables as values and their positions as keys
         */
        gatherInputs(blocks, blockJSON) {
            var inputs = {};
            var variables = {};
            const args: ArgEntry[] = [];
            if (blockJSON.inputs && Object.keys(blockJSON.inputs).length > 0) {
                Object.keys(blockJSON.inputs).forEach(input => {
                    var keyIndex = input;
                    input = blockJSON.inputs[input];
                    if (typeof input[1] == "string") {
                        variables[keyIndex] = [
                            3,
                            input[1],
                            input[2]
                        ]
                        args.push({id: keyIndex, value: input[2][1]});
                    } else {
                        const type = parseFloat(input[1][0]);
                        switch (type) {
                            case 6:
                            case 5:
                            case 8:
                            case 4: {
                                args.push({id: keyIndex, value: parseFloat(input[1][1])});
                                break;
                            }
                            case 10: {
                                args.push({id: keyIndex, value: input[1][1]})
                                break;
                            }
                            default: {
                                args.push({id: keyIndex, value: input[1][1]});
                                break;
                            }  
                        }
                    }
                   
//                    const MATH_NUM_PRIMITIVE = 4; // there's no reason these constants can't collide
                    // // math_positive_number
                    // const POSITIVE_NUM_PRIMITIVE = 5; // with the above, but removing duplication for clarity
                    // // math_whole_number
                    // const WHOLE_NUM_PRIMITIVE = 6;
                    // // math_integer
                    // const INTEGER_NUM_PRIMITIVE = 7;
                    // // math_angle
                    // const ANGLE_NUM_PRIMITIVE = 8;
                    // // colour_picker
                    // const COLOR_PICKER_PRIMITIVE = 9;
                    // // text
                    // const TEXT_PRIMITIVE = 10;
                    // // event_broadcast_menu
                    // const BROADCAST_PRIMITIVE = 11;
                    // // data_variable
                    // const VAR_PRIMITIVE = 12;
                    // // data_listcontents
                    // const LIST_PRIMITIVE = 13;
                    // if (blocks[(input as any).block]) {
                    //     if (Object.keys(primitiveOpcodeInfoMap).includes(blocks[(input as any).block].opcode)) {
                    //         const inputBlock = blocks[(input as any).block].fields;
                    //         const inputType = Object.keys(blocks[(input as any).block].fields)[0];
                    //         var inputValue = inputBlock[inputType].value;
                    //         if (inputType == "NUM") {
                    //             inputValue = parseFloat(inputValue);
                    //         }
                    //     } else {
                    //         variables[keyIndex] = input;
                    //         inputValue = "0";
                    //     }
                    //     args.push({id: keyIndex, value: inputValue})
                    // } 
                })
            }
            return { inputs: args, variables: variables };
        }

        gatherFields(blockJSON, argList) {
            const args: ArgEntry[] = [];
            var fields = {};
            if (blockJSON.fields && Object.keys(blockJSON.fields).length > 0) {
                Object.keys(blockJSON.fields).forEach(field => {
                        const keyIndex = field;
                        field = blockJSON.fields[field];
                        var value = (field as any).value;
                        var argType = argList[(field as any).name].type;
                        if (argType == "number" || argType == "angle") {
                            value = parseFloat(value);
                        }
                        args.push({id: keyIndex, value: value})
                })
            }
            return args;
        }

        /**
         * A function that combines the primitive values from the block's inputs and fields
         * so that it can be processed by the version functions
         * 
         * @param {object} inputs A dictionary with the primitive values of the block's inputs
         * @param {object} fields A dictionary with the primitive values of the block's fields
         * @param {object} argList The argument dictionary for the associated block
         * @return {Array} An array with the combined primitive values from the block's inputs and fields
         */
        addInputsAndFields(inputs, fields) {
            return inputs.concat(fields);
        }

        updateDictionary(originalDict, keyMapping) {
            const updatedDict = {};
            for (const [oldKey, newKey] of Object.entries(keyMapping)) {
                if (originalDict.hasOwnProperty(oldKey)) {
                    const newEntry = originalDict[oldKey];
                    updatedDict[newKey as any] = newEntry;
                }
            }
            return updatedDict;
        }

        removeInput(block, removeBlock, blocks, argInfo) {
            const inputs = block.inputs;
            const newInputs = {};
            let objectBlocks = {};
            for (const key of Object.keys(inputs)) {
                if (inputs[key] && inputs[key].block == removeBlock.id) {
                    const primitiveBlock = this.createInputBlock(blocks, argInfo[key].type, argInfo[key].defaultValue, block.id);
                    //objectBlocks = values.blocks;
                    let defaultVal = argInfo[key].defaultValue;
                    if (String(defaultVal) == "undefined") {
                        switch(argInfo[key].type) {
                            case "number": 
                            case "angle": 
                            case "color": {
                                defaultVal = 0;
                                break;
                            }
                            case "string": {
                                defaultVal = "string";
                                break;
                            }
                        }
                    }
                    newInputs[key] = [
                        1, [
                            primitiveOpcodeInfoMap[primitiveBlock.opcode][0],
                            defaultVal
                        ]
                    ]
                    // newInputs[key] = {
                    //     name: String(key),
                    //     block: values.newId,
                    //     shadow: values.newId,
                    // };
                } else {
                    newInputs[key] = inputs[key];
                }
            }
            block.inputs = newInputs;
            return block;
        }


    }

    return ExtensionWithConfigurableSupport;
}