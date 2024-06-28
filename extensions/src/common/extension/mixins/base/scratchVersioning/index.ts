import { BaseScratchExtensionConstuctor } from "..";
import { ArgEntry, VersionArgTransformMechanism, ArgIdentifier } from "$common/types";

/**
 * Mixin the ability for extensions to have their blocks 'versioned', 
 * so that projects serialized with past versions of blocks can be loaded.
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */


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
            // Collect the targets
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

                    // Collect the version number
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
                    // If the block is under the current extension
                    if (extensionID == this.getInfo().id) {
                        const block = object.blocks[blockId];
                        let blockInfoIndex = block.opcode.replace(`${block.opcode.split("_")[0]}_`, "");
                        let oldIndex = blockInfoIndex;
                        const nameMap = this.createNameMap(blocksInfo);
                        if (nameMap[version] && nameMap[version][blockInfoIndex]) {
                            blockInfoIndex = nameMap[version][blockInfoIndex];
                        }
                        // Update the opcode to be the current version name
                        block.opcode = block.opcode.replace(oldIndex, blockInfoIndex);
                        const versions = this.getVersion(blockInfoIndex);

                        // If we need to update the JSON to be compatible with the current version
                        if (versions && version < versions.length) {
                            // Remove the image entries from the arguments
                            const blockArgs = this.removeImageEntries(blocksInfo[blockInfoIndex].arguments);
                            // Gather values
                            let { inputs, variables } = this.gatherInputs(block);
                            let fields = this.gatherFields(block, blockArgs);
                            let totalList = inputs.concat(fields);
                            const newInputs = {};
                            const newFields = {};
                            let changed = false;
                            let moveToSay = false;

                            // Apply each version modification as needed
                            for (let i = version; i < versions.length; i++) {
                                if (versions[i].transform) {
                                    // Create the map to be used in the mechanism from ArgEntry objects
                                    const map = new Map();
                                    for (let i = 0; i < totalList.length; i++) {
                                        map.set(totalList[i].id, totalList[i]);
                                    }
                                    const mechanism: VersionArgTransformMechanism = {
                                        arg: (identifier: ArgIdentifier) => map.get(identifier),
                                        args: () => Array.from(map.values()),
                                    }
                                    // Complete the transformation
                                    const entries: ArgEntry[] = versions[i].transform(mechanism);
                                    // Update the ArgEntry objects' IDs and get position mappings
                                    const { newEntries, mappings } = this.updateEntries(entries);
                                    totalList = newEntries;
                                    // Update variable positions
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

                            // Re-create the project JSON inputs/fields with the new values
                            for (let i = 0; i < Object.keys(blockArgs).length; i++) {
                                const argIndex = Object.keys(blockArgs)[i];
                                // If there's a variable in the argIndex position
                                if (Object.keys(variables).includes(argIndex)) {
                                    newInputs[argIndex] = variables[argIndex];
                                } 
                                // If we need to place the value in a field
                                else if (blockArgs[argIndex].menu) {
                                    let fieldValue = totalList[argIndex];
                                    if (typeof fieldValue == "number") {
                                        fieldValue = String(fieldValue);  
                                    }
                                    newFields[argIndex] = {
                                        name: String(argIndex),
                                        value: fieldValue,
                                        id: null
                                    }
                                } 
                                // If we need to place the value in an input
                                else {
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
            
                            // If we need to move the information to a 'say' block, since 
                            // we need to keep it connected to the previous/next blocks
                            if (moveToSay && changed) { // command to reporter
                                const oldID = blockId;
                                const next = block.next;
                                // Re-assign the ID of the current block
                                block.id = uid();
                                // Create the new block
                                const newBlock = Object.create(null);
                                newBlock.id = oldID;
                                newBlock.parent = block.parent;
                                block.parent = newBlock.id;
                                newBlock.fields = {};
                                // Input should be the reporter block variable
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
                                
                                // Since we changed the block ID, we need to update the 
                                // block's input blocks to match
                                for (const key of Object.keys(block.inputs)) {
                                    if (block.inputs[key].block) {
                                        let inputBlock = block.inputs[key].block;
                                        if (object.blocks[inputBlock]) {
                                            object.blocks[inputBlock].parent = block.id;
                                            block.inputs[key].shadow = block.inputs[key].block;
                                        }
            
                                    }
                                }
                                // Set the blocks in the JSON
                                newBlocks[block.id] = block;
                                newBlocks[newBlock.id] = newBlock;
                            } 
                            // If we need to create a command from a reporter
                            else if (!moveToSay && changed) {
                                // If the previous reporter block has a parent
                                if (object.blocks[block.parent]) {
                                    const parentBlock = object.blocks[block.parent];
                                    // Remove the reporter variable from the parent block's inputs
                                    for (let key of Object.keys(parentBlock.inputs)) {
                                        let values = [];
                                        let index = 0;
                                        for (const value of parentBlock.inputs[key]) {
                                            if (value != blockId) {
                                                if (index == 0) {
                                                    // We'll also need to set the shadow to 1
                                                    // since we removed the variable
                                                    values.push(1);
                                                } else {
                                                    values.push(value);
                                                }
                                            }
                                            index = index + 1;
                                        }
                                        parentBlock.inputs[key] = values; 
                                    }
                                    // Update the current block to be a command block
                                    block.parent = null;
                                    block.topLevel = true;
                                } 
                            } 
                        }
                        // Set the blocks dictionary
                        if (!Object.keys(newBlocks).includes(blockId)) {
                            newBlocks[blockId] = block;
                        }
                    } 
                }
                // Update the target with the new blocks
                object.blocks = newBlocks;
                newTargets.push(object);
            }
            // Update the project JSON with the new target
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
            // Loop through the arg entries
            for (let i = 0; i < entries.length; i++) {
                // If the value hasn't just been added
                if (entries[i].id) {
                    // Set the positional dictionary
                    mappings[entries[i].id] = String(i);
                }   
                // Update the new ArgEntry array with the new ID
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
        createNameMap(blocksInfo: any) {
            const versionMap = new Map();
            // Loop through every block in the extension
            for (const opcode of Object.keys(blocksInfo)) {
                // Get version information for each extension
                const versions = this.getVersion(opcode);
                // If there is version information
                if (versions && versions.length > 0) {
                    let tempName = opcode;
                    // Loop through the versions from most current to least current
                    for (let index = versions.length - 1; index >= 0; index--) { 
                        if (!versionMap.has(index)) {
                            versionMap[index] = {};
                        }
                        // Collect the name for the version, if it's not the current opcode
                        const version = versions[index];
                        if (typeof version == "object" && version.previousName) { // check if the version entry has a name
                            const oldName = version.previousName;
                            tempName = oldName;
                        }
                        // Set the map entry for the version and the name at that version
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
         * @return {object} return.variables - A dictionary with all the block's variables as values and their positions as keys
         */
        gatherInputs(blockJSON: any): any {
            const variables = {};
            const args: ArgEntry[] = [];
            // Loop through the block's inputs
            if (blockJSON.inputs && Object.keys(blockJSON.inputs).length > 0) {
                Object.keys(blockJSON.inputs).forEach(input => {
                    const keyIndex = input;
                    input = blockJSON.inputs[input];
                    // If there is a variable in the input
                    if (typeof input[1] == "string") {
                        // Set the variables dictionary accordingly
                        variables[keyIndex] = [
                            3,
                            input[1],
                            input[2]
                        ]
                        args.push({id: keyIndex, value: input[2][1]});
                    } else {
                        // If the input is a value, push that value according to type
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
        gatherFields(blockJSON: any, argList: any) {
            const args: ArgEntry[] = [];
            // Loop through each field
            if (blockJSON.fields && Object.keys(blockJSON.fields).length > 0) {
                Object.keys(blockJSON.fields).forEach(field => {
                        const keyIndex = field;
                        field = blockJSON.fields[field];
                        // Collect the field's value
                        let value = (field as any).value;
                        let argType = argList[(field as any).name].type;
                        // Convert the value to its correct type
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
        updateDictionary(originalDict: any, keyMapping: any) {
            const updatedDict = {};
            for (const [oldKey, newKey] of Object.entries(keyMapping)) {
                // If the old variable exists at that position...
                if (originalDict.hasOwnProperty(oldKey)) {
                    const newEntry = originalDict[oldKey];
                    // ... update the new dictionary at the new position
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
            let opcode: string;
            // Collect the opcode for each type
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
            // Map the opcode to its enum type
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
        removeInput(block: any, removeBlock: any, argInfo: any) {
            const inputs = block.inputs;
            const newInputs = {};
            // Loop through block inputs
            for (const key of Object.keys(inputs)) {
                // If the input contains the block we need to remove
                if (inputs[key] && inputs[key].includes(removeBlock.id)) {
                    // Get the default value for the current input position
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
                    // Set the input value to be the default instead of the variable
                    newInputs[key] = [
                        1, [
                            typeNum,
                            defaultVal
                        ]
                    ]
                // Otherwise, leave the input as is
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