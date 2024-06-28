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
        
        /**
         * A function that modifies a project JSON based on any updated
         * versioning implementations
         * 
         * @param {object} projectJSON The project JSON to be modified
         * @return {object} An updated project JSON compatible with the current version of the extension
        */
        alterJSON(projectJSON: any) {
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
                            let { inputs, variables } = this.gatherInputs(block);
                            let fields = this.gatherFields(block, blockArgs);
                            let totalList = inputs.concat(fields);
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
                                    const typeNum = this.getType(blockArgs[argIndex].type);
                                    newInputs[argIndex] = [
                                        1, [
                                            typeNum,
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

        /**
         * Helper function to get the extension ID from a block's opcode
         * 
         * @param {string} opcode The block's opcode
         * @return {string} The extension ID
        */
        getExtensionIdForOpcode(opcode: string): string {
            // Allowed ID characters are those matching the regular expression [\w-]: A-Z, a-z, 0-9, and hyphen ("-").
            const index = opcode.indexOf('_');
            const forbiddenSymbols = /[^\w-]/g;
            const prefix = opcode.substring(0, index).replace(forbiddenSymbols, '-');
            if (CORE_EXTENSIONS.indexOf(prefix) === -1) {
                if (prefix !== '') return prefix;
            }
        };

        /**
         * Helper function used to create a position mapping from one version to another as well as
         * assign each ArgEntry object a new ID
         * 
         * @param {ArgEntry[]} entries The updated entries to create the mapping from
         * @return {ArgEntry[]} returns.newEntries - The ArgEntry objects with updated IDs
         * @return {object} returns.mappings - A dictionary with the position mappings
        */
        updateEntries(entries: ArgEntry[]) {
            const mappings = {};
            let newEntries = [];
            for (let i = 0; i < entries.length; i++) {
                if (entries[i].id) {
                    mappings[entries[i].id] = String(i);
                }   
                newEntries.push({id: String(i), value: entries[i].value});
            }
            return { newEntries, mappings };

        }

        /**
         * This function creates a dictionary with the opcode associated with each block
         * at each version, so that if an opcode changes during a version, we'll be able
         * to find the correct block.
         * 
         * @param {object} blockInfo A dictionary with the information of each block from the extension
         * @return {object} The dictionary with each block's opcode at each version
        */
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
         * 
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
         * Gather the values from the 'inputs' property of a block as well as the block's variables
         * 
         * @param {object} blockJSON The block to gather the inputs from
         * @return {ArgEntry[]} return.inputs - An array of ArgEntry objects with each value representing an input
         * @return {object} return.variables - A dictionary with all th block's variables as values and their positions as keys
         */
        gatherInputs(blockJSON: any): any {
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
                            case 6: // WHOLE_NUM_PRIMITIVE
                            case 5: // POSITIVE_NUM_PRIMITIVE
                            case 7: // INTEGER_NUM_PRIMITIVE
                            case 8: // ANGLE_NUM_PRIMITIVE
                            case 9: // COLOR_PICKER_PRIMITIVE
                            case 4: // MATH_NUM_PRIMITIVE
                            {
                                args.push({id: keyIndex, value: parseFloat(input[1][1])});
                                break;
                            }
                            case 10: // TEXT_PRIMITIVE
                            default: // BROADCAST_PRIMITIVE, VAR_PRIMITIVE, LIST_PRIMITIVE
                            {
                                args.push({id: keyIndex, value: input[1][1]})
                                break;
                            }
                        }
                    }
                })
            }
            return { inputs: args, variables: variables };
        }

        /**
         * Gather the values from the 'fields' property of a block
         * 
         * @param {object} blockJSON The block to gather the inputs from
         * @return {ArgEntry[]} An array of ArgEntry objects representing each field
         */
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
         * If the positions of the arguments change between version transformations, we
         * use this function to update the variables dictionary to contain each variable's
         * new position
         * 
         * @param {object} originalDict The dictionary with the old variable positions
         * @param {object} keyMapping The position transformations corresponding to a version transformation
         * @return {object} A dictionary with the new variable positions
        */
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

        /**
         * Taking a type as provided by the argument info from the extension and converting it 
         * to an integer (as would be represented in the JSON)
         * 
         * @param {string} type The type of the value
         * @return {number} The enum value of the type
        */
        getType(type: string): number {
            let opcode;
            switch (type) {
                case "number": {
                    opcode = 'math_number';
                    break;
                }
                case "angle": {
                    opcode = 'math_angle';
                    break;
                }
                case "color": {
                    opcode = 'colour_picker';
                    break;
                }
                case "string":
                default:
                {
                    opcode = 'text';
                    break;
                }
            }
            return primitiveOpcodeInfoMap[opcode][0];
        }

        /**
         * If a block changes from a reporter to a command, we use this function
         * to remove the reporter version from its parent in the JSON
         * 
         * @param {object} block The parent block we'll use to remove the input
         * @param {object} removeBlock The block to remove
         * @param {object} argInfo The type info for the block's arguments so we can 
         * correctly set the default value
         * @return {number} The parent block with the input removed
        */
        removeInput(block, removeBlock, argInfo) {
            const inputs = block.inputs;
            const newInputs = {};
            for (const key of Object.keys(inputs)) {
                if (inputs[key] && inputs[key].block == removeBlock.id) {
                    const typeNum = this.getType(argInfo[key].type);
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
                            typeNum,
                            defaultVal
                        ]
                    ]
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