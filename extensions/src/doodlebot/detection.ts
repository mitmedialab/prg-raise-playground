import type { ReverseMap } from "$common";
import {
    ObjectDetector,
    FilesetResolver,
    GestureRecognizer,
    Detection,
    ObjectDetectorResult
} from "@mediapipe/tasks-vision";

let objectDetector: ObjectDetector | null = null;

const createObjectDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    return ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
            delegate: "GPU" // TODO: is this the best setting?
        },
        scoreThreshold: 0.5,
        runningMode: "IMAGE"
    });
};

export const objectDetection = async (image: HTMLImageElement) => {
    objectDetector ??= await createObjectDetector();
    return objectDetector.detect(image);
}

let gestureRecognizer: GestureRecognizer | null = null;

export const gestures = {
    thumbsUp: "Thumb_Up",
    thumbsDown: "Thumb_Down",
    peace: "Victory",
    up: "Pointing_Up",
    fist: "Closed_Fist",
    love: "ILoveYou",
    open: "Open_Palm",
} as const;

export const categoryByGesture = Object.entries(gestures).reduce(
    (acc, [key, value]) => ({ ...acc, [value]: key }),
    {} as ReverseMap<typeof gestures>
);

export const emojiByGesture = {
    "👍": "Thumb_Up",
    "👎": "Thumb_Down",
    "✌️": "Victory",
    "☝️": "Pointing_Up",
    "✊": "Closed_Fist",
    "👋": "Open_Palm",
    "🤟": "ILoveYou",
} as const satisfies Record<string, keyof typeof categoryByGesture>;

export const gestureMenuItems = Object.entries(emojiByGesture).map(([text, value]) => ({ text, value })) as Array<{ text: keyof typeof emojiByGesture, value: keyof typeof categoryByGesture }>;

const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    return GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: "IMAGE"
    });
};

export const gestureDetection = async (image: HTMLImageElement) => {
    gestureRecognizer ??= await createGestureRecognizer();
    return gestureRecognizer.recognize(image);
}