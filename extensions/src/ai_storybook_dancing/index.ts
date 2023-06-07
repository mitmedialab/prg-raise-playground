import { Environment, ExtensionMenuDisplayDetails, extension, block, SaveDataHandler, RuntimeEvent, ArgumentType, } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { hideNonBlocklyElements, stretchWorkspaceToScreen } from "./layout";
import { announce, requestDanceMove, untilMessageReceived, type DanceMove } from "./messaging";
import hop from "./inlineImages/hop.png";
import stepLeft from "./inlineImages/left.png";
import stepRight from "./inlineImages/right.png";
import spin from "./inlineImages/spin-left.png"; // TODO: Change to a generic spin image

const details: ExtensionMenuDisplayDetails = { name: "Dancing Activity for AI Storybook" };

const dance = async (move: DanceMove) => {
  requestDanceMove(move);
  await untilMessageReceived(`end ${move}`);
}

let flipFlopper = false;

export default class AiStorybookDancing extends extension(details, "blockly", "customSaveData") {
  
  async init(env: Environment) {
    hideNonBlocklyElements();
    stretchWorkspaceToScreen();

    const workspace = this.blockly.getMainWorkspace();
    // workspace.options.zoomOptions.startScale = 1.2;

    // const w = this.blockly.Mutator.prototype.getWorkspace();
    // console.log(w);
    // const rect = w.zoomControls_.getBoundingRectangle();
    // w.zoom(50, 50, 3);

    // workspace.options.zoomOptions.minScale = 1.2;
    // workspace.options.zoomOptions.maxScale = 1.2;

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

  protected override saveDataHandler = new SaveDataHandler({
    Extension: AiStorybookDancing,
    onSave: () => ({ hackToLoadExtensionEvenIfNoBlocksInProject: true }),
    onLoad: () => { },
  });

  @block({
    text: (hop) => `${hop}`,
    arg: {
      type: "image",
      uri: hop,
      alt: "Hop"
    },
    type: "command"
  })
  async hop(hop: "inline image") {
    await dance("hop");
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
  async stepLeft(stepLeft: "inline image") {
    await dance("swivel left");
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
  async stepRight(stepRight: "inline image") {
    await dance("swivel right");
  }

  @block({
    text: (spin, direction: 'left' | 'right') => `${spin} ${direction}`,
    type: "command",
    args: [{
      type: "image",
      uri: spin,
      alt: "Spin"
    },
    {
      type: "custom",
      options:
        [{ text: "↻", value: "left" }, // TODO: Find better symbols for spinning
        { text: "↺", value: "right" }]
    }],
  })
  async spin(spin: "inline image", direction: 'left' | 'right') {
    await dance(`spin ${direction}`);
  }

  @block({
    text: "Tell doodlebot to dance",
    type: "hat"
  })
  entry(util: BlockUtility) {

    // Todo: use `util` to identify if there are any scripts attached to this block.
    // If so: (and the music isn't already playing) start the music
    // If not: (and the music is playing) stop the music

    return this.runContinuously;
  }
}