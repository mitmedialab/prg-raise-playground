import { ArgumentType, BlockType, ExtensionMenuDisplayDetails, extension, block, untilTimePassed, rgbToHex, RGBObject } from "$common";
import type { ObjectDetector as ObjectDetectorClass } from "@mediapipe/tasks-vision";
import { initializeObjectDetector, getImageHelper } from './utils';

const details: ExtensionMenuDisplayDetails = {
  name: "Object Detection",
  description: "Detects and identifies the object shown!",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

export default class objectDetection extends extension(details, "video", "drawable", "addCostumes", "toggleVideoBlock", "setTransparencyBlock") {

  /**
   * The MediaPipe detector that is used to detect objects
   */
  detector: ObjectDetectorClass;

  /**
   * Tells whether the continuous detection should be on/off
   */
  continuous: boolean = false;

  /**
   * The frequency at which the detector will generate new detections
   */
  processFreq: number = 100;

  /**
   * Helper for creating ImageData objects (used to create drawables)
   */
  imageHelper: ReturnType<typeof getImageHelper>;

  /**
   * The list of drawables, which will all be displayed in the video frame
   */
  drawables: ReturnType<typeof this.createDrawable>[] = [];

  /**
   * The color of the detection box
   */
  color: string = 'white';

  /**
   * The thickness of the detection box
   */
  thickness: number = 5;

  /**
   * Initializes the extension with standard values for the extension's class attributes.
   */
  async init() {
    this.enableVideo()
    this.detector = await initializeObjectDetector();
    this.imageHelper = getImageHelper(this.videoDimensions.width, this.videoDimensions.height);
  }

  /**
   * Runs a loop for constantly updating the video frame with a new set of detections.
   * Used for the continuous detection block.
   */
  private async detectionLoop() {
    while (this.continuous) {
      const frame = this.getVideoFrame("canvas");
      const start = Date.now();
      if (frame) {
        const detections = await this.detector.detect(frame);
        this.displayImageDetections(detections);
      }
      const elapsed = Date.now() - start;
      await untilTimePassed(this.processFreq - elapsed);
      this.clearFrame();
    }
  }

  /**
   * Clears the frame of all drawables (resets the frame to blank video).
   */
  clearFrame() {
    while (this.drawables.length > 0) this.drawables.shift().destroy();
  }

  /**
   * Displays the detections from the detector in the video frame.
   * @param detections The detections object returned from the detector's detect method
   */
  async displayImageDetections(detections) {
    const { drawables, imageHelper } = this;
    const rects = imageHelper.createRects(detections.detections, this.color, this.thickness);
    drawables.push(this.createDrawable(rects));
  }

  @block({
    type: "command",
    text: (delay) => `Set detection rate to ${delay}`,
    arg: {
      type: "number",
      options: [60, 30, 10, 2, 1],
      defaultValue: 10
    }
  })
  setFrameRate(delay: number) {
    this.processFreq = 1000 / delay;
  }

  @block({
    type: "command",
    text: (color) => `Set box color to ${color}`,
    arg: "color"
  })
  setColor(color: RGBObject) {
    this.color = rgbToHex(color);
  }

  @block({
    type: "command",
    text: (thickness) => `Set box thickness to ${thickness}`,
    arg: {
      type: "number",
      defaultValue: 5,
      handler: (x) => {
        return isNaN(x) ? 5 : Math.min(Math.max(0, x), 50);
      }
    }
  })
  setThickness(thickness: number) {

    // temporary solution until handler fix
    this.thickness = isNaN(thickness) ? 5 : Math.min(Math.max(0, thickness), 50);
  }

  @block({
    type: BlockType.Command,
    text: (freezeTime) => `Detect objects for ${freezeTime} seconds`,
    arg: { type: ArgumentType.Number, defaultValue: 1 }
  })
  async detectObject(freezeTime: number) {
    const frame = this.getVideoFrame('canvas');
    const detections = await this.detector.detect(frame);
    this.displayImageDetections(detections);
    await untilTimePassed(freezeTime * 1000);
    this.clearFrame();
  }

  @block({
    type: BlockType.Command,
    text: (state) => `Turn continuous detection ${state}`,
    arg: { type: ArgumentType.Boolean, options: [{ text: 'on', value: true }, { text: 'off', value: false }] }
  })
  async continuouslyDetectObjects(state) {
    this.continuous = state;
    this.detectionLoop();
  }
}