import type Video from "$scratch-vm/io/video";
import { MinimalExtensionConstructor } from "../base";

const Format = {
  image: "image-data",
  canvas: "canvas"
} as const satisfies {
  image: (typeof Video)["FORMAT_IMAGE_DATA"],
  canvas: (typeof Video)["FORMAT_CANVAS"];
}

type VideoFrameTypeByFormat = {
  "image-data": ImageData,
  "canvas": HTMLCanvasElement
}

/**
 * Mixin the ability for extensions to interact with the user's web cam video feed
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionWithVideoSupport extends Ctor {
    private videoDevice: Video | null;

    private get video(): Video | null {
      this.videoDevice ??= this.runtime.ioDevices?.video;
      return this.videoDevice;
    };

    /**
     * Dimensions of the video frame
     */
    videoDimensions = { width: 480, height: 360 } as const;

    /**
     * Access the most recent frame captured by the web cam
     * @param {"image" | "canvas"} format 
     * @returns 
     */
    getVideoFrame<TFormat extends keyof typeof Format>(format: TFormat) {
      return this.video?.getFrame({
        format: Format[format]
      }) as VideoFrameTypeByFormat[typeof Format[typeof format]]
    }

    setVideoTransparency(transparency: number) {
      this.video?.setPreviewGhost(transparency);
    }

    /**
     * Turn the video feed on so that it's frames can be accessed and the feed
     * diplays within the game window.
     * @param {boolean} mirror defaults to `true`
     * @returns 
     */
    enableVideo(mirror: boolean = true) {
      if (!this.video) return;
      this.video.enableVideo();
      this.video.provider.mirror = mirror;
    }

    /**
     * Disable the video feed
     */
    disableVideo() {
      this.video?.disableVideo();
    }
  }

  return ExtensionWithVideoSupport;
}
