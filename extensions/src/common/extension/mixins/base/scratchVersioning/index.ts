import { BaseScratchExtensionConstuctor } from "..";
import type { ArgEntry, VersionArgTransformMechanism, ArgIdentifier, ExtensionBlockMetadata } from "$common/types";
import { CORE_EXTENSIONS, primitiveOpcodeInfoMap } from './enums';
import { uid, regex, merge } from "./utils";
import { isString } from "$common/utils";

type BlockID = ReturnType<typeof uid>;
type SerializedBlock = { opcode: string, id: string, fields: any, inputs: Record<string, any>, next: BlockID, parent: BlockID, topLevel: boolean };
type SerializedTarget = { blocks: Record<string, SerializedBlock>, layerOrder: number, };

type SerializedScratchData = {
    targets: SerializedTarget[],
}

type BlockInfoByOpcode = Record<string, ExtensionBlockMetadata>;

/**
 * 
 * NOTE: This modifies the block in place, and thus has side-effects
 * @param block 
 * @returns 
 */
const getVersionForBlockAndRemoveFromOpcode = (block: Pick<SerializedBlock, "opcode">) => {
    const { opcode } = block;
    const allVersionMatches = opcode.match(regex.versionSuffix.global);
    if (!allVersionMatches) return 0;

    const lastMatch = allVersionMatches.at(-1);
    const matchVersionNumber = lastMatch.match(regex.versionSuffix.local);
    const version = matchVersionNumber ? parseInt(matchVersionNumber[1], 10) : 0;

    block.opcode = opcode.replace(regex.versionSuffix.global, "");
    return version;
}

const getExtensionIdForBlock = ({ opcode }: Pick<SerializedBlock, "opcode">) => {
    const index = opcode.indexOf('_');
    const prefix = opcode.substring(0, index).replace(regex.forbiddenSymbols, '-');
    if (CORE_EXTENSIONS.indexOf(prefix) === -1) {
        if (prefix !== '') return prefix;
    }
};

/**
 * Remove image entries from the passed-in arguments for each block from the extension
 * 
 * @param {object} dict The arguments of the block
 * @return {object} The arguments of the block with the static images removed
 */
const getBlockArgumentsWithoutImageEntries = ({ arguments: args }: Pick<ExtensionBlockMetadata, "arguments">) => {
    const filtered: ExtensionBlockMetadata["arguments"] = {};
    for (const [key, value] of Object.entries(args)) {
        if (value.type === 'image') continue;
        filtered[key] = value;
    }
    return filtered;
}

/**
 * Gather the values from the 'inputs' property of a block as well as the block's variables
 * @param {object} block The block to gather the inputs from
 * @return {ArgEntry[]} return.inputs - An array of ArgEntry objects with each value representing an input
 * @return {object} return.variables - A dictionary with all the block's variables as values and their positions as keys
 */
const gatherInputs = (block: SerializedBlock, { blocks }: SerializedTarget) => {
    const variables = {};
    const menus = {};
    const args = new Map();

    if (!block.inputs || Object.keys(block.inputs).length <= 0)
        return { inputs: args, variables, menus };

    for (const inputID in block.inputs) {
        const input = block.inputs[inputID];
        // If there is a variable in the input
        if (isString(input[1])) {
            const variableBlock = blocks[input[1]];
            if (!variableBlock) continue;
            // Store the block ID if the variable is a menu block
            if (variableBlock.opcode.includes("_menu_")) {
                menus[inputID] = input[1];
                // Find the menu block value
                const menuValue = variableBlock.fields["0"][0];
                args.set(inputID, menuValue);
            } else {
                // Set the variables dictionary accordingly
                variables[inputID] = [
                    3,
                    input[1],
                    input[2]
                ];
                args.set(inputID, { id: inputID, value: input[2][1] });
            }

        } else {
            // If the input is a value, push that value according to type
            const type = parseFloat(input[1][0]);
            switch (type) {
                case primitiveOpcodeInfoMap.math_whole_number.code:
                case primitiveOpcodeInfoMap.math_positive_number.code:
                case primitiveOpcodeInfoMap.math_integer.code:
                case primitiveOpcodeInfoMap.math_angle.code:
                case primitiveOpcodeInfoMap.colour_picker.code:
                case primitiveOpcodeInfoMap.math_positive_number.code:
                    args.set(inputID, { id: inputID, value: parseFloat(input[1][1]) });
                case primitiveOpcodeInfoMap.text.code:
                case primitiveOpcodeInfoMap.event_broadcast_menu.code:
                case primitiveOpcodeInfoMap.data_variable.code:
                case primitiveOpcodeInfoMap.data_listcontents.code:
                    args.set(inputID, { id: inputID, value: input[1][1] });
                default:
                    throw new Error("Unhandled input type");
            }
        }
    }

    return { inputs: args, variables: variables, menus: menus };
}


