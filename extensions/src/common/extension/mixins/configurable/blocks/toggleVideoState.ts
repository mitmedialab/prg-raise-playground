import { block } from "$common/extension/decorators/blocks";
import { withDependencies } from "../../dependencies";
import { MinimalExtensionConstructor } from "../../base";
import video from "../video";

/**
 * Mixin a 'toggleVideo' Block to control whether the video feed is on, off, or flipped
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithToggleVideoBlock extends withDependencies(Ctor, video) {
    /**
     * A `command` block that sets the current video state
     * @param state What state to set ("on", "off", or "on (flipped)")
     * @returns 
     */
    @block({
      type: "command",
      text: (state) => `Set video feed to ${state}`,
      arg: { type: "string", options: ["on", "off", "on (flipped)"] }
    })
    toggleVideoBlock(state: "off" | "on" | "on (flipped)") {
      if (state === "off") return this.disableVideo();
      this.enableVideo(state === "on");
    }
  }

  return ExtensionWithToggleVideoBlock;
}
