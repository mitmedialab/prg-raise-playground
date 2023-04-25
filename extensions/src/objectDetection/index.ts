import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, untilExternalGlobalVariableLoaded } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { ObjectDetector as ObjectDetectorClass, FilesetResolver, Detection } from "@mediapipe/tasks-vision"

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
export default class objectDetection extends extension(details, "video", "toggleVideoBlock", "setTransparencyBlock") {

  objectDetector: typeof ObjectDetectorClass;
  detector;
  runningMode;
  continuous: boolean;
  // demosSection = document.getElementById("demos");

  init(env: Environment) {
    this.runningMode = 'IMAGE';
    this.continuous = false;
    this.initializeObjectDetector();
  }

  // Initialize the object detector
  async initializeObjectDetector() {
    // @ts-ignore
    const z = await import("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.1.0-alpha-11");
    const objectDetector: typeof ObjectDetectorClass = z["ObjectDetector"];
    const { ObjectDectector, FilesetResolver } = z as { ObjectDectector: typeof ObjectDetectorClass, FilesetResolver };

    //const package = await untilExternalGlobalVariableLoaded("url", "taskVision");
    //const objectDector: ObjectDetector = package["ObjectDector"];

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm"
    );
    this.detector = await objectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
      },
      scoreThreshold: 0.5,
      runningMode: this.runningMode
    });
  }

  private async detectionLoop() {
    while (this.continuous) {
      const frame = this.getVideoFrame('image')
      const time = +new Date();
      if (frame) {
        // this.detector = 
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }

  @block({
    type: BlockType.Command,
    text: `Detect objects`
  })
  detectObject() {
    console.log('pass')
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