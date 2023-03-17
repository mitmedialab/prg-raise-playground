import { untilExternalGlobalVariableLoaded } from "$common";
import type Runtime from "$scratch-vm/engine/runtime";
import { ResultsListener, type Results, type SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import MockBitmapAdapter from "./MockBitmapAdapter";
import type Tesseract from "tesseract.js";

export const getImageHelper = (width, height) => {
  const canvas = document.body.appendChild(document.createElement("canvas"));
  canvas.hidden = true;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
 
  return {
    /**
     * 
     * @param mask 
     * @param color 
     * @returns 
     */
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
    /**
     * 
     * @param image 
     * @param mask 
     * @returns 
     */
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
    },
    /**
     * 
     * @param image 
     * @returns 
     */
    getDataURL(image: ImageData) {
      context.save();
      context.clearRect(0, 0, width, height);
      context.putImageData(image, 0, 0);
      const url = canvas.toDataURL('image/png');
      context.restore();
      return url;
    }
  }
}

export const getSelfieModel = async (onFrame: ResultsListener) => {
  const packageURL = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
  const packageClassName = "SelfieSegmentation";

  // Load the media pipe script from an external source to get around the following bug: https://github.com/vitejs/vite/issues/4680
  // TODO: Revist this once rollup-plugin-esbuild supports Typescript 5.0
  const Class = await untilExternalGlobalVariableLoaded<typeof SelfieSegmentation>(packageURL, packageClassName);

  const model = new Class({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
    }
  });
  // Initialize the mediaPipe model according to the documentation
  model.setOptions({ modelSelection: 1 });
  model.onResults(onFrame);
  await model.initialize();

  return model;
}

export const getTesseract = async () => {
  const packageURL = "https://unpkg.com/tesseract.js@4.0.2/dist/tesseract.min.js";
  const packageClassName = "Tesseract";

  let tesseract = await untilExternalGlobalVariableLoaded<typeof Tesseract>(packageURL, packageClassName);
  function imageToText(language: string, image: ImageData){
    return tesseract.recognize(
      image,
      language,
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      return text;
    })
  }
  return imageToText;
}

let bitmapAdapter: MockBitmapAdapter;

export const createCostumeAssetFromImage = async (dataURL: string, runtime: Runtime) => {
  bitmapAdapter ??= new MockBitmapAdapter();

  // storage is of type: https://github.com/LLK/scratch-storage/blob/develop/src/ScratchStorage.js
  const storage = runtime.storage;
  const costumeFormat = storage.DataFormat.PNG;
  const assetType = storage.AssetType.ImageBitmap;

  const dataBuffer = await bitmapAdapter.importBitmap(dataURL);

  const asset = storage.createAsset(
    assetType,
    costumeFormat,
    dataBuffer,
    null,
    true // generate md5
  );

  return {
    name: null, // Needs to be set by caller
    dataFormat: costumeFormat,
    asset: asset,
    md5: `${asset.assetId}.${costumeFormat}`,
    assetId: asset.assetId
  };
}