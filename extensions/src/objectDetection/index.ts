import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, untilTimePassed, rgbToHex, RGBObject } from "$common";
import { ObjectDetector as ObjectDetectorClass } from "@mediapipe/tasks-vision"
import { initializeObjectDetector, getImageHelper } from './utils'

const details: ExtensionMenuDisplayDetails = {
  name: "Object Detection",
  description: "Detects and identifies the object shown!",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

export default class objectDetection extends extension(details, "video", "drawable", "addCostumes", "toggleVideoBlock", "setTransparencyBlock") {

  detector: ObjectDetectorClass;
  runningMode;
  continuous: boolean;
  DIMENSIONS = [480, 360];
  detections: any[];
  processFreq: number = 100;
  imageHelper: ReturnType<typeof getImageHelper>;
  drawables: ReturnType<typeof this.createDrawable>[] = [];
  color: string;
  thickness: number;

  async init(env: Environment) {
    this.enableVideo()
    this.runningMode = 'IMAGE';
    this.continuous = false;
    this.detector = await initializeObjectDetector();
    this.imageHelper = getImageHelper(this.DIMENSIONS[0], this.DIMENSIONS[1])
    this.color = 'white'
    this.thickness = 5
  }

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

  clearFrame() {
    while (this.drawables.length > 0) this.drawables.shift().destroy();
  }

  async displayImageDetections(detections) {
    const { drawables, imageHelper } = this;
    const rects = imageHelper.createRects(detections.detections, this.color, this.thickness)
    drawables.push(this.createDrawable(rects));
  }

  @block({
    type: "command",
    text: (delay) => `Set cont-detect delay ${delay}`,
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
      handler: (x) => {
        return Math.min(Math.max(0, x), 20)
      }
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
  async continuouslyDetectObjects(state) {
    this.continuous = state
    this.detectionLoop()
  }

}