const gatherFields = ({ fields }: SerializedBlock) => {
    const args = new Map();
    if (!fields || Object.keys(fields).length <= 0)
        return args;

    for (const id in fields) {
        const field = fields[id];
        const { value } = field;
        // let argType = argList[(field as any).name].type;
        // Convert the value to its correct type
        // if (argType == "number" || argType == "angle") {
        //     value = parseFloat(value);
        // }
        args.set(id, { id, value })
    }

    return args;
}

/**
 * Helper function used to create a position mapping from one version to another as well as
 * assign each ArgEntry object a new ID
 * 
 * @param {ArgEntry[]} entries The updated entries to create the mapping from
 * @param {string[]} serializedIDs The original list of keys to be passed in
 * @return {ArgEntry[]} returns.newEntries - The ArgEntry objects with updated IDs
 * @return {object} returns.mappings - A dictionary with the position mappings
*/
const updateEntries = (entries: ArgEntry[], serializedIDs: string[]) => {
    const mappings: Map<string | number, string> = new Map();
    const newEntries = new Map<string, ArgEntry>();
    // Loop through the arg entries
    for (let i = 0; i < entries.length; i++) {
        const { id, value } = entries[i];
        const serialized = serializedIDs[i];

        if (id) mappings.set(id, serialized);

        // Update the new ArgEntry array with the new ID
        newEntries.set(serialized, { id: serialized, value });
    }
    return { newEntries, mappings };

}


