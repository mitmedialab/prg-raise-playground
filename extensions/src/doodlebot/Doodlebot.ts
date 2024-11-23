import EventEmitter from "events";
import { Service } from "./communication/ServiceHelper";
import UartService from "./communication/UartService";
import { followLine } from "./LineFollowing";
import { Command, DisplayKey, NetworkStatus, ReceivedCommand, SensorKey, command, display, endpoint, keyBySensor, motorCommandReceived, networkStatus, port, sensor } from "./enums";
import { base64ToInt32Array, makeWebsocket, Max32Int, testWebSocket } from "./utils";
import { line0, line1, line2, line3, line4, line5, line6, line7, line8 } from './Points';
import { LineDetector } from "./LineDetection";
import { calculateArcTime } from "./TimeHelper";

export type Services = Awaited<ReturnType<typeof Doodlebot.getServices>>;
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
export type NetworkCredentials = { ssid: string, password: string, ipOverride?: string };
export type NetworkConnection = { ip: string, hostname?: string };
export type RequestBluetooth = (callback: (bluetooth: Bluetooth) => any) => void;
export type SaveIP = (ip: string) => void;

type MaybePromise<T> = undefined | Promise<T>;

type Pending = Record<"motor" | "wifi" | "websocket" | "video" | "image", MaybePromise<any>> & { ip: MaybePromise<string> };

type SubscriptionTarget = Pick<EventTarget, "addEventListener" | "removeEventListener">;

type Subscription<T extends SubscriptionTarget> = {
    target: T,
    event: Parameters<T["addEventListener"]>[0],
    listener: Parameters<T["addEventListener"]>[1],
}

type MotorCommand = "steps" | "arc" | "stop";

const trimNewtworkStatusMessage = (message: string, prefix: NetworkStatus) => message.replace(prefix, "").trim();

const localIp = "127.0.0.1";

const events = {
    stop: "motor",
    connect: "connect",
    disconnect: "disconnect",
} as const;

type CreatePayload = {
    credentials: NetworkCredentials,
    requestBluetooth: RequestBluetooth,
    saveIP: SaveIP,
}

const msg = (content: string, type: "success" | "warning" | "error") => {
    switch (type) {
        case "success":
            console.log(content);
            break;
        case "warning":
            console.warn(content);
            break;
        case "error":
            console.error(content);
            break;
    }
}

export default class Doodlebot {
    /**
     * 
     * @param services 
     * @param serviceClass 
     * @returns 
     */
    static async tryCreateService<T extends Service & (new (...args: any) => any)>(
        services: BluetoothRemoteGATTService[], serviceClass: T
    ): Promise<InstanceType<T>> {
        const found = services.find((service) => service.uuid === serviceClass.uuid);
        return found ? await serviceClass.create(found) : undefined;
    }

    /**
     * 
     * @param bluetooth 
     * @param devicePrefix @todo unused
     * @returns 
     */
    static async requestRobot(bluetooth: Bluetooth, ...filters: BluetoothLEScanFilter[]) {
        const device = await bluetooth.requestDevice({
            filters: [
                ...(filters ?? []),
                {
                    services: [UartService.uuid]
                },
            ],
        });

        return device;
    }

    /**
     * Get
     * @param device 
     * @returns 
     */
    static async getServices(device: BluetoothDevice) {
        if (!device || !device.gatt) return null;
        if (!device.gatt.connected) await device.gatt.connect();

        const services = await device.gatt.getPrimaryServices();
        const uartService = await Doodlebot.tryCreateService(services, UartService);

        return { uartService, };
    }

    static async getBLE(ble: Bluetooth, ...filters: BluetoothLEScanFilter[]) {
        const robot = await Doodlebot.requestRobot(ble, ...filters);
        const services = await Doodlebot.getServices(robot);
        if (!services) throw new Error("Unable to connect to doodlebot's UART service");
        return { robot, services };
    }

    /**
     * 
     * @param ble 
     * @param filters 
     * @throws 
     * @returns 
     */
    static async tryCreate(
        ble: Bluetooth,
        { requestBluetooth, credentials, saveIP }: CreatePayload,
        ...filters: BluetoothLEScanFilter[]) {
        const { robot, services } = await Doodlebot.getBLE(ble, ...filters);
        return new Doodlebot(robot, services, requestBluetooth, credentials, saveIP);
    }

