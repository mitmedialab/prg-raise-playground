import type RenderedTarget from "$scratch-vm/sprites/rendered-target";
import { MinimalExtensionConstructor } from "../../required";
import MockBitmapAdapter from "./MockBitmapAdapter";
import { getUrlHelper } from "./utils";

let bitmapAdapter: MockBitmapAdapter;
let urlHelper: ReturnType<typeof getUrlHelper>;

/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithCustomSupport extends Ctor {

    async addCostume(target: RenderedTarget, image: ImageData, action: "add only" | "generate and set", name?: string) {
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
      if (action === "generate and set") target.setCostume(length);
    }

  }

  return ExtensionWithCustomSupport;
}
