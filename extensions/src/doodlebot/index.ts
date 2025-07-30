import { Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock, BlockUtilityWithID, scratch } from "$common";
import { DisplayKey, displayKeys, command, type Command, SensorKey, sensorKeys } from "./enums";
import Doodlebot, { NetworkCredentials } from "./Doodlebot";
import FileArgument from './FileArgument.svelte';
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

export var imageFiles = [];
export var soundFiles: string[] = [];

export default class DoodlebotBlocks extends extension(details, "ui", "customArguments", "indicators", "video", "drawable") {
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

  soundDictionary;
  costumeDictionary: any;

  externalIp: string

  voice_id: number;
  pitch_value: number;

  blocksRun: number;

  SOCIAL = false;
  socialness = 1.0; // Value from 0 to 1, where 1 is always social and 0 is never social

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async blockCounter(utility: BlockUtilityWithID) {
    if (JSON.parse(JSON.stringify(utility.blockID)) == JSON.parse(JSON.stringify(utility.thread.topBlock))) {
      this.blocksRun = 0;
      const r = Math.random();
      console.log("starting", r);
      if (r < 0.3) {
        await this.speakText("Here I go!");
      } else if (r < 0.6) {
        await this.speakText("Let's do it!");
      }
    }
    this.blocksRun = this.blocksRun + 1;
  }

  async init(env: Environment) {
    this.blocksRun = 0;
    this.voice_id = 1;
    this.pitch_value = 0;
    this.soundDictionary = {};
    this.costumeDictionary = {};
    this.setIndicator("disconnected");
    if (window.isSecureContext) this.openUI("Connect")
    else this.connectToDoodlebotWithExternalBLE();
    this._loop();
    env.runtime.on("TARGETS_UPDATE", async () => {
      await this.setDictionaries();
    })

    await this.setDictionaries();
    console.log("env", env);

    soundFiles = ["File"];
    imageFiles = ["File"];

    // try {
    //   const url = `https://doodlebot.media.mit.edu/settings?voice=1&pitch=0`;
    //   const response = await fetch(url, {
    //     method: "POST"
    //   });
  
    //   if (!response.ok) {
    //     const text = await response.text();
    //     console.error("Error setting voice/pitch:", text);
    //   }
    // } catch (error) {
    //   console.error("Failed to update settings:", error);
    // }

    // env.runtime.on("PROJECT_RUN_START", async () => {
      
    // })
    env.runtime.on("PROJECT_RUN_STOP", async () => {
      if (this.blocksRun > 10) {
        const r = Math.random();
        console.log("blocks > 10", r);
        if (r < 0.3) {
          await this.speakText("Whew!")
        } else if (r < 0.6) {
          await this.speakText("That was tough!")
        }
      } else {
        const r = Math.random(); 
        console.log("blocks < 10", r);
        if (r < 0.2) {
          await this.speakText("Yay!");
        } else if (r < 0.4) {
          await this.speakText("Yippee!");
        } else if (r < 0.5) {
          await this.speakText("I did it!");
        } else if (r < 0.6) {
          await this.speakText("Go Doodlebot!");
        }
      }
    })
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
            await this.convertSvgUint8ArrayToPng(costume.asset.data, costume.size[0], costume.size[1])
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

  async convertSvgUint8ArrayToPng(uint8Array, width, height) {
    return new Promise((resolve, reject) => {
      // Convert Uint8Array to a string
      const svgString = new TextDecoder().decode(uint8Array);

      // Create an SVG Blob
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create an Image element
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to PNG data URL
        const pngDataUrl = canvas.toDataURL('image/png');

        // Convert the data URL to a Blob
        fetch(pngDataUrl)
          .then(res => res.blob())
          .then(blob => {
            // Clean up
            URL.revokeObjectURL(url);
            resolve(blob);
          })
          .catch(err => {
            URL.revokeObjectURL(url);
            reject(err);
          });
      };

      img.onerror = reject;
      img.src = url;
    });
  }

  private async connectToDoodlebotWithExternalBLE() {
    // A few globals that currently must be set the same across the playground and the https frontend
    const handshakeMessage = "doodlebot";
    const disconnectMessage = "disconnected";
    const commandCompleteIdentifier = "done";

    const urlParams = new URLSearchParams(window.location.search); // Hack for now -jon

    const ip = urlParams.get("ip");

    if (!ip) {
      alert("No IP address provided. Please provide an IP address in the URL query string.");
      return;
    }

    this.externalIp = ip;

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
        console.log("posting ready");
        source.postMessage("ready", { targetOrigin: origin })
        resolve({ source, targetOrigin: origin });
      }
      window.addEventListener("message", onInitialMessage);
    });

    console.log("source", source);
    console.log("target origin", targetOrigin);

    const doodlebot = new Doodlebot(
      {
        send: (text) => new Promise<void>(resolve => {
          const onMessageReturn = ({ data, origin }: MessageEvent<string>) => {
            if (origin !== targetOrigin || !data.includes(text) || !data.includes(commandCompleteIdentifier)) {
              console.log("error -- source");
              return;
            } 
            window.removeEventListener("message", onMessageReturn);
            resolve();
          }
          window.addEventListener("message", onMessageReturn);
          console.log("posting message");
          source.postMessage(text, { targetOrigin });
        }),

        onReceive: (callback) => {
          window.addEventListener('message', ({ data, origin }) => {
            console.log("RECEIVED", data);
            if (origin !== targetOrigin || data === disconnectMessage || data.includes(commandCompleteIdentifier)) {
              console.log("error 2 -- source", data);
              return;
            } 
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
      () => alert("save IP called"), // placeholder,
      async (description) => {
        // Send the fetch request to the source
        console.log("INSIDE FETCH 2");
        
        return new Promise<string>((resolve, reject) => {
          console.log("INSIDE PROMISE 2");
          const fetchReturn = (event: MessageEvent) => {
            console.log("inside return");
            if (event.origin !== targetOrigin) {
              console.log("ERROR", event.origin, targetOrigin);
              return;
            }
            if (!event.data.startsWith("fetchResponse---")) {
              console.log("ERROR", event.data);
              return;
            }
            const urlReturned = event.data.split("---")[1];
            if ("webrtc" != urlReturned) {
              console.log("URL NOT SAME");
              return;
            }
            const response = event.data.split("---")[2];
            console.log("RESPONSE", JSON.parse(response));
            window.removeEventListener('message', fetchReturn);
            resolve(JSON.parse(response));
          }
          console.log("adding return");
          window.addEventListener('message', fetchReturn);
          console.log("posting message", `fetch---webrtc---${description}`, targetOrigin);
          source.postMessage(`fetch---webrtc---${description}`, { targetOrigin });
        });
      }
    )
    doodlebot.fetch = async (url: string, type: string, options?: string) => {
      // Send the fetch request to the source
      return new Promise<string>((resolve, reject) => {
        const fetchReturn = (event: MessageEvent) => {
          if (event.origin !== targetOrigin) {
            console.log("ERROR", event.origin, targetOrigin);
            return;
          }
          if (!event.data.startsWith("fetchResponse---")) {
            console.log("ERROR", event.data);
            return;
          }
          const urlReturned = event.data.split("---")[1];
          if (url != urlReturned) {
            console.log("URL NOT SAME");
            return;
          }
          const response = event.data.split("---")[2];
          console.log("RESPONSE", response);
          window.removeEventListener('message', fetchReturn);
          resolve(response);
        }
        console.log("adding return");
        window.addEventListener('message', fetchReturn);
        console.log("posting message", `fetch---${type}--${url}`, targetOrigin);
        if (options) {
          source.postMessage(`fetch---${type}---${url}---${JSON.stringify(options)}`, { targetOrigin });
        } else {
          source.postMessage(`fetch---${type}---${url}`, { targetOrigin });
        }
      });
    }
    doodlebot.setIP(ip);
    this.setDoodlebot(doodlebot);

    
  }

  getCurrentSounds(id): string[] {
    return Object.keys(this.soundDictionary[id]);
  }

  async setDoodlebot(doodlebot: Doodlebot) {
    this.doodlebot = doodlebot;
    await this.setIndicator("connected");

    const urlParams = new URLSearchParams(window.location.search); // Hack for now -jon
    const ip = urlParams.get("ip");
    this.doodlebot.setIP(ip);

    try {
      imageFiles = await doodlebot.findImageFiles();
      soundFiles = await doodlebot.findSoundFiles();
    } catch (e) {
      //this.openUI("ArrayError");
    }
    
    // Wait a short moment to ensure connection is established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (this.SOCIAL && Math.random() < this.socialness && this.doodlebot) {
        await this.doodlebot.display("happy");
        await this.speakText("Hi! I'm Doodlebot! I'm here to help you learn about AI and robotics! If you have any questions, just click on the chat with me block and I'll do my best to help you out!");
      }
    } catch (error) {
      console.error("Error during welcome message:", error);
      // Don't throw the error - we still want the robot to be usable even if the welcome message fails
    }

    try {
      console.log("FETCHING");
      const ip = await this.getIPAddress();
      console.log(doodlebot.fetch);
      imageFiles = await doodlebot.fetch(`http://${ip}:8080/images`, "text");
      imageFiles = doodlebot.extractList(imageFiles);
      console.log("FILES", imageFiles)
      soundFiles = await doodlebot.fetch(`http://${ip}:8080/sounds`, "text");
      soundFiles = doodlebot.extractList(soundFiles);
    } catch (e) {
      //this.openUI("ArrayError");
    }
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

  // async createVideoStreamDrawable() {
  //   this.imageStream ??= this.doodlebot?.getImageStream();
  //   if (!this.imageStream) {
  //     console.error("Failed to get image stream");
  //     return;
  //   }
  //   //console.log("Image stream dimensions:", this.imageStream.width, "x", this.imageStream.height);
  //   const drawable = this.createDrawable(this.imageStream);
  //   drawable.setVisible(true);
  //   const self = this;
  //   const update = () => {
  //     drawable.update(this.doodlebot?.getImageStream());
  //     requestAnimationFrame(update);
  //   }
  //   requestAnimationFrame(update);
  //   return drawable;
  // }

  async createVideoStreamDrawable() {
    this.imageStream ??= this.doodlebot?.getImageStream();
    if (!this.imageStream) {
      console.error("Failed to get image stream");
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

  // @block({
  //   type: "command",
  //   text: (value) => `set socialness to ${value}`,
  //   arg: { 
  //     type: "number", 
  //     defaultValue: 1.0
  //   }
  // })
  // async setSocialness(value: number) {
  //   // Ensure value is between 0 and 1
  //   this.socialness = Math.max(0, Math.min(1, value));
    
  //   if (this.SOCIAL && Math.random() < this.socialness) {
  //     await this.doodlebot?.display("happy");
  //     await this.speakText(`I'll be ${Math.round(this.socialness * 100)}% social from now on!`);
  //   }
  // }

  // @block({
  //   type: "command",
  //   text: (seconds) => `chat with me for ${seconds} seconds`,
  //   arg: { type: "number", defaultValue: 3 }
  // })
  // async testChatAPI(seconds: number) {
  //   await this.handleChatInteraction(seconds, "chat");
  // }

  // @block({
  //   type: "command",
  //   text: (seconds) => `repeat after me for ${seconds} seconds`,
  //   arg: { type: "number", defaultValue: 3 }
  // })
  // async testRepeatAPI(seconds: number) {
  //   await this.handleChatInteraction(seconds, "repeat_after_me");
  // }

  @block({
    type: "command",
    text: (voice, pitch) => `set voice to ${voice} and pitch to ${pitch}`,
    args: [
      { type: "number", defaultValue: 1, name: "voice" },
      { type: "number", defaultValue: 0, name: "pitch" }
    ]
  })
  async setVoiceAndPitch(voice: number, pitch: number) {
    this.voice_id = voice;
    this.pitch_value = pitch;
  }
  

  // @block({
  //   type: "command",
  //   text: (seconds) => `listen for ${seconds} seconds and repeat`,
  //   arg: { type: "number", defaultValue: 3 }
  // })
  // async repeatAfterMe(seconds: number) {
  //   // Record the audio
  //   const { context, buffer } = await this.doodlebot?.recordAudio(seconds);
    
  //   // Convert to WAV format
  //   const wavBlob = await this.saveAudioBufferToWav(buffer);
  //   const arrayBuffer = await wavBlob.arrayBuffer();
    
  //   // Send the audio data directly to the Doodlebot for playback
  //   await this.doodlebot.sendAudioData(new Uint8Array(arrayBuffer));
    
  //   // Wait until playback is complete (approximately buffer duration)
  //   const playbackDuration = buffer.duration * 1000; // convert to milliseconds
  //   await new Promise(resolve => setTimeout(resolve, playbackDuration));
  // }

  @block({
    type: "command",
    text: (text) => `speak ${text}`,
    arg: { type: "string", defaultValue: "Hello!" }
  })
  async speak(text: string, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    await this.speakText(text);
  }

  // @block({
  //   type: "command",
  //   text: (type: DisplayKey) => `display emotion ${type}`,
  //   arg: { type: "string", options: displayKeys.filter(key => key !== "clear"), defaultValue: "happy" }
  // })
  // async setDisplay(display: DisplayKey) {
  //   await this.doodlebot?.display(display);
  // }

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
    text: (direction, steps, speed) => `drive ${direction} for ${steps} steps at speed ${speed}`,
    args: [
      { type: "string", options: ["forward", "backward", "left", "right"], defaultValue: "forward" },
      { type: "number", defaultValue: 2000 },
      { type: "number", options: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], defaultValue: 2000 }
    ]
  })
  async drive(direction: "left" | "right" | "forward" | "backward", steps: number, speed: number) {
    const leftSteps = direction == "left" || direction == "backward" ? -steps : steps;
    const rightSteps = direction == "right" || direction == "backward" ? -steps : steps;
    const stepsPerSecond = speed;

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
  async arc(direction: "left" | "right", radius: number, degrees: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("happy");
      await this.speakText(`Driving ${direction} arc with radius ${radius} for ${degrees} degrees`);
    }
    if (direction == "right") degrees *= -1;
    await this.doodlebot?.motorCommand("arc", radius, degrees);
  }

  @block({
    type: "command",
    text: (degrees) => `spin ${degrees} degrees`,
    arg: { type: "angle", defaultValue: 90 }
  })
  async spin(degrees: number, utility: BlockUtilityWithID) {
    await this.blockCounter(utility);
    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("happy");
      await this.speakText(`Spinning ${degrees} degrees`);
    }
    if (degrees === 0) return;
    await this.doodlebot?.motorCommand("arc", 0, -degrees);
  }

  @block({
    type: "command",
    text: "stop driving"
  })
  async stop() {
    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("disgust");
      await this.speakText("okk, I will stop driving now.");
    }
    await this.doodlebot?.motorCommand("stop");
  }


  // @block({
  //   type: "command",
  //   text: "perform line following"
  // })
  // async testLine2() {
  //   if (this.SOCIAL) {
  //     await this.speakText("Starting line following now!");
  //   }
  //   await this.doodlebot.followLine();
  // }

  // @block({
  //   type: "command",
  //   text: "get predictions"
  // })
  // async testLine2() {
  //   if (this.SOCIAL) {
  //     await this.speakText("Starting line following now!");
  //   }
  //   await this.doodlebot.followLine();
  // }

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

  // @block({
  //   type: "command",
  //   text: (sensor: SensorKey) => `disable ${sensor}`,
  //   arg: { type: "string", options: sensorKeys, defaultValue: sensorKeys[0] }
  // })
  // async disableSensor(sensor: SensorKey) {
  //   await this.doodlebot?.disableSensor(sensor);
  // }

  @block({
    type: "command",
    text: (direction1, direction2) => `move eyes from ${direction1} to ${direction2}`,
    args: [
      { type: "string", options: ["center", "left", "right", "up", "down"] },
      { type: "string", options: ["center", "left", "right", "up", "down"] },
    ]
  })
  async moveEyes(direction1: string, direction2: string) {
    await this.doodlebot.moveEyes(direction1, direction2);
  }

  @block({
    type: "command",
    text: (sound) => `play sound track${sound}`,
    arg: { type: "number", defaultValue: 1 }
  })
  async playSound(sound: number) {
    await this.doodlebot?.sendWebsocketCommand("m", sound)
  }

  @block((self) => ({
    type: "command",
    text: (sound) => `play sound ${sound}`,
    arg: {
      type: "string", options: () => soundFiles.concat(self.getCurrentSounds(self.runtime._editingTarget.id))
    }
  }))
  async playSoundFile(sound: string, util: BlockUtilityWithID) {
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
        return displayKeys.filter(key => key !== "clear").concat(imageFiles).concat(Object.keys(self.costumeDictionary[self.runtime._editingTarget.id]) as any[]).filter((item: string) => item != "costume9999.png")
      }, defaultValue: "happy"
    }
  }))
  async setDisplay(display: DisplayKey | string) {
    let costumeNames = Object.keys(this.costumeDictionary[this.runtime._editingTarget.id]);
    if (costumeNames.includes(display)) {
      await this.uploadFile("image", this.costumeDictionary[this.runtime._editingTarget.id][display]);
      await this.setArrays();
      await this.doodlebot.displayFile("costume9999.png");
    } else if (imageFiles.includes(display)) {
      await this.doodlebot?.displayFile(display);
    } else {
      await this.doodlebot?.display(display as DisplayKey);
    }

  }

  async getIPAddress() {
    if (window.isSecureContext) {
      return this.doodlebot?.getStoredIPAddress();
    } else {
      return this.externalIp;
    }
  }

  // @block({
  //   type: "command",
  //   text: (transparency) => `display video with ${transparency}% transparency`,
  //   arg: { type: "number", defaultValue: 0 }
  // })
  // async connectToVideo(transparency: number) {
  //   this.videoDrawable ??= await this.createVideoStreamDrawable();
  //   this.videoDrawable.setTransparency(transparency);
  // }

  @block({
    type: "command",
    text: "display video",
  })
  async connectToVideo() {
    this.videoDrawable ??= await this.createVideoStreamDrawable();
    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("happy");
      await this.speakText("You can now see what I see on your screen!");
    }
  }

  @block({
    type: "command",
    text: "start video segmentation",
  })
  async startVideoSegmentation() {
    const ip = await this.getIP();
    await this.doodlebot?.callSegmentation(ip);
  }

  // @block({
  //   type: "hat",
  //   text: (gesture) => `when ${gesture} detected`,
  //   arg: { type: "string", defaultValue: "Thumb_Up", options: gestureMenuItems }
  // })
  // whenGesture(gesture: keyof typeof this.gestureState) {
  //   const self = this;

  //   this.gestureLoop ??= looper(async () => {
  //     self.imageStream ??= await self.doodlebot?.getImageStream();
  //     const result = await gestureDetection(self.imageStream);

  //     for (const k in self.gestureState) self.gestureState[k] = false;

  //     for (const arr of result.gestures)
  //       for (const gesture of arr)
  //         self.gestureState[gesture.categoryName] = true;
  //   }, "gesture detection");

  //   return this.gestureState[gesture];
  // }

  // @block({
  //   type: "reporter",
  //   text: (object) => `degrees from ${object}`,
  //   arg: { type: "string", defaultValue: "cup", options: classes }
  // })
  // async getOffsetFromObject(object: typeof classes[number]) {
  //   this.imageStream ??= await this.doodlebot?.getImageStream();
  //   const result = await objectDetection(this.imageStream);
  //   for (const detection of result.detections) {
  //     const isCup = detection.categories.some(({ categoryName }) => categoryName === object);
  //     if (!isCup) continue;
  //     if (!detection.boundingBox) continue;
  //     const x = detection.boundingBox.originX + detection.boundingBox.width / 2;
  //     const xOffset = x - this.imageStream.width / 2;
  //     return xOffset * 90 / this.imageStream.width;
  //   }
  //   return 0;
  // }

  // @block({
  //   type: "command",
  //   text: (seconds) => `record for ${seconds} seconds and play`,
  //   arg: { type: "number", defaultValue: 1 }
  // })
  // async recordAudio(seconds: number) {
  //   const { context, buffer } = await this.doodlebot?.recordAudio(seconds);

  //   const audioBufferSource = context.createBufferSource();
  //   audioBufferSource.buffer = buffer;

  //   const gainNode = context.createGain();
  //   audioBufferSource.connect(gainNode);
  //   gainNode.connect(context.destination);

  //   const fadeInDuration = 0.1;
  //   const fadeOutDuration = 0.1;
  //   const audioDuration = audioBufferSource.buffer.duration;

  //   // Start with silence
  //   gainNode.gain.setValueAtTime(0, context.currentTime);
  //   gainNode.gain.linearRampToValueAtTime(1, context.currentTime + fadeInDuration);

  //   gainNode.gain.setValueAtTime(1, context.currentTime + audioDuration - fadeOutDuration);
  //   gainNode.gain.linearRampToValueAtTime(0, context.currentTime + audioDuration);

  //   audioBufferSource.start();
  //   audioBufferSource.stop(context.currentTime + audioDuration);

  //   await new Promise((resolve) => setTimeout(resolve, audioDuration * 1000));
  // }
  
  async setArrays() {
    imageFiles = await this.doodlebot.findImageFiles();
    soundFiles = await this.doodlebot.findSoundFiles();
    console.log("SETTING");
  }

  async uploadFile(type: string, blobURL: string) {
    console.log("BEFORE IP");
    const ip = await this.getIPAddress();
    console.log("GOT IP");
    let uploadEndpoint;
    if (type == "sound") {
      uploadEndpoint = "https://" + ip + "/api/v1/upload/sounds_upload";
    } else {
      uploadEndpoint = "https://" + ip + "/api/v1/upload/img_upload";
    }

    try {
      const components = blobURL.split("---name---");
      console.log("COMPONENTS");
      console.log(components);
      console.log("BEFORE BLOB");
      const response1 = await fetch(components[1]);
      console.log("AFTER BLOB");
      if (!response1.ok) {
        throw new Error(`Failed to fetch Blob from URL: ${blobURL}`);
      }
      const blob = await response1.blob();
      if (window.isSecureContext) {
        console.log("BEFORE BLOB 2");
        
        console.log("AFTER BLOB 2");
        // Convert Blob to File
        const file = new File([blob], components[0], { type: blob.type });
        const formData = new FormData();
        formData.append("file", file);

        console.log("file");
        console.log(file);
        console.log("BEFORE FETCH");
        const response2 = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });
        console.log("AFTER FETCH");
        console.log(response2);

        if (!response2.ok) {
          throw new Error(`Failed to upload file: ${response2.statusText}`);
        }

        console.log("File uploaded successfully");
        this.setArrays();
      } else {
        const base64 = await this.blobToBase64(blob);
          const payload = {
            filename: components[0],
            content: base64,
            mimeType: blob.type,
          };
          const response2 = await this.doodlebot.fetch(uploadEndpoint, "file_upload", payload);
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async callSinglePredict() {
    console.log("inside");
    const ip = await this.getIP();
    const uploadEndpoint = "https://" + ip + "/api/v1/video/single_predict";
    console.log("calling single predict");
    if (window.isSecureContext) {
      const response2 = await fetch(uploadEndpoint);
      const responseJson = await response2.json();
      return responseJson;
    } else {
      const response2 = await this.doodlebot.fetch(uploadEndpoint, "json");
      const responseJson = JSON.parse(response2);
      return responseJson;
    }
    
  }

  @block({
    type: "reporter",
    text: (location, type) => `get ${location} of ${type}`,
    args: [
      { type: "string", options: ["x", "y"], defaultValue: "x" },
      { type: "string", options: ["face", "apple", "orange"], defaultValue: "face" }
    ]
  })
  async getSinglePredict2s(location: string, type: string) {
    const reading = await this.callSinglePredict();
    if (type == "face") {
      if (reading.faces.length == 0) {
        return 0;
      }
      if (location == "x") {
        return reading.faces[0].x;
      } else {
        return reading.faces[0].y;
      }
    } else {
      if (reading.objects.length == 0) {
        return 0;
      }
      if (type == "apple") {
        const firstApple = reading.objects.find(obj => obj.label === "apple");
        if (firstApple) {
          if (location == "x") {
            return firstApple.x;
          } else {
            return firstApple.y;
          }
        } else {
          return 0;
        }
      } else {
        const firstOrange = reading.objects.find(obj => obj.label === "orange");
        if (firstOrange) {
          if (location == "x") {
            return firstOrange.x;
          } else {
            return firstOrange.y;
          }
        } else {
          return 0;
        }
      }
      
    }
  }

  @block({
    type: "reporter",
    text: (type) => `is ${type} detected`,
    args: [{ type: "string", options: ["face", "apple", "orange"], defaultValue: "face" }]
  })
  async isFaceDetected(type: string) {
    const reading = await this.callSinglePredict();
    if (reading.faces.length > 0 && type == "face") {
      return true;
    }
    if (reading.objects.length > 0 && type == "apple") {
      const firstApple = reading.objects.find(obj => obj.label === "apple");
      return firstApple ? true : false;
    }
    if (reading.objects.length > 0 && type == "orange") {
      const firstOrange = reading.objects.find(obj => obj.label === "orange");
      return firstOrange ? true : false;
    }
    return false;
  }

  @(scratch.command((self, $) => $`Upload sound file ${self.makeCustomArgument({ component: FileArgument, initial: { value: "", text: "File" } })}`))
  async uploadSoundFile(test: string) {
    await this.uploadFile("sound", test);
  }

  @(scratch.command((self, $) => $`Upload image file ${self.makeCustomArgument({ component: FileArgument, initial: { value: "", text: "File" } })}`))
  async uploadImageFile(test: string) {
    await this.uploadFile("image", test);
  }

  @block({
    type: "command",
    text: (volume) => `set volume to ${volume}`,
    arg: { type: "number", options: [0, 100, 200, 300], defaultValue: 100 },

  })
  async setVolume(volume: 0 | 100 | 200 | 300) {
    await this.doodlebot?.setVolume(volume)
  }

  @block({
    type: "command",
    text: (size) => `set font size to ${size}`,
    arg: { type: "string", options: ["small", "medium", "large"], defaultValue: "medium" },

  })
  async setFont(size: "small" | "medium" | "large") {
    await this.doodlebot?.setFont(size);
  }
  


  // @block({
  //   type: "reporter",
  //   text: "get IP address"
  // })
  async getIP() {
    return this.doodlebot?.getIPAddress();
  }

  // @block({
  //   type: "command",
  //   text: (_command, args, protocol) => `send (${_command}, ${args}) over ${protocol}`,
  //   args: [
  //     { type: "string", defaultValue: "u" },
  //     { type: "string", defaultValue: "0" },
  //     { type: "string", options: ["BLE", "Websocket"], defaultValue: "BLE" }
  //   ]
  // })
  // async sendMessage(_command: string, args: string, protocol: "BLE" | "Websocket") {
  //   const candidates = Object.values(command).filter((entry) => entry === _command)
  //   if (candidates.length === 0) return console.error(`Command ${command} not found`);

  //   protocol === "BLE"
  //     ? await this.doodlebot?.sendBLECommand(candidates[0], ...splitArgsString(args))
  //     : await this.doodlebot?.sendWebsocketCommand(candidates[0], ...splitArgsString(args));
  // }

  // @block({
  //   type: "command",
  //   text: (url) => `import AI model ${url}`,
  //   arg: {
  //     type: "string",
  //     defaultValue: "URL HERE"
  //   }
  // })
  // async importModel(url: string) {
  //   if (this.SOCIAL && Math.random() < this.socialness) {
  //     await this.doodlebot?.display("happy");
  //     await this.speakText(`Importing Teachable Machine model`);
  //   }
  //   await this.useModel(url);

  //   if (this.SOCIAL && Math.random() < this.socialness) {
  //     await this.doodlebot?.display("happy");
  //     await this.speakText(`Model imported successfully. You can access your image classes using the model prediction blocks.`);
  //     await this.speakText(`Let me know if you have any questions.`);
  //   }
  // }


  // @block({
  //   type: "hat",
  //   text: (className) => `when model detects ${className}`,
  //   arg: {
  //     type: "string",
  //     options: function () {
  //       if (!this) {
  //         throw new Error('Context is undefined');
  //       }
  //       return this.getModelClasses() || ["Select a class"];
  //     },
  //     defaultValue: "Select a class"
  //   }
  // })
  // whenModelDetects(className: string) {
  //   return this.model_match(className);
  // }

  // @block({
  //   type: "reporter",
  //   text: "get AI prediction",
  // })
  // modelPrediction() {
  //   return this.getModelPrediction();
  // }

  // @block({
  //   type: "reporter",
  //   text: (className) => `confidence for ${className}`,
  //   arg: {
  //     type: "string",
  //     options: function () {
  //       if (!this) {
  //         throw new Error('Context is undefined');
  //       }
  //       return this.getModelClasses() || ["Select a class"];
  //     },
  //     defaultValue: "Select a class"
  //   }
  // })
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

blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // "data:<mime>;base64,<base64>"
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

  async sendAudioFileToChatEndpoint(file, endpoint, blob, seconds) {
    console.log("sending audio file");
    const url = `https://doodlebot.media.mit.edu/${endpoint}?voice=${this.voice_id}&pitch=${this.pitch_value}`
    const formData = new FormData();
    formData.append("audio_file", file);
    const audioURL = URL.createObjectURL(file);
    const audio = new Audio(audioURL);
    //audio.play();

    try {
        let response;
        let uint8array;
        // if (window.isSecureContext) {
          
          // if (endpoint == "repeat_after_me") {
          //   const eventSource = new EventSource("http://doodlebot.media.mit.edu/viseme-events");

          //   eventSource.onmessage = (event) => {
          //     console.log("Received viseme event:", event.data);
          //     try {
          //       const data = JSON.parse(event.data);
          //       const visemeId = data.visemeId;
          //       const offsetMs = data.offsetMs;
          
          //       // You can customize which viseme IDs should trigger a command.
          //       // For now, all non-silence visemes trigger it.
          //       if (visemeId !== 0) {
          //         setTimeout(() => {
          //           this.doodlebot.display("happy");
          //           console.log("DISPLAYING");
          //         }, offsetMs);
          //       }
          //     } catch (err) {
          //       console.error("Failed to parse viseme event:", err);
          //     }
          //   };

          //   eventSource.onerror = (err) => {
          //     console.error("EventSource failed:", err);
          //     eventSource.close();
          //   };
          // }

          response = await fetch(url, {
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
          uint8array = new Uint8Array(array);
        // } else {
        //   const base64 = await this.blobToBase64(blob);
        //   const payload = {
        //     filename: file.name,
        //     content: base64,
        //     mimeType: blob.type,
        //   };
        //   response = await this.doodlebot.fetch(endpoint, "chatgpt", payload);
        //   uint8array = new Uint8Array([...atob(response)].map(char => char.charCodeAt(0)));
        // }
        const interval = 50; // 0.2 seconds in milliseconds
        const endTime = Date.now() + 1 * 1000;

        this.doodlebot.sendAudioData(uint8array);
        while (Date.now() < endTime) {
          await this.doodlebot.sendWebsocketCommand("d,O");
          await new Promise((res) => setTimeout(res, interval));
          await this.doodlebot.sendWebsocketCommand("d,N");
          await new Promise((res) => setTimeout(res, interval));
        }
        

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
  
  async processAndSendAudio(buffer, endpoint, seconds) {
    try {
        const wavBlob = await this.saveAudioBufferToWav(buffer);
        console.log(wavBlob);
        const wavFile = new File([wavBlob], "output.wav", { type: "audio/wav" });

        // // Create a temporary URL for the file
        // const url = URL.createObjectURL(wavFile);

        // // Create a temporary anchor element
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "output.wav";
        // document.body.appendChild(a);

        // // Trigger the download
        // a.click();

        // // Clean up
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
    //     const isValid = await this.isValidWavFile(wavFile);
    // if (!isValid) {
    //   throw new Error("Generated file is not a valid WAV file");
    // }
        await this.sendAudioFileToChatEndpoint(wavFile, endpoint, wavBlob, seconds);
    } catch (error) {
        console.error("Error processing and sending audio:", error);
    }
  }

  // Internal method that can be called directly
  private async handleChatInteraction(seconds: number, endpoint: string) {
    console.log(`recording audio for ${seconds} seconds`);
    // Display "listening" while recording
    await this.doodlebot?.display("clear");
    await this.doodlebot?.displayText("listening");
    console.log("recording audio?")
    const { context, buffer } = await this.doodlebot?.recordAudio(seconds);
    console.log("finished recording audio");
    
    // Display "thinking" while processing and waiting for response
    await this.doodlebot?.display("clear");
    await this.doodlebot?.displayText("thinking");
    
    // Before sending audio to be played
    await this.processAndSendAudio(buffer, endpoint, seconds);
    
    // Display "speaking" when ready to speak
    // await this.doodlebot?.display("clear");
    // await this.doodlebot?.displayText("speaking");
    
    // Wait a moment before clearing the display
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.doodlebot?.display("h");
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
      const imageStream = this.getImageStream();
      if (!imageStream) {
        console.error("Failed to get image stream");
        return;
      }
      // const imageBitmap = await createImageBitmap(imageStream);
      // this.predictAllBlocks(imageBitmap);
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

  // @block({
  //   type: "command",
  //   text: (imageClass, seconds) => `capture snapshots of ${imageClass} class for ${seconds} seconds`,
  //   args: [
  //     { type: "string", defaultValue: "class name" },
  //     { type: "number", defaultValue: 10 }
  //   ]
  // })
  async captureSnapshots(imageClass: string, seconds: number) {
    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("love");
      await this.speakText(`Bring the ${imageClass} to my camera, and I will capture snapshots of it for you.`);
      await this.speakText("Ready Set Go!");
    }

    // Create indicator to show progress
    const indicator = await this.indicate({ 
      type: "warning",
      msg: `Capturing snapshots of ${imageClass}...` 
    });

    const snapshots: string[] = [];
    const zip = new JSZip();
    
    // Ensure we have video stream
    this.imageStream ??= this.doodlebot?.getImageStream();
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
      zip.file(`${imageClass}_${i+1}.jpg`, base64Data, {base64: true});
      
      // Wait for next interval
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    // Generate zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Create download link with image class in filename
    const downloadUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${imageClass}_snapshots.zip`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(downloadUrl);
    indicator.close();
    
    await this.indicate({ 
      type: "success", 
      msg: `Captured ${snapshots.length} snapshots of ${imageClass}` 
    });

    if (this.SOCIAL && Math.random() < this.socialness) {
      await this.doodlebot?.display("happy");
      await this.speakText(`Done. I've saved the snapshots to the Downloads folder, to a zip file called ${imageClass}_snapshots`);
      await this.speakText("You can now upload this file to the Teachable Machine interface to train your model.");
      await this.speakText("Let me know if you have any questions.");
    }
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
