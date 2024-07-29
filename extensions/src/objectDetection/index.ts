import { ArgumentType, BlockType, ExtensionMenuDisplayDetails, extension, block, untilTimePassed, rgbToHex, RGBObject, scratch } from "$common";
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

  cocoCategories = [
    { text: "person", value: "person" },
    { text: "bicycle", value: "bicycle" },
    { text: "car", value: "car" },
    { text: "motorcycle", value: "motorcycle" },
    { text: "airplane", value: "airplane" },
    { text: "bus", value: "bus" },
    { text: "train", value: "train" },
    { text: "truck", value: "truck" },
    { text: "boat", value: "boat" },
    { text: "traffic light", value: "traffic light" },
    { text: "fire hydrant", value: "fire hydrant" },
    { text: "stop sign", value: "stop sign" },
    { text: "parking meter", value: "parking meter" },
    { text: "bench", value: "bench" },
    { text: "bird", value: "bird" },
    { text: "cat", value: "cat" },
    { text: "dog", value: "dog" },
    { text: "horse", value: "horse" },
    { text: "sheep", value: "sheep" },
    { text: "cow", value: "cow" },
    { text: "elephant", value: "elephant" },
    { text: "bear", value: "bear" },
    { text: "zebra", value: "zebra" },
    { text: "giraffe", value: "giraffe" },
    { text: "backpack", value: "backpack" },
    { text: "umbrella", value: "umbrella" },
    { text: "handbag", value: "handbag" },
    { text: "tie", value: "tie" },
    { text: "suitcase", value: "suitcase" },
    { text: "frisbee", value: "frisbee" },
    { text: "skis", value: "skis" },
    { text: "snowboard", value: "snowboard" },
    { text: "sports ball", value: "sports ball" },
    { text: "kite", value: "kite" },
    { text: "baseball bat", value: "baseball bat" },
    { text: "baseball glove", value: "baseball glove" },
    { text: "skateboard", value: "skateboard" },
    { text: "surfboard", value: "surfboard" },
    { text: "tennis racket", value: "tennis racket" },
    { text: "bottle", value: "bottle" },
    { text: "wine glass", value: "wine glass" },
    { text: "cup", value: "cup" },
    { text: "fork", value: "fork" },
    { text: "knife", value: "knife" },
    { text: "spoon", value: "spoon" },
    { text: "bowl", value: "bowl" },
    { text: "banana", value: "banana" },
    { text: "apple", value: "apple" },
    { text: "sandwich", value: "sandwich" },
    { text: "orange", value: "orange" },
    { text: "broccoli", value: "broccoli" },
    { text: "carrot", value: "carrot" },
    { text: "hot dog", value: "hot dog" },
    { text: "pizza", value: "pizza" },
    { text: "donut", value: "donut" },
    { text: "cake", value: "cake" },
    { text: "chair", value: "chair" },
    { text: "couch", value: "couch" },
    { text: "potted plant", value: "potted plant" },
    { text: "bed", value: "bed" },
    { text: "dining table", value: "dining table" },
    { text: "toilet", value: "toilet" },
    { text: "TV", value: "TV" },
    { text: "laptop", value: "laptop" },
    { text: "mouse", value: "mouse" },
    { text: "remote", value: "remote" },
    { text: "keyboard", value: "keyboard" },
    { text: "cell phone", value: "cell phone" },
    { text: "microwave", value: "microwave" },
    { text: "oven", value: "oven" },
    { text: "toaster", value: "toaster" },
    { text: "sink", value: "sink" },
    { text: "refrigerator", value: "refrigerator" },
    { text: "book", value: "book" },
    { text: "clock", value: "clock" },
    { text: "vase", value: "vase" },
    { text: "scissors", value: "scissors" },
    { text: "teddy bear", value: "teddy bear" },
    { text: "hair drier", value: "hair drier" },
    { text: "toothbrush", value: "toothbrush" }
  ];


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
    console.log("DETECTIONS");
    console.log(detections);
    this.displayImageDetections(detections);
    await untilTimePassed(freezeTime * 1000)
    this.clearFrame()
  }

  @block({
    type: BlockType.Reporter,
    text: (dimension, index) => `Get bounding box ${dimension} for box ${index}`,
    args: [{
      type: ArgumentType.String, options: [
        { text: 'x', value: 'x' },
        { text: 'y', value: 'y' },
        { text: 'width', value: 'width' },
        { text: 'height', value: 'height' },
      ], defaultValue: "x"
    }, { type: ArgumentType.Number, defaultValue: 0 }]
  })
  async getObjectPosition(dimension: string, index: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return 0;
    }
    if (dimension == 'x') {
      return detections.detections[index].boundingBox.originX;
    } else if (dimension == 'y') {
      return detections.detections[index].boundingBox.originY;
    } else if (dimension == 'width') {
      return detections.detections[index].boundingBox.width;
    } else {
      return detections.detections[index].boundingBox.height;
    }

  }

  @(scratch.reporter((self, $) => $`Is ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }} in bounds?`))
  async inBounds(category: string) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return false;
    }
    for (let i = 0; i < detections.detections.length; i++) {
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category)) {
        return true;
      }
    }
    return false;
  }

  calculateDistance2D(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
    let angleRad = Math.atan2(y2 - y1, x2 - x1);
    let angleDeg = angleRad * (180 / Math.PI);
    angleDeg = (angleDeg + 360) % 360;
    return angleDeg;
  }

  @(scratch.reporter((self, $) => $`Distance from ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }} to x ${"number"}, y ${"number"}`))
  async distanceToCategory(category: string, x: number, y: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return false;
    }
    let box;
    for (let i = 0; i < detections.detections.length; i++) {
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category)) {
        box = detections.detections[i].boundingBox;
      }
    }
    if (box) {
      let boxX = box.originX + box.width / 2;
      let boxY = box.originY + box.height / 2;
      return this.calculateDistance2D(boxX, boxY, x, y);
    }
    return false;
  }

  @(scratch.reporter((self, $) => $`Distance from ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }} to ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }}`))
  async distanceBetweenCategory(category1: string, category2: string) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return false;
    }
    let box1;
    let box2
    for (let i = 0; i < detections.detections.length; i++) {
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category1)) {
        box1 = detections.detections[i].boundingBox;
      }
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category2)) {
        box2 = detections.detections[i].boundingBox;
      }
    }
    if (box1 && box2) {
      let box1X = box1.originX + box1.width / 2;
      let box1Y = box1.originY + box1.height / 2;
      let box2X = box2.originX + box2.width / 2;
      let box2Y = box2.originY + box2.height / 2;
      return this.calculateDistance2D(box1X, box1Y, box2X, box2Y);
    }
    return false;
  }

  @(scratch.reporter((self, $) => $`Angle from ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }} to ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }}`))
  async angleBetweenCategory(category1: string, category2: string) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return false;
    }
    let box1;
    let box2
    for (let i = 0; i < detections.detections.length; i++) {
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category1)) {
        box1 = detections.detections[i].boundingBox;
      }
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category2)) {
        box2 = detections.detections[i].boundingBox;
      }
    }
    if (box1 && box2) {
      let box1X = box1.originX + box1.width / 2;
      let box1Y = box1.originY + box1.height / 2;
      let box2X = box2.originX + box2.width / 2;
      let box2Y = box2.originY + box2.height / 2;
      return this.calculateAngle(box1X, box1Y, box2X, box2Y);
    }
    return false;
  }

  @(scratch.reporter((self, $) => $`Angle from ${{ type: "string", options: self.cocoCategories, defaultValue: "person" }} to x ${"number"}, y ${"number"}`))
  async angleToCategory(category: string, x: number, y: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (detections.detections.length == 0) {
      return false;
    }
    let box;
    for (let i = 0; i < detections.detections.length; i++) {
      if (detections.detections[i].categories.map(category => category.categoryName).includes(category)) {
        box = detections.detections[i].boundingBox;
      }
    }
    if (box) {
      let boxX = box.originX + box.width / 2;
      let boxY = box.originY + box.height / 2;
      return this.calculateAngle(boxX, boxY, x, y);
    }
    return false;
  }

  @(scratch.reporter`Distance from box ${"number"} to x ${"number"}, y ${"number"}`)
  async distanceToIndex(index: number, x: number, y: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (index < detections.detections.length) {
      let box = detections.detections[index].boundingBox;
      let boxX = box.originX + box.width / 2;
      let boxY = box.originY + box.height / 2;
      return this.calculateDistance2D(boxX, boxY, x, y);
    }
    return false;
  }

  @(scratch.reporter`Angle from box ${"number"} to x ${"number"}, y ${"number"}`)
  async angleToIndex(index: number, x: number, y: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    if (index < detections.detections.length) {
      let box = detections.detections[index].boundingBox;
      let boxX = box.originX + box.width / 2;
      let boxY = box.originY + box.height / 2;
      return this.calculateAngle(boxX, boxY, x, y);
    }
    return false;
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