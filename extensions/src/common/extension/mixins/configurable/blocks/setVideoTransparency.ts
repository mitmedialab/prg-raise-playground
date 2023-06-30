import { block } from "$common/extension/decorators/blocks";
import { withDependencies } from "../../dependencies";
import { MinimalExtensionConstructor } from "../../base";
import video from "../video";

/**
 * Mixin a 'setVideoTransparency' Block to control the transparency of the videofeed
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithSetVideoTransparencyBlock extends withDependencies(Ctor, video) {
    /**
     * A `command` block that takes a single number argument and uses it to set the transparency of the video feed.
     * @param transparency What transparency to set -- a higher number is more transparent (thus '100' is fully invisible)
     */
    @block({
      type: "command",
      text: (transparency) => `Set video to ${transparency}% transparent`,
      arg: "number"
    })
    setVideoTransparencyBlock(transparency: number) {
      this.setVideoTransparency(transparency);
    }
  }

  return ExtensionWithSetVideoTransparencyBlock;
}
