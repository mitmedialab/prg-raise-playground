import { Environment, ExtensionMenuDisplayDetails, extension, block, SaveDataHandler, RuntimeEvent, ArgumentType } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { hideNonBlocklyElements, stretchWorkspaceToScreen, fixInlineImages, fixHatImage, populateSVGElements, highlight } from "./layout";
import { announce, requestDanceMove, requestMusic, untilMessageReceived, type DanceMove, type MusicState } from "./messaging";
import hop from "./inlineImages/hop.png";
import stepLeft from "./inlineImages/left.png";
import stepRight from "./inlineImages/right.png";
import spinLeft from "./inlineImages/spin-left.png";
import spinRight from "./inlineImages/spin-right.png";
import start from "./inlineImages/start.png";
import BlockIDs from "./BlockIDs";

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

const blockByDanceMove = {
  "hop": "hop",
  "swivel left": "stepLeft",
  "swivel right": "stepRight",
  "spin left": "spinLeft",
  "spin right": "spinRight"
} satisfies Record<DanceMove, keyof AiStorybookDancing>;

const dance = async (move: DanceMove) => {
  requestDanceMove(move);
  await untilMessageReceived(`end ${move}`);
}

async function blockSequence(move: DanceMove, blockIDs: BlockIDs, util: BlockUtility) {
  const { topBlock, blockContainer } = util.thread;
  if (topBlock != blockIDs.get("entry")) return;
  const block = blockByDanceMove[move];
  const isFirtSibling = blockContainer.getNextBlock(topBlock) === blockIDs.get(block);
  if (!hatShouldExecute && !isFirtSibling) return;
  else if (!hatShouldExecute) overrideHatShouldExecute = true;
  const unhighlight = highlight(block, blockIDs);
  await dance(move);
  unhighlight();
  if (!hatShouldExecute) executionStateChange = true;
}

function onFirstExecution(blockIDs: BlockIDs) {
  fixInlineImages();
  fixHatImage(blockIDs.get("entry"));
  populateSVGElements(blockIDs);
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
  private blockIDs: BlockIDs;
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
  async hop(hop: "inline image", util: BlockUtility) {
    await blockSequence("hop", this.blockIDs, util);
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
  async stepLeft(stepLeft: "inline image", util: BlockUtility) {
    await blockSequence("swivel left", this.blockIDs, util);
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
  async stepRight(stepRight: "inline image", util: BlockUtility) {
    await blockSequence("swivel right", this.blockIDs, util);
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
  async spinLeft(spinLeft: "inline image", util: BlockUtility) {
    await blockSequence("spin left", this.blockIDs, util);
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
  async spinRight(spinRight: "inline image", util: BlockUtility) {
    await blockSequence("spin right", this.blockIDs, util);
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
  entry(image: "inline image", util: BlockUtility) {
    if (!this.blockIDs) {
      this.blockIDs = new BlockIDs(this, util);
      onFirstExecution(this.blockIDs);
    }
    const children = getHatChildren(this.blockIDs.get("entry"), util);
    const serialized = JSON.stringify(children);
    hatShouldExecute = overrideHatShouldExecute || (children.length > 0 && this.previousHatChildren !== serialized);
    this.previousHatChildren = serialized;
    hatShouldExecute ? music(true) : music(false);
    overrideHatShouldExecute = false;
    return hatShouldExecute;
  }
}