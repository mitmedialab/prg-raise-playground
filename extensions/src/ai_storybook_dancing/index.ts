import { Environment, extension, block, hideElementsWithClass, } from "$common";

export default class ExtensionNameGoesHere extends extension(
  { name: "Dancing Activity for AI Storybook" },
  "blockly"
) {
  async init(env: Environment) {
    [
      "gui_menu-bar-position_3U1T0",
      "gui_stage-and-target-wrapper_69KBf",
      "react-tabs_react-tabs__tab-list_17Wee",
      "backpack_backpack-container_2_wGr",
      "blocklyToolboxDiv",
      "gui_extension-button-container_b4rCs"
    ].forEach(hideElementsWithClass);

    this.blockly.hideChaff();
  }



  @block({
    text: "dummy",
    type: "command"
  })
  dummy() {

  }
}