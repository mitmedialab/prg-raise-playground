/// <reference types="@types/web-bluetooth" />

import { EventEmitter } from "eventemitter3";
import UartService from "./communication/UartService";
import { followLine } from "./LineFollowing";
import { Command, DisplayKey, NetworkStatus, ReceivedCommand, SensorKey, command, display, endpoint, keyBySensor, motorCommandReceived, networkStatus, port, sensor } from "./enums";
import { base64ToInt32Array, deferred, makeWebsocket, Max32Int } from "./utils";
import { LineDetector } from "./LineDetection";
import { calculateArcTime } from "./TimeHelper";
import type { BLEDeviceWithUartService } from "./ble";
import { saveAudioBufferToWav } from "./SoundUtils";

export type MotorStepRequest = {
    /** Number of steps for the stepper (+ == forward, - == reverse) */
    steps: number,
    /** Number of steps/second (rate) of stepper */
    stepsPerSecond: number
};
export type Bumper = { front: number, back: number };
export type Vector3D = { x: number, y: number, z: number };
export type Color = { red: number, green: number, blue: number, alpha: number };
export type SensorReading = number | Vector3D | Bumper | Color;
export type SensorData = Doodlebot["sensorData"];

type MaybePromise<T> = undefined | Promise<T>;

type Pending = Record<"motor" | "websocket" | "video" | "image", MaybePromise<any>>;

type SubscriptionTarget = Pick<EventTarget, "addEventListener" | "removeEventListener">;

type Subscription<T extends SubscriptionTarget> = {
    target: T,
    event: Parameters<T["addEventListener"]>[0],
    listener: Parameters<T["addEventListener"]>[1],
}

type MotorCommand = "steps" | "arc" | "stop";

const trimNewtworkStatusMessage = (message: string, prefix: NetworkStatus) => message.replace(prefix, "").trim();

const events = {
    stop: "motor",
    connect: "connect",
    disconnect: "disconnect",
} as const;

type BLECommunication = {
    onDisconnect: (...callbacks: (() => void)[]) => void,
    onReceive: (callback: (text: CustomEvent<string>) => void) => void,
    send: (text: string) => Promise<void>
}


export default class Doodlebot {
    private pending: Pending = { motor: undefined, websocket: undefined, video: undefined, image: undefined };
    private onMotor = new EventEmitter();
    private onSensor = new EventEmitter();
    private disconnectCallbacks = new Set<() => void>();
    private subscriptions = new Array<Subscription<any>>();
    private websocket: WebSocket;
    private encoder = new TextEncoder();

    public readonly topLevelDomain = deferred<string>();
    public readonly bleDevice = deferred<BLEDeviceWithUartService>();

    private readonly ble = deferred<BLECommunication>();

    private lastDisplayedKey;
    private lastDisplayedType;

    private isStopped = true; // should this be initializeed more intelligently?

    public newSounds: string[] = [];
    public newImages: string[] = [];
    private soundFiles = ['Scn2ALL.wav', 'Huh_sigh.wav', 'HMMMM.wav', 'Scn4bALL.wav', 'Sch1Whistle.wav', 'Scn4ALL.wav', '5.wav', 'Hmm.wav', '1.wav', 'Scn6Whistle.wav', 'Scn4Whistle.wav', 'Yay.wav', '3.wav', '4.wav', 'Scn6ALL.wav', '8.wav', 'mmMMmmm.wav', '9.wav', 'Scn2Whistle.wav', 'Scn6Voice.wav', '2.wav', 'NO.wav', '7.wav', 'emmemm.wav', 'Scn4bVoice.wav', 'Scn4Voice.wav', 'mumbleandhum.wav', 'Scn2Voice.wav', 'hello.wav', 'OK.wav', '6.wav', 'gotit.wav', 'Scn1ALL.wav', 'Scn1Voice.wav']
    private imageFiles = [
        "hannah.jpg",
        "sad.png",
        "13confused.png",
        "newhannah.jpg",
        "RGB24bits_320x240.png",
        "1sleep.png",
        "wink.png",
        "panda.gif",
        "sleep.png",
        "angry.png",
        "base_v2.png",
        "surprise@2x.png",
        "base@2x.png",
        "annoyed.png",
        "8confused.png",
        "4asleep.png",
        "13asleep.png",
        "14asleep.png",
        "colorcheck_320x240.png",
        "3confused.png",
        "4sleep.png",
        "12asleep.png",
        "2asleep.png",
        "NTSCtest_320x240.png",
        "happy.png",
        "angry_RTeye_closed.bmp",
        "15confused.png",
        "asleep.png",
        "angry_mouth.bmp",
        "11asleep.png",
        "6confused.png",
        "9confused.png",
        "disgust.png",
        "angry_LTeye-closed.bmp",
        "animesmileinvertedsmall.png",
        "love.png",
        "a.out",
        "15asleep.png",
        "14confused.png",
        "db_animation-test.gif",
        "5confused.png",
        "PALtest_320x240.png",
        "9asleep.png",
        "surprise.png",
        "5asleep.png",
        "sadface.png",
        "10asleep.png",
        "3asleep.png",
        "10confused.png",
        "2confused.png",
        "engaged.png",
        "angry_mouth_closed.bmp",
        "RGBParrot_320x240.png",
        "page7orig.jpg",
        "somethingWrong.png",
        "confused.png",
        "11confused.png",
        "ball.gif",
        "7confused.png",
        "12confused.png",
        "worried.png",
        "animesmileinverted.png",
        "angry_LTeye.bmp",
        "7asleep.png",
        "panda.jpg",
        "animesmile.png",
        "cambridge24bit_320x240.png",
        "base_transparent@2x.png",
        "8asleep.png",
        "6asleep.png",
        "fear.png",
        "1asleep.png",
        "3sleep.png",
        "angry_cheek.bmp",
        "4confused.png",
        "base_v1.png",
        "2sleep.png",
        "1confused.png",
        "angry_RTeye.bmp",
        "closedmouth.png",
        "cheeksbase.png",
        "eyebase.png",
        "EL.png"
    ];

