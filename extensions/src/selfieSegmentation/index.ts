import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, loadExternalScript, untilExternalScriptLoaded, untilExternalGlobalVariableLoaded, untilTimePassed, RGBObject, rgbToHex } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { type Results, type SelfieSegmentation } from "@mediapipe/selfie_segmentation";

const details: ExtensionMenuDisplayDetails = {
  name: "Selfie Detector",
};

const packageURL = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
const packageClassName = "SelfieSegmentation";

const getImageHelper = (width, height) => {
  const canvas = document.body.appendChild(document.createElement("canvas"));
  canvas.hidden = true;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  return {
    colorIn(mask: ImageBitmap, color: string) {
      context.save();
      context.clearRect(0, 0, width, height);
      context.drawImage(mask, 0, 0);
      context.globalCompositeOperation = 'source-in';
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
      return context.getImageData(0, 0, width, height);
    },
    getMasked(image: ImageBitmap, mask: ImageBitmap) {
      context.save();
      context.clearRect(0, 0, width, height);
      context.drawImage(mask, 0, 0);
      context.globalCompositeOperation = 'source-in';
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      context.restore();
      return context.getImageData(0, 0, width, height);
    }
  }
}

export default class extends extension(details, "video", "drawable") {
  model: SelfieSegmentation;
  processing: boolean;
  drawables: ReturnType<typeof this.createDrawable>[] = [];
  mode: "mask" | "color" = "mask";
  echoLength: number = 0;
  processFrequencyMs: number = 100;
  color: string;

  imageHelper: ReturnType<typeof getImageHelper>;

  async init(env: Environment) {
    this.enableVideo();
    // Load the media pipe script from an external source.
    // This allows us to get around the following bug:
    // https://github.com/vitejs/vite/issues/4680
    // An alternative is being explored
    const SelfieClass = await untilExternalGlobalVariableLoaded<typeof SelfieSegmentation>(packageURL, packageClassName);

    // Initialize the mediaPipe model according to the documentation
    this.model = new SelfieClass({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
      }
    });
    this.model.setOptions({ modelSelection: 1 });
    this.model.onResults((results) => this.processResults(results));
    await this.model.initialize();

    // start our processing loop
    this.start();
  }

  private processResults(results: Results) {
    const image = results.image as ImageBitmap;
    const mask = results.segmentationMask as ImageBitmap;
    const { width, height } = mask;
    this.imageHelper ??= getImageHelper(width, height);
    const { drawables, mode, imageHelper, color } = this;

    const toDraw = mode === "color"
      ? imageHelper.colorIn(mask, color)
      : imageHelper.getMasked(image, mask);

    if (this.echoLength <= 0) {
      if (drawables.length === 0) drawables[0] = this.createDrawable(toDraw);
      return drawables[0].update(toDraw);
    }

    while (drawables.length > this.echoLength) drawables.shift().destroy();
    const { length } = drawables;
    for (let index = 0; index < length; index++) {
      drawables[index].setTransparency(100 * ((length - index) / length));
    }
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
    arg: { type: "number", options: [60, 30, 10, 2, 1], defaultValue: 1000 / self.processFrequencyMs } as const
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
}