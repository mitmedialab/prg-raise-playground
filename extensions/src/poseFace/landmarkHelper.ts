import { ResultsListener, type FaceMesh } from '@mediapipe/face_mesh';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import { untilExternalGlobalVariableLoaded } from "$common";
import '@tensorflow/tfjs-backend-webgl';

export const getLandmarkModel = async (onFrame: ResultsListener) => {

    const packageURL = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh";
    const packageClassName = "FaceMesh";

    const Class = await untilExternalGlobalVariableLoaded<typeof FaceMesh>(packageURL, packageClassName);

    const faceMesh = new Class({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
    });

    // Initialize the mediaPipe model according to the documentation
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onFrame);
    await faceMesh.initialize();
    return faceMesh;
}