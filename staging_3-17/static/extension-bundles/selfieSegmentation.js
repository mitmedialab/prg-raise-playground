var selfieSegmentation=(function(exports,$common){'use strict';/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind,
    key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _,
    done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function (f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? {
      get: descriptor.get,
      set: descriptor.set
    } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.push(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.push(_);else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", {
    configurable: true,
    value: prefix ? "".concat(prefix, " ", name) : name
  });
}const getImageHelper = (width, height) => {
    const canvas = document.body.appendChild(document.createElement("canvas"));
    canvas.hidden = true;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    return {
        /**
         *
         * @param mask
         * @param color
         * @returns
         */
        colorIn(mask, color) {
            context.save();
            context.clearRect(0, 0, width, height);
            context.drawImage(mask, 0, 0);
            context.globalCompositeOperation = 'source-in';
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.restore();
            return context.getImageData(0, 0, width, height);
        },
        /**
         *
         * @param image
         * @param mask
         * @returns
         */
        getMasked(image, mask) {
            context.save();
            context.clearRect(0, 0, width, height);
            context.drawImage(mask, 0, 0);
            context.globalCompositeOperation = 'source-in';
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            context.restore();
            return context.getImageData(0, 0, width, height);
        },
        /**
         *
         * @param image
         * @returns
         */
        getDataURL(image) {
            context.save();
            context.clearRect(0, 0, width, height);
            context.putImageData(image, 0, 0);
            const url = canvas.toDataURL('image/png');
            context.restore();
            return url;
        }
    };
};
const getSelfieModel = async (onFrame) => {
    const packageURL = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
    const packageClassName = "SelfieSegmentation";
    // Load the media pipe script from an external source to get around the following bug: https://github.com/vitejs/vite/issues/4680
    // TODO: Revist this once rollup-plugin-esbuild supports Typescript 5.0
    const Class = await $common.untilExternalGlobalVariableLoaded(packageURL, packageClassName);
    const model = new Class({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
        }
    });
    // Initialize the mediaPipe model according to the documentation
    model.setOptions({ modelSelection: 1 });
    model.onResults(onFrame);
    await model.initialize();
    return model;
};const details = {
    name: "Selfie Detector",
};
var index = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setCostume_decorators;
    let _setDisplayMode_decorators;
    let _setNumberOfEchos_decorators;
    let _setColor_decorators;
    let _setFrameRate_decorators;
    let _setProcessingState_decorators;
    return _a = class default_1 extends $common.extension(details, "video", "drawable", "addCostumes", "setTransparencyBlock", "toggleVideoBlock") {
            constructor() {
                super(...[...arguments, ...["Selfie Detector","selfieSegmentation","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="]]);
                // A reference to the mediapipe SelfieSegmentation class doing all the work
                this.model = (__runInitializers(this, _instanceExtraInitializers), void 0);
                /**
                 * An to the items being drawn on screen
                 */
                this.drawables = [];
                /**
                 * Current drawing method.
                 * - Mask: Mask-out the selfie region of the original image
                 * - Color: Draw the selfi region as a single color
                 */
                this.mode = "mask";
                /**
                 * How many 'echo' images to preserve on screen
                 */
                this.echoLength = 0;
                /**
                 * Ideal processing time for each selfie
                 */
                this.processFrequencyMs = 100;
            }
            async init() {
                this.enableVideo();
                this.model = await getSelfieModel((results) => this.processResults(results));
                this.start();
            }
            processResults(results) {
                const image = results.image;
                const mask = results.segmentationMask;
                const { width, height } = mask;
                this.imageHelper ?? (this.imageHelper = getImageHelper(width, height));
                const { drawables, mode, imageHelper, color } = this;
                const toDraw = mode === "color" ? imageHelper.colorIn(mask, color) : imageHelper.getMasked(image, mask);
                this.lastProcessedImage = toDraw;
                if (this.echoLength <= 0) {
                    drawables.length === 0 ? drawables.push(this.createDrawable(toDraw)) : drawables[0].update(toDraw);
                    return;
                }
                while (drawables.length > this.echoLength)
                    drawables.shift().destroy();
                drawables.forEach((drawable, index, { length }) => drawable.setTransparency(100 * ((length - index) / length)));
                drawables.push(this.createDrawable(toDraw));
            }
            start() {
                if (this.processing)
                    return;
                this.processing = true;
                this.enableVideo();
                this.loop();
            }
            stop() {
                this.processing = false;
                this.clearDrawables();
            }
            async loop() {
                while (this.processing) {
                    const image = this.getVideoFrame("canvas");
                    const start = Date.now();
                    if (image)
                        await this.model.send({ image });
                    const elapsed = Date.now() - start;
                    await $common.untilTimePassed(this.processFrequencyMs - elapsed);
                }
            }
            clearDrawables() {
                this.drawables.forEach(drawable => drawable.destroy());
                this.drawables = [];
            }
            async setCostume({ target }) {
                this.addCostume(target, this.lastProcessedImage, "add and set");
            }
            setDisplayMode(mode) {
                this.clearDrawables();
                this.mode = mode;
            }
            setNumberOfEchos(num) {
                this.echoLength = Math.min(100, Math.max(num, 1));
            }
            setColor(color) {
                this.color = $common.rgbToHex(color);
            }
            setFrameRate(fps) {
                this.processFrequencyMs = 1000 / fps;
            }
            setProcessingState(state) {
                state === "on" ? this.start() : this.stop();
            }
        },
        (() => {
            __setFunctionName(_a, "default");
            _setCostume_decorators = [$common.block({
                    type: "command",
                    text: `Set selfie image as costume`,
                })];
            _setDisplayMode_decorators = [$common.block({
                    type: "command",
                    text: (mode) => `Set mode to ${mode}`,
                    arg: { type: "string", options: ["color", "mask"], defaultValue: "mask" }
                })];
            _setNumberOfEchos_decorators = [$common.block({
                    type: "command",
                    text: (num) => `Set echo count to ${num}`,
                    arg: {
                        type: "number",
                        defaultValue: 0,
                        options: {
                            items: [0, 1, 2, 4, 8, 10, 25, 50, 100],
                            acceptsReporters: true,
                            handler: (x) => {
                                const parsed = parseInt(`${x}`);
                                return isNaN(parsed) ? 1 : parsed;
                            }
                        }
                    }
                })];
            _setColor_decorators = [$common.block({
                    type: "command",
                    text: (color) => `Set fill color to ${color}`,
                    arg: "color"
                })];
            _setFrameRate_decorators = [$common.block((self) => ({
                    type: "command",
                    text: (fps) => `Set processing rate to ${fps} fps`,
                    arg: {
                        type: "number",
                        options: [60, 30, 10, 2, 1],
                        defaultValue: 1000 / self.processFrequencyMs
                    }
                }))];
            _setProcessingState_decorators = [$common.block({
                    "type": "command",
                    text: (state) => `Turn processing ${state}`,
                    arg: { type: "string", options: ["on", "off"] }
                })];
            __esDecorate(_a, null, _setCostume_decorators, { kind: "method", name: "setCostume", static: false, private: false, access: { has: obj => "setCostume" in obj, get: obj => obj.setCostume } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setDisplayMode_decorators, { kind: "method", name: "setDisplayMode", static: false, private: false, access: { has: obj => "setDisplayMode" in obj, get: obj => obj.setDisplayMode } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setNumberOfEchos_decorators, { kind: "method", name: "setNumberOfEchos", static: false, private: false, access: { has: obj => "setNumberOfEchos" in obj, get: obj => obj.setNumberOfEchos } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setColor_decorators, { kind: "method", name: "setColor", static: false, private: false, access: { has: obj => "setColor" in obj, get: obj => obj.setColor } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setFrameRate_decorators, { kind: "method", name: "setFrameRate", static: false, private: false, access: { has: obj => "setFrameRate" in obj, get: obj => obj.setFrameRate } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setProcessingState_decorators, { kind: "method", name: "setProcessingState", static: false, private: false, access: { has: obj => "setProcessingState" in obj, get: obj => obj.setProcessingState } }, null, _instanceExtraInitializers);
        })(),
        _a;
})();exports.Extension=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=selfieSegmentation.js.map
