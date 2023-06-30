import type RenderedTarget from "$scratch-vm/sprites/rendered-target";
import Target from "$scratch-vm/engine/target";
import { MinimalExtensionConstructor } from "../../required";
import MockBitmapAdapter from "./MockBitmapAdapter";
import { getUrlHelper } from "./utils";

let bitmapAdapter: MockBitmapAdapter;
let urlHelper: ReturnType<typeof getUrlHelper>;

const rendererKey: keyof RenderedTarget = "renderer";
const isRenderedTarget = (target: Target | RenderedTarget): target is RenderedTarget => rendererKey in target;

/**
 * Mixin the ability for extensions to add costumes to sprites
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithCustomSupport extends Ctor {

    /**
     * Add a costume to the current sprite based on same image data
     * @param {RenderedTarget} target (e.g. `util.target`)
     * @param {ImageData} image What image to use to create the costume
     * @param {"add only" | "add and set"} action What action should be applied
     * - **_add only_**: generates the costume and append it it to the sprite's costume library
     * - **_add and set_**: Both generate the costume (adding it to the sprite's costume library) and set it as the sprite's current costume
     * @param {string?} name optional name to attach to the costume
     */
    async addCostume(target: Target, image: ImageData, action: "add only" | "add and set", name?: string) {
      if (!isRenderedTarget(target)) return console.warn("Costume could not be added is the supplied target wasn't a rendered target");

      name ??= `${this.id}_generated_${Date.now()}`;
      bitmapAdapter ??= new MockBitmapAdapter();
      urlHelper ??= getUrlHelper(image);

      // storage is of type: https://github.com/LLK/scratch-storage/blob/develop/src/ScratchStorage.js
      const { storage } = this.runtime;
      const dataFormat = storage.DataFormat.PNG;
      const assetType = storage.AssetType.ImageBitmap;
      const dataBuffer = await bitmapAdapter.importBitmap(urlHelper.getDataURL(image));

      const asset = storage.createAsset(assetType, dataFormat, dataBuffer, null, true);
      const { assetId } = asset;
      const costume = { name, dataFormat, asset, md5: `${assetId}.${dataFormat}`, assetId };

      await this.runtime.addCostume(costume);

      const { length } = target.getCostumes();

      target.addCostume(costume, length);
      if (action === "add and set") target.setCostume(length);
    }

  }

  return ExtensionWithCustomSupport;
}
