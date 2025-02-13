import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import { DisplayKey, displayKeys, command, type Command, SensorKey, sensorKeys } from "./enums";
import Doodlebot, { NetworkCredentials } from "./Doodlebot";
import { splitArgsString } from "./utils";
import EventEmitter from "events";
import { categoryByGesture, classes, emojiByGesture, gestureDetection, gestureMenuItems, gestures, objectDetection } from "./detection";
//import { createLineDetector } from "./LineDetection";
import { line0, line1, line2, line3, line4, line5, line6, line7, line8 } from './Points';
import { followLine } from "./LineFollowing";
import { createLineDetector } from "./LineDetection";
import tmPose from '@teachablemachine/pose';
import { calculateArcTime } from "./TimeHelper";
import tmImage from '@teachablemachine/image';
import * as speechCommands from '@tensorflow-models/speech-commands';
import JSZip from 'jszip';

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
  private lineDetector: (() => Promise<number[][]>) | null = null;
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
  predictionState = {};
  latestAudioResults: any;
  ModelType = {
    POSE: 'pose',
    IMAGE: 'image',
    AUDIO: 'audio',
  };
  teachableImageModel;

  lastUpdate: number = null;
  maxConfidence: number = null;
  modelConfidences = {};
  isPredicting: number = 0;
  INTERVAL = 16;
  DIMENSIONS = [480, 360];

  init(env: Environment) {
    this.setIndicator("disconnected");
    if (window.isSecureContext) this.openUI("Connect")
    else this.connectToDoodlebotWithExternalBLE();
    this._loop();
    env.runtime.on("PROJECT_RUN_START", () => {
      this.setDisplay("love");
    })
    env.runtime.on("PROJECT_RUN_STOP", () => {
      this.setDisplay("sad");
    })
  }

  private async connectToDoodlebotWithExternalBLE() {
    // A few globals that currently must be set the same across the playground and the https frontend
    const handshakeMessage = "doodlebot";
    const disconnectMessage = "disconnected";
    const commandCompleteIdentifier = "done";

    const urlParams = new URLSearchParams(window.location.search); // Hack for now

    const ip = urlParams.get("ip");

    if (!ip) {
      alert("No IP address provided. Please provide an IP address in the URL query string.");
      return;
    }

    const networkCredentials: NetworkCredentials = {
      ssid: "dummy", // NOTE: When using the external BLE, it is assumed a valid ip address will be provided, and thus there is no need for wifi credentials
      password: "dummy", // NOTE: When using the external BLE, it is assumed a valid ip address will be provided, and thus there is no need for wifi credentials
      ipOverride: ip
    }

    type ExternalPageDetails = { source: MessageEventSource, targetOrigin: string }

    const { source, targetOrigin } = await new Promise<ExternalPageDetails>((resolve) => {
      const onInitialMessage = ({ data, source, origin }: MessageEvent) => {
        if (typeof data !== "string" || data !== handshakeMessage) return;
        window.removeEventListener("message", onInitialMessage);
        source.postMessage("ready", { targetOrigin: origin })
        resolve({ source, targetOrigin: origin });
      }
      window.addEventListener("message", onInitialMessage);
    });

    const doodlebot = new Doodlebot(
      {
        send: (text) => new Promise<void>(resolve => {
          const onMessageReturn = ({ data, origin }: MessageEvent<string>) => {
            if (origin !== targetOrigin || !data.includes(text) || !data.includes(commandCompleteIdentifier)) return;
            window.removeEventListener("message", onMessageReturn);
            resolve();
          }
          window.addEventListener("message", onMessageReturn);
          source.postMessage(text, { targetOrigin });
        }),

        onReceive: (callback) => {
          window.addEventListener('message', ({ data, origin }) => {
            if (origin !== targetOrigin || data === disconnectMessage || data.includes(commandCompleteIdentifier)) return;
            callback(new CustomEvent<string>("ble", { detail: data }));
          });
        },

        onDisconnect: () => {
          window.addEventListener("message", ({ data, origin }) => {
            if (origin !== targetOrigin || data !== disconnectMessage) return;
            this.setIndicator("disconnected");
            alert("Disconnected from robot"); // Decide how to handle (maybe direct user to close window and go back to https)
          });
        },
      },
      () => alert("requestBluetooth called"), // placeholder
      networkCredentials,
      () => alert("save IP called"), // placeholder
    )
    this.setDoodlebot(doodlebot);
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

  async getImageStream() {
    this.imageStream ??= await this.doodlebot?.getImageStream();
    return this.imageStream;
  }

  async createVideoStreamDrawable() {
    this.imageStream ??= await this.doodlebot?.getImageStream();
    if (!this.imageStream) {
      console.error("Failed to get image stream");
      return;
    }
    console.log("Image stream dimensions:", this.imageStream.width, "x", this.imageStream.height);
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
    text: "Test line follow"
  })
  async testLine2() {
    await this.doodlebot.followLine();
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

  @block({
    type: "command",
    text: (url) => `import model ${url}`,
    arg: {
      type: "string",
      defaultValue: "URL HERE"
    }
  })
  async importModel(url: string) {
    await this.useModel(url);
  }


  @block({
    type: "hat",
    text: (className) => `when model detects ${className}`,
    arg: {
      type: "string",
      options: function () {
        if (!this) {
          throw new Error('Context is undefined');
        }
        return this.getModelClasses() || ["Select a class"];
      },
      defaultValue: "Select a class"
    }
  })
  whenModelDetects(className: string) {
    return this.model_match(className);
  }

  @block({
    type: "reporter",
    text: "model prediction",
  })
  modelPrediction() {
    return this.getModelPrediction();
  }

  @block({
    type: "reporter",
    text: (className) => `confidence for ${className}`,
    arg: {
      type: "string",
      options: function () {
        if (!this) {
          throw new Error('Context is undefined');
        }
        return this.getModelClasses() || ["Select a class"];
      },
      defaultValue: "Select a class"
    }
  })
  getConfidence(className: string) {
    if (!this.modelConfidences || !this.modelConfidences[className]) {
      return 0;
    }
    return Math.round(this.modelConfidences[className] * 100);
  }

  writeString(view: DataView, offset: number, text: string) {
    for (let i = 0; i < text.length; i++) {
        view.setUint8(offset + i, text.charCodeAt(i));
    }
  }

  async saveAudioBufferToWav(buffer) {
    function createWavHeader(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate / 4;
        const bitsPerSample = 16; // 16-bit PCM
        const blockAlign = (numChannels * bitsPerSample) / 8;
        const byteRate = sampleRate * blockAlign;
        const dataLength = buffer.length * numChannels * 2; // 16-bit PCM = 2 bytes per sample
        const header = new ArrayBuffer(44);
        const view = new DataView(header);
        // "RIFF" chunk descriptor
        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + dataLength, true); // File size - 8 bytes
        writeString(view, 8, "WAVE");
        // "fmt " sub-chunk
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
        view.setUint16(20, 1, true); // Audio format (1 = PCM)
        view.setUint16(22, numChannels, true); // Number of channels
        view.setUint32(24, sampleRate, true); // Sample rate
        view.setUint32(28, byteRate, true); // Byte rate
        view.setUint16(32, blockAlign, true); // Block align
        view.setUint16(34, bitsPerSample, true); // Bits per sample
        // "data" sub-chunk
        writeString(view, 36, "data");
        view.setUint32(40, dataLength, true); // Data length
        console.log("WAV Header:", new Uint8Array(header));
        return header;
    }
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    function interleave(buffer) {
        const numChannels = buffer.numberOfChannels;
        const length = buffer.length * numChannels;
        const result = new Float32Array(length);
        const channelData = [];
        for (let i = 0; i < numChannels; i++) {
            channelData.push(buffer.getChannelData(i));
        }
        let index = 0;
        for (let i = 0; i < buffer.length; i++) {
            for (let j = 0; j < numChannels; j++) {
                result[index++] = channelData[j][i];
            }
        }
        console.log("Interleaved data:", result);
        return result;
    }
    function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i])); // Clamp to [-1, 1]
            s = s < 0 ? s * 0x8000 : s * 0x7FFF; // Convert to 16-bit PCM
            output.setInt16(offset, s, true); // Little-endian
        }
    }
    const header = createWavHeader(buffer);
    const interleaved = interleave(buffer);
    const wavBuffer = new ArrayBuffer(header.byteLength + interleaved.length * 2);
    const view = new DataView(wavBuffer);
    //return this.createAndSaveWAV(interleaved, buffer.sampleRate);
    // Write header
    new Uint8Array(wavBuffer).set(new Uint8Array(header), 0);
    // Write PCM data
    floatTo16BitPCM(view, header.byteLength, interleaved);
    console.log("Final WAV buffer length:", wavBuffer.byteLength);
    console.log("Expected data length:", header.byteLength + interleaved.length * 2);
    // Return a Blob
    return new Blob([wavBuffer], { type: "audio/wav" });
}

