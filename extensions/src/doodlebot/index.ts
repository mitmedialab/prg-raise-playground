import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { Anim, anims } from "./enums";
import Doodlebot from "./Doodlebot";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

export default class DoodlebotBlocks extends extension(details, "indicators") {

  private doodlebot: Doodlebot;

  init(env: Environment) {
  }

  async connectToBLE() {
    console.log("Getting BLE device");
    const { bluetooth } = window.navigator;
    if (!bluetooth) return alert("Your browser does not allow / support bluetooth.");
    try {
      const namePrefix = "Bluefruit52"; /* "Saira" "BBC micro:bit"; TODO: might delete? */
      this.doodlebot = await Doodlebot.tryCreate("", "", bluetooth, { namePrefix });
      await this.indicateFor({ position: "category", msg: "Connected to robot" }, 1000);
    } catch (err) { DoodlebotBlocks.ProcessConnectionError(err); }
  }

  @buttonBlock("Test Robot")
  test() {

  }

  @buttonBlock("Connect Robot")
  connect() {
    this.connectToBLE();
  }

  @block({
    type: "command",
    text: (anim) => `play ${anim} animation`,
    arg: {
      type: "string",
      options: anims,
      defaultValue: "happy"
    }
  })
  playAnimation(anim: Anim) {

  }

  @block({
    type: "command",
    text: (text) => `display text ${text}`,
    arg: {
      type: "string",
      defaultValue: "Hello!"
    }
  })
  displayText(text: string) {

  }

  @block({
    type: "command",
    text: "clear display"
  })
  clearDisplay() {

  }

  private static ProcessConnectionError(err: Error) {
    console.error(err);
    if (err.message == "Bluetooth adapter not available.")
      alert("Your device does not support BLE connections.");
    if (err.message == "User cancelled the requestDevice() chooser.")
      alert("You must select a device to connect to. Please try again.");
    else if (err.message !== "User cancelled the requestDevice() chooser.")
      alert("There was a problem connecting your device, please try again or request assistance.");
  }
}