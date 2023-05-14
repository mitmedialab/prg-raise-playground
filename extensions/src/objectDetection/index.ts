import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, untilTimePassed, untilExternalGlobalVariableLoaded } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { ObjectDetector as ObjectDetectorClass, FilesetResolver, Detection } from "@mediapipe/tasks-vision"
import { initializeObjectDetector, getImageHelper } from './utils'
// import { ObjectDectector, FilesetResolver, Detection} from ("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.1.0-alpha-11"); 

/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be delete when you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part to get a popup that tells you more about the code.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Object Detection",
  description: "Detects and identifies the object shown!",
  iconURL: "Typescript_logo.png",
  insetIconURL: "typescript-logo.svg"
};

/** @see {ExplanationOfClass} */
/** @see {ExplanationOfInitMethod} */
export default class objectDetection extends extension(details, "video", "drawable", "addCostumes", "toggleVideoBlock", "setTransparencyBlock") {

  detector: ObjectDetectorClass;
  runningMode;
  continuous: boolean;
  // demosSection = document.getElementById("demos");
  DIMENSIONS = [480, 360];
  detections: any[];
  processFreq: number = 100;
  imageHelper: ReturnType<typeof getImageHelper>;
  drawables: ReturnType<typeof this.createDrawable>[] = [];

  async init(env: Environment) {
    this.enableVideo()
    this.runningMode = 'IMAGE';
    this.continuous = false;
    this.detector = await initializeObjectDetector();
    this.imageHelper = getImageHelper(this.DIMENSIONS[0], this.DIMENSIONS[1])
    // this.detections = []
  }

  private async detectionLoop() {
    while (this.continuous) {
      const frame = this.getVideoFrame("canvas");
      const start = Date.now();
      // console.log(frame)
      if (frame) {
        const detections = await this.detector.detect(frame);
        // console.log(detections)
        this.displayImageDetections(detections, frame);
      }
      const elapsed = Date.now() - start;
      await untilTimePassed(this.processFreq - elapsed);
      this.clearFrame()
    }
  }

  clearFrame(){
    while (this.drawables.length > 0) this.drawables.shift().destroy();
  }

  // FIX AND FINISH
  async displayImageDetections(detections, resultElement: HTMLCanvasElement) {

    const { drawables, imageHelper } = this;

    const ratio = 1

    for (let detection of detections.detections) {
      // const width = detection.boundingBox.width
      // const height = detection.boundingBox.height

      // const box = new Image(width, height)

      // Description text
      const p = document.createElement("p");
      p.setAttribute("class", "info");
      p.innerText =
        detection.categories[0].categoryName +
        " - with " +
        Math.round(parseFloat(detection.categories[0].score) * 100) +
        "% confidence.";
      // Positioned at the top left of the bounding box.
      // Height is whatever the text takes up.
      // Width subtracts text padding in CSS so fits perfectly.
      p.style =
        "left: " +
        detection.boundingBox.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px; " +
        "width: " +
        (detection.boundingBox.width * ratio - 10) +
        "px;";
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style =
        "left: " +
        detection.boundingBox.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px;" +
        "width: " +
        detection.boundingBox.width * ratio +
        "px;" +
        "height: " +
        detection.boundingBox.height * ratio +
        "px;";

      console.log(resultElement.parentNode)
      resultElement.appendChild(highlighter);
      
      resultElement.appendChild(p);
    }

    drawables.push(this.createDrawable(await createImageBitmap(resultElement)));
  }

  // private processResults(results: Results) {
  //   const image = results.image as ImageBitmap;
  //   const mask = results.segmentationMask as ImageBitmap;
  //   const { width, height } = mask;

  //   this.imageHelper ??= getImageHelper(width, height);

  //   const { drawables, mode, imageHelper, color } = this;

  //   const toDraw = mode === "color" ? imageHelper.colorIn(mask, color) : imageHelper.getMasked(image, mask);

  //   this.lastProcessedImage = toDraw;

  //   if (this.echoLength <= 0) {
  //     drawables.length === 0 ? drawables.push(this.createDrawable(toDraw)) : drawables[0].update(toDraw);
  //     return;
  //   }

  //   while (drawables.length > this.echoLength) drawables.shift().destroy();

  //   drawables.forEach((drawable, index, { length }) => drawable.setTransparency(100 * ((length - index) / length)));
  //   drawables.push(this.createDrawable(toDraw));
  // }

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
    type: BlockType.Command,
    text: (freezeTime) => `Detect objects for ${freezeTime} seconds`,
    arg: {type: ArgumentType.Number, defaultValue: 1}
  })
  async detectObject(freezeTime: number) {
    const frame = this.getVideoFrame('canvas')
    const detections = await this.detector.detect(frame);
    console.log(detections.detections)
    this.displayImageDetections(detections, frame);
    await untilTimePassed(freezeTime*1000)
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