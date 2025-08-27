/**
 * Class adapted from: https://github.com/LLK/scratch-svg-renderer/blob/develop/src/bitmap-adapter.js
 */
export default class {
  private makeImage() { return new Image() }
  private makeCanvas() { return document.createElement('canvas') }

  /**
   * Return a canvas with the resized version of the given image, done using nearest-neighbor interpolation
   * @param {CanvasImageSource} image The image to resize
   * @param {int} newWidth The desired post-resize width of the image
   * @param {int} newHeight The desired post-resize height of the image
   * @returns {HTMLCanvasElement} A canvas with the resized image drawn on it.
   */
  resize(image, newWidth, newHeight) {
    // We want to always resize using nearest-neighbor interpolation. However, canvas implementations are free to
    // use linear interpolation (or other "smooth" interpolation methods) when downscaling:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1360415
    // It seems we can get around this by resizing in two steps: first width, then height. This will always result
    // in nearest-neighbor interpolation, even when downscaling.
    const stretchWidthCanvas = this.makeCanvas();
    stretchWidthCanvas.width = newWidth;
    stretchWidthCanvas.height = image.height;
    let context = stretchWidthCanvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, stretchWidthCanvas.width, stretchWidthCanvas.height);
    const stretchHeightCanvas = this.makeCanvas();
    stretchHeightCanvas.width = newWidth;
    stretchHeightCanvas.height = newHeight;
    context = stretchHeightCanvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.drawImage(stretchWidthCanvas, 0, 0, stretchHeightCanvas.width, stretchHeightCanvas.height);
    return stretchHeightCanvas;
  }

  /**
   * Scratch 2.0 had resolution 1 and 2 bitmaps. All bitmaps in Scratch 3.0 are equivalent
   * to resolution 2 bitmaps. Therefore, converting a resolution 1 bitmap means doubling
   * it in width and height.
   * @param {!string} dataURI Base 64 encoded image data of the bitmap
   * @param {!function} callback Node-style callback that returns updated dataURI if conversion succeeded
   */
  convertResolution1Bitmap(dataURI, callback) {
    const image = new Image();
    image.src = dataURI;
    image.onload = () => {
      callback(null, this.resize(image, image.width * 2, image.height * 2).toDataURL());
    };
    image.onerror = () => {
      callback('Image load failed');
    };
  }

  /**
   * Given width/height of an uploaded item, return width/height the image will be resized
   * to in Scratch 3.0
   * @param {!number} oldWidth original width
   * @param {!number} oldHeight original height
   * @return {object} Array of new width, new height
   */
  getResizedWidthHeight(oldWidth, oldHeight) {
    const STAGE_WIDTH = 480;
    const STAGE_HEIGHT = 360;
    const STAGE_RATIO = STAGE_WIDTH / STAGE_HEIGHT;

    // If both dimensions are smaller than or equal to corresponding stage dimension,
    // double both dimensions
    if ((oldWidth <= STAGE_WIDTH) && (oldHeight <= STAGE_HEIGHT)) {
      return { width: oldWidth * 2, height: oldHeight * 2 };
    }

    // If neither dimension is larger than 2x corresponding stage dimension,
    // this is an in-between image, return it as is
    if ((oldWidth <= STAGE_WIDTH * 2) && (oldHeight <= STAGE_HEIGHT * 2)) {
      return { width: oldWidth, height: oldHeight };
    }

    const imageRatio = oldWidth / oldHeight;
    // Otherwise, figure out how to resize
    if (imageRatio >= STAGE_RATIO) {
      // Wide Image
      return { width: STAGE_WIDTH * 2, height: STAGE_WIDTH * 2 / imageRatio };
    }
    // In this case we have either:
    // - A wide image, but not with as big a ratio between width and height,
    // making it so that fitting the width to double stage size would leave
    // the height too big to fit in double the stage height
    // - A square image that's still larger than the double at least
    // one of the stage dimensions, so pick the smaller of the two dimensions (to fit)
    // - A tall image
    // In any of these cases, resize the image to fit the height to double the stage height
    return { width: STAGE_HEIGHT * 2 * imageRatio, height: STAGE_HEIGHT * 2 };
  }

  /**
   * Given bitmap data, resize as necessary.
   * @param {string} fileData Base 64 encoded image data of the bitmap
   * @param {string} fileType The MIME type of this file
   * @returns {Promise} Resolves to resized image data Uint8Array
   */
  importBitmap(dataURI: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const image = this.makeImage();
      image.src = dataURI;
      image.onload = () => {
        const newSize = this.getResizedWidthHeight(image.width, image.height);
        if (newSize.width === image.width && newSize.height === image.height) {
          // No change
          resolve(this.convertDataURIToBinary(dataURI));
        } else {
          const resizedDataURI = this.resize(image, newSize.width, newSize.height).toDataURL();
          resolve(this.convertDataURIToBinary(resizedDataURI));
        }
      };
      image.onerror = () => {
        reject('Image load failed');
      };
    });
  }

  // TODO consolidate with scratch-vm/src/util/base64-util.js
  // From https://gist.github.com/borismus/1032746
  convertDataURIToBinary(dataURI) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}