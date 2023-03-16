import { StageLayering, ValueOf } from "$common/types";
import { MinimalExtensionConstructor } from "../required";

type Handle = number;

type Renderer = {
  /**
   * Create a new bitmap skin from a snapshot of the provided bitmap data.
   * @param {ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} bitmapData - new contents for this skin.
   * @param {!int} [costumeResolution=1] - The resolution to use for this bitmap.
   * @param {?Array<number>} [rotationCenter] Optional: rotation center of the skin. If not supplied, the center of
   * the skin will be used.
   * @returns {!int} the ID for the new skin.
   */
  createBitmapSkin(bitmapData: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, costumeResolution?: number, rotationCenter?: Array<number> | null): Handle;
  /**
   * Create a new Drawable and add it to the scene.
   * @param {string} group Layer group to add the drawable to
   * @returns {int} The ID of the new Drawable.
   */
  createDrawable(group: string): Handle;
  /**
     * Update a drawable's visibility.
     * @param {number} drawableID The drawable's id.
     * @param {boolean} visible Will the drawable be visible?
     */
  updateDrawableVisible(drawableID: number, visible: boolean): void;
  /**
   * Update a drawable's visual effect.
   * @param {number} drawableID The drawable's id.
   * @param {string} effectName The effect to change.
   * @param {number} value A new effect value.
   */
  updateDrawableEffect(drawableID: number, effectName: string, value: number): void;
  /**
   * Update a drawable's skin.
   * @param {number} drawableID The drawable's id.
   * @param {number} skinId The skin to update to.
   */
  updateDrawableSkinId(drawableID: Handle, skinId: Handle): void;
  /**
   * Update an existing bitmap skin, or create a bitmap skin if the previous skin was not bitmap.
   * @param {!int} skinId the ID for the skin to change.
   * @param {!ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imgData - new contents for this skin.
   * @param {!number} bitmapResolution - the resolution scale for a bitmap costume.
   * @param {?Array<number>} rotationCenter Optional: rotation center of the skin. If not supplied, the center of the
   * skin will be used
   */
  updateBitmapSkin(skinId: Handle, imgData: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, bitmapResolution: number, rotationCenter?: Array<number> | null): void;
  /**
   * Destroy an existing skin. Do not use the skin or its ID after calling this.
   * @param {!int} skinId - The ID of the skin to destroy.
   */
  destroySkin(skinId: number): void;
  /**
   * Destroy a Drawable, removing it from the scene.
   * @param {int} drawableID The ID of the Drawable to remove.
   * @param {string} group Group name that the drawable belongs to
   */
  destroyDrawable(drawableID: Handle, group: string): void;
}

/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithDrawingSupport extends Ctor {
    private renderer: Renderer;

    protected createDrawable<T extends ImageData | ImageBitmap>(image: T) {
      this.renderer ??= this.runtime.renderer;
      const { renderer } = this;

      if (!renderer) return null;

      const skin = renderer.createBitmapSkin(image as ImageData, 1);
      const drawable = renderer.createDrawable(StageLayering.VideoLayer);

      renderer.updateDrawableSkinId(drawable, skin);

      const setTransparency = (transparency: number) =>
        renderer.updateDrawableEffect(drawable, 'ghost', transparency);

      const setVisible = (visible: boolean = true) =>
        renderer.updateDrawableVisible(drawable, visible);

      const update = (image: ImageData | ImageBitmap) =>
        renderer.updateBitmapSkin(skin, image as ImageData, 1);

      const destroy = () => {
        setVisible(false);
        renderer.destroyDrawable(drawable, StageLayering.VideoLayer);
        renderer.destroySkin(skin);
      }

      setTransparency(0);
      setVisible(true);

      return { setTransparency, setVisible, update, destroy }
    }
  }

  return ExtensionWithDrawingSupport;
}
