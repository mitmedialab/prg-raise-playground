import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { Anim, anims } from "./enums";
import Doodlebot from "./Doodlebot";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

export default class DoodlebotBlocks extends extension(details, "ui", "indicators") {
  doodlebot: Doodlebot;
  private indicator: Promise<{ close(): void; }>

  init(env: Environment) {
    this.openUI("Connect");
    this.setIndicator("disconnected");
  }

  setDoodlebot(doodlebot: Doodlebot) {
    this.doodlebot = doodlebot;
    this.setIndicator("connected");
  }

  async setIndicator(status: "connected" | "disconnected") {
    if (this.indicator) (await this.indicator).close;
    this.indicator = status == "connected"
      ? this.indicate({ position: "category", msg: "Connected to robot", type: "success" })
      : this.indicate({ position: "category", msg: "Not connected to robot", type: "warning" });
  }

  @buttonBlock("Connect Robot")
  connect() {
    this.openUI("Connect");
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
  async clearDisplay() {
    await this.doodlebot?.display("clear");
  }


  @block({
    type: "command",
    text: (direction, steps) => `drive ${direction} for ${steps} steps`,
    args: [
      { type: "string", options: ["forward", "backward", "left", "right"], defaultValue: "forward" },
      { type: "number", defaultValue: 50 }
    ]
  })
  async drive(direction: "left" | "right" | "forward" | "backward", steps: number) {
    const leftSteps = direction == "left" || direction == "backward" ? -steps : steps;
    const rightSteps = direction == "right" || direction == "backward" ? -steps : steps;
    const stepsPerSecond = 100;

    await this.doodlebot?.motorCommand(
      "steps",
      { steps: leftSteps, stepsPerSecond },
      { steps: rightSteps, stepsPerSecond }
    );
  }
}