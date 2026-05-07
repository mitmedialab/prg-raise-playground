import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock, BlockUtilityWithID, scratch } from "$common";
import { DisplayKey, displayKeys, command, type Command, SensorKey, sensorKeys, units, keyBySensor, sensor } from "./enums";
import Doodlebot from "./Doodlebot";
import EventEmitter from "events";
import TeachableMachine from "./ModelUtils";
import { convertSvgUint8ArrayToPng } from "./utils";
import LineArrayFollowing from "./LineArrayFollowing";
//import { createLineDetector } from "./LineDetection";

import JSZip from 'jszip';
import type { BLEDeviceWithUartService } from "./ble";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace me here",
  insetIconURL: "doodlebot_icon.png",
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

export var imageFiles: string[] = [];
export var soundFiles: string[] = [];

export default class DoodlebotBlocks extends extension(details, "ui", "customArguments", "indicators", "video", "drawable") {
  doodlebot = new Doodlebot();
  connected = false;

  private indicator: Promise<{ close(): void; }>;
  bluetoothEmitter = new EventEmitter();

  gestureLoop: ReturnType<typeof looper>;
  objectLoop: ReturnType<typeof looper>;

  imageStream: HTMLImageElement;
  videoDrawable: ReturnType<typeof this.createDrawable>;

  studyJson = {};
  sessionId: string;
  injectionProbability: number;
  taskType: string;
  condition: string;

  INTERVAL = 16;
  DIMENSIONS = [480, 360];

  soundDictionary: {} | { string: string[] };
  costumeDictionary: {} | { string: string[] };

  lastUpdate: number = null;
  isPredicting;

  voice_id: number;
  pitch_value: number;

  lineFollower;

  blocksRun: number;
  runId: number;

  async init(env: Environment) {
    this.voice_id = 1;
    this.pitch_value = 0;
    this.soundDictionary = {};
    this.costumeDictionary = {};
    this.blocksRun = 0;
    this.runId = 0;
    //requestAnimationFrame(() => this.setIndicator("disconnected"));
    this.openUI("Connect")
    env.runtime.on("TARGETS_UPDATE", async () => {
      await this.setDictionaries();
    })


    await this.setDictionaries();

    soundFiles = ["File"];
    imageFiles = ["File"];

    env.runtime.on("PROJECT_RUN_STOP", async() => {
      console.log("PROJECT FINISHED");
    })

    env.runtime.on("PROJECT_RUN_START", async() => {

    })

    env.runtime.on("PROJECT_STOP_ALL", async() => {
      console.log("PROJECT STOPPED");
    })

    env.runtime.on("STOP_FOR_TARGET", async() => {
      console.log("PROJECT STOPPED");
    })



  }

   async blockCounter(utility: BlockUtilityWithID) {
    console.log("utility", utility);
    if (JSON.parse(JSON.stringify(utility.blockID)) == JSON.parse(JSON.stringify(utility.thread.topBlock))) {
      this.blocksRun = 0;
      this.runId += 1;
      const opcodes = [];
      const blockIds = JSON.parse(JSON.stringify(utility.thread.blockContainer._scripts));
      for (const id of blockIds) {
        const block = JSON.parse(JSON.stringify(utility.thread.blockContainer._blocks[id]));
        opcodes.push(block.opcode);
      }
      if (Object.keys(this.studyJson).includes("run_start")) {
        this.studyJson["run_start"].push({
          "run_id": this.runId,
          "block_snapshot": opcodes,
          "block_count": opcodes.length,
          "timstamp": Date.now()
        })
      }

      console.log("FINAL OPCODES", opcodes);
    }
    this.blocksRun = this.blocksRun + 1;
    if (this.blocksRun > 1) {
      const r = Math.random();
      console.log("starting", r);
      if (r < 0.3) {
        // await this.speakText("Here I go!");
      } else if (r < 0.6) {
        // await this.speakText("Let's do it!");
      }
    }
  }