    private sensorData = ({
        bumper: { front: 0, back: 0 },
        altimeter: 0,
        battery: 0,
        distance: 0,
        humidity: 0,
        temperature: 0,
        pressure: 0,
        gyroscope: { x: 0, y: 0, z: 0 },
        magnometer: { x: 0, y: 0, z: 0 },
        accelerometer: { x: 0, y: 0, z: 0 },
        light: { red: 0, green: 0, blue: 0, alpha: 0 },
        line: [],
    } satisfies Record<SensorKey, SensorReading>);

    private sensorState: Record<SensorKey, boolean> = {
        bumper: false,
        altimeter: false,
        battery: false,
        distance: false,
        humidity: false,
        temperature: false,
        pressure: false,
        gyroscope: false,
        magnometer: false,
        accelerometer: false,
        light: false,
        line: [],
    };

    private audioSocket: WebSocket;
    private audioCallbacks = new Set<(chunk: Float32Array) => void>();

    private pc: RTCPeerConnection;
    private webrtcVideo: HTMLVideoElement;

    public previewImage;
    public canvasWebrtc;

    private reloadRequired?: ((msg: string) => void) | null = null;

    constructor() {
        this.ble.promise.then(ble => ble.onReceive(this.receiveTextBLE.bind(this)));
        this.ble.promise.then(ble => ble.onDisconnect(this.handleBleDisconnect.bind(this)));
        this.bleDevice.promise.then(async ({ device, service }) => {
            this.ble.resolve(
                {
                    onReceive: (callback) => service.addEventListener("receiveText", callback),
                    onDisconnect: (callback) => device.addEventListener("gattserverdisconnected", callback),
                    send: (text) => service.sendText(text),
                });
        })

        this.connectionWorkflow();

        this.pc = new RTCPeerConnection();
        this.pc.addTransceiver("video", { direction: "recvonly" });
        console.log("pc", this.pc);

        this.pc.ontrack = (event) => {
            const stream = event.streams[0];
            console.log("stream", stream);

            this.webrtcVideo = document.createElement('video');
            this.webrtcVideo.srcObject = stream;
            this.webrtcVideo.autoplay = true;
            this.webrtcVideo.playsInline = true;
            // document.body.appendChild(this.webrtcVideo);

            this.webrtcVideo.play().catch(e => console.error("Playback error:", e));

            this.webrtcVideo.onerror = (error) => {
                console.log("ERROR 2", error);
            };
            let latestFrameId = 0;
            // Setup once
            this.canvasWebrtc = document.createElement('canvas');
            const ctx = this.canvasWebrtc.getContext('2d');
            this.canvasWebrtc.width = 640;
            this.canvasWebrtc.height = 480;
            let lastUpdateTime = 0;

            const handleVideoFrame = (now) => {
                // if (now - lastUpdateTime < 33) {
                //     this.webrtcVideo.requestVideoFrameCallback(handleVideoFrame);
                //     return;
                // }
                // lastUpdateTime = now;

                ctx.drawImage(this.webrtcVideo, 0, 0, this.canvasWebrtc.width, this.canvasWebrtc.height);
                this.webrtcVideo.requestVideoFrameCallback(handleVideoFrame);
            };
            this.webrtcVideo.requestVideoFrameCallback(handleVideoFrame);
        };

        this.pc.createOffer()
            .then(offer => this.pc.setLocalDescription(offer))
            .then(async () => {
                const tld = await this.topLevelDomain.promise;
                console.log("TLD", tld);
                const webrtcResponse = await fetch(`https://${tld}/api/v1/video/webrtc`, {
                    method: 'POST',
                    body: JSON.stringify(this.pc.localDescription),
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("webrtcResponse", webrtcResponse);
                return webrtcResponse;
            })
            .then(response => response.json())
            .then(answer => this.pc.setRemoteDescription(answer))
            .catch(err => console.error("WebRTC error:", err));

        this.previewImage = document.createElement("img");
        document.body.appendChild(this.previewImage);
    }

    private formCommand(...args: (string | number)[]) {
        return `(${args.join(",")})`;
    }

    private parseCommand(text: string) {
        const lines = text.split("(").map((line) => line.replace(")", "")).splice(1);
        return lines.map((line) => {
            const [command, ...parameters] = line.split(",").map(s => s.trim()) as [ReceivedCommand, ...string[]];
            return { command, parameters };
        });
    }

    private updateSensor<T extends SensorKey>(type: T, value: SensorData[T]) {
        this.onSensor.emit(type, value);
        if (type == "distance" && value as number >= 63) {
            (this.sensorData[type] as number) = 100;
        } else {
            this.sensorData[type] = value;
        }
        this.sensorState[type] = true;
    }

    private updateNetworkStatus(ipComponent: string, hostnameComponent: string) {
        const ip = trimNewtworkStatusMessage(ipComponent, networkStatus.ipPrefix);
        const hostname = trimNewtworkStatusMessage(hostnameComponent, networkStatus.hostnamePrefix);
        this.reloadRequired?.("Network settings changed, please reload the page and reconnect to doodlebot.");
    }

    private receiveTextBLE(event: CustomEvent<string>) {
        const { detail } = event;

        console.log("received text", detail);

        if (detail.startsWith(networkStatus.ipPrefix)) {
            const parts = detail.split(",");
            this.updateNetworkStatus(parts[0], parts[1]);
            return;
        }

        if (detail.includes("fetchReturn---")) {
            // Process fetch return
            return;
        }

        for (const { command, parameters } of this.parseCommand(detail)) {
            console.log({ command, parameters });
            switch (command) {
                case motorCommandReceived:
                    this.isStopped = true;
                    this.onMotor.emit(events.stop);
                    break;
                case sensor.bumper: {
                    const [front, back] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.updateSensor(keyBySensor[command], { front, back });
                    break;
                }
                case sensor.distance:
                case sensor.battery:
                case sensor.altimeter:
                case sensor.humidity:
                case sensor.temperature:
                case sensor.pressure: {
                    const value = Number.parseFloat(parameters[0]);
                    this.updateSensor(keyBySensor[command], value);
                    break;
                }
                case sensor.gyroscope:
                case sensor.magnometer:
                case sensor.accelerometer: {
                    const [x, y, z] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.updateSensor(keyBySensor[command], { x, y, z });
                    break;

                }
                case sensor.line: {
                    const [l1, l2, l3, l4] =  parameters.map((parameter) => Number.parseFloat(parameter));
                    this.updateSensor(keyBySensor[command], [l1, l2, l3, l4]);
                    break;
                }
                case sensor.light: {
                    const [red, green, blue, alpha] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.updateSensor(keyBySensor[command], { red, green, blue, alpha });
                    break;
                }
                
                default:
                    throw new Error(`Not implemented: ${command}`);
            }
        }
    }

    private async onWebsocketMessage(event: MessageEvent) {
        console.log("websocket message", { event });
        if (event.data instanceof Blob) {
            const text = await event.data.text();
            console.log(text);
        }
        else if (event.data instanceof ArrayBuffer) {
            const decoder = new TextDecoder('utf-8');
            const decodedMessage = decoder.decode(event.data);
            console.log('Received ArrayBuffer as text:', decodedMessage);
        }
    }

    private handleBleDisconnect() {
        this.reloadRequired?.("Doodlebot bluetooth disconnected, please reload the page and reconnect to doodlebot.");
        for (const callback of this.disconnectCallbacks) callback();
        for (const { target, event, listener } of this.subscriptions) target.removeEventListener(event, listener);
    }

    onDisconnect(...callbacks: (() => void)[]) {
        for (const callback of callbacks) this.disconnectCallbacks.add(callback);
    }

    /**
     * 
     * @param type 
     * @returns 
     */
    async enableSensor<T extends SensorKey>(type: T) {
        // Cancel any pending disable
        if (this.disableTimers[type]) {
            clearTimeout(this.disableTimers[type]);
            delete this.disableTimers[type];
        }
        if (this.sensorState[type]) return;
        await this.sendBLECommand(command.enable, sensor[type]);
        await new Promise((resolve) => this.onSensor.once(type, resolve));
        this.sensorState[type] = true;
    }

    /**
     * 
     */
    private disableTimers: Partial<Record<SensorKey, ReturnType<typeof setTimeout>>> = {};

    async disableSensor<T extends SensorKey>(type: T) {
        console.log("DISABLING");
        if (!this.sensorState[type]) return;
        await this.sendBLECommand(command.disable, sensor[type]);
        this.sensorState[type] = false;
    }

    scheduleDisableSensor(type: SensorKey, delay = 5000) {
        // Reset existing timer
        if (this.disableTimers[type]) {
            clearTimeout(this.disableTimers[type]);
        }

        this.disableTimers[type] = setTimeout(() => {
            this.disableSensor(type);
            delete this.disableTimers[type];
        }, delay);
    }

    /**
     * 
     * @param type 
     * @returns 
     */
    async getSensorReading<T extends SensorKey>(type: T): Promise<SensorData[T]> {
        await this.enableSensor(type);

        const reading = this.sensorData[type];

        // Schedule auto-disable after 5s of inactivity
        this.scheduleDisableSensor(type, 5000);

        return reading;
    }

    async getSingleSensorReading<T extends SensorKey>(
        type: T
    ): Promise<SensorData[T]> {
        await this.enableSensor(type);

        const reading = this.sensorData[type];

        // Schedule auto-disable after 5s of inactivity
        this.scheduleDisableSensor(type, 5000);

        return reading;
    }

    getSensorReadingSync<T extends SensorKey>(type: T): SensorData[T] | false {
        if (this.sensorState[type]) {
            this.scheduleDisableSensor(type, 5000);
            return this.sensorData[type];
        } else {
            this.enableSensor(type);
            this.scheduleDisableSensor(type, 5000);
            return false;
        }
    }

    extractList(text: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Extract all <li> elements
        const listItems = doc.querySelectorAll('li');

        // Get the text content of each <li> element
        const itemNames = Array.from(listItems).map(li => li.textContent.trim());

        return itemNames;
    }

    // Function to fetch and parse HTML template
    async fetchAndExtractList(endpoint) {
        try {
            // Fetch the HTML template from the endpoint
            const response = await fetch(endpoint);
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            // Get the HTML text
            const htmlText = await response.text();

            // Parse the HTML text into a DOM structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Extract all <li> elements
            const listItems = doc.querySelectorAll('li');

            // Get the text content of each <li> element
            const itemNames = Array.from(listItems).map(li => li.textContent.trim());

            return itemNames;
        } catch (error) {
            throw new Error('Error fetching or parsing HTML:', error)
        }
    }

    async findImageFiles() {
        const tld = await this.topLevelDomain.promise;
        let endpoint = "https://" + tld + "/api/v1/upload/images"
        let uploadedImages = await this.fetchAndExtractList(endpoint);
        return uploadedImages.filter(item => !this.imageFiles.includes(item));
    }

    private lastCallTime: Record<string, number> = {};
    private streamActive: Record<string, boolean> = {};
    private stopTimers: Record<string, any> = {};

    async getFacePrediction(type: "face" | "object") {
        const now = Date.now();

        // Clear old stop timers whenever we get a new call
        if (this.stopTimers[type]) {
            clearTimeout(this.stopTimers[type]);
        }

        // If stream is already active → just return continuous predict
        if (this.streamActive[type]) {
            this.lastCallTime[type] = now;
            this.resetStopTimer(type);
            return await this.getContinuousPredict(type);
        }

        // If first call or more than 1s since last call → single_predict
        if (!this.lastCallTime[type] || now - this.lastCallTime[type] > 1000) {
            this.lastCallTime[type] = now;
            console.log(`[${type}] Calling single_predict API...`);
            return await this.callSinglePredict();
        }

        // If called again within 1s → switch to stream
        console.log(`[${type}] Switching to stream API...`);
        this.streamActive[type] = true;
        this.lastCallTime[type] = now;
        await this.startContinuousDetection(type);
        this.resetStopTimer(type);
        return await this.getContinuousPredict(type);
    }

    private resetStopTimer(type: "face" | "object") {
        this.stopTimers[type] = setTimeout(() => {
            console.log(`[${type}] No calls in 5s, stopping stream...`);
            this.stopContinuousDetection(type);
        }, 5000);
    }

    async callSinglePredict() {
        const tld = await this.topLevelDomain.promise;
        const uploadEndpoint = `https://${tld}/api/v1/video/single_predict?width=320&height=240`;
        const response = await fetch(uploadEndpoint);
        return await response.json();
    }

    async startContinuousDetection(type: "face" | "object") {
        const tld = await this.topLevelDomain.promise;
        let endpoint;
        if (this.streamActive["face"] && this.streamActive["object"]) {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=true&set_detect_faces=true`;
        } else if (this.streamActive["face"]) {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=false&set_detect_faces=true`;
        } else {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=true&set_detect_faces=false`;
        }
        console.log("starting", endpoint);
        await fetch(endpoint);
        console.log(`[${type}] Continuous detection started`);
    }

    async stopContinuousDetection(type: "face" | "object") {
        this.streamActive[type] = false;
        this.lastCallTime[type] = 0;
        if (this.stopTimers[type]) {
            clearTimeout(this.stopTimers[type]);
            delete this.stopTimers[type];
        }
        let endpoint;
        const tld = await this.topLevelDomain.promise;
        if (!this.streamActive["face"] && !this.streamActive["object"]) {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=false&set_detect_faces=false`;
        } else if (!this.streamActive["face"]) {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=true&set_detect_faces=false`;
        } else {
            endpoint = `https://${tld}/api/v1/video/stream?width=640&height=480&set_display=true&set_detect_objects=false&set_detect_faces=true`;
        }
        console.log("stopping", endpoint)
        await fetch(endpoint);
        console.log(`[${type}] Continuous detection stopped`);
    }

    async getContinuousPredict(type: "face" | "object") {
        const tld = await this.topLevelDomain.promise;

        const endpoint = `https://${tld}/api/v1/video/stream_latest?screenshot=false`;

        const response = await fetch(endpoint);
        if (!response.ok) {
            await this.startContinuousDetection(type);
            return this.getContinuousPredict(type);
        } else {
            return await response.json();
        }


    }

    getReadingLocation(axis, type, reading) {
        if (type == "face") {
            if (reading.faces.length == 0) {
                return -1;
            }
            if (axis == "x") {
                return reading.faces[0].x;
            } else {
                return reading.faces[0].y;
            }
        } else {
            if (reading.objects.length == 0) {
                return -1;
            }
            if (type == "apple") {
                const firstApple = reading.objects.find(obj => obj.label === "apple");
                if (firstApple) {
                    if (axis == "x") {
                        return firstApple.x;
                    } else {
                        return firstApple.y;
                    }
                } else {
                    return -1;
                }
            } else {
                const firstOrange = reading.objects.find(obj => obj.label === "orange");
                if (firstOrange) {
                    if (axis == "x") {
                        return firstOrange.x;
                    } else {
                        return firstOrange.y;
                    }
                } else {
                    return -1;
                }
            }
        }
    }

    async findSoundFiles() {
        const tld = await this.topLevelDomain.promise;
        let endpoint = "https://" + tld + "/api/v1/upload/sounds"
        let uploadedSounds = await this.fetchAndExtractList(endpoint);
        return uploadedSounds.filter(item => !this.soundFiles.includes(item));
    }

    /**
     * 
     * @param type 
     * @returns 
     */
    getSensorReadingImmediately<T extends SensorKey>(type: T): SensorData[T] {
        this.enableSensor(type); // should this be automatic?
        return this.sensorData[type];
    }

    /**
     * @typedef {Object} MotorStepRequest
     * @property {number} steps - The number of steps the motor should move.
     * @property {number} stepsPerSecond - The speed of the motor in steps per second.
     */

    /**
     * 
     * @param type 
     * @param left {MotorStepRequest}
     * @param right 
     */
    async motorCommand(type: "steps", left: MotorStepRequest, right: MotorStepRequest);
    /**
     * 
     * @param type 
     * @param radius 
     * @param degrees 
     */
    async motorCommand(type: "arc", radius: number, degrees: number);
    /**
     * 
     * @param type 
     */
    async motorCommand(type: "stop");
    async motorCommand(type: MotorCommand, ...args: any[]) {

        const { pending: { motor: pending } } = this;
        switch (type) {
            case "steps": {
                if (pending) await pending;
                const [left, right] = args as MotorStepRequest[];
                return await this.untilFinishedPending("motor", new Promise(async (resolve) => {
                    this.isStopped = false;
                    await this.sendBLECommand(command.motor, left.steps, right.steps, left.stepsPerSecond, right.stepsPerSecond);
                    this.onMotor.once(events.stop, resolve);
                }));
            }
            case "arc": {
                if (pending) await pending;
                const [radius, degrees] = args as number[];
                return await this.untilFinishedPending("motor", new Promise(async (resolve) => {
                    this.isStopped = false;
                    await this.sendBLECommand(command.arc, radius, degrees);
                    this.onMotor.once(events.stop, resolve);
                }));
            }
            case "stop":
                if (this.isStopped) return;
                await this.sendBLECommand(command.motor, "s");
            // return await this.untilFinishedPending("motor", new Promise(async (resolve) => {
            //     this.onMotor.once(events.stop, resolve);
            // }));
        }
    }

    async setVolume(volume: number) {
        await this.sendWebsocketCommand(command.volume, volume);
    }

    async setFont(font: "small" | "medium" | "large") {
        let key = font == "small" ? "s" : (font == "medium" ? "m" : (font == "large" ? "l" : null))
        await this.sendWebsocketCommand(command.display, display.font, key);
    }

    async penCommand(direction: "up" | "down") {
        await this.sendBLECommand(command.pen, direction === "up" ? 0 : 45);
    }

    /**
     * 
     */
    async lowPowerMode() {
        await this.sendBLECommand(command.lowPower);
    }

    /**
     * 
     * @param credentials 
     */
    async connectToWebsocket() {
        const tld = await this.topLevelDomain.promise;
        this.websocket = makeWebsocket(tld, '/api/v1/command');
        await this.untilFinishedPending("websocket", new Promise<void>((resolve) => {
            const resolveAndRemove = () => {
                console.log("Connected to websocket");
                this.websocket.removeEventListener("open", resolveAndRemove);
                resolve();
            }
            this.websocket.addEventListener("open", resolveAndRemove);
            this.websocket.addEventListener("message", this.onWebsocketMessage.bind(this));
        }));
    }

    async connectionWorkflow() {
        const tld = await this.topLevelDomain.promise;
        if (this.websocket) this.websocket.close();
        await this.connectToWebsocket();
        this.detector = new LineDetector(tld);
    }

    getImageStream() {
        return this.canvasWebrtc;
    }

    // Handle incoming image data from WebSocket
    onWebSocketImageMessage(event: MessageEvent) {
        // Assuming the message contains binary image data (e.g., Blob or ArrayBuffer)
        const imageBlob = event.data;

        // Create an image element to render the received frame
        const image = document.createElement("img");
        const url = URL.createObjectURL(imageBlob);
        image.src = url;

        // Wait until the image loads and then perform some action
        image.addEventListener("load", () => {
            console.log("Image frame received and rendered");
            this.onImageReceived(image); // Process or display the image
            URL.revokeObjectURL(url); // Clean up the URL object
        });
    }

    // Example image processing logic
    onImageReceived(image: HTMLImageElement) {
        // Perform operations on the image, e.g., display or analyze the frame
        console.log("Processing image from WebSocket stream");
        document.body.appendChild(image); // Example: Display the image in the document
    }

    prependUntilTarget = (line) => {
        const targetX = line[0][0];
        const targetY = line[0][1];
        const startX = line[0][0];
        const startY = 0; // Start slightly below targetY


        const incrementX = 0.01; // Small step for x
        let x = startX;
        let y = startY;

        const newSegment = [];
        while (y < targetY) {
            newSegment.push([x, y]);
            y += incrementX; // Increment y based on slope
        }

        // Prepend the new segment to the beginning of line
        line.unshift(...newSegment);
        return line;
    }

    printLine() {
        console.log(this.wholeString);
    }

    wholeString = "export const allLines = [";
    cumulativeLine = "export const cumulativeLines = [";

    motorCommands;
    bezierPoints;
    line;
    lineCounter = 0;
    detector;
    iterationNumber = 0;

    deepEqual = (a, b) => {
        if (a === b) return true;
        if (Array.isArray(a) && Array.isArray(b)) {
            return a.length === b.length && a.every((val, i) => this.deepEqual(val, b[i]));
        }
        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a), keysB = Object.keys(b);
            return keysA.length === keysB.length && keysA.every(key => this.deepEqual(a[key], b[key]));
        }
        return false;
    };

