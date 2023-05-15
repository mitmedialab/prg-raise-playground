import { Environment, ExtensionMenuDisplayDetails, extension, block, hideElementsOfClass, } from "$common";

const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

export default class ExtensionNameGoesHere extends extension(details, "blockly") {
  async init(env: Environment) {

    [
      "gui_menu-bar-position_3U1T0",
      "gui_stage-and-target-wrapper_69KBf",
      "react-tabs_react-tabs__tab-list_17Wee",
      "backpack_backpack-container_2_wGr",
      "blocklyToolboxDiv",
      "gui_extension-button-container_b4rCs"
    ].forEach(hideElementsOfClass);

    this.blockly.hideChaff();
  }

  @block({
    text: "dummy",
    type: "command"
  })
  dummy() {

  }
}