generateWAV(interleaved: Float32Array, sampleRate: number): Uint8Array {
  const numChannels = 1; // Mono
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataLength = interleaved.length * (bitsPerSample / 8);
  const bufferLength = 44 + dataLength;
  const buffer = new ArrayBuffer(bufferLength);
  const view = new DataView(buffer);
  // RIFF header
  this.writeString(view, 0, "RIFF");
  view.setUint32(4, bufferLength - 8, true); // File size
  this.writeString(view, 8, "WAVE");
  // fmt subchunk
  this.writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true); // Channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, byteRate, true); // Byte rate
  view.setUint16(32, blockAlign, true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample
  // data subchunk
  this.writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);
  // PCM data
  const offset = 44;
  for (let i = 0; i < interleaved.length; i++) {
      const sample = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }
  return new Uint8Array(buffer);
}

createAndSaveWAV(interleaved, sampleRate) {
  // Step 1: Get interleaved audio data and sample rate
  // Step 2: Generate WAV file
  const wavData = this.generateWAV(interleaved, sampleRate);
  // Step 3: Save or process the WAV file
  // Example: Create a Blob and download the file
  const blob = new Blob([wavData], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  // Create a link to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.wav";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return blob;
}

  async sendAudioFileToChatEndpoint(file) {
    const url = "http://doodlebot.media.mit.edu/chat";
    const formData = new FormData();
    formData.append("audio_file", file);
    const audioURL = URL.createObjectURL(file);
    const audio = new Audio(audioURL);
    //audio.play();

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textResponse = response.headers.get("text-response");
        console.log("Text Response:", textResponse);

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        console.log("Audio URL:", audioUrl);

        const audio = new Audio(audioUrl);
        const array = await blob.arrayBuffer();
        this.doodlebot.sendAudioData(new Uint8Array(array));

    } catch (error) {
        console.error("Error sending audio file:", error);
    }
  }
  async isValidWavFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
  
    // Check the "RIFF" chunk descriptor
    const riff = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 4)));
    if (riff !== "RIFF") {
      console.error("Invalid WAV file: Missing RIFF header");
      return false;
    }
  
    // Check the "WAVE" format
    const wave = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(8, 12)));
    if (wave !== "WAVE") {
      console.error("Invalid WAV file: Missing WAVE format");
      return false;
    }
  
    // Check for "fmt " subchunk
    const fmt = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(12, 16)));
    if (fmt !== "fmt ") {
      console.error("Invalid WAV file: Missing fmt subchunk");
      return false;
    }
  
    // Check for "data" subchunk
    const dataIndex = arrayBuffer.byteLength - 8; // Approximate location
    const dataChunk = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(dataIndex, dataIndex + 4)));
    if (dataChunk !== "data") {
      console.error("Invalid WAV file: Missing data subchunk");
      return false;
    }
  
    console.log("Valid WAV file");
    return true;
  }
  
  async processAndSendAudio(buffer) {
    try {
        const wavBlob = await this.saveAudioBufferToWav(buffer);
        console.log(wavBlob);
        const wavFile = new File([wavBlob], "output.wav", { type: "audio/wav" });
    //     const isValid = await this.isValidWavFile(wavFile);
    // if (!isValid) {
    //   throw new Error("Generated file is not a valid WAV file");
    // }
        await this.sendAudioFileToChatEndpoint(wavFile);
    } catch (error) {
        console.error("Error processing and sending audio:", error);
    }
  }

  // Internal method that can be called directly
  private async handleChatInteraction(seconds: number) {
    console.log(`recording audio for ${seconds} seconds`);
    // Display "listening" while recording
    await this.doodlebot?.display("clear");
    await this.doodlebot?.displayText("listening");
    
    const { context, buffer } = await this.doodlebot?.recordAudio(seconds);
    console.log("finished recording audio");
    
    // Display "thinking" while processing and waiting for response
    await this.doodlebot?.display("clear");
    await this.doodlebot?.displayText("thinking");
    
    // Before sending audio to be played
    await this.processAndSendAudio(buffer);
    
    // Display "speaking" when ready to speak
    await this.doodlebot?.display("clear");
    await this.doodlebot?.displayText("speaking");
    
    // Wait a moment before clearing the display
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.doodlebot?.display("clear");
  }

  @block({
    type: "command",
    text: (seconds) => `chat with me for ${seconds} seconds`,
    arg: { type: "number", defaultValue: 3 }
  })
  async testChatAPI(seconds: number) {
    await this.handleChatInteraction(seconds);
  }

  async useModel(url: string) {
    try {
      const modelUrl = this.modelArgumentToURL(url);
      console.log('Loading model from URL:', modelUrl);
      
      // Initialize prediction state if needed
      this.predictionState[modelUrl] = {};
      
      // Load and initialize the model
      const { model, type } = await this.initModel(modelUrl);
      this.predictionState[modelUrl].modelType = type;
      this.predictionState[modelUrl].model = model;
      
      // Update the current model reference
      this.teachableImageModel = modelUrl;
      
      await this.indicate({ 
        type: "success", 
        msg: "Model loaded successfully" 
      });
    } catch (e) {
      console.error('Error loading model:', e);
      this.teachableImageModel = null;
      await this.indicate({ 
        type: "error", 
        msg: "Failed to load model" 
      });
    }
  }

  modelArgumentToURL(modelArg: string) {
    // Convert user-provided model URL/ID to the correct format
    const endpointProvidedFromInterface = "https://teachablemachine.withgoogle.com/models/";
    const redirectEndpoint = "https://storage.googleapis.com/tm-model/";
    
    return modelArg.startsWith(endpointProvidedFromInterface)
      ? modelArg.replace(endpointProvidedFromInterface, redirectEndpoint)
      : redirectEndpoint + modelArg + "/";
  }

  async initModel(modelUrl: string) {
    const avoidCache = `?x=${Date.now()}`;
    const modelURL = modelUrl + "model.json" + avoidCache;
    const metadataURL = modelUrl + "metadata.json" + avoidCache;

    // First try loading as an image model
    try {
      const customMobileNet = await tmImage.load(modelURL, metadataURL);
      
      // Check if it's actually an audio model
      if ((customMobileNet as any)._metadata.hasOwnProperty('tfjsSpeechCommandsVersion')) {
        const recognizer = await speechCommands.create("BROWSER_FFT", undefined, modelURL, metadataURL);
        await recognizer.ensureModelLoaded();
        
        // Setup audio listening
        await recognizer.listen(async result => {
          this.latestAudioResults = result;
        }, {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.50
        });
        
        return { model: recognizer, type: this.ModelType.AUDIO };
      } 
      // Check if it's a pose model
      else if ((customMobileNet as any)._metadata.packageName === "@teachablemachine/pose") {
        const customPoseNet = await tmPose.load(modelURL, metadataURL);
        return { model: customPoseNet, type: this.ModelType.POSE };
      }
      // Otherwise it's an image model
      else {
        return { model: customMobileNet, type: this.ModelType.IMAGE };
      }
    } catch (e) {
      console.error("Failed to load model:", e);
      throw e;
    }
  }

  updateStageModel(modelUrl) {
    const stage = this.runtime.getTargetForStage();
    this.teachableImageModel = modelUrl;
    if (stage) {
      (stage as any).teachableImageModel = modelUrl;
    }
  }

  private getPredictionStateOrStartPredicting(modelUrl: string) {
    if (!modelUrl || !this.predictionState || !this.predictionState[modelUrl]) {
      console.warn('No prediction state available for model:', modelUrl);
      return null;
    }
    return this.predictionState[modelUrl];
  }

  model_match(state) {
    const modelUrl = this.teachableImageModel;
    const className = state;

    const predictionState = this.getPredictionStateOrStartPredicting(modelUrl);
    if (!predictionState) {
      return false;
    }

    const currentMaxClass = predictionState.topClass;
    return (currentMaxClass === String(className));
  }

  getModelClasses(): string[] {
    if (
      !this.teachableImageModel ||
      !this.predictionState ||
      !this.predictionState[this.teachableImageModel] ||
      !this.predictionState[this.teachableImageModel].hasOwnProperty('model')
    ) {
      return ["Select a class"];
    }

    if (this.predictionState[this.teachableImageModel].modelType === this.ModelType.AUDIO) {
      return this.predictionState[this.teachableImageModel].model.wordLabels();
    }

    return this.predictionState[this.teachableImageModel].model.getClassLabels();
  }

  getModelPrediction() {
    const modelUrl = this.teachableImageModel;
    const predictionState: { topClass: string } = this.getPredictionStateOrStartPredicting(modelUrl);
    if (!predictionState) {
      console.error("No prediction state found");
      return '';
    }
    return predictionState.topClass;
  }

  private _loop() {
    setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, this.INTERVAL));
    const time = Date.now();
    if (this.lastUpdate === null) {
      this.lastUpdate = time;
    }
    if (!this.isPredicting) {
      this.isPredicting = 0;
    }
    const offset = time - this.lastUpdate;

    if (offset > this.INTERVAL && this.isPredicting === 0) {
      this.lastUpdate = time;
      this.isPredicting = 0;
      this.getImageStreamAndPredict();
    }
  }

  private async getImageStreamAndPredict() {
    try {
      const imageStream = await this.getImageStream();
      if (!imageStream) {
        console.error("Failed to get image stream");
        return;
      }
      const imageBitmap = await createImageBitmap(imageStream);
      this.predictAllBlocks(imageBitmap);
    } catch (error) {
      console.error("Error in getting image stream and predicting:", error);
    }
  }

  private async predictAllBlocks(frame: ImageBitmap) {
    for (let modelUrl in this.predictionState) {
      if (!this.predictionState[modelUrl].model) {
        console.log('No model found for:', modelUrl);
        continue;
      }
      if (this.teachableImageModel !== modelUrl) {
        console.log('Model URL mismatch:', modelUrl);
        continue;
      }
      ++this.isPredicting;
      const prediction = await this.predictModel(modelUrl, frame);
      console.log('Prediction:', prediction);
      this.predictionState[modelUrl].topClass = prediction;
      --this.isPredicting;
    }
  }

  private async predictModel(modelUrl: string, frame: ImageBitmap) {
    const predictions = await this.getPredictionFromModel(modelUrl, frame);
    if (!predictions) {
      return;
    }
    let maxProbability = 0;
    let maxClassName = "";
    for (let i = 0; i < predictions.length; i++) {
      const probability = predictions[i].probability.toFixed(2);
      const className = predictions[i].className;
      this.modelConfidences[className] = probability;
      if (probability > maxProbability) {
        maxClassName = className;
        maxProbability = probability;
      }
    }
    this.maxConfidence = maxProbability;
    return maxClassName;
  }

  private async getPredictionFromModel(modelUrl: string, frame: ImageBitmap) {
    const { model, modelType } = this.predictionState[modelUrl];
    switch (modelType) {
      case this.ModelType.IMAGE:
        if (!frame) return null;
        return await model.predict(frame);
      case this.ModelType.POSE:
        if (!frame) return null;
        const { pose, posenetOutput } = await model.estimatePose(frame);
        return await model.predict(posenetOutput);
      case this.ModelType.AUDIO:
        if (this.latestAudioResults) {
          return model.wordLabels().map((label, i) => ({
            className: label,
            probability: this.latestAudioResults.scores[i]
          }));
        }
        return null;
    }
  }

  @block({
    type: "command",
    text: (seconds) => `capture for ${seconds} seconds`,
    arg: { type: "number", defaultValue: 10 }
  })
  async captureSnapshots(seconds: number) {
    // Create indicator to show progress
    const indicator = await this.indicate({ 
      type: "warning",
      msg: "Capturing snapshots..." 
    });

    const snapshots: string[] = [];
    const zip = new JSZip();
    
    // Ensure we have video stream
    this.imageStream ??= await this.doodlebot?.getImageStream();
    if (!this.imageStream) {
      indicator.close();
      await this.indicate({ 
        type: "error", 
        msg: "No video stream available" 
      });
      return;
    }

    // Capture a snapshot every 500ms
    const interval = 100; // 500ms between snapshots
    const iterations = (seconds * 1000) / interval;
    
    for (let i = 0; i < iterations; i++) {
      // Create a canvas to draw the current frame
      const canvas = document.createElement('canvas');
      canvas.width = this.imageStream.width;
      canvas.height = this.imageStream.height;
      const ctx = canvas.getContext('2d');
      
      // Draw current frame to canvas
      ctx.drawImage(this.imageStream, 0, 0);
      
      // Convert to base64 and store
      const dataUrl = canvas.toDataURL('image/jpeg');
      snapshots.push(dataUrl);
      
      // Add to zip file
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      zip.file(`snapshot_${i+1}.jpg`, base64Data, {base64: true});
      
      // Wait for next interval
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    // Generate zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Create download link
    const downloadUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'snapshots.zip';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(downloadUrl);
    indicator.close();
    
    await this.indicate({ 
      type: "success", 
      msg: `Captured ${snapshots.length} snapshots` 
    });
  }
}

