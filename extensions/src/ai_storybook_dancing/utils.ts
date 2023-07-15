import { BlockUtilityWithID } from "$common";
import AiStorybookDancing from ".";
import { fixHatImage, fixInlineImages } from "./layout";
import { DanceMove, requestDanceMove, untilMessageReceived } from "./messaging";

export function getHatChildren(hatBlockID: string, { thread: { blockContainer } }: BlockUtilityWithID) {
    let children = [];
    let previous = hatBlockID;
    while ((previous = blockContainer.getNextBlock(previous))) {
        children.push(previous);
        if (previous === getID("repeat")) {
            let child = blockContainer.getBranch(previous, 1);
            if (!child) continue;
            do children.push(child);
            while ((child = blockContainer.getNextBlock(child)));
        }
    }
    return children;
}

const idByBlock = new Map<keyof AiStorybookDancing, string>();
export const setID = (block: keyof AiStorybookDancing, { blockID }: Pick<BlockUtilityWithID, "blockID">) => idByBlock.set(block, blockID);
export const getID = (block: keyof AiStorybookDancing) => idByBlock.get(block);

export const dance = async (move: DanceMove) => {
    requestDanceMove(move);
    await untilMessageReceived(`end ${move}`);
}

let isSetup = false;
export function setup() {
    if (isSetup) return;
    fixInlineImages();
    fixHatImage(getID("entry"));
    isSetup = true;
}

export function isHatChildEmptyLoop(
    { id }: AiStorybookDancing,
    { thread: { blockContainer } }: BlockUtilityWithID,
    children: ReturnType<typeof getHatChildren>
) {
    const blockKey: keyof AiStorybookDancing = "repeat";
    const { _blocks: blocks } = blockContainer;
    const loopID = getID(blockKey)
        ?? Object.entries(blocks).find(([_, { opcode }]) => opcode === `${id}_${blockKey}`)[0];
    setID(blockKey, { blockID: loopID });
    return children.length === 1 && children[0] === loopID && !blockContainer.getBranch(loopID, 1);
}