import EventEmitter from "events";
import { Service } from "./communication/ServiceHelper";
import UartService from "./communication/UartService";
import { Command, DisplayKey, NetworkStatus, ReceivedCommand, SensorKey, command, display, endpoint, keyBySensor, motorCommandReceived, networkStatus, port, sensor } from "./enums";
import { base64ToFloat32Array, makeWebsocket } from "./utils";

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
export type NetworkConnection = { ip: string, hostname: string };

type MaybePromise<T> = undefined | Promise<T>;

type Pending = Record<"motor" | "wifi" | "websocket", MaybePromise<any>> & { ip: MaybePromise<string> };

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

    /**
     * 
     * @param ble 
     * @param filters 
     * @throws 
     * @returns 
     */
    static async tryCreate({ ssid, password, ipOverride }: NetworkCredentials, ble: Bluetooth, ...filters: BluetoothLEScanFilter[]) {
        const robot = await Doodlebot.requestRobot(ble, ...filters);
        const services = await Doodlebot.getServices(robot);
        if (!services) throw new Error("Unable to connect to doodlebot's UART service");
        return new Doodlebot(robot, services, ssid, password, ipOverride);
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

    constructor(private device: BluetoothDevice, private services: Services, private ssid: string, private wifiPassword: string, private ip: string | undefined = undefined) {
        this.subscribe(services.uartService, "receiveText", this.receiveTextBLE.bind(this));
        this.subscribe(device, "gattserverdisconnected", this.handleBleDisconnect.bind(this));
        if (ip) this.connectToWebsocket(ip);
        //this.connectToWebsocket({ ssid, password: wifiPassword, ipOverride: ip });
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
        const text = await event.data.text();
        console.log(text);
    }

    private invalidateWifiConnection() {
        this.connection = undefined;
        this.pending.wifi = undefined;
        this.pending.websocket = undefined;
        this.websocket?.close();
        this.websocket = undefined;
    }

    private handleBleDisconnect() {
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
        const ip = await (
            this.pending.ip ??
            this.untilFinishedPending("ip", new Promise<string>(async (resolve) => {
                this.sendBLECommand(command.network);
                this.onNetwork.once(events.connect, () => resolve(self.connection.ip));
                this.onNetwork.once(events.disconnect, () => resolve("invalid"));
            }))
        );
        return ip;
    }


    /**
     * 
     * @param ssid 
     * @param password 
     */
    async connectToWifi(credentials?: NetworkCredentials) {
        const { ssid, pending: { wifi: pending } } = this;
        const invalidate = credentials && credentials.ssid !== ssid;
        if (invalidate) {
            this.invalidateWifiConnection();
            this.ssid = credentials.ssid;
            this.wifiPassword = credentials.password;
        }
        else if (pending) await pending;

        if (this.connection) return;

        await this.untilFinishedPending("wifi", new Promise<void>(async (resolve) => {
            //await this.sendBLECommand(command.wifi, this.ssid, this.wifiPassword);
            this.onNetwork.once(events.connect, () => {
                console.log("connected to wifi");
                resolve();
            })
        }));
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

    async getImageStream(ip: string) {
        const image = document.createElement("img");
        image.src = `http://${ip}:${port.camera}/${endpoint.video}`;
        image.crossOrigin = "anonymous";
        await new Promise((resolve) => image.addEventListener("load", resolve));
        return image;
    }

    async getAudioStream(ip: string, numSeconds = 1) {
        const socket = new WebSocket(`ws://${ip}:${port.audio}`);


        // Initialize the audio context
        const audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = 48000;  // Sample rate of the audio stream
        const buffer = audioContext.createBuffer(1, sampleRate * numSeconds, sampleRate);

        let index = 0;

        socket.onmessage = async function (event) {
            const offset = index++; // this is wrong, the offset is actually the length of the floats
            const data = JSON.parse(event.data);
            const float32Array = await base64ToFloat32Array(data.audio_data);
            console.log(float32Array.length);
            buffer.copyToChannel(float32Array, 0, offset * float32Array.length);
        };


        socket.onerror = function (error) {
            console.error('WebSocket Error:', error);
        };

        const openMsg = this.encoder.encode('(1)');
        socket.onopen = function (event) {
            console.log('WebSocket connection established');
            socket.send(openMsg);
        };

        socket.onclose = function () {
            console.log('WebSocket connection closed');
            // Optionally save the received audio data to a file
            //saveAudioToFile();
            const audioBufferSource = audioContext.createBufferSource();
            audioBufferSource.buffer = buffer;
            audioBufferSource.connect(audioContext.destination);
            audioBufferSource.start();
        };

        return socket;
    }

    async display(type: DisplayKey) {
        const value = display[type];
        await this.sendWebsocketCommand(command.display, value);
    }

    getNetworkCredentials(): NetworkCredentials {
        return { ssid: this.ssid, password: this.wifiPassword };
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
        // assumes connection to websocket established
        const msg = this.formCommand(command, ...args);
        this.websocket.send(this.encoder.encode(msg));
    }

    async untilFinishedPending<TKey extends keyof Pending>(type: TKey, promise: Pending[TKey]) {
        this.pending[type] = promise;
        const value = await promise;
        this.pending[type] = undefined;
        return value;
    }
}