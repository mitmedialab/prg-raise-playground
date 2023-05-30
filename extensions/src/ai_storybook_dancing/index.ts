import { Environment, ExtensionMenuDisplayDetails, extension, block, } from "$common";
import { hideNonBlocklyElements, stretchWorkspaceToScreen } from "./layout";

const details: ExtensionMenuDisplayDetails = { name: "Dancing Activity for AI Storybook" };

const setUpMessagePassing = () => {
  window.onmessage = function (e) {
    console.log(e)
  };
}

export default class ExtensionNameGoesHere extends extension(details, "blockly") {
  async init(env: Environment) {
    hideNonBlocklyElements();
    stretchWorkspaceToScreen();
    setUpMessagePassing();
  }

  @block({
    text: "dummy",
    type: "command"
  })
  dummy() {

  }
}