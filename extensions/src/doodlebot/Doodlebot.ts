/*
 * Doodlebot Web Bluetooth
 * Built on top of
 * - micro:bit Web Bluetooth
 * - Copyright (c) 2019 Rob Moran
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import EventEmitter from "events";
import { Service } from "./communication/ServiceHelper";
import UartService, { UartEvents } from "./communication/UartService";
import { Command, ReceivedCommand, Sensor, SensorKey, command, keyBySensor, motorCommandReceived, sensor } from "./enums";

export type Services = Awaited<ReturnType<typeof Doodlebot.getServices>>;
export type MotorStepRequest = { steps: number, stepsPerSecond: number };
export type Bumper = { front: number, back: number };
export type Vector3D = { x: number, y: number, z: number };
export type Color = { red: number, green: number, blue: number, alpha: number };
export type SensorReading = number | Vector3D | Bumper | Color;
export type SensorData = Doodlebot["sensorData"];

export default class Doodlebot {
    static async createService<T extends Service & (new (...args: any) => any)>(
        services: BluetoothRemoteGATTService[], serviceClass: T
    ): Promise<InstanceType<T>> {
        const found = services.find(
            (service) => service.uuid === serviceClass.uuid
        );

        if (!found) return undefined;

        return await serviceClass.create(found);
    }

    /**
     * 
     * @param bluetooth 
     * @param devicePrefix @todo unused
     * @returns 
     */
    static async requestRobot(bluetooth: Bluetooth, devicePrefix: string) {
        const device = await bluetooth.requestDevice({
            filters: [
                {
                    services: [UartService.uuid]
                },
            ],
        });

        return device;
    }

    static async getServices(device: BluetoothDevice) {
        if (!device || !device.gatt) return null;
        if (!device.gatt.connected) await device.gatt.connect();

        const services = await device.gatt.getPrimaryServices();
        const uartService = await Doodlebot.createService(services, UartService);

        return { uartService, };
    }

    static async create(ble: Bluetooth, deviceNamePrefix: string) {
        const robot = await Doodlebot.requestRobot(ble, deviceNamePrefix);
        const services = await Doodlebot.getServices(robot);
        if (!services) throw new Error("Unable to connect to doodlebot's UART service");
        return new Doodlebot(robot, services);
    }

    private pendingMotorCommand: Promise<any>;
    private onMotor = new EventEmitter();
    private onSensor = new EventEmitter();
    private listeners = new Map<keyof UartEvents, (...args: any[]) => void>();

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

    constructor(private device: BluetoothDevice, private services: Services) {
        const { listeners } = this;
        listeners.set("receiveText", this.receiveText.bind(this));
        for (const [key, listener] of listeners) services.uartService.addEventListener(key, listener);
    }

    private formCommand(...args: (string | number)[]) {
        return `(${args.join(",")})`;
    }

    private parseCommand(command: string) {
        const lines = command.split("(").map((line) => line.replace(")", ""));
        return lines.map((line) => {
            const [command, ...parameters] = line.split(",") as [ReceivedCommand, ...string[]];
            return { command, parameters };
        });
    }

    private sendBLECommand(command: Command, ...args: (string | number)[]) {
        const { uartService } = this.services;
        return uartService.sendText(this.formCommand(command, ...args));
    }

    private setSensor<T extends SensorKey>(type: T, value: SensorData[T]) {
        this.onSensor.emit(type, value);
        this.sensorData[type] = value;
    }

    private receiveText(event: CustomEvent<string>) {
        for (const { command, parameters } of this.parseCommand(event.detail)) {
            switch (command) {
                case motorCommandReceived:
                    this.onMotor.emit("stop");
                    break;
                case sensor.bumper: {
                    const [front, back] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.setSensor(keyBySensor[command], { front, back });
                    break;
                }
                case sensor.distance:
                case sensor.battery:
                case sensor.altimeter:
                case sensor.humidity:
                case sensor.temperature:
                case sensor.pressure: {
                    const value = Number.parseFloat(parameters[0]);
                    this.setSensor(keyBySensor[command], value);
                    break;
                }
                case sensor.gyroscope:
                case sensor.magnometer:
                case sensor.accelerometer: {
                    const [x, y, z] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.setSensor(keyBySensor[command], { x, y, z });
                    break;
                }
                case sensor.light: {
                    const [red, green, blue, alpha] = parameters.map((parameter) => Number.parseFloat(parameter));
                    this.setSensor(keyBySensor[command], { red, green, blue, alpha });
                    break;
                }
                default:
                    throw new Error(`Not implemented: ${command}`);
            }
        }
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
        await this.enableSensor(type);
        return this.sensorData[type];
    }

    /**
     * 
     * @param type 
     * @param left 
     * @param rightSteps 
     */
    async motorCommand(type: "steps", left: MotorStepRequest, rightSteps: MotorStepRequest);
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
    async motorCommand(type: string, ...args: any[]): Promise<boolean> {
        switch (type) {
            case "steps": {
                if (this.pendingMotorCommand) await this.pendingMotorCommand;
                const [left, right] = args as MotorStepRequest[];
                await this.sendBLECommand(command.motor, left.steps, right.steps, left.stepsPerSecond, right.stepsPerSecond);
                this.pendingMotorCommand = new Promise((resolve) => this.onMotor.once("stop", resolve));
                await this.pendingMotorCommand;
                return true;
            }
            case "arc": {
                if (this.pendingMotorCommand) await this.pendingMotorCommand;
                const [radius, degrees] = args as number[];
                await this.sendBLECommand(command.motor, radius, degrees);
                this.pendingMotorCommand = new Promise((resolve) => this.onMotor.once("stop", resolve));
                await this.pendingMotorCommand;
                break;
            }
            case "stop":
                await this.sendBLECommand(command.motor, "s");
                this.pendingMotorCommand = new Promise((resolve) => this.onMotor.once("stop", resolve));
                await this.pendingMotorCommand;
                break;
        }
    }
}