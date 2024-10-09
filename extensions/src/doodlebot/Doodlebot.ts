import EventEmitter from "events";
import { Service } from "./communication/ServiceHelper";
import UartService from "./communication/UartService";
import { followLine } from "./LineFollowing";
import { Command, DisplayKey, NetworkStatus, ReceivedCommand, SensorKey, command, display, endpoint, keyBySensor, motorCommandReceived, networkStatus, port, sensor } from "./enums";
import { base64ToInt32Array, makeWebsocket, Max32Int, testWebSocket } from "./utils";

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


    async followLine() {

        let line0;
        let line1;
        let line2;
        let line3;
        let line4;
        let line5;
        let line6;
        line0=[[0.0, 0.0], [-17.104673497907527, 20.564281569525853], [-42.011478766789594, 39.423381796634736], [-75.92074377141333, 56.314965090186675], [-120.03279647654222, 70.97669585904111], [-164.14484918167207, 85.63842662789493], [-198.05411418629512, 102.53000992144658], [-222.9609194551773, 121.38911014855627], [-240.0655929530852, 141.95339171808214], [-250.56846264478227, 163.96051903888355], [-255.66985649503542, 187.14815651981806], [-256.5701024686096, 211.2539685697469], [-254.4695285302698, 236.015619597528], [-250.56846264478273, 261.17077401202096], [-246.06723277691222, 286.4570962220841], [-242.1661668914246, 311.6122506365771], [-240.06559295308506, 336.3739016643582], [-240.96583892665913, 360.4797137142863], [-246.06723277691242, 383.66735119522167], [-256.5701024686097, 405.6744785160225], [-273.674775966517, 426.2387600855489], [-298.5815812353995, 445.0978603126579], [-332.4908462400224, 461.98944360620965]]
        // line0=[[-383.1296156102412, 1230.5622560465351], [-365.3300647514816, 1202.4185890994863], [-347.53051389272196, 1174.2749221524373], [-329.677510929282, 1146.0467396890313], [-285.5654582241526, 1131.3850089201762], [-251.65619321952863, 1114.4934256266242], [-226.74938795064645, 1095.6343253995153], [-209.64471445273944, 1075.0700438299891], [-199.1418447610422, 1053.0629165091882], [-194.040450910789, 1029.8752790282526], [-193.1402049372149, 1005.7694669783241], [-195.24077887555472, 981.007815950543], [-199.1418447610423, 955.8526615360504], [-203.64307462891315, 930.5663393259867], [-207.54414051440074, 905.4111849114944], [-209.64471445274, 880.649533883713], [-208.74446847916602, 856.5437218337844], [-203.64307462891315, 833.3560843528488], [-193.14020493721546, 811.348957032048], [-176.0355314393089, 790.7846754625223], [-151.1287261704265, 771.9255752354127], [-117.21946116580324, 755.0339919418606], [-73.10740846067358, 740.3722611730069], [-28.99535575554421, 725.7105304041522], [4.913909249078415, 708.8189471106002], [29.820714517961108, 689.9598468834912], [46.92538801586829, 669.3955653139649], [57.428257707565535, 647.3884379931638], [62.52965155781868, 624.2008005122286], [63.42989753139284, 600.0949884623001], [61.329323593053175, 575.3333374345189], [57.428257707565706, 550.1781830200262], [52.92702783969469, 524.8918608099631], [49.02596195420699, 499.73670639547066], [46.925388015868066, 474.97505536768887], [47.82563398944188, 450.8692433177603], [52.927027839694745, 427.68160583682493], [63.429897531392214, 405.6744785160235], [80.53457102929917, 385.1101969464983], [105.4413762981817, 366.2510967193885], [139.35064130280483, 349.3595134258366], [183.4626940079338, 334.6977826569824], [227.57474671306295, 320.0360518881285], [261.48401171768626, 303.1444685945765], [286.3908169865691, 284.2853683674667]]
         line1=[[320.0, 0.0], [320.0, 23.742172418771816], [324.30030842448235, 47.4783887316922], [331.67226572359556, 71.21035068329016], [340.8872123474861, 94.93976001809521], [350.7164887463037, 118.66831848063619], [359.93143537019427, 142.3977278154408], [367.30339266930685, 166.12968976703922], [371.6037010937892, 189.86590607995961], [371.60370109378977, 213.60807849873117], [366.07473311945506, 237.35790876788278], [353.788137620935, 261.11709863194324], [333.51525504837565, 284.88734983544157], [304.0274258519256, 308.6703641229065], [264.09599048173254, 332.46784323886675], [224.1645551115397, 356.26532235482824], [194.6767259150903, 380.0483366422928], [174.4038433425307, 403.8185878457908], [162.11724784401008, 427.5777777098518], [156.58827986967603, 451.32760797900346]]
         line2=[[320.0, 0.0], [320.0, 23.74217241877156], [314.4710320256647, 47.492002687923026], [302.1844365271441, 71.2511925519832], [281.9115539545842, 95.02144375548104], [252.42372475813357, 118.80445804294527], [212.49228938793993, 142.60193715890455], [172.56085401774652, 166.3994162748651], [143.07302482129654, 190.18243056232893], [122.80014224873636, 213.95268176582644], [110.51354675021517, 237.71187162988713], [104.98457877588055, 261.4617018990387], [104.98457877588001, 285.20387431781006], [109.2848872003618, 308.9400906307306], [116.65684449947389, 332.672052582329], [125.87179112336378, 356.4014619171344], [135.70106752218086, 380.1300203796749], [144.91601414607132, 403.8594297144797], [152.28797144518282, 427.59139166607855], [156.588279869665, 451.3276079789992]]
         line3=[[320.0, 0.0], [320.0, 31.24123253135492], [326.069280541584, 57.2916330205665], [337.27410615681515, 78.94979101257925], [352.6807413777573, 97.01429605233866], [371.3554507364751, 112.28373768479007], [392.36449876503275, 125.55670545487848], [414.7741499954941, 137.63178890754958], [437.65066895992396, 149.30757758774695], [460.06032019038537, 161.38266104041722], [481.0693682189428, 174.65562881050636], [499.7440775776611, 189.9250704429576], [515.1507127986035, 207.98957548271702], [526.3555384138346, 229.64773347472993], [532.4248189554181, 255.6981339639407], [532.4248189554188, 286.93936649529616], [525.4218029458999, 324.17002061373967], [510.4820354589266, 368.1886858642177], [495.54226797195287, 412.20735111469503]]
         line4=[[320.0, 0.0], [320.0, 25.45584625699707], [318.2810797223905, 50.246914922370934], [313.6972923154343, 73.9300209350388], [305.1026909273915, 96.06197923391805], [291.35132870652296, 116.19960475792656], [271.2972588010903, 133.8997124459814], [243.79453435935335, 148.71911723700137], [207.6972085295742, 160.21463406990244], [161.85933446001326, 167.94307788360373], [116.02146039045272, 175.67152169730434], [79.9241345606728, 187.16703853020582], [52.42141011893614, 201.98644332122558], [32.367340213503155, 219.68655100928046], [18.61597799263444, 239.82417653328918], [10.02137660459141, 261.95613483216806], [5.437589197636157, 285.63924084483597], [3.718668920026289, 310.43030951020984], [3.7186689200267438, 335.88615576720713], [4.2916423458953545, 361.56359455474563], [4.291642345894672, 387.01944081174275], [2.5727220682860548, 411.810509477117], [-2.011065338669596, 435.49361548978413], [-10.605666726712684, 457.6255737886634]]
         line5=[[320.0, 0.0], [320.0, 46.484831321609256], [319.9999999999994, 92.969662643218], [325.3340819230948, 130.47581426337925], [335.37470671951024, 160.0596014410853], [349.49433533946905, 182.77733943533053], [367.0654287331962, 199.68534350510947], [387.4604478509146, 211.83992890941542], [410.0518536428496, 220.2974109072414], [434.2121070592242, 226.11410475758467], [459.3136690502629, 230.3463257194352], [484.72900056618926, 234.05038905179012], [509.83056255722755, 238.28261001364174], [533.9908159736027, 244.09930386398383], [556.5822217655369, 252.5567858618101], [576.9772408832557, 264.71137126611615], [594.5483342769828, 281.61937533589463], [608.667962896942, 304.3371133301405], [618.708587693357, 333.92090050784526], [624.0426696164516, 371.42705212800644], [624.0426696164528, 417.9118834496162]]
         line6=[[320.0, 0.0], [320.0, 24.85058897676393], [321.760786046391, 50.24546525444484], [324.1085007749103, 75.82177063243151], [325.86928682130014, 101.21664691011227], [325.8692868213014, 126.06723588687649], [322.9346434106544, 150.0106793621108], [315.8914992250986, 172.68411913520555], [303.5659969003755, 193.72469700554865], [284.78427907222476, 212.76955477252855], [258.3724883763891, 229.45583423553302], [223.15676744860562, 243.42067719395098], [177.96325892461726, 254.30122544717358], [132.76975040062902, 265.18177370039484], [97.55402947284608, 279.1466166588124], [71.14223877701002, 295.83289612181727], [52.36052094885912, 314.8777538887973], [40.0350186241368, 335.91833175914024], [32.99187443857954, 358.59177153223476], [30.057231027931437, 382.53521500746945], [30.057231027933767, 407.385803984234], [31.81801707432402, 432.7806802619144]]
         //line7=[[320.0, 0.0], [320.0, 26.74807529413604], [312.911198184821, 57.174437201259146], [297.6430096598178, 91.84497596952409], [273.1048495303509, 131.3255818470832], [248.5666894008832, 170.80618772464132], [233.2985008758801, 205.47672649290558], [226.2096990607011, 235.90308840002928], [226.2096990607011, 262.6511636941655], [232.20791598123856, 286.2868426234638], [243.11376492766777, 307.3760154360794], [257.8366610053482, 326.4845723801618], [275.2860193196383, 344.17840370386347], [294.3712549758911, 361.02339965533696], [314.0017830794657, 377.585450482735], [333.0870187357199, 394.4304464342091], [350.5363770500079, 412.1242777579095], [365.2592731276887, 431.2328347019926], [376.16512207411927, 452.3220075146087]]
         
        const delay = 0.5;
        const previousSpeed = 0.1;

        let commands2 = followLine(line0, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }


        commands2 = followLine(line1, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }

        commands2 = followLine(line2, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);


        }
        commands2 = followLine(line3, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }
        commands2 = followLine(line4, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }
        commands2 = followLine(line5, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }

        commands2 = followLine(line6, delay, previousSpeed);

        for (const command of commands2) {
            console.log(command);
            const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
            await this.motorCommand(
                "steps",
                { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
                { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
            );
            console.log("command");
            console.log(command);

        }

        // commands2 = followLine(line7, delay, previousSpeed);

        // for (const command of commands2) {
        //     console.log(command);
        //     const { leftWheelSpeed, rightWheelSpeed, leftWheelDistance, rightWheelDistance } = command;
        //     await this.motorCommand(
        //         "steps",
        //         { steps: Math.round(leftWheelDistance), stepsPerSecond: Math.round(leftWheelSpeed) },
        //         { steps: Math.round(rightWheelDistance), stepsPerSecond: Math.round(rightWheelSpeed) }
        //     );
        //     console.log("command");
        //     console.log(command);

        // }


    }


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