  async setDictionaries() {
    for (const target of this.runtime.targets) {
      this.soundDictionary[target.id] = {};
      this.costumeDictionary[target.id] = {};
      if (target.sprite) {
        for (const sound of target.sprite.sounds) {
          if (sound.asset.dataFormat == "wav") {
            this.soundDictionary[target.id][sound.name] = sound.asset.data;
          }
        }
        for (const costume of target.sprite.costumes) {
          let id = "Costume: " + costume.name;
          if (costume.asset.dataFormat == "svg") {
            await convertSvgUint8ArrayToPng(costume.asset.data, costume.size[0], costume.size[1])
              .then((pngBlob: Blob) => {
                const url = URL.createObjectURL(pngBlob)
                this.costumeDictionary[target.id][id] = "costume9999.png---name---" + url;
              })
          } else if (costume.asset.dataFormat == "png") {
            const blob = new Blob([costume.asset.data], { type: 'image/png' });
            const url = URL.createObjectURL(blob)
            this.costumeDictionary[target.id][id] = "costume9999.png---name---" + url;
          }

        }
      }
    }
  }



  getCurrentSounds(id): string[] {
    return (this.soundDictionary && this.soundDictionary[id]) ? Object.keys(this.soundDictionary[id]) : [];
  }

  async setDoodlebot(topLevelDomain: string, bluetooth: BLEDeviceWithUartService) {
    this.doodlebot.topLevelDomain.resolve(topLevelDomain);
    this.doodlebot.bleDevice.resolve(bluetooth);

    await this.setIndicator("connected");

    try {
      imageFiles = await this.doodlebot.findImageFiles();
      soundFiles = await this.doodlebot.findSoundFiles();
      if (soundFiles.length == 0) soundFiles.push("File");

    } catch (e) {
      //this.openUI("ArrayError");
    }

    // Wait a short moment to ensure connection is established
    await new Promise(resolve => setTimeout(resolve, 1000));

    window.addEventListener("pagehide", () => {
      for (const key of Object.keys(sensor)) {
        console.log("DISABLE SENSOR", key);
        this.doodlebot.disableSensor(key as SensorKey); // don't await
      }
    });


    await this.doodlebot.display("happy");
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

  getImageStream() {
    this.imageStream ??= this.doodlebot?.getImageStream();
    return this.imageStream;
  }

  async createVideoStreamDrawable() {
    this.imageStream ??= this.doodlebot?.getImageStream();
    if (!this.imageStream) {
      //console.error("Failed to get image stream");
      return;
    }

    let stageWidth = 480;
    let stageHeight = 360;

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = stageWidth;
    resizedCanvas.height = stageHeight;
    const resizedCtx = resizedCanvas.getContext('2d');

    const drawable = this.createDrawable(resizedCanvas); // draw from resized version
    drawable.setVisible(true);

    const update = () => {
      const latest = this.doodlebot?.getImageStream();
      if (!latest) return;

      // Draw the current stream into the resized canvas
      resizedCtx.clearRect(0, 0, stageWidth, stageHeight);
      resizedCtx.drawImage(latest, 0, 0, stageWidth, stageHeight);
      drawable.update(resizedCanvas);

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    return drawable;
  }

  @buttonBlock("Connect Robot")
  connect() {
    this.openUI("Connect");
  }

  @block({
    type: "command",
    text: (sessionId, condition, injectionProbability, taskType) => `start session with ${sessionId}; condition ${condition}; injection probability ${injectionProbability}; and task type ${taskType}`,
    args: [
      { type: "string", defaultValue: "session_id" },
      { type: "string", defaultValue: "compliant", options: ["compliant", "rebel"] },
      { type: "number", defaultValue: 0 },
      { type: "string", defaultValue: "directed", options: ["directed", "open"]}
    ]
  })
  startSession(sessionId: string, condition: string, injectionProbability: number, taskType: string) {
    this.sessionId = sessionId;
    this.condition = condition;
    this.injectionProbability = injectionProbability;
    this.taskType = taskType;
    this.studyJson["session_start"] = {
      "session_id": sessionId,
      "condition": condition,
      "injection_probability": injectionProbability,
      "task_type": taskType,
      "timestamp": Date.now()
    }
  }

  @block({
    type: "command",
    text: `end session`
  })
  endSession() {
    this.studyJson["session_end"] = {
      "timestamp": Date.now()
    }
    // download JSON
  }

  @block({
    type: "command",
    text: (voice, pitch) => `set voice to ${voice} and pitch to ${pitch}`,
    args: [
      { type: "number", defaultValue: 1 },
      { type: "number", defaultValue: 0 }
    ]
  })
  async setVoiceAndPitch(voice: number, pitch: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    this.voice_id = voice;
    this.pitch_value = pitch;
  }

  @block({
    type: "command",
    text: (text) => `speak ${text}`,
    arg: { type: "string", defaultValue: "Hello!" }
  })
  async speak(text: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.speakText(text);
  }

  @block({
    type: "command",
    text: (text: string) => `display text ${text}`,
    arg: { type: "string", defaultValue: "hello world!" }
  })
  async setText(text: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.displayText(text);
  }

  @block({
    type: "command",
    text: (size) => `set font size to ${size}`,
    arg: { type: "string", options: ["small", "medium", "large"], defaultValue: "medium" },

  })
  async setFont(size: "small" | "medium" | "large", utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.setFont(size);
  }

  @block({
    type: "command",
    text: "clear display"
  })
  async clearDisplay(utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.display("clear");
  }

  @block({
    type: "command",
    text: (direction, steps, speed) => `drive ${direction} for ${steps} cm at speed ${speed}`,
    args: [
      { type: "string", options: ["forward", "backward"], defaultValue: "forward" },
      { type: "number", defaultValue: 10 },
      { type: "number", options: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], defaultValue: 2000 }
    ]
  })
  async drive(direction: "forward" | "backward", steps: number, speed: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    const leftSteps = direction == "backward" ? -steps * 7.160 * 16 : steps * 7.160 * 16;
    const rightSteps = direction == "backward" ? -steps * 7.160 * 16 : steps * 7.160 * 16;
    const stepsPerSecond = speed;

    await this.doodlebot?.motorCommand(
      "steps",
      { steps: leftSteps, stepsPerSecond },
      { steps: rightSteps, stepsPerSecond }
    );
  }

  @block({
    type: "command",
    text: (direction, radius, degrees) => `arc ${direction} with radius ${radius} cm for ${degrees} degrees`,
    args: [
      { type: "string", options: ["left", "right"], defaultValue: "left" },
      { type: "number", defaultValue: 2 },
      { type: "number", defaultValue: 90 }
    ]
  })
  async arc(direction: "left" | "right", radius: number, degrees: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    if (direction == "right") degrees *= -1;
    await this.doodlebot?.motorCommand("arc", radius / 2.54, degrees);
  }

  @block({
    type: "command",
    text: (degrees) => `spin ${degrees} degrees`,
    arg: { type: "number", defaultValue: 90 }
  })
  async spin(degrees: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    if (degrees === 0) return;
    await this.doodlebot?.motorCommand("arc", 0, -degrees);
  }

  @block({
    type: "command",
    text: "stop driving"
  })
  async stop(utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.motorCommand("stop");
  }

  @block({
    type: "command",
    text: (direction) => `move pen ${direction}`,
    arg: { type: "string", options: ["up", "down"], defaultValue: "up" }
  })
  async movePen(direction: "up" | "down", utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.penCommand(direction);
  }

  @block({
    type: "reporter",
    text: (sensor: SensorKey) => `${sensor} sensor`,
    arg: { type: "string", options: ["battery", "temperature", "humidity", "pressure", "distance", "altimeter", "line"], defaultValue: "battery" }
  })
  async getSingleSensorReading(sensor: "battery" | "temperature" | "humidity" | "pressure" | "distance" | "altimeter" | "line", utility: BlockUtilityWithID) {
    const reading = await this.doodlebot?.getSingleSensorReading(sensor);
    return `${JSON.stringify(reading)} ${units[sensor]}`;
  }

  @block({
    type: "reporter",
    text: (axis: string, sensor: SensorKey) => `get ${axis} of ${sensor} sensor`,
    args: [
      { type: 'string', options: ["x", "y", "z"], defaultValue: 'x' },
      { type: "string", options: ["gyroscope", "accelerometer"], defaultValue: "gyroscope" }
    ]
  })
  async getSingleSensorReadingAxis(axis: string, sensor: "gyroscope" | "accelerometer", utility: BlockUtilityWithID) {
    const reading = await this.doodlebot?.getSingleSensorReading(sensor);
    if (!reading) {
      return NaN;
    }
    return `${JSON.stringify(reading[axis])} ${units[sensor]}`;
  }



  @(scratch.hat`
    when ${{ type: "string", options: ["battery", "temperature", "humidity", "pressure", "distance", "altimeter"], defaultValue: "battery" }} 
    sensor > ${{ type: "number", defaultValue: 0 }}
  `)
  whenSensorGreater(sensor: "battery" | "temperature" | "humidity" | "pressure" | "distance" | "altimeter", greater: number) {
    const reading = this.doodlebot?.getSensorReadingSync(sensor);
    if (!reading) return false;
    return (Number(reading) > Number(greater));
  }

  @block({
    type: "Boolean",
    text: (bumper) => `is ${bumper} bumper pressed`,
    arg: { type: "string", options: bumperOptions, defaultValue: bumperOptions[0] }
  })
  async isBumperPressed(bumber: typeof bumperOptions[number]) {
    const isPressed = await this.doodlebot?.getSingleSensorReading("bumper");

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
    const isPressed = this.doodlebot?.getSensorReadingSync("bumper");

    const isPressedCondition = condition === "pressed";
    if (!isPressed) {
      return false;
    }

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
  async disableSensor(sensor: SensorKey, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.disableSensor(sensor);
  }

  @block({
    type: "command",
    text: (direction) => `move eyes from center to ${direction}`,
    arg: { type: "string", options: ["left", "right", "up", "down"] },
  })
  async moveEyes1(direction: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot.moveEyes("center", direction);
  }

  @block({
    type: "command",
    text: (direction) => `move eyes from ${direction} to center`,
    arg: { type: "string", options: ["left", "right", "up", "down"] },
  })
  async moveEyes2(direction: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot.moveEyes(direction, "center");
  }

  @block({
    type: "command",
    text: (sound) => `play sound track${sound}`,
    arg: { type: "number", defaultValue: 1 }
  })
  async playSound(sound: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.sendWebsocketCommand("m", sound)
  }

  @block((self) => ({
    type: "command",
    text: (sound) => `play sound ${sound}`,
    arg: {
      type: "string", options: () => {
        const soundList = self.getCurrentSounds(self.runtime._editingTarget.id);
        if (soundFiles.length == 0 && soundList.length == 0) {
          return ["File"];
        }
        if ((soundFiles.length == 1 && soundFiles[0] == "File") && soundList.length > 0) {
          soundFiles = [];
        }
        return soundFiles.concat(soundList);
      }
    }
  }))
  async playSoundFile(sound: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    let currentId = this.runtime._editingTarget.id;
    let costumeSounds = this.getCurrentSounds(currentId);
    if (costumeSounds.includes(sound)) {
      let soundArray = this.soundDictionary[currentId][sound];
      console.log(soundArray);
      await this.doodlebot.sendAudioData(soundArray);
    } else {
      await this.doodlebot?.sendWebsocketCommand("m", sound)
    }

  }

  @block((self) => ({
    type: "command",
    text: (type: DisplayKey | string) => `display ${type}`,
    arg: {
      type: "string", options: () => {
        self.setDictionaries();
        return displayKeys.filter(key => (key !== "clear" && key !== "font")).concat(imageFiles).concat(
          (self.costumeDictionary && self.costumeDictionary[self.runtime._editingTarget.id]) ? Object.keys(self.costumeDictionary[self.runtime._editingTarget.id]) : [] as any[]
        ).filter((item: string) => item != "costume9999.png")
      }, defaultValue: "happy"
    }
  }))
  async setDisplay(display: DisplayKey | string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    let costumeNames = Object.keys(this.costumeDictionary[this.runtime._editingTarget.id]);
    if (costumeNames.includes(display)) {
      await this.doodlebot.uploadFile("image", this.costumeDictionary[this.runtime._editingTarget.id][display]);
      await this.setArrays();
      await this.doodlebot.displayFile("costume9999.png");
    } else if (imageFiles.includes(display)) {
      await this.doodlebot?.displayFile(display);
    } else {
      await this.doodlebot?.display(display as DisplayKey);
    }
  }

  // @ts-ignore
  @block((self) => ({
    type: "command",
    text: (type: DisplayKey | string, seconds: number) => `display ${type} for ${seconds} seconds`,
    args: [{
      type: "string", options: () => {
        self.setDictionaries();
        return displayKeys.filter(key => key !== "clear").concat(imageFiles).concat(
          (self.costumeDictionary && self.costumeDictionary[self.runtime._editingTarget.id]) ? Object.keys(self.costumeDictionary[self.runtime._editingTarget.id]) : [] as any[]
        ).filter((item: string) => item != "costume9999.png")
      }, defaultValue: "happy"
    }, { type: "number", defaultValue: 1 }]
  }))
  async setDisplayForSeconds(display: DisplayKey | string, seconds: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    const lastDisplayedKey = this.doodlebot.getLastDisplayedKey();
    const lastDisplayedType = this.doodlebot.getLastDisplayedType();
    let costumeNames = Object.keys(this.costumeDictionary[this.runtime._editingTarget.id]);
    if (costumeNames.includes(display)) {
      await this.doodlebot.uploadFile("image", this.costumeDictionary[this.runtime._editingTarget.id][display]);
      await this.setArrays();
      await this.doodlebot.displayFile("costume9999.png");
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    } else if (imageFiles.includes(display)) {
      await this.doodlebot?.displayFile(display);
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    } else {
      await this.doodlebot?.display(display as DisplayKey);
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    if (lastDisplayedType == "text") {
      await this.doodlebot.displayText(lastDisplayedKey);
    } else {
      await this.doodlebot.display(lastDisplayedKey);
    }
  }

  @block({
    type: "command",
    text: "display video",
  })
  async connectToVideo(utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    this.videoDrawable ??= await this.createVideoStreamDrawable();
  }

  async setArrays() {
    imageFiles = await this.doodlebot.findImageFiles();
    soundFiles = await this.doodlebot.findSoundFiles();
  }

  @(scratch.button`Upload sound`)
  uploadSoundUI() {
    this.openUI("UploadSound");
  }

  @(scratch.button`Upload image`)
  uploadImageUI() {
    this.openUI("UploadImage");
  }

  @block({
    type: "command",
    text: (volume) => `set volume to ${volume}`,
    arg: { type: "number", options: [0, 25, 50, 75, 100, 200, 300], defaultValue: 100 },

  })
  async setVolume(volume: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.doodlebot?.setVolume(volume)
  }

  private async speakText(text: string, showDisplay: boolean = false) {
    try {
      // Display "speaking" while processing if showDisplay is true
      if (showDisplay) {
        await this.doodlebot?.display("clear");
        await this.doodlebot?.displayText("speaking");
      }

      const url = `https://doodlebot.media.mit.edu/speak?voice=${this.voice_id}&pitch=${this.pitch_value}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(null);
        });
      });

      const durationMs = audio.duration * 1000; // duration is in seconds

      // Convert blob to Uint8Array and send to Doodlebot
      const array = await blob.arrayBuffer();
      await this.doodlebot.sendAudioData(new Uint8Array(array));
      console.log("DATA SENT");

      // Wait a moment before clearing the display if showDisplay is true
      if (showDisplay) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.doodlebot?.display("clear");
      }
      await new Promise(resolve => setTimeout(resolve, durationMs));

    } catch (error) {
      console.error("Error in speak function:", error);
      if (showDisplay) {
        await this.doodlebot?.display("clear");
        await this.doodlebot?.displayText("error");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.doodlebot?.display("clear");
      }
      throw error; // Re-throw the error so calling functions can handle it
    }
  }
}