/**
 * Mixin the ability for extensions to have their blocks 'versioned', 
 * so that projects serialized with past versions of blocks can be loaded.
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function (Ctor: BaseScratchExtensionConstuctor) {
    abstract class ExtensionWithConfigurableSupport extends Ctor {
        /**
         * Appends the version number to each opcode of block on project save
         * 
         * @param {Array} objTargets The obj.targets array from the Scratch project
         * @return {Array} An updated object.targets array with the new opcodes
        */
        alterOpcodes({ targets }: SerializedScratchData) {
            for (const object of targets) {
                for (const blockId in object.blocks) {
                    const { opcode } = object.blocks[blockId];
                    const extensionPrefix = opcode.split("_")[0];
                    const pureOpcode = opcode.replace(`${extensionPrefix}_`, "");
                    const versions = this.getVersions(pureOpcode);
                    const versionNumber = versions?.length ?? 0;
                    object.blocks[blockId].opcode = `${opcode}_v${versionNumber}`;
                }
            }
        }

        /**
         * A function that modifies a project JSON based on any updated
         * versioning implementations
         * 
         * @param {object} projectJSON The project JSON to be modified
         * @return {object} An updated project JSON compatible with the current version of the extension
        */
        alterJSON(projectJSON: SerializedScratchData) {
            // Collect the targets
            const serializedTargets = projectJSON.targets
                .map((t, i) => Object.assign(t, { targetPaneOrder: i }))
                .sort((a, b) => a.layerOrder - b.layerOrder);

            const newTargets = [];
            const selfInfo = this.getInfo();
            const { blocks: selfBlocks, id: selfID } = selfInfo;

            const blockInfoByOpcode = selfBlocks.reduce((acc, tempBlock: ExtensionBlockMetadata) => {
                acc[tempBlock.opcode] = tempBlock;
                return acc;
            }, {} as BlockInfoByOpcode);

            const nameMap = this.createNameMap(blockInfoByOpcode);

            for (const serializedTarget of serializedTargets) {
                const newBlocks = {};
                for (const blockId in serializedTarget.blocks) {
                    const serializedBlock = serializedTarget.blocks[blockId];
                    const version = getVersionForBlockAndRemoveFromOpcode(serializedBlock);
                    const extensionID = getExtensionIdForBlock(serializedBlock);
                    const blockBelongsToSelf = extensionID === selfID;

                    if (blockBelongsToSelf && !serializedBlock.opcode.includes("_menu_")) {
                        const serializedOpcode = serializedBlock.opcode.replace(`${extensionID}_`, "");
                        const upgradedOpcode = nameMap.get(version)?.get(serializedOpcode) ?? serializedOpcode;

                        serializedBlock.opcode = serializedBlock.opcode.replace(serializedOpcode, upgradedOpcode);
                        const versions = this.getVersions(upgradedOpcode);

                        const latestBlockInfo = blockInfoByOpcode[upgradedOpcode];

                        const versioningRequired = versions && version < versions.length;
                        if (!versioningRequired) continue;

                        let { inputs, variables, menus } = gatherInputs(serializedBlock, serializedTarget);
                        let fields = gatherFields(serializedBlock);
                        let allArgs = merge(inputs, fields);
                        const newInputs = {};
                        const newFields = {};

                        for (const { transform } of versions) {
                            if (!transform) continue;

                            const serializedArgIDs: string[] = Array.from(allArgs.keys());
                            const mechanism: VersionArgTransformMechanism = {
                                arg: (identifier: ArgIdentifier) => allArgs.get(String(identifier)),
                                args: () => Array.from(allArgs.values()),
                            }
                            const entries = transform(mechanism);
                            const { newEntries, mappings } = updateEntries(entries, serializedArgIDs);

                            allArgs = newEntries;

                            // Change the menu block value if applicable
                            for (const key of Object.keys(menus)) {
                                if (!mappings.has(key)) continue;
                                const { value } = newEntries.get(mappings.get(key));
                                serializedTarget.blocks[menus[key]].fields["0"][0] = value;
                            }

                            menus = this.updateDictionary(menus, mappings);
                            variables = this.updateDictionary(variables, mappings);
                        }

                        const latestBlockArgs = getBlockArgumentsWithoutImageEntries(latestBlockInfo);

                        // Re-create the project JSON inputs/fields with the new values
                        for (let i = 0; i < Object.keys(latestBlockArgs).length; i++) {
                            const argID = Object.keys(latestBlockArgs)[i];

                            // If there's a menu block in the argIndex position
                            if (Object.keys(menus).includes(argID)) {
                                newInputs[argID] = [1, menus[argID]];
                            }
                            // If there's a variable in the argIndex position
                            else if (Object.keys(variables).includes(argID)) {
                                newInputs[argID] = variables[argID];
                            }
                            // If we need to place the value in a field
                            else if (latestBlockArgs[argID].menu) {
                                let fieldValue = allArgs.get(argID).value;
                                if (typeof fieldValue == "number") {
                                    fieldValue = String(fieldValue);
                                }
                                newFields[argID] = {
                                    name: String(argID),
                                    value: fieldValue,
                                    id: null
                                }
                            }
                            // If we need to place the value in an input
                            else {
                                const typeNum = this.getType(latestBlockArgs[argID].type);
                                newInputs[argID] = [
                                    1, [
                                        typeNum,
                                        String(allArgs.get(argID).value)
                                    ]
                                ]
                            }
                        }

                        // Re-assign fields and inputs
                        serializedBlock.inputs = newInputs;
                        serializedBlock.fields = newFields;

                        let originalType = blockInfoByOpcode[upgradedOpcode].blockType;
                        let first = true;
                        // Apply each version modification as needed
                        for (let i = version; i < versions.length; i++) {
                            const { previousType } = version[i];
                            if (previousType) {
                                if (first) {
                                    originalType = versions[i].previousType;
                                    first = false;
                                }
                            }
                        }


                        // If we need to move the information to a 'say' block, since 
                        // we need to keep it connected to the previous/next blocks
                        if (originalType != blockInfoByOpcode[upgradedOpcode].blockType) {
                            if ((originalType == "command" || originalType == "hat") && blockInfoByOpcode[upgradedOpcode].blockType == "reporter") { // square to circle
                                const oldID = blockId;
                                const next = serializedBlock.next;
                                // Re-assign the ID of the current block
                                serializedBlock.id = uid();
                                // Create the new block
                                const newBlock = Object.create(null);
                                newBlock.id = oldID;
                                newBlock.parent = serializedBlock.parent;
                                serializedBlock.parent = newBlock.id;
                                newBlock.fields = {};
                                // Input should be the reporter block variable
                                newBlock.inputs = {
                                    MESSAGE: [
                                        3,
                                        serializedBlock.id,
                                        [
                                            10,
                                            "Hello"
                                        ]
                                    ]
                                }
                                newBlock.next = next;
                                serializedBlock.next = null;
                                newBlock.opcode = "looks_say";
                                newBlock.shadow = false;

                                // Since we changed the block ID, we need to update the 
                                // block's input blocks to match
                                for (const key of Object.keys(serializedBlock.inputs)) {
                                    if (serializedBlock.inputs[key].block) {
                                        let inputBlock = serializedBlock.inputs[key].block;
                                        if (serializedTarget.blocks[inputBlock]) {
                                            serializedTarget.blocks[inputBlock].parent = serializedBlock.id;
                                            serializedBlock.inputs[key].shadow = serializedBlock.inputs[key].block;
                                        }

                                    }
                                }
                                // Set the blocks in the JSON
                                newBlocks[serializedBlock.id] = serializedBlock;
                                newBlocks[newBlock.id] = newBlock;
                            }
                            // If we need to create a command from a reporter
                            else if (originalType == "reporter" && (blockInfoByOpcode[upgradedOpcode].blockType == "command" || blockInfoByOpcode[upgradedOpcode].blockType == "button" || blockInfoByOpcode[upgradedOpcode].blockType == "hat")) { // reporter to command) { // circle to square
                                // If the previous reporter block has a parent
                                if (serializedTarget.blocks[serializedBlock.parent]) {
                                    const parentBlock = serializedTarget.blocks[serializedBlock.parent];
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
                                    if (blockInfoByOpcode[upgradedOpcode].blockType == "command") {
                                        serializedBlock.parent = null;
                                        serializedBlock.topLevel = true;
                                    }

                                }
                            } else if ((originalType == "command") && (blockInfoByOpcode[upgradedOpcode].blockType == "hat")) {
                                if (serializedTarget.blocks[serializedBlock.parent]) {
                                    const oldId = serializedBlock.parent;
                                    const parentBlock = serializedTarget.blocks[serializedBlock.parent];
                                    parentBlock.next = null;
                                    serializedBlock.parent = null;
                                    serializedBlock.topLevel = true;
                                    newBlocks[blockId] = serializedBlock;
                                    newBlocks[oldId] = parentBlock;
                                }
                            }
                        }
                    }
                    // Set the blocks dictionary
                    if (!Object.keys(newBlocks).includes(blockId)) {
                        newBlocks[blockId] = serializedBlock;
                    }
                }
                // Update the target with the new blocks
                serializedTarget.blocks = newBlocks;
                newTargets.push(serializedTarget);
            }
            // Update the project JSON with the new target
            projectJSON.targets = newTargets;
            return projectJSON;
        }

        /**
         * This function creates a dictionary with the opcode associated with each block
         * at each version, so that if an opcode changes during a version, we'll be able
         * to find the correct block.
         * 
         * @param {object} blockInfo A dictionary with the information of each block from the extension
         * @return {object} The dictionary with each block's opcode at each version
        */
        createNameMap(blocksInfo: BlockInfoByOpcode) {
            const versionMap = new Map<number, Map<string, string>>();
            for (const opcode of Object.keys(blocksInfo)) {
                const versions = this.getVersions(opcode);
                if (!versions || versions.length === 0) continue;

                let tempName = opcode;
                for (let index = versions.length - 1; index >= 0; index--) {
                    const version = versions[index];
                    if (!versionMap.has(index)) versionMap.set(index, new Map());
                    tempName = version.previousName ?? tempName;
                    if (tempName !== opcode) versionMap.get(index).set(tempName, opcode);
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
         * Gather the values from the 'fields' property of a block
         * 
         * @param {object} blockJSON The block to gather the inputs from
         * @return {ArgEntry[]} An array of ArgEntry objects representing each field
         */
        gatherFields(blockJSON: any): any {
            const args = new Map();
            // Loop through each field
            if (blockJSON.fields && Object.keys(blockJSON.fields).length > 0) {
                Object.keys(blockJSON.fields).forEach(field => {
                    const keyIndex = field;
                    field = blockJSON.fields[field];
                    // Collect the field's value
                    let value = (field as any).value;
                    // let argType = argList[(field as any).name].type;
                    // Convert the value to its correct type
                    // if (argType == "number" || argType == "angle") {
                    //     value = parseFloat(value);
                    // }
                    args.set(keyIndex, { id: keyIndex, value: value })
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
                        switch (argInfo[key].type) {
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