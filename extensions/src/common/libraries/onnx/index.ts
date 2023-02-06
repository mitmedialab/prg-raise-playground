import * as ort from "onnxruntime-web";
import ExternalLibrary from "../ExternalLibrary";

export default class Onnx extends ExternalLibrary<typeof ort> {
  protected details = {
    globalVariableName: "ort",
    url: "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"
  };

}