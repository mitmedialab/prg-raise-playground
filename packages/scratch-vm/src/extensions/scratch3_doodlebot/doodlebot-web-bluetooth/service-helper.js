/*
* micro:bit Web Bluetooth
* Copyright (c) 2019 Rob Moran
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
require("regenerator-runtime/runtime");
const PromiseQueue = require("./promise-queue");

/**
 * interface ServiceEventHandler {
 ** characteristic: BluetoothCharacteristicUUID;
 ** handler: (event: Event) => void;
 */

 
class ServiceHelper {
    constructor(service, emitter) {
        this.queue = new PromiseQueue();
        this.service = service;
        this.emitter = emitter;
    }

    async getCharacteristic(uuid) {
        if (!this.characteristics) {
            this.characteristics = await this.service.getCharacteristics();
        }

        return this.characteristics.find(characteristic => characteristic.uuid === uuid);
    }

    async getCharacteristicValue(uuid) {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            throw new Error("Unable to locate characteristic");
        }

        return await this.queue.add(async () => characteristic.readValue());
    }

    async setCharacteristicValue(uuid, value) {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            throw new Error("Unable to locate characteristic");
        }

        await this.queue.add(async () => characteristic.writeValue(value));
    }

    async handleListener(event, uuid, handler) {
        const characteristic = await this.getCharacteristic(uuid);

        if (!characteristic) {
            return;
        }

        await this.queue.add(async () => characteristic.startNotifications());

        this.emitter.on("newListener", (emitterEvent) => {
            if (emitterEvent !== event || this.emitter.listenerCount(event) > 0) {
                return;
            }

            return this.queue.add(async () => characteristic.addEventListener("characteristicvaluechanged", handler));
        });

        this.emitter.on("removeListener", (emitterEvent) => {
            if (emitterEvent !== event || this.emitter.listenerCount(event) > 0) {
                return;
            }

            return this.queue.add(async () => characteristic.removeEventListener("characteristicvaluechanged", handler));
        });
    }
}
module.exports = ServiceHelper;