    async followLine() {
        let first = true;
        let iterations = 2;

        let prevInterval;
        let t = { aT: 0.3 };
        let lastTime: number;

        const tld = await this.topLevelDomain.promise;

        console.log(tld);
        console.log(this.detector);
        this.detector = new LineDetector(tld);
        await this.detector.initialize(this);
        let prevLine = [];
        let add = 0;
        while (true) {
            try {
                let lineData = this.detector.returnLine();
                lineData = lineData.map(value => [640 - value[0], 480 - value[1]])
                const firstQuadrant = lineData.filter(value => value[1] < 10);
                lineData = firstQuadrant.length > 0 ? lineData.filter(value => value[1] < 350) : [];
                console.log("FIRST QUADRANT", firstQuadrant.length);
                // Process line data
                lineData = lineData.sort((a, b) => a[1] - b[1]);

                // Debugging statements
                this.wholeString = this.wholeString + `${JSON.stringify(lineData)},`;
                this.printLine();
                this.lineCounter += 1;

                let newMotorCommands;

                if (first) {
                    ({ motorCommands: newMotorCommands, bezierPoints: this.bezierPoints, line: this.line } = followLine(
                        lineData,
                        lineData,
                        prevLine,
                        [],
                        [],
                        [],
                        add,
                        true
                    ));
                } else {
                    ({ motorCommands: newMotorCommands, bezierPoints: this.bezierPoints, line: this.line } = followLine(
                        this.line,
                        lineData,
                        prevLine,
                        this.motorCommands,
                        [prevInterval / 2],
                        [t.aT],
                        add,
                        false
                    ));
                }

                lastTime = Date.now();

                // Debugging statement
                this.cumulativeLine = this.cumulativeLine + `${JSON.stringify(this.line)},`;
                console.log(this.cumulativeLine);

                let waitTime = prevLine.length < 100 ? 190 : 200;
                if (newMotorCommands[0].angle > 10) {
                    newMotorCommands[0].angle = 10;
                } else if (newMotorCommands[0].angle < -10) {
                    newMotorCommands[0].angle = -10;
                }


                if (this.iterationNumber % iterations == 0) {
                    newMotorCommands[0].angle = this.limitArcLength(newMotorCommands[0].angle, newMotorCommands[0].radius, 2);
                    // newMotorCommands[0].angle = this.increaseArcLength(newMotorCommands[0].angle, newMotorCommands[0].radius, );
                    if (newMotorCommands[0].radius < 10) {
                        newMotorCommands[0].angle = this.limitArcLength(newMotorCommands[0].angle, newMotorCommands[0].radius, 1.5);
                    }

                    if (this.motorCommands && !(this.motorCommands[0].distance > 0)) {
                        if (this.motorCommands) {
                            t = calculateArcTime(this.motorCommands[0].radius, this.motorCommands[0].angle, newMotorCommands[0].radius, newMotorCommands[0].angle);
                        } else {
                            t = calculateArcTime(0, 0, newMotorCommands[0].radius, newMotorCommands[0].angle);
                        }
                    }

                    this.motorCommands = newMotorCommands;
                    for (const command of this.motorCommands) {
                        let { radius, angle } = command;

                        if ((lineData.length == 0 || !this.deepEqual(lineData, prevLine))) {
                            if (command.distance > 0) {
                                this.sendWebsocketCommand("m", Math.round(12335.6 * command.distance), Math.round(12335.6 * command.distance), 500, 500);
                            } else {
                                this.sendBLECommand("t", radius, angle);
                            }
                        }
                        if (this.deepEqual(lineData, prevLine) && lineData.length > 0) {
                            console.log("LAG");
                        }

                    }
                    if (prevLine.length < 100 && lineData.length < 100) {
                        add = add + 1;
                    } else {
                        add = 0;
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, waitTime));
                prevInterval = waitTime / 1000;
                first = false;
                prevLine = lineData;
            } catch (error) {
                console.error("Error in followLine loop:", error);
                break; // Optionally, break the loop on error
            }
            this.iterationNumber = this.iterationNumber + 1;
        }
    }


