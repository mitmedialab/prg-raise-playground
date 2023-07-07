import { BlockUtilityWithID } from "$common";
import AiStorybookDancing from ".";
import { fixHatImage, fixInlineImages } from "./layout";
import { DanceMove, requestDanceMove, untilMessageReceived } from "./messaging";

export function getHatChildren(hatBlockID: string, { thread: { blockContainer } }: BlockUtilityWithID) {
    let children = [];
    let previous = hatBlockID;
    while ((previous = blockContainer.getNextBlock(previous))) children.push(previous);
    return children;
}

const idByBlock = new Map<keyof AiStorybookDancing, string>();
export const setID = (block: keyof AiStorybookDancing, { blockID }: BlockUtilityWithID) => idByBlock.set(block, blockID);
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
