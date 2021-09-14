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

import { UartService } from "./uart";

class ServiceBuilder {
    async createService(serviceClass) {
        const found = this.services.find(service => service.uuid === serviceClass.uuid);

        if (!found) {
            return undefined;
        }

        return await serviceClass.create(found);
    }
}

export class Doodlebot {
    async requestRobot(bluetooth) {
        const device = await bluetooth.requestDevice({
            filters: [
                {
                    namePrefix: "Bluefruit52"
                }
            ],
            optionalServices: [
                UartService.uuid
            ]
        });

        return device;
    }

    async getServices (device) {
        if (!device || !device.gatt) {
            return {};
        }

        if (!device.gatt.connected) {
            await device.gatt.connect();
        }

        const services = await device.gatt.getPrimaryServices();
        const builder = new ServiceBuilder(services);

        const uartService = await builder.createService(UartService);

        return {
            uartService
        };
    }
}
