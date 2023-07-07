import { Environment, ExtensionMenuDisplayDetails, extension, block, SaveDataHandler, RuntimeEvent, ArgumentType, BlockUtilityWithID } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { hideNonBlocklyElements, stretchWorkspaceToScreen, fixInlineImages, fixHatImage, highlight } from "./layout";
import { announce, requestDanceMove, requestMusic, untilMessageReceived, type DanceMove, type MusicState } from "./messaging";
import hop from "./inlineImages/hop.png";
import stepLeft from "./inlineImages/left.png";
import stepRight from "./inlineImages/right.png";
import spinLeft from "./inlineImages/spin-left.png";
import spinRight from "./inlineImages/spin-right.png";
import start from "./inlineImages/start.png";

const details: ExtensionMenuDisplayDetails = {
  name: "Dancing Activity for AI Storybook",
  noBlockIcon: true,
  blockColor: "#faa302",
  menuSelectColor: "#d99c57"
};

let musicPlaying = false;
let hatShouldExecute = false;
let overrideHatShouldExecute = false;
let executionStateChange = false;

const idByBlock = new Map<keyof AiStorybookDancing, string>();
const setID = (block: keyof AiStorybookDancing, { blockID }: BlockUtilityWithID) => idByBlock.set(block, blockID);
const getID = (block: keyof AiStorybookDancing) => idByBlock.get(block);

const dance = async (move: DanceMove) => {
  requestDanceMove(move);
  await untilMessageReceived(`end ${move}`);
}

async function blockSequence(move: DanceMove, { thread: { topBlock, blockContainer }, blockID }: BlockUtilityWithID) {
  if (topBlock != getID("entry")) return;
  const isFirtSibling = blockContainer.getNextBlock(topBlock) === blockID;
  if (!hatShouldExecute && !isFirtSibling) return;
  else if (!hatShouldExecute) overrideHatShouldExecute = true;
  const unhighlight = highlight(blockID);
  await dance(move);
  unhighlight();
  if (!hatShouldExecute) executionStateChange = true;
}

let executed = false;
function setup() {
  if (executed) return;
  fixInlineImages();
  fixHatImage(getID("entry"));
  executed = true;
}

function getHatChildren(hatBlockID: string, { thread: { blockContainer } }: BlockUtility) {
  let previous = hatBlockID;
  let children = [];
  while ((previous = blockContainer.getNextBlock(previous))) children.push(previous);
  return children;
}

function music(doPlay: boolean) {
  if (doPlay && !musicPlaying && !executionStateChange) {
    musicPlaying = true;
    requestMusic("on");
  }
  else if (!doPlay && musicPlaying) {
    musicPlaying = false;
    requestMusic("off");
  }
  executionStateChange = false;
}

export default class AiStorybookDancing extends extension(details, "blockly", "customSaveData") {
  private previousHatChildren: string;

  async init(env: Environment) {
    hideNonBlocklyElements();
    stretchWorkspaceToScreen();
    const workspace = this.blockly.getMainWorkspace();
    workspace.zoom(0, 0, 3.5);
    announce("ready");
  }

  @block({
    text: (hop) => `${hop}`,
    arg: {
      type: "image",
      uri: hop,
      alt: "Hop"
    },
    type: "command"
  })
  async hop(hop: "inline image", util: BlockUtilityWithID) {
    setID("hop", util);
    await blockSequence("hop", util);
  }

  @block({
    text: (stepLeft) => `${stepLeft}`,
    arg: {
      type: "image",
      uri: stepLeft,
      alt: "Step left"
    },
    type: "command"
  })
  async stepLeft(stepLeft: "inline image", util: BlockUtilityWithID) {
    setID("stepLeft", util);
    await blockSequence("swivel left", util);
  }

  @block({
    text: (stepRight) => `${stepRight}`,
    arg: {
      type: "image",
      uri: stepRight,
      alt: "Step right"
    },
    type: "command"
  })
  async stepRight(stepRight: "inline image", util: BlockUtilityWithID) {
    setID("stepRight", util);
    await blockSequence("swivel right", util);
  }

  @block({
    text: (spinLeft) => `${spinLeft}`,
    arg: {
      type: "image",
      uri: spinLeft,
      alt: "Spin left"
    },
    type: "command"
  })
  async spinLeft(spinLeft: "inline image", util: BlockUtilityWithID) {
    setID("spinLeft", util);
    await blockSequence("spin left", util);
  }

  @block({
    text: (spinRight) => `${spinRight}`,
    arg: {
      type: "image",
      uri: spinRight,
      alt: "Spin right"
    },
    type: "command"
  })
  async spinRight(spinRight: "inline image", util: BlockUtilityWithID) {
    setID("spinRight", util);
    await blockSequence("spin right", util);
  }


  @block({
    text: (image) => `${image}`, // Maybe add a symbol in the future?
    type: "hat",
    arg: {
      type: "image",
      uri: start,
      alt: "Start icon"
    }
  })
  entry(image: "inline image", util: BlockUtilityWithID) {
    setID("entry", util);
    setup();
    const children = getHatChildren(getID("entry"), util);
    const serialized = JSON.stringify(children);
    hatShouldExecute = overrideHatShouldExecute || (children.length > 0 && this.previousHatChildren !== serialized);
    this.previousHatChildren = serialized;
    hatShouldExecute ? music(true) : music(false);
    overrideHatShouldExecute = false;
    return hatShouldExecute;
  }
}