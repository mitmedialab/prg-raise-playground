import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { DisplayKey, displayKeys, command, type Command, SensorKey, sensorKeys } from "./enums";
import Doodlebot from "./Doodlebot";
import { splitArgsString } from "./utils";
import EventEmitter from "events";
import { categoryByGesture, classes, emojiByGesture, gestureDetection, gestureMenuItems, gestures, objectDetection } from "./detection";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)",
  tags: ["Made by PRG"]
};

const bumperOptions = ["front", "back", "front or back", "front and back", "neither"] as const;

const looper = (action: () => Promise<any>, profileMarker?: string) => {
  const controller = new AbortController();
  let samples = 0;
  let average = 0;
  async function loop() {
    if (controller.signal.aborted) return;
    const start = performance.now();
    await action();
    const end = performance.now();
    if (profileMarker && samples < Number.MAX_SAFE_INTEGER) {
      samples++;
      average = (average * (samples - 1) + end - start) / samples;
      if (samples % 100 === 0) console.log(`Average time for ${profileMarker}: ${average}ms`);
    }
    requestAnimationFrame(loop);
  }
  loop();
  return controller;
}

export default class DoodlebotBlocks extends extension(details, "ui", "indicators", "video", "drawable") {
  doodlebot: Doodlebot;
  private indicator: Promise<{ close(): void; }>;

  bluetoothEmitter = new EventEmitter();

  gestureLoop: ReturnType<typeof looper>;
  objectLoop: ReturnType<typeof looper>;

  gestureState = {
    "Closed_Fist": false,
    "Thumb_Up": false,
    "Thumb_Down": false,
    "Victory": false,
    "Pointing_Up": false,
    "ILoveYou": false,
    "Open_Palm": false
  } satisfies Record<keyof typeof categoryByGesture, boolean>;

  imageStream: HTMLImageElement;
  videoDrawable: ReturnType<typeof this.createDrawable>;

  init(env: Environment) {
    this.openUI("Connect");
    this.setIndicator("disconnected");

    // idea: set up polling mechanism to try and disable unused sensors
    // idea: set up polling mechanism to destroy gesture recognition loop
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

  requestBluetooth(callback: (bluetooth: Bluetooth) => any) {
    this.bluetoothEmitter.once("bluetooth", callback);
    this.openUI("ReattachBLE");
  }

  async createVideoStreamDrawable() {
    this.imageStream ??= await this.doodlebot?.getImageStream();
    const drawable = this.createDrawable(this.imageStream);
    drawable.setVisible(true);
    const self = this;
    const update = () => {
      drawable.update(self.imageStream);
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    return drawable;
  }

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
    text: (degrees) => `spin ${degrees} degrees`,
    arg: { type: "angle", defaultValue: 90 }
  })
  async spin(degrees: number) {
    if (degrees === 0) return;
    await this.doodlebot?.motorCommand("arc", 0, -degrees);
  }

  @block({
    type: "command",
    text: "stop driving"
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
    type: "reporter",
    text: (sensor: SensorKey) => `${sensor} sensor`,
    arg: { type: "string", options: ["battery", "temperature", "humidity", "pressure", "distance"], defaultValue: "battery" }
  })
  async getSingleSensorReading(sensor: "battery" | "temperature" | "humidity" | "pressure" | "distance") {
    const reading = await this.doodlebot?.getSensorReading(sensor);
    return reading;
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
    type: "command",
    text: (sensor: SensorKey) => `disable ${sensor}`,
    arg: { type: "string", options: sensorKeys, defaultValue: sensorKeys[0] }
  })
  async disableSensor(sensor: SensorKey) {
    await this.doodlebot?.disableSensor(sensor);
  }

  @block({
    type: "command",
    text: (type: DisplayKey) => `display ${type}`,
    arg: { type: "string", options: displayKeys.filter(key => key !== "clear"), defaultValue: "happy" }
  })
  async setDisplay(display: DisplayKey) {
    await this.doodlebot?.display(display);
  }

  @block({
    type: "command",
    text: (text: string) => `display text ${text}`,
    arg: { type: "string", defaultValue: "hello world!" }
  })
  async setText(text: string) {
    await this.doodlebot?.displayText(text);
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
    text: (sound) => `play sound ${sound}`,
    arg: { type: "number", defaultValue: 1 }
  })
  async playSound(sound: number) {
    await this.doodlebot?.sendWebsocketCommand("m", sound)
  }

  @block({
    type: "command",
    text: (transparency) => `display video with ${transparency}% transparency`,
    arg: { type: "number", defaultValue: 50 }
  })
  async connectToVideo(transparency: number) {
    this.videoDrawable ??= await this.createVideoStreamDrawable();
    this.videoDrawable.setTransparency(transparency);
  }

  @block({
    type: "hat",
    text: (gesture) => `when ${gesture} detected`,
    arg: { type: "string", defaultValue: "Thumb_Up", options: gestureMenuItems }
  })
  whenGesture(gesture: keyof typeof this.gestureState) {
    const self = this;

    this.gestureLoop ??= looper(async () => {
      self.imageStream ??= await self.doodlebot?.getImageStream();
      const result = await gestureDetection(self.imageStream);

      for (const k in self.gestureState) self.gestureState[k] = false;

      for (const arr of result.gestures)
        for (const gesture of arr)
          self.gestureState[gesture.categoryName] = true;
    }, "gesture detection");

    return this.gestureState[gesture];
  }

  @block({
    type: "reporter",
    text: (object) => `degrees from ${object}`,
    arg: { type: "string", defaultValue: "cup", options: classes }
  })
  async getOffsetFromObject(object: typeof classes[number]) {
    this.imageStream ??= await this.doodlebot?.getImageStream();
    const result = await objectDetection(this.imageStream);
    for (const detection of result.detections) {
      const isCup = detection.categories.some(({ categoryName }) => categoryName === object);
      if (!isCup) continue;
      if (!detection.boundingBox) continue;
      const x = detection.boundingBox.originX + detection.boundingBox.width / 2;
      const xOffset = x - this.imageStream.width / 2;
      return xOffset * 90 / this.imageStream.width;
    }
    return 0;
  }

  @block({
    type: "command",
    text: (seconds) => `record for ${seconds} seconds and play`,
    arg: { type: "number", defaultValue: 1 }
  })
  async recordAudio(seconds: number) {
    const { context, buffer } = await this.doodlebot?.recordAudio(seconds);

    const audioBufferSource = context.createBufferSource();
    audioBufferSource.buffer = buffer;

    const gainNode = context.createGain();
    audioBufferSource.connect(gainNode);
    gainNode.connect(context.destination);

    const fadeInDuration = 0.1;
    const fadeOutDuration = 0.1;
    const audioDuration = audioBufferSource.buffer.duration;

    // Start with silence
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, context.currentTime + fadeInDuration);

    gainNode.gain.setValueAtTime(1, context.currentTime + audioDuration - fadeOutDuration);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + audioDuration);

    audioBufferSource.start();
    audioBufferSource.stop(context.currentTime + audioDuration);

    await new Promise((resolve) => setTimeout(resolve, audioDuration * 1000));
  }


  @block({
    type: "reporter",
    text: "get IP address"
  })
  async getIP() {
    return this.doodlebot?.getIPAddress();
  }

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

}