import type * as cv from "@techstark/opencv-js";
import ExternalLibrary from "../ExternalLibrary";

export default class OpenCV extends ExternalLibrary<cv.CV> {
  protected details = {
    globalVariableName: "cv",
    url: "https://docs.opencv.org/4.6.0/opencv.js"
  }
}