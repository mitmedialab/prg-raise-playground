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

import EventEmitter from "events";

export default class EventDispatcher<T extends Record<string, any> = Record<string, unknown>> extends EventEmitter {
    isEventListenerObject(listener): listener is EventListenerObject {
        return listener.handleEvent !== undefined;
    }

    addEventListener<K extends keyof T & string>(type: K, listener: (event: CustomEvent<T[K]>) => void): void {
        if (listener) {
            const handler = this.isEventListenerObject(listener)
                ? listener.handleEvent
                : listener;
            super.addListener(type, handler);
        }
    }

    removeEventListener<K extends keyof T & string>(type: K, callback: (event: CustomEvent<T[K]>) => void): void {
        if (callback) {
            const handler = this.isEventListenerObject(callback)
                ? callback.handleEvent
                : callback;
            super.removeListener(type, handler);
        }
    }

    dispatchEvent<K extends keyof T | CustomEvent<T[keyof T]>>(eventOrType: K, detail: K extends string ? T[K] : K): boolean {
        const event = typeof eventOrType === "string"
            ? new CustomEvent(eventOrType, { detail, })
            : eventOrType as CustomEvent;
        return super.emit(event.type, event);
    }
}