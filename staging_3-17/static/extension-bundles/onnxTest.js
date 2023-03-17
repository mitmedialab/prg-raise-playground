var onnxTest=(function(exports,$common){'use strict';/******************************************************************************
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
}/**
 * Used to validate (through type assertion) that a Generic Extension does not
 * define any members with the same name as one of its blocks.
 *
 * The Generic Extension `Extension` class predates this requirment of having no overlap between the keys of blocks and the members of the associated Extension
 * class, so this decorator is provided as an easy way to check and confirm a Generic Extension class is compliant.
 *
 * Runtime errors will also be produced if this condition is not met.
 * @param failure If this extension is not valid, this will be a type that displays the member names causing trouble.
 * @returns
 */
const validGenericExtension = (...failure) => {
    return function (value, context) { };
};async function untilReady(obj, delay = 100) {
    let timeout;
    while (!obj.ready) {
        await new Promise(resolve => {
            clearTimeout(timeout);
            timeout = setTimeout(resolve, delay);
        });
    }
    clearTimeout(timeout);
}
const loadExternalScript = (url, onLoad, onError) => {
    const script = document.createElement('script');
    script.onload = onLoad;
    script.onerror = onError ?? (() => {
        throw new Error(`Error loading endpoint: ${url}`);
    });
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
};class OnnxRuntime {
    get runtime() { return untilReady(this).then(() => this.onnx); }
    get globalOnnx() { return window.ort; }
    constructor() {
        this.ready = false;
        const onnx = this.globalOnnx;
        onnx ? this.resolve() : loadExternalScript(OnnxRuntime.FromCDN, this.resolve.bind(this));
    }
    resolve() {
        this.ready = true;
        this.onnx = this.globalOnnx;
    }
}
OnnxRuntime.FromCDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";
var index = (() => {
    let _classDecorators = [validGenericExtension()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    _classThis = class extends $common.Extension { 
 constructor(runtime){ super(...[runtime, ...["Onnx Example","onnxTest","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="] ]); }; 

        async init(env) {
            this.onnx = await new OnnxRuntime().runtime;
        }
        defineBlocks() {
            return {
                test: {
                    type: $common.BlockType.Command,
                    text: "eee",
                    operation: async () => {
                        try {
                            const { InferenceSession, Tensor } = this.onnx;
                            // create a new session and load the specific model.
                            //
                            // the model in this example contains a single MatMul node
                            // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
                            // it has 1 output: 'c'(float32, 3x3)
                            const session = await InferenceSession.create(`${location.href}/static/model.onnx`);
                            // prepare inputs. a tensor need its corresponding TypedArray as data
                            const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
                            const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
                            const tensorA = new Tensor('float32', dataA, [3, 4]);
                            const tensorB = new Tensor('float32', dataB, [4, 3]);
                            // prepare feeds. use model input names as keys.
                            const feeds = { a: tensorA, b: tensorB };
                            // feed inputs and run
                            const results = await session.run(feeds);
                            // read from results
                            const dataC = results.c.data;
                            console.log(dataC);
                        }
                        catch (e) {
                            console.error(`failed to inference ONNX model: ${e}.`);
                        }
                    }
                }
            };
        }
    };
    __setFunctionName(_classThis, "ExtensionNameGoesHere");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return _classThis;
})();exports.Extension=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=onnxTest.js.map
