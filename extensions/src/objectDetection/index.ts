import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { ObjectDetector, FilesetResolver, Detection } from "@mediapipe/tasks-vision"

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

  objectDetector: ObjectDetector;
  // demosSection = document.getElementById("demos");

  init(env: Environment) {
    this.initializeObjectDetector();
    if (this.runtime.ioDevices) {
      this._loop()
    }
  }

  // Initialize the object detector
  async initializeObjectDetector() {

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm"
    );
    this.objectDetector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
      },
      scoreThreshold: 0.5,
      runningMode: 'VIDEO'
    });
    // demosSection.classList.remove("invisible");
  }

  // const initializeObjectDetector = async () => {
  //   const vision = await FilesetResolver.forVisionTasks(
  //     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm"
  //   );
  //   objectDetector = await ObjectDetector.createFromOptions(vision, {
  //     baseOptions: {
  //       modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
  //     },
  //     scoreThreshold: 0.5,
  //     runningMode: runningMode
  //   });
  //   demosSection.classList.remove("invisible");
  // };
  // initializeObjectDetector();


  async _loop() {
    while (true) {
      const frame = this.getVideoFrame('image')
      const time = +new Date();
      if (frame) {
        // this.poseState = await this.estimatePoseOnImage(frame);
      }
      const estimateThrottleTimeout = (+new Date() - time) / 4;
      await new Promise(r => setTimeout(r, estimateThrottleTimeout));
    }
  }



  /** @see {ExplanationOfField} */
  exampleField: number;

  /** @see {ExplanationOfReporterBlock} */
  @block({ type: "reporter", text: "This increments an internal field and then reports it's value" })
  exampleReporter() {
    return ++this.exampleField;
  }

  /** @see {ExplanationOfCommandBlock} */
  @block((self) => ({
    /** @see {ExplanationOfBlockType} */
    type: BlockType.Command,
    /** @see {ExplanationOfBlockTextFunction} */
    text: (exampleString, exampleNumber) => `This is the block's display text with inputs here --> ${exampleString} and here --> ${exampleNumber}`,
    /** @see {ExplanationOfBlockArgs} */
    args: [ArgumentType.String, { type: ArgumentType.Number, defaultValue: self.exampleField }],
  }))
  exampleCommand(exampleString: string, exampleNumber: number) {
    alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
  }

  /** @see {ExplanationOfHatBlock} */
  /** @see {ExplanationOfBlockUtility} */
  @block({
    type: "hat",
    text: (condition) => `Should the below block execute: ${condition}`,
    /** @see {ExplanationOfBlockArg} */
    arg: "Boolean"
  })
  async exampleHat(condition: boolean, util: BlockUtility) {
    return util.stackFrame.isLoop === condition;
  }
}