import { untilExternalGlobalVariableLoaded } from "$common";
import { FilesetResolver as FilesetResolverClass, ObjectDetector as ObjectDetectorClass } from "@mediapipe/tasks-vision";

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
    createRects(detections, color: string, thickness: number) {
      context.save();
      context.clearRect(0, 0, width, height);
      context.fillStyle = color
      for (let detection of detections) {
        const x = detection.boundingBox.originX
        const y = detection.boundingBox.originY
        const width = detection.boundingBox.width
        const height = detection.boundingBox.height
        context.fillRect(x, y, width, height);
        context.clearRect(x + thickness, y + thickness, width - 2 * thickness, height - 2 * thickness);
        const text = detection.categories[0].categoryName + " - with " +
          Math.round(parseFloat(detection.categories[0].score) * 100) + "% confidence."
        context.fillText(text, x, y-5)
      }
      context.restore();
      return context.getImageData(0, 0, width, height);
    },
  }
}

// Initialize the object detector
export const initializeObjectDetector = async () => {

  const packageURL = "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.1.0-alpha-11"
  const packageClassName = "ObjectDetector"

  const { ObjectDetector, FilesetResolver } = await import(packageURL) as { ObjectDetector: typeof ObjectDetectorClass, FilesetResolver: typeof FilesetResolverClass };

  // const Class = await untilExternalGlobalVariableLoaded<typeof ObjectDetector>(packageURL, packageClassName);


  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm"
  );

  const detector = await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
    },
    scoreThreshold: 0.5,
    runningMode: 'IMAGE'
  });

  return detector;
}


