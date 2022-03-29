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
const EventDispatcher = require("./event-dispatcher");
const ServiceHelper = require("./service-helper");

/**
 * Events raised by the UART service
 * newListener: keyof UartEvents;
 * removeListener: keyof UartEvents;
 * receive: Uint8Array;
 * receiveText: string;
 */

/**
 * UART Service
 */

class UartService extends EventDispatcher {
    static get uuid() {
        return "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    }

    static get rx_uuid() {
        return "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    }

    static get tx_uuid() {
        return "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
    }

    static async create(service) {
        const bluetoothService = new UartService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    constructor(service) {
        super();
        this.helper = new ServiceHelper(service, this);
    }

    async init() {
        await this.helper.handleListener(
            "receive",
            UartService.tx_uuid,
            this.receiveHandler.bind(this)
        );
        await this.helper.handleListener(
            "receiveText",
            UartService.tx_uuid,
            this.receiveTextHandler.bind(this)
        );
    }

    /**
     * Send serial data
     * @param value The buffer to send
     */
    async send(value) {
        return this.helper.setCharacteristicValue(UartService.rx_uuid, value);
    }

    /**
     * Send serial text
     * @param value The text to send
     */
    async sendText(value) {
        const arrayData = value.split("").map((e) => e.charCodeAt(0));
        return this.helper.setCharacteristicValue(
            UartService.rx_uuid,
            new Uint8Array(arrayData).buffer
        );
    }

    receiveHandler(event) {
        const view = event.target.value;
        const value = new Uint8Array(view.buffer);
        this.dispatchEvent("receive", value);
    }

    receiveTextHandler(event) {
        const view = event.target.value;
        const numberArray = Array.prototype.slice.call(
            new Uint8Array(view.buffer)
        );
        const value = String.fromCharCode.apply(null, numberArray);
        this.dispatchEvent("receiveText", value);
    }
}
module.exports = UartService;
