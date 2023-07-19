import { BlockMetadata, BlockOperation, } from "$common/types";
import { MinimalExtensionConstructor } from "../../base";
import { withDependencies } from "../../dependencies";
import blockly from "../blockly";
import { BlockOpcode, BlocklyLibrary, ExtensionID, SupportedBlock, SupportedExtension, blockHasCustomReportValueUI, getIdentifiersFromBlock } from "./utils";

const componentMap = new Map<ExtensionID, Map<BlockOpcode, SupportedBlock["reportValueUI"]>>();
const extensionByID = new Map<ExtensionID, SupportedExtension>();

let reportValueOverriden = false;
const overrideReportValue = (blockly: BlocklyLibrary) => {
    if (reportValueOverriden) return;
    const workspace = blockly.getMainWorkspace();
    const reportValue = workspace.reportValue.bind(workspace);

    workspace.reportValue = (blockID: string, serializedValue: string) => {
        const block = workspace.getBlockById(blockID);
        if (!block) throw 'Tried to report value on block that does not exist.';
        const [extensionID, blockOpcode] = getIdentifiersFromBlock(block);
        const Component = componentMap.get(extensionID)?.get(blockOpcode);
        if (!Component) return reportValue(blockID, serializedValue);
        reportValue(blockID, "");
        const element = document.getElementsByClassName("valueReportBox")[0] as HTMLDivElement;
        new Component({ target: element, props: { value: 0 as any, extension: extensionByID.get(extensionID) } });
    }
}

const collectReportValueUIs = (extensionID: ExtensionID, opcode: BlockOpcode, metadata: BlockMetadata<BlockOperation>) => {
    if (!blockHasCustomReportValueUI(metadata)) return metadata;
    if (!extensionByID.has(extensionID)) extensionByID.set(extensionID, this);
    if (!componentMap.has(extensionID)) componentMap.set(extensionID, new Map());
    const { reportValueUI } = metadata;
    componentMap.get(extensionID).set(opcode, reportValueUI);
    return metadata;
}

/**
 * Mixin the ability for extensions to...
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
    abstract class ExtensionWithCustomReportValueSupport extends withDependencies(Ctor, blockly) {
        constructor(...args: any[]) {
            super(...args);
            overrideReportValue(this.blockly);
            this.addModifier("block", collectReportValueUIs.bind(null, this.id));
        }
    }

    return ExtensionWithCustomReportValueSupport;
}