    limitArcLength(angle: number, radius: number, maxArcLength: number = 2): number {
        // Calculate the max allowable angle
        let negative = true;
        if (angle > 0) {
            negative = false;
        }
        angle = Math.abs(angle);
        const maxAngle = (maxArcLength * 180) / ((radius + 2.93) * Math.PI);

        const returnAngle = Math.min(angle, maxAngle);
        // Return the limited angle
        return negative ? returnAngle * -1 : returnAngle;
    }

    increaseArcLength(angle: number, radius: number, maxArcLength: number = 2): number {
        // Calculate the max allowable angle
        let negative = true;
        if (angle > 0) {
            negative = false;
        }
        angle = Math.abs(angle);
        const maxAngle = (maxArcLength * 180) / ((radius + 2.93) * Math.PI);

        // Return the limited angle
        return negative ? maxAngle * -1 : maxAngle;
    }

    private async setupAudioStream() {
        if (this.audioSocket) return true;

        const tld = await this.topLevelDomain.promise;

        const socket = new WebSocket(`wss://${tld}:${port.audio}`);
        const self = this;

        socket.onopen = function (event) {
            console.log('WebSocket connection established');
            socket.send(self.encoder.encode('(1)'));
        };

        socket.onerror = function (error) {
            console.error('WebSocket Error:', error);
            // TODO: automatically restart socket 
        };

        socket.onclose = function () {
            console.log('WebSocket connection closed');
        };

        socket.onmessage = async function (event) {
            if (self.audioCallbacks.size === 0) return;

            const data = JSON.parse(event.data);

            const interleaved = await base64ToInt32Array(data.audio_data);
            const chunkSize = interleaved.length / 2;

            const mono = new Float32Array(chunkSize);

            for (let i = 0, j = 0; i < interleaved.length; i += 2, j++) {
                mono[j] = interleaved[i] / Max32Int;
            }

            for (const callback of self.audioCallbacks) callback(mono);
        };

        return true;
    }

