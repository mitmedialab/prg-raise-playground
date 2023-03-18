import { block } from "$common/extension/decorators/blocks";
import { withDependencies } from "../../dependencies";
import { MinimalExtensionConstructor } from "../../required";
import video from "../video";

/**
 * Mixin a 'setVideoTransparencyBlock' to control the transparency of the videofeed
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithSetTransparencyBlock extends withDependencies(Ctor, video) {
    @block({
      type: "button",
      text: "",
    })
    setVideoTransparencyBlock() {
      console.log(Object.keys(this));
      this.enableVideo();
    }
  }

  return ExtensionWithSetTransparencyBlock;
}
