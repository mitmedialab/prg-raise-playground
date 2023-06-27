import BlockUtility from "$scratch-vm/engine/block-utility";
import AiStorybookDancing from ".";

export default class {
    private idByBlock = new Map<keyof AiStorybookDancing, string>();
    private blockByID = new Map<string, keyof AiStorybookDancing>();
    private svgElements = new Map<keyof AiStorybookDancing, SVGPathElement>();

    constructor({ id }: AiStorybookDancing, { thread: { blockContainer: { _blocks } } }: BlockUtility) {
        for (const blockID in _blocks) {
            const { opcode } = _blocks[blockID]
            const block = (opcode as string).replace(`${id}_`, "") as keyof AiStorybookDancing;
            this.idByBlock.set(block, blockID);
            this.blockByID.set(blockID, block);
        }
    }

    get(block: keyof AiStorybookDancing) {
        return this.idByBlock.get(block);
    }

    setElement(id: string, element: SVGElement) {
        const block = this.blockByID.get(id);
        if (!block) return;
        this.svgElements.set(block, element.getElementsByTagName("path")[0]);
    }

    getElement(block: keyof AiStorybookDancing) {
        console.log(this.idByBlock.get(block));
        console.log(this.svgElements);
        return this.svgElements.get(block);
    }
}