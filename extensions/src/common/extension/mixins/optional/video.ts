import type Video from "$scratch-vm/io/video";
import { MinimalExtensionConstructor } from "../required";

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
 * Mixin the ability for extensions to open up UI at-will
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

    getVideoFrame<TFormat extends keyof typeof Format>(format: TFormat) {
      return this.video?.getFrame({
        format: Format[format]
      }) as VideoFrameTypeByFormat[typeof Format[typeof format]]
    }

    setVideoTransparency(transparency: number) {
      this.video?.setPreviewGhost(transparency);
    }

    enableVideo() {
      this.video?.enableVideo();
    }

    disableVideo() {
      this.video?.disableVideo();
    }

    flipVideo(doFlip: boolean) {
      if (!this.video) return;
      (this.video as any).mirror = doFlip;
    }
  }

  return ExtensionWithVideoSupport;
}