    private pending: Pending = { motor: undefined, wifi: undefined, websocket: undefined, ip: undefined };
    private onMotor = new EventEmitter();
    private onSensor = new EventEmitter();
    private onNetwork = new EventEmitter();
    private disconnectCallbacks = new Set<() => void>();
    private subscriptions = new Array<Subscription<any>>();
    private connection: NetworkConnection;
    private websocket: WebSocket;
    private encoder = new TextEncoder();

    private isStopped = true; // should this be initializeed more intelligently?

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
        light: { red: 0, green: 0, blue: 0, alpha: 0 }
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
        light: false
    };

    private audioSocket: WebSocket;
    private audioCallbacks = new Set<(chunk: Float32Array) => void>();

    constructor(
        private device: BluetoothDevice,
        private services: Services,
        private requestBluetooth: RequestBluetooth,
        private credentials: NetworkCredentials,
        private saveIP: SaveIP
    ) {
        this.attachToBLE(device, services);
        this.connectionWorkflow(credentials);
    }

    private attachToBLE(device: BluetoothDevice, services: Services) {
        this.device = device;
        this.services = services;
        this.subscribe(services.uartService, "receiveText", this.receiveTextBLE.bind(this));
        this.subscribe(device, "gattserverdisconnected", this.handleBleDisconnect.bind(this));
    }

    private subscribe<T extends SubscriptionTarget>(target: T, event: Subscription<T>["event"], listener: Subscription<T>["listener"]) {
        target.addEventListener(event, listener);
        this.subscriptions.push({ target, event, listener });
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
        this.sensorData[type] = value;
        this.sensorState[type] = true;
    }

    private updateNetworkStatus(ipComponent: string, hostnameComponent: string) {
        const ip = trimNewtworkStatusMessage(ipComponent, networkStatus.ipPrefix);
        const hostname = trimNewtworkStatusMessage(hostnameComponent, networkStatus.hostnamePrefix);
        if (ip === localIp) {
            return this.onNetwork.emit(events.disconnect);
        }
        this.connection = { ip, hostname };
        this.onNetwork.emit(events.connect, this.connection);
    }

    private receiveTextBLE(event: CustomEvent<string>) {
        const { detail } = event;

        console.log("received text", detail);

        if (detail.startsWith(networkStatus.ipPrefix)) {
            const parts = detail.split(",");
            this.updateNetworkStatus(parts[0], parts[1]);
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

    private invalidateWifiConnection() {
        this.connection = undefined;
        this.pending.wifi = undefined;
        this.pending.websocket = undefined;
        this.websocket?.close();
        this.websocket = undefined;
    }

    private handleBleDisconnect() {
        console.log("disconnected!!!");
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
        if (this.sensorState[type]) return;
        await this.sendBLECommand(command.enable, sensor[type]);
        await new Promise((resolve) => this.onSensor.once(type, resolve));
        this.sensorState[type] = true;
    }

    /**
     * 
     */
    async disableSensor<T extends SensorKey>(type: T) {
        if (!this.sensorState[type]) return;
        await this.sendBLECommand(command.disable, sensor[type]);
        this.sensorState[type] = false;
    }

    /**
     * 
     * @param type 
     * @returns 
     */
    async getSensorReading<T extends SensorKey>(type: T): Promise<SensorData[T]> {
        await this.enableSensor(type); // should this be automatic?
        return this.sensorData[type];
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
                return await this.untilFinishedPending("motor", new Promise(async (resolve) => {
                    await this.sendBLECommand(command.motor, "s");
                    this.onMotor.once(events.stop, resolve);
                }));
        }
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

    async getIPAddress() {
        const self = this;
        const interval = setTimeout(() => this.sendBLECommand(command.network), 1000);
        const ip = await new Promise<string>(async (resolve) => {
            this.onNetwork.once(events.connect, () => resolve(self.connection.ip));
            this.onNetwork.once(events.disconnect, () => resolve(null));
        });
        console.log(`Got ip: ${ip}`);
        clearTimeout(interval);
        return ip;
    }

    async testIP(ip: string) {
        if (!ip) return false;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        try {
            const resp = await fetch(`http://${ip}:${port.camera}/${endpoint.video}`, { signal: controller.signal });
            return resp.ok;
        }
        catch {
            return false;
        }
        finally {
            clearTimeout(timeout);
        }
    }

    setIP(ip: string) {
        this.connection ??= { ip };
        this.saveIP(ip);
        return this.connection.ip = ip;
    }


    /**
     * 
     * @param ssid 
     * @param password 
     */
    async connectToWifi(credentials: NetworkCredentials) {
        if (credentials.ipOverride) {
            msg("Testing stored IP address", "warning")
            const validIP = await this.testIP(credentials.ipOverride);
            msg(
                validIP ? "Validated stored IP address" : "Stored IP address could not be reached",
                validIP ? "success" : "warning"
            )
            if (validIP) return this.setIP(credentials.ipOverride);
        }

        msg("Asking doodlebot for it's IP", "warning");

        let ip = await this.getIPAddress();

        if (ip) {
            if (ip === localIp) {
                msg("Doodlebot IP is local, not valid", "warning");
            }
            else {
                msg("Testing Doodlebot's reported IP address", "warning");
                const validIP = await this.testIP(ip);
                msg(
                    validIP ? "Validated Doodlebot's IP address" : "Doodlebot's IP address could not be reached",
                    validIP ? "success" : "warning"
                )
                if (validIP) return this.setIP(ip);
            }
        }
        else {
            msg("Could not retrieve IP address from doodlebot", "error")
        }

        return new Promise<string>(async (resolve) => {
            const self = this;
            const { device } = this;

            //let interval: NodeJS.Timeout;

            const reconnectToBluetooth = async () => {
                this.requestBluetooth(async (ble) => {
                    msg("Reconnected to doodlebot", "success");
                    //clearInterval(interval);
                    const { robot, services } = await Doodlebot.getBLE(ble);
                    self.attachToBLE(robot, services);
                    device.removeEventListener("gattserverdisconnected", reconnectToBluetooth);
                    msg("Waiting to issue connect command", "warning");
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    msg("Testing doodlebot's IP after reconnect", "warning");
                    const ip = await self.getIPAddress();
                    msg(
                        ip === localIp ? "Doodlebot's IP is local, not valid" : "Doodlebot's IP is valid",
                        ip === localIp ? "warning" : "success"
                    )
                    resolve(this.setIP(ip));
                });
            }

            device.addEventListener("gattserverdisconnected", reconnectToBluetooth);

            msg("Attempting to connect to wifi", "warning");

            await this.sendBLECommand(command.wifi, credentials.ssid, credentials.password);
            //interval = setInterval(() => this.sendBLECommand(command.network), 5000);
        });
    }

    /**
     * 
     * @param credentials 
     */
    async connectToWebsocket(ip: string) {
        this.websocket = makeWebsocket(ip, port.websocket);
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

    async connectionWorkflow(credentials: NetworkCredentials) {
        await this.connectToWifi(credentials);
        await this.connectToWebsocket(this.connection.ip);
        this.detector = new LineDetector(this.connection.ip);
        //await this.connectToImageWebSocket(this.connection.ip);
    }

    async getImageStream() {
        if (!this.connection.ip) return;
        const image = document.createElement("img");
        image.src = `http://${this.connection.ip}:${port.camera}/${endpoint.video}`;
        image.crossOrigin = "anonymous";
        await new Promise((resolve) => image.addEventListener("load", resolve));
        return image;
    }

    async connectToImageWebSocket(ip: string) {
        // Create a WebSocket connection
        this.websocket = new WebSocket(`ws://${ip}:${port.camera}`);

        // Return a promise that resolves when the WebSocket is connected
        await this.untilFinishedPending("image", new Promise<void>((resolve, reject) => {
            const onOpen = () => {
                console.log("Connected to WebSocket for image stream");
                this.websocket.removeEventListener("open", onOpen);
                resolve();
            };

            const onError = (err: Event) => {
                console.error("WebSocket error: ", err);
                reject(err);
            };

            this.websocket.addEventListener("open", onOpen);
            this.websocket.addEventListener("error", onError);

            // Handle each message (which could be an image frame)
            this.websocket.addEventListener("message", (event) => this.onWebSocketImageMessage(event));
        }));
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


    i = 0;
    wholeString = "export const allLines = [";
    cumulativeLine = "export const cumulativeLines = [";

    motorCommands;
    bezierPoints;
    line;
    lineCounter = 0;
    detector;
    
    async followLine() {
        let first = true;
        const delay = 0.5;
        const previousSpeed = 0.1;
        const interval = 300; // 1/15th of a second
        let prevRadius;
        let prevAngle;
        let lineData
        await this.detector.initialize(this);
        
        while (true) {
            console.log("NEXT");
            try {
                console.log("before 1");
                console.log("after 1");
                let lineData = this.detector.returnLine();
                // Process line data
                lineData = lineData.sort((a, b) => a[1] - b[1]);
                console.log("LINE DATA", lineData);
                this.wholeString = this.wholeString + `${JSON.stringify(lineData)},`;
                this.printLine();
                this.lineCounter += 1;

                if (first) {
                    ({ motorCommands: this.motorCommands, bezierPoints: this.bezierPoints, line: this.line } = followLine(
                        lineData,
                        lineData,
                        null,
                        delay,
                        previousSpeed,
                        [],
                        [],
                        [],
                        false,
                        true
                    ));
                    first = false;
                } else {
                    ({ motorCommands: this.motorCommands, bezierPoints: this.bezierPoints, line: this.line } = followLine(
                        this.line,
                        lineData,
                        null,
                        delay,
                        previousSpeed,
                        this.motorCommands,
                        [1],
                        [1],
                        false,
                        false
                    ));
                }


                this.cumulativeLine = this.cumulativeLine + `${JSON.stringify(this.line)},`;
                console.log("after");
                console.log("motorCommands DEBUG 1", this.motorCommands);
                for (const command of this.motorCommands) {
                    console.log("command DEBUG 2", command);
                    const { radius, angle } = command;
                    console.log(command);
                    if (command.distance > 0) {
                        this.sendWebsocketCommand("m", Math.round(12335.6*command.distance), Math.round(12335.6*command.distance), 500, 500);
                    } else {
                        this.sendBLECommand("t", radius, angle);
                    }
                    
                }
                console.log("after 2");
                console.log(this.cumulativeLine);

                // Wait for the interval duration before the next iteration
                await new Promise((resolve) => setTimeout(resolve, interval));
            } catch (error) {
                console.error("Error in followLine loop:", error);
                break; // Optionally, break the loop on error
            }
        }
    }
    //console.log(j);
    // Process the line data here

    //     } catch (error) {
    //         console.error("Error detecting line:", error);
    //         // Optionally stop polling if there's a consistent error
    //     }
    // }



    private setupAudioStream() {
        if (!this.connection.ip) return false;

        if (this.audioSocket) return true;

        const socket = new WebSocket(`ws://${this.connection.ip}:${port.audio}`);
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

    recordAudio(numSeconds = 1) {
        if (!this.setupAudioStream()) return;

        const context: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = 48000;
        const buffer = context.createBuffer(1, sampleRate * numSeconds, sampleRate);

        let index = 0;
        let samples = 0;

        const callbacks = this.audioCallbacks;

        return new Promise<{ context: AudioContext, buffer: AudioBuffer }>((resolve) => {
            const accumulate = (chunk: Float32Array) => {

                if (samples >= buffer.length) {
                    callbacks.delete(accumulate);
                    return resolve({ context, buffer });
                }

                const offset = index++;
                const { length } = chunk;
                buffer.copyToChannel(chunk, 0, offset * length);
                samples += length;

            }
            callbacks.add(accumulate);
        })
    }

    async display(type: DisplayKey) {
        const value = display[type];
        await this.sendWebsocketCommand(command.display, value);
    }

    async displayText(text: string) {
        await this.sendWebsocketCommand(command.display, "t", text);
    }

    /**
     * NOTE: Consider making private
     * @param command 
     * @param args 
     * @returns 
     */
    sendBLECommand(command: Command, ...args: (string | number)[]) {
        const { uartService } = this.services;
        return uartService.sendText(this.formCommand(command, ...args));
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
}