import { ExtensionInstance } from "$common/extension";
import { BlockMetadata, BlockOperation, Expand } from "$common/types";
import { isString, } from "$common/utils";
import { ExtensionInstanceWithFunctionality } from "../..";
import blockly, { type BlockSvg } from "../blockly";

export type ExtensionID = string;
export type BlockOpcode = string;
export type SupportedExtension = ExtensionInstanceWithFunctionality<["customReportValue"]>;
export type SupportedBlock = BlockMetadata<() => unknown, SupportedExtension>;
export type ComponentConstructor = SupportedBlock["reportValueUI"];

export const blockHasCustomReportValueUI = (metadata: BlockMetadata<BlockOperation, ExtensionInstance | SupportedExtension>): metadata is SupportedBlock => {
    const { reportValueUI: customReportValueUI } = metadata;
    return Boolean(customReportValueUI) && !isString(customReportValueUI);
}

export type BlocklyLibrary = Expand<InstanceType<ReturnType<typeof blockly>>["blockly"]>;
export type Block = Expand<ReturnType<ReturnType<BlocklyLibrary["getMainWorkspace"]>["getBlockById"]>>;

export const getIdentifiersFromBlock = ({ type }: Block): [extensionID: ExtensionID, blockOpcode: BlockOpcode] =>
    type.split("_") as [ExtensionID, BlockOpcode];

// Helpful pieces of scratch-blocks code:
// reportValue: https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/dropdowndiv.js#L186
// showPositionedByBlock: https://github.com/scratchfoundation/scratch-blocks/blob/develop/core/dropdowndiv.js#L186