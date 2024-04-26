import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { DisplayKey, displayKeys, command, type Command, SensorKey, sensorKeys } from "./enums";
import Doodlebot from "./Doodlebot";
import { splitArgsString } from "./utils";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)",
  tags: ["Made by PRG"]
};

const bumperOptions = ["front", "back", "front or back", "front and back", "neither"] as const;

export default class DoodlebotBlocks extends extension(details, "ui", "indicators", "video", "drawable") {
  doodlebot: Doodlebot;
  private indicator: Promise<{ close(): void; }>

  init(env: Environment) {
    this.openUI("Connect");
    this.setIndicator("disconnected");

    // idea: set up polling mechanism to try and disable unused sensors
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

  @block({
    type: "command",
    text: (direction, radius, degrees) => `arc ${direction} with radius ${radius} for ${degrees} degrees`,
    args: [
      { type: "string", options: ["left", "right"], defaultValue: "left" },
      { type: "number", defaultValue: 2 },
      { type: "number", defaultValue: 90 }
    ]
  })
  async arc(direction: "left" | "right", radius: number, degrees: number) {
    if (direction == "right") degrees *= -1;
    await this.doodlebot?.motorCommand("arc", radius, degrees);
  }

  @block({
    type: "command",
    text: "Stop"
  })
  async stop() {
    await this.doodlebot?.motorCommand("stop");
  }

  @block({
    type: "command",
    text: (direction) => `move pen ${direction}`,
    arg: { type: "string", options: ["up", "down"], defaultValue: "up" }
  })
  async movePen(direction: "up" | "down") {
    await this.doodlebot?.penCommand(direction);
  }


  @block({
    type: "Boolean",
    text: (bumper) => `is ${bumper} bumper pressed`,
    arg: { type: "string", options: bumperOptions, defaultValue: bumperOptions[0] }
  })
  async isBumperPressed(bumber: typeof bumperOptions[number]) {
    const isPressed = await this.doodlebot?.getSensorReading("bumper");
    switch (bumber) {
      case "back":
        return isPressed.back > 0;
      case "front":
        return isPressed.front > 0;
      case "front or back":
        return isPressed.front > 0 || isPressed.back > 0;
      case "front and back":
        return isPressed.front > 0 && isPressed.back > 0;
      case "neither":
        return isPressed.front === 0 && isPressed.back === 0;
    }
  }

  @block({
    type: "hat",
    text: (bumper, condition) => `when ${bumper} bumper ${condition}`,
    args: [
      { type: "string", options: bumperOptions, defaultValue: bumperOptions[0] },
      { type: "string", options: ["release", "pressed"], defaultValue: "pressed" }
    ]
  })
  whenBumperPressed(bumber: typeof bumperOptions[number], condition: "release" | "pressed") {
    const isPressed = this.doodlebot?.getSensorReadingImmediately("bumper");
    const isPressedCondition = condition === "pressed";
    switch (bumber) {
      case "back":
        return isPressedCondition ? isPressed.back > 0 : isPressed.back === 0;
      case "front":
        return isPressedCondition ? isPressed.front > 0 : isPressed.front === 0;
      case "front or back":
        return isPressedCondition ? isPressed.front > 0 || isPressed.back > 0 : isPressed.front === 0 && isPressed.back === 0;
      case "front and back":
        return isPressedCondition ? isPressed.front > 0 && isPressed.back > 0 : isPressed.front === 0 || isPressed.back === 0;
      case "neither":
        return isPressedCondition ? isPressed.front === 0 && isPressed.back === 0 : isPressed.front > 0 && isPressed.back > 0;
    }
  }

  @block({
    type: "reporter",
    text: (sensor: SensorKey) => `${sensor} sensor`,
    arg: { type: "string", options: ["battery", "temperature", "humidity", "pressure", "distance"], defaultValue: "battery" }
  })
  async getSingleSensorReading(sensor: "battery" | "temperature" | "humidity" | "pressure" | "distance") {
    const reading = await this.doodlebot?.getSensorReading(sensor);
    return reading;
  }

  @block({
    type: "command",
    text: (sensor: SensorKey) => `disable ${sensor}`,
    arg: { type: "string", options: sensorKeys, defaultValue: sensorKeys[0] }
  })
  async disableSensor(sensor: SensorKey) {
    await this.doodlebot?.disableSensor(sensor);
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
    await this.doodlebot?.connectToWebsocket("192.168.0.103");
    await this.doodlebot?.display(display);
  }

  // #endregion

  // #region BLE-based commands

  @block({
    type: "reporter",
    text: "get IP address"
  })
  async getIP() {
    return this.doodlebot?.getIPAddress();
  }

  @block({
    type: "command",
    text: "connect video"
  })
  async connectToVideo() {
    const ip = await this.doodlebot?.getIPAddress();
    const image = await this.doodlebot?.getImageStream(ip);

    const drawable = this.createDrawable(image);
    drawable.setVisible(true);
    setInterval(() => drawable.update(image), 100);
  }

  @block({
    type: "command",
    text: "connect audio"
  })
  async connectToAudio() {
    const ip = await this.doodlebot?.getIPAddress();
    const socket = await this.doodlebot?.getAudioStream(ip, 10);
    await new Promise((resolve) => setTimeout(resolve, 9000));
    socket.close();
  }

  // #endregion

  // #region mixed commands

  @block({
    type: "command",
    text: (_command, args, protocol) => `send (${_command}, ${args}) over ${protocol}`,
    args: [
      { type: "string", defaultValue: "u" },
      { type: "string", defaultValue: "0" },
      { type: "string", options: ["BLE", "Websocket"], defaultValue: "BLE" }
    ]
  })
  async sendMessage(_command: string, args: string, protocol: "BLE" | "Websocket") {
    const candidates = Object.values(command).filter((entry) => entry === _command)
    if (candidates.length === 0) return console.error(`Command ${command} not found`);

    protocol === "BLE"
      ? await this.doodlebot?.sendBLECommand(candidates[0], ...splitArgsString(args))
      : await this.doodlebot?.sendWebsocketCommand(candidates[0], ...splitArgsString(args));
  }

  // #endregion

  // #endregion

}