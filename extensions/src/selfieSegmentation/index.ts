//Parker Malachowsky
//Gur Machol

import { ExtensionMenuDisplayDetails, extension, block, untilTimePassed, RGBObject, rgbToHex } from "$common";
import { type Results, type SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { createCostumeAssetFromImage, getImageHelper, getSelfieModel, getTesseract } from "./utils";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import type RenderedTarget from "$scratch-vm/sprites/rendered-target";


//add angle field and rotate image before costume
//block to take x photos in x seconds 

const details: ExtensionMenuDisplayDetails = {
  name: "Selfie Detector",
};
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export default class extends extension(details, "video", "drawable") {
  // A reference to the mediapipe SelfieSegmentation class doing all the work
  model: SelfieSegmentation;


  /**
   * Whether or not the extension should currently be processing selfies
   */
  processing: boolean;

  /**
   * An to the items being drawn on screen
   */
  drawables: ReturnType<typeof this.createDrawable>[] = [];

  /**
   * Current drawing method.
   * - Mask: Mask-out the selfie region of the original image
   * - Color: Draw the selfi region as a single color
   */
  mode: "mask" | "color" = "mask";

  /**
   * How many 'echo' images to preserve on screen
   */
  echoLength: number = 0;

  /**
   * Ideal processing time for each selfie
   */
  processFrequencyMs: number = 100;

  /**
   * Color used to fill in selfie region when mode = "color"
   */
  color: string;

  /**
   * Helper object for using and manipulating the ouputs of the model
   */
  imageHelper: ReturnType<typeof getImageHelper>;

  getTesseractInfrence: Awaited<ReturnType<typeof getTesseract>>;

  lastProcessedImage: ImageData;

  async init() {
    this.enableVideo();
    this.model = await getSelfieModel((results) => this.processResults(results));
    this.start();
    this.getTesseractInfrence = await getTesseract();
  }

  private processResults(results: Results) {
    const image = results.image as ImageBitmap;
    const mask = results.segmentationMask as ImageBitmap;
    const { width, height } = mask;

    this.imageHelper ??= getImageHelper(width, height);

    const { drawables, mode, imageHelper, color } = this;

    const toDraw = mode === "color" ? imageHelper.colorIn(mask, color) : imageHelper.getMasked(image, mask);

    this.lastProcessedImage = toDraw;

    if (this.echoLength <= 0) {
      drawables.length === 0 ? drawables.push(this.createDrawable(toDraw)) : drawables[0].update(toDraw);
      return;
    }

    while (drawables.length > this.echoLength) drawables.shift().destroy();

    drawables.forEach((drawable, index, { length }) => drawable.setTransparency(100 * ((length - index) / length)));
    drawables.push(this.createDrawable(toDraw));
  }

  private start() {
    if (this.processing) return;
    this.processing = true;
    this.loop();
  }

  private stop() {
    this.processing = false;
    this.clearDrawables();
  }

  private async loop() {
    while (this.processing) {
      const image = this.getVideoFrame("canvas");
      const start = Date.now();
      if (image) await this.model.send({ image });
      const elapsed = Date.now() - start;
      await untilTimePassed(this.processFrequencyMs - elapsed);
    }
  }

  private clearDrawables() {
    this.drawables.forEach(drawable => drawable.destroy());
    this.drawables = [];
  }

  @block({
    type: "command",
    text: `Set selfie image as costume`,
  })
  async setCostume(util: BlockUtility) {
    const buffer = this.imageHelper.getDataURL(this.lastProcessedImage);
    const costume = await createCostumeAssetFromImage(buffer, this.runtime);
    costume.name = `${this.id}_generated_${Date.now()}`;
    const renderedTarget = util.target as any as RenderedTarget;
    const { length } = renderedTarget.getCostumes();
    await this.runtime.addCostume(costume);
    renderedTarget.addCostume(costume, length);
    renderedTarget.setCostume(length);
  }
  /*
  @block({
    type: "command",
    arg: "number"
    text: (degree) =>`Set selfie image as costume rotated ${degree} degrees`,
  })
  async setCostumeAndRotaion(util: BlockUtility, degree: number) {
    const buffer = this.imageHelper.getDataURL(this.lastProcessedImage);
    const costume = await createCostumeAssetFromImage(buffer, this.runtime);
    costume.name = `${this.id}_generated_${Date.now()}`;
    const renderedTarget = util.target as any as RenderedTarget;
    const { length } = renderedTarget.getCostumes();
    await this.runtime.addCostume(costume);
    renderedTarget.addCostume(costume, length);
    renderedTarget.setCostume(length);
  }
  */
  @block({
    type: "command",
    text: (x) => `Set video feed transparency to ${x}%`,
    arg: "number"
  })
  setVideoFeedTransparency(transparency: number) {
    this.setVideoTransparency(transparency);
  }

  @block({
    type: "command",
    text: (mode) => `Set mode to ${mode}`,
    arg: { type: "string", options: ["color", "mask"], defaultValue: "mask" }
  })
  setDisplayMode(mode: typeof this.mode) {
    this.clearDrawables();
    this.mode = mode;
  }

  @block({
    type: "command",
    text: (num) => `Set echo count to ${num}`,
    arg: {
      type: "number",
      defaultValue: 0,
      options: {
        items: [0, 1, 2, 4, 8, 10, 25, 50, 100],
        acceptsReporters: true,
        handler: (x) => {
          const parsed = parseInt(`${x}`);
          return isNaN(parsed) ? 1 : parsed;
        }
      }
    }
  })
  setNumberOfEchos(num: number) {
    this.echoLength = Math.min(100, Math.max(num, 1));
  }

  @block({
    type: "command",
    text: (color) => `Set fill color to ${color}`,
    arg: "color"
  })
  setColor(color: RGBObject) {
    this.color = rgbToHex(color);
  }

  @block((self) => ({
    type: "command",
    text: (fps) => `Set processing rate to ${fps} fps`,
    arg: {
      type: "number",
      options: [60, 30, 10, 2, 1],
      defaultValue: 1000 / self.processFrequencyMs
    } as const
  }))
  setFrameRate(fps: number) {
    this.processFrequencyMs = 1000 / fps
  }

  @block({
    "type": "command",
    text: (state) => `Turn processing ${state}`,
    arg: { type: "string", options: ["on", "off"] }
  })
  setProcessingState(state: "on" | "off") {
    state === "on" ? this.start() : this.stop();
  }

  @block({
    type: "command",
    text: (numberOfPics: number, seconds: number) => `Make ${numberOfPics} selfie images into costumes in ${seconds} seconds`,
    args: [{ type: "number" }, { type: "number" }],
  })
  async xCostumesxSeconds(numberOfPics: number, seconds: number, util: BlockUtility) {
    for (let x = 0; x <= numberOfPics; x++) {
      const buffer = this.imageHelper.getDataURL(this.lastProcessedImage);
      const costume = await createCostumeAssetFromImage(buffer, this.runtime);
      costume.name = `${this.id}_generated_${Date.now()}`;
      const renderedTarget = util.target as any as RenderedTarget;
      const { length } = renderedTarget.getCostumes();
      await this.runtime.addCostume(costume);
      renderedTarget.addCostume(costume, length);
      renderedTarget.setCostume(length);
      sleep((seconds * 1000 + 10) / numberOfPics);
    }

  }
  @block({
    type: "reporter",
    text: "Text recognized in image",
  })
  async generateText() {
    let imageText = await this.getTesseractInfrence("eng", this.imageHelper.getDataURL(this.getVideoFrame("image")));
    return imageText;
  }

  @block({
    type: "command",
    text: (condition) => `Flip video ${condition}`,
    arg: { type: "Boolean", options: [true, false] }
  })
  flipVideoBlock(doFlip: boolean) {
    this.flipVideo(doFlip)
  }
}