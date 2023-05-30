import { Environment, ExtensionMenuDisplayDetails, extension, block, } from "$common";
import { hideNonBlocklyElements, stretchWorkspaceToScreen } from "./layout";

const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};


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