    parseWavHeader(uint8Array) {
        const dataView = new DataView(uint8Array.buffer);
        // Extract sample width, number of channels, and sample rate
        const sampleWidth = dataView.getUint16(34, true) / 8; // Sample width in bytes (16-bit samples = 2 bytes, etc.)
        const channels = dataView.getUint16(22, true); // Number of channels
        const rate = dataView.getUint32(24, true); // Sample rate
        const byteRate = dataView.getUint32(28, true); // Byte rate
        const blockAlign = dataView.getUint16(32, true); // Block align
        const dataSize = dataView.getUint32(40, true); // Size of the data chunk
        const frameSize = blockAlign; // Size of each frame in bytes
        return {
            sampleWidth,
            channels,
            rate,
            frameSize,
            dataSize
        };
    }
    splitIntoChunks(uint8Array, framesPerChunk) {
        const headerInfo = this.parseWavHeader(uint8Array);
        const { frameSize } = headerInfo;
        const chunkSize = framesPerChunk * frameSize; // Number of bytes per chunk
        const chunks = [];
        // Skip the header (typically 44 bytes)
        const dataStart = 44;
        for (let i = dataStart; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            chunks.push(chunk);
        }
        return chunks;
    }


    private isSendingAudio = false;

    async sendAudioData(uint8Array: Uint8Array) {

        if (this.isSendingAudio) {
            console.warn("WebSocket is already sending audio data.");
            return;
        }

        this.isSendingAudio = true;

        let CHUNK_SIZE = 1024;
        const tld = await this.topLevelDomain.promise;
        const ws = makeWebsocket(tld, '/api/v1/speaker');
        ws.onopen = () => {
            console.log('WebSocket connection opened');
            let { sampleWidth, channels, rate } = this.parseWavHeader(uint8Array);
            let first = "(1," + String(sampleWidth) + "," + String(channels) + "," + String(rate) + ")";
            console.log(first);
            ws.send(first);
            let chunks = this.splitIntoChunks(uint8Array, CHUNK_SIZE);
            let i = 0;
            const sendNextChunk = async () => {
                if (i >= chunks.length) {
                    console.log('All data sent');
                    this.isSendingAudio = false;
                    ws.close();
                    return;
                }
                const chunk = chunks[i];
                const binaryString = Array.from(chunk).map((byte: any) => String.fromCharCode(byte)).join('');;
                const base64Data = btoa(binaryString);
                const jsonData = JSON.stringify({ audio_data: base64Data });
                ws.send(jsonData);
                i = i + 1;
                sendNextChunk();
            }
            sendNextChunk();
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        ws.onmessage = (message) => {
            console.log(message);
        }
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    async sendAudioFileToChatEndpoint(file, endpoint, voice_id, pitch_value) {
        console.log("sending audio file");
        const url = `https://doodlebot.media.mit.edu/${endpoint}?voice=${voice_id}&pitch=${pitch_value}`
        const formData = new FormData();
        formData.append("audio_file", file);
        const audioURL = URL.createObjectURL(file);
        const audio = new Audio(audioURL);
        //audio.play();
    
        try {
          let response;
          let uint8array;
         
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
    
          this.sendAudioData(uint8array);
    
    
        } catch (error) {
          console.error("Error sending audio file:", error);
        }
      }

    
      async processAndSendAudio(buffer, endpoint, voice_id, pitch_value) {
        try {
          const wavBlob = await saveAudioBufferToWav(buffer);
          console.log(wavBlob);
          const wavFile = new File([wavBlob], "output.wav", { type: "audio/wav" });
    
          await this.sendAudioFileToChatEndpoint(wavFile, endpoint, voice_id, pitch_value);
        } catch (error) {
          console.error("Error processing and sending audio:", error);
        }
      }

    recordAudio(numSeconds = 1) {
        if (!this.setupAudioStream()) return;

        const context: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = 48000;
        const totalSamples = sampleRate * numSeconds;
        const buffer = context.createBuffer(1, totalSamples, sampleRate);

        let index = 0;
        let samples = 0;
        const startTime = Date.now();
        const callbacks = this.audioCallbacks;



        return new Promise<{ context: AudioContext, buffer: AudioBuffer }>((resolve) => {
            const accumulate = (chunk: Float32Array<ArrayBuffer>) => {
                // Check if we've exceeded our time limit
                if (Date.now() - startTime >= numSeconds * 1000) {
                    callbacks.delete(accumulate);
                    return resolve({ context, buffer });
                }

                if (samples + chunk.length > totalSamples) {
                    // Only copy what we need to fill the buffer
                    const remainingSamples = totalSamples - samples;
                    buffer.copyToChannel(chunk.slice(0, remainingSamples), 0, samples);
                    samples = totalSamples;
                    callbacks.delete(accumulate);
                    return resolve({ context, buffer });
                }

                buffer.copyToChannel(chunk, 0, samples);
                samples += chunk.length;
                index++;
            }
            callbacks.add(accumulate);
            setTimeout(() => {
                callbacks.delete(accumulate);
                resolve({ context, buffer });
            }, numSeconds * 1000 + 1000); // +1s safety
        });
    }

    async display(type: DisplayKey) {
        const value = display[type];
        await this.sendWebsocketCommand(command.display, value);
        this.lastDisplayedKey = type;
        this.lastDisplayedType = "face";
    }

    getLastDisplayedKey() {
        return this.lastDisplayedKey;
    }

    getLastDisplayedType() {
        return this.lastDisplayedType;
    }

    async displayText(text: string) {
        await this.sendWebsocketCommand(command.display, "t", text);
        this.lastDisplayedKey = text;
        this.lastDisplayedType = "text";
    }

    async moveEyes(direction1: string, direction2: string) {
        const dirMap: Record<string, string> = {
            center: "C",
            left: "<",
            right: ">",
            up: "^",
            down: "v",
        };

        const from = dirMap[direction1];
        const to = dirMap[direction2];

        if (!from || !to || (from != "C" && to != "C")) {
            throw new Error(`Invalid direction: ${direction1}, ${direction2}`);
        }

        const movement = `${from}${to}`;

        await this.sendWebsocketCommand(command.display, movement);
    }

    async displayFile(file: string) {
        await this.sendWebsocketCommand(command.display, file);
    }

    /**
     * NOTE: Consider making private
     * @param command 
     * @param args 
     * @returns 
     */
    async sendBLECommand(command: Command, ...args: (string | number)[]) {
        const ble = await this.ble.promise;
        return ble.send(this.formCommand(command, ...args));
    }

    /**
     * NOTE: Consider making private
     * @param command 
     * @param args 
     */
    sendWebsocketCommand(command: Command, ...args: (string | number)[]) {
        const msg = this.formCommand(command, ...args);
        console.log("sending websocket message", msg);
        this.websocket.send(this.encoder.encode(msg));
    }

    async untilFinishedPending<TKey extends keyof Pending>(type: TKey, promise: Pending[TKey]) {
        this.pending[type] = promise;
        const value = await promise;
        this.pending[type] = undefined;
        return value;
    }

    async uploadFile(type: string, blobURL: string) {
        const tld = await this.topLevelDomain.promise;
        let uploadEndpoint;
        if (type == "sound") {
          uploadEndpoint = "https://" + tld + "/api/v1/upload/sounds_upload";
        } else {
          uploadEndpoint = "https://" + tld + "/api/v1/upload/img_upload";
        }
    
        try {
          const components = blobURL.split("---name---");
          const response1 = await fetch(components[1]);
          if (!response1.ok) {
            throw new Error(`Failed to fetch Blob from URL: ${blobURL}`);
          }
          const blob = await response1.blob();
          // Convert Blob to File
          const file = new File([blob], components[0], { type: blob.type });
          const formData = new FormData();
          formData.append("file", file);
    
          const response2 = await fetch(uploadEndpoint, {
            method: "POST",
            body: formData,
          });
    
    
          if (!response2.ok) {
            throw new Error(`Failed to upload file: ${response2.statusText}`);
          }
    
        } catch (error) {
          console.error("Error:", error);
        }
      }
}
