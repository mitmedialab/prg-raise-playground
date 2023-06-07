import { Environment, ExtensionMenuDisplayDetails, extension, block, SaveDataHandler, RuntimeEvent, ArgumentType, } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { hideNonBlocklyElements, stretchWorkspaceToScreen } from "./layout";
import { announce, requestDanceMove, untilMessageReceived, type DanceMove } from "./messaging";
import hop from "./inlineImages/hop.png";
import stepLeft from "./inlineImages/left.png";
import stepRight from "./inlineImages/right.png";
import spinLeft from "./inlineImages/spin-left.png"; // TODO: Change to a generic spin image?
import spinRight from "./inlineImages/spin-right.png";

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
    workspace.zoom(0, 0, 3.5);
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
    text: (spinLeft) => `${spinLeft}`,
    arg: {
      type: "image",
      uri: spinLeft,
      alt: "Spin left"
    },
    type: "command"
  })
  async spinLeft(spinLeft: "inline image") {
    await dance("spin left");
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
  async spinRight(spinRight: "inline image") {
    await dance("spin right");
  }

  // @block({
  //   text: (spin, direction: 'left' | 'right') => `${spin} ${direction}`,
  //   type: "command",
  //   args: [{
  //     type: "image",
  //     uri: spin,
  //     alt: "Spin"
  //   },
  //   {
  //     type: "custom",
  //     options:
  //       [{ text: "↩️↻↷↻⤾⥁", value: "left" }, // TODO: Find better symbols for spinning
  //       { text: "↪️↺↶↺⤿⥀", value: "right" }]
  //   }],
  // })
  // async spin(spin: "inline image", direction: 'left' | 'right') {
  //   await dance(`spin ${direction}`);
  // }

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