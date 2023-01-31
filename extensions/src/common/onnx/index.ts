import { loadExternalScript, untilReady } from "$common/utils";
import * as ort from "onnxruntime-web";

type OnWindow = { ort: typeof ort };

export class OnnxRuntime {
  static CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";

  ready = false;
  private onnx: typeof ort;

  get runtime(): Promise<typeof ort> { return untilReady(this).then(() => this.onnx); }

  constructor() {
    loadExternalScript(OnnxRuntime.CDN, () => {
      this.ready = true;
      this.onnx = (window as any as OnWindow).ort;
    });
  }

}