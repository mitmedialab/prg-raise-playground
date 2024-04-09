import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { DisplayKey, displayKeys, command, type Command } from "./enums";
import Doodlebot from "./Doodlebot";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)",
  tags: ["Made by PRG"]
};

/**
 * 
 * @param input 
 * @example splitArgsString("hello ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello,ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello, ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello"); // Output: ["hello"]
 * @example splitArgsString(""); // Output: []
 * @returns 
 */
const splitArgsString = (input: string): string[] => {
  if (!input) return [];
  // Regular expression to split the string by either comma followed by optional space characters or by space characters alone
  const regex = /,\s*|\s+/;
  const words = input.split(regex);
  return words;
}

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
    if (this.indicator) (await this.indicator)?.close();
    this.indicator = status == "connected"
      ? this.indicate({ position: "category", msg: "Connected to robot", type: "success", retry: true })
      : this.indicate({ position: "category", msg: "Not connected to robot", type: "warning", retry: true });
  }

  // #region Block Methods

  @buttonBlock("Connect Robot")
  connect() {
    this.openUI("Connect");
  }

  // #region Websocket-based commands

  @block({
    type: "command",
    text: "clear display"
  })
  async clearDisplay() {
    await this.doodlebot?.display("clear");
  }

  @block({
    type: "command",
    text: (type: DisplayKey) => `display ${type}`,
    arg: { type: "string", options: displayKeys.filter(key => key !== "clear"), defaultValue: "happy" }
  })
  async setDisplay(display: DisplayKey) {
    await this.doodlebot?.display(display);
  }

  // #endregion

  // #region BLE-based commands

  @block({
    type: "command",
    text: (_command, args) => `send (${_command}, ${args}) over BLE`,
    args: [{ type: "string", defaultValue: "u" }, { type: "string", defaultValue: "0" }]
  })
  async sendBLEMessage(_command: string, args: string) {
    const candidates = Object.values(command).filter((entry) => entry === _command)

    if (candidates.length === 0) return console.error(`Command ${command} not found`);

    await this.doodlebot?.sendBLECommand(candidates[0], ...splitArgsString(args));
  }

  @block({
    type: "command",
    text: (direction, steps) => `drive ${direction} for ${steps} steps`,
    args: [
      { type: "string", options: ["forward", "backward", "left", "right"], defaultValue: "forward" },
      { type: "number", defaultValue: 2000 }
    ]
  })
  async drive(direction: "left" | "right" | "forward" | "backward", steps: number) {
    const leftSteps = direction == "left" || direction == "backward" ? -steps : steps;
    const rightSteps = direction == "right" || direction == "backward" ? -steps : steps;
    const stepsPerSecond = 2000;

    await this.doodlebot?.motorCommand(
      "steps",
      { steps: leftSteps, stepsPerSecond },
      { steps: rightSteps, stepsPerSecond }
    );
  }

  // #endregion

  // #endregion

}