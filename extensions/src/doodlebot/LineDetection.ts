import { endpoint, port } from "./enums";
import cv from '@u4/opencv4nodejs';
import axios from 'axios';

export class LineDetector {
  private lastDetectedLine: number[][] = [];
  private isProcessing = false;

  constructor(private raspberryPiIp: string, private width = 640, private height = 480) {}

  async detectLine(): Promise<number[][]> {
    if (this.isProcessing) return this.lastDetectedLine;
    this.isProcessing = true;

    try {
      // Get image from endpoint
      const response = await axios.get(
        `http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`,
        { responseType: 'arraybuffer' }
      );

      // Convert response to cv Mat
      const buffer = Buffer.from(response.data);
      let mat = cv.imdecode(buffer);
      
      // Resize if needed
      if (mat.cols !== this.width || mat.rows !== this.height) {
        mat = mat.resize(this.height, this.width);
      }

      // Convert to grayscale and apply threshold
      const gray = mat.cvtColor(cv.COLOR_BGR2GRAY);
      const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);
      const thresh = blurred.threshold(0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

      // Find contours
      const contours = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      
      // Get the largest contour (assuming it's the line)
      const sortedContours = contours.sort((c1, c2) => c2.area - c1.area);
      
      if (sortedContours.length > 0) {
        // Convert contour points to coordinate array
        const coordinates = sortedContours[0].getPoints().map(point => [point.x, point.y]);
        this.lastDetectedLine = coordinates;
      }

      return this.lastDetectedLine;
    } catch (error) {
      console.error('Error detecting line:', error);
      return this.lastDetectedLine;
    } finally {
      this.isProcessing = false;
    }
  }
}

export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
  const detector = new LineDetector(raspberryPiIp);
  return () => detector.detectLine();
}