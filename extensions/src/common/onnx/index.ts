import { loadExternalScript, untilReady } from "$common/utils";
import * as ort from "onnxruntime-web";

type OnWindow = { ort: typeof ort };

export class OnnxRuntime {
  static FromCDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";

  ready = false;
  private onnx: typeof ort;

  get runtime(): Promise<typeof ort> { return untilReady(this).then(() => this.onnx); }

  private get globalOnnx() { return (window as any as OnWindow).ort }

  constructor() {
    const onnx = this.globalOnnx;
    onnx ? this.resolve(onnx) : loadExternalScript(OnnxRuntime.FromCDN, this.resolve);
  }

  private resolve(onnx?: typeof ort) {
    this.ready = true;
    this.onnx = onnx ?? this.globalOnnx;
  }
}