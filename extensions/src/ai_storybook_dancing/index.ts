import { Environment, ExtensionMenuDisplayDetails, extension, block, SaveDataHandler, RuntimeEvent, ArgumentType} from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { hideNonBlocklyElements, stretchWorkspaceToScreen } from "./layout";
import { announce, requestDanceMove, requestMusic, untilMessageReceived, type DanceMove, type MusicState } from "./messaging";
import hop from "./inlineImages/hop.png";
import stepLeft from "./inlineImages/left.png";
import stepRight from "./inlineImages/right.png";
import spinLeft from "./inlineImages/spin-left.png";
import spinRight from "./inlineImages/spin-right.png";
import { convertToArgumentInfo } from "$common/extension/mixins/required/scratchInfo/args";

const details: ExtensionMenuDisplayDetails = { name: "Dancing Activity for AI Storybook", noBlockIcon: true };

let flipFlopper = false;
let musicPlayingLoop = false;
let musicPlayingSingle = false;

const dance = async (move: DanceMove) => {
  requestDanceMove(move);
  await untilMessageReceived(`end ${move}`);
}

async function blockSequence(move: DanceMove, util: BlockUtility) {

  const currentBlockID = util.thread.stack[0];

  if (!musicPlayingLoop && !musicPlayingSingle) {
    requestMusic("on");
    musicPlayingSingle = true;
  }

  await dance(move);
  
  if (musicPlayingSingle && !util.thread.blockContainer.getNextBlock(currentBlockID)) {
    requestMusic("off");
    musicPlayingSingle = false;
  }
}

// function 


export default class AiStorybookDancing extends extension(details, "blockly", "customSaveData") {

  async init(env: Environment) {
    hideNonBlocklyElements();
    stretchWorkspaceToScreen();
    const workspace = this.blockly.getMainWorkspace();
    workspace.zoom(0, 0, 3.5);
    // let domElt = this.blockly.Xml.workspaceToDom(workspace);
    // this.blockly.Css.inject
    
    this.runtime.on(RuntimeEvent.ProjectLoaded, whenProjectLoads);
    announce("ready");
  }

  /**
   * As noted in the extension documentation: 
   * "[A hat] starts a stack if its value changes from falsy to truthy ('edge triggered')"
   * so this property continuously flips between true and false to trigger a hat block continuously.
   */
  get runContinuously() {
    flipFlopper = !flipFlopper;
    return flipFlopper;
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
    console.log(document.querySelectorAll(".blocklyDraggable g image"));
    // await blockSequence("hop", util);
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
  async stepRight(stepRight: "inline image", util: BlockUtility) {
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
  async spinLeft(spinLeft: "inline image", util: BlockUtility) {
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
  async spinRight(spinRight: "inline image", util: BlockUtility) {
    await blockSequence("spin right", util);
  }


  @block({
    text: " ", // Maybe add a symbol in the future?
    type: "hat"
  })
  entry(util: BlockUtility) {

    const hatID = util.thread.topBlock;
    const hasChildren = !!util.thread.blockContainer.getNextBlock(hatID);

    if (hasChildren && !musicPlayingLoop) {
      requestMusic("on");
    }
    else if (!hasChildren && musicPlayingLoop) {
      requestMusic("off");
    }
    musicPlayingLoop = hasChildren;

    return this.runContinuously;
  }
}