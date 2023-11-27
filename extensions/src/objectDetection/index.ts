import { ArgumentType, BlockType, ExtensionMenuDisplayDetails, extension, block, untilTimePassed, rgbToHex, RGBObject } from "$common";
import { ObjectDetector as ObjectDetectorClass } from "@mediapipe/tasks-vision"
import { initializeObjectDetector, getImageHelper } from './utils'

const details: ExtensionMenuDisplayDetails = {
  name: "Object Detection",
  description: "Detects and identifies the object shown!",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg",
  tags: ["PRG Internal"]
};

export default class objectDetection extends extension(details, "video", "drawable", "addCostumes", "toggleVideoBlock", "setTransparencyBlock") {

  /**
   * The MediaPipe detector that is used to detect objects
   */
  detector: ObjectDetectorClass;

  /**
   * Tells whether the continuous detection should be on/off
   */
  continuous: boolean;

  /**
   * Dimensions of the video frame
   */
  DIMENSIONS = [480, 360];

  /**
   * The frequency at which the detector will generate new detections
   */
  processFreq: number;

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
  color: string;

  /**
   * The thickness of the detection box
   */
  thickness: number;

  /**
   * Initializes the extension with standard values for the extension's class attributes.
   */
  async init() {
    this.enableVideo()
    this.continuous = false;
    this.detector = await initializeObjectDetector();
    this.imageHelper = getImageHelper(this.DIMENSIONS[0], this.DIMENSIONS[1])
    this.color = 'white'
    this.thickness = 5
    this.processFreq = 100;
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
      this.clearFrame()
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
    const rects = imageHelper.createRects(detections.detections, this.color, this.thickness)
    drawables.push(this.createDrawable(rects));
  }

  @block({
    type: "command",
    text: (delay) => `Set detection rate to ${delay}`,
    arg: {
      type: "number",
      options: [60, 30, 10, 2, 1],
      defaultValue: 10
    } as const
  })
  setFrameRate(delay: number) {
    this.processFreq = 1000 / delay
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
    }
  })
  setThickness(thickness: number) {
    this.thickness = thickness;
  }

  @block({
    type: BlockType.Command,
    text: (freezeTime) => `Detect objects for ${freezeTime} seconds`,
    arg: { type: ArgumentType.Number, defaultValue: 1 }
  })
  async detectObject(freezeTime: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    this.displayImageDetections(detections);
    await untilTimePassed(freezeTime * 1000)
    this.clearFrame()
  }

  @block({
    type: BlockType.Command,
    text: (state) => `Toggle continuous detection ${state}`,
    arg: { type: ArgumentType.Boolean, options: [{ text: 'on', value: true }, { text: 'off', value: false }] }
  })
  async continuouslyDetectObjects(state: boolean) {
    this.continuous = state
    this.detectionLoop()
  }
}