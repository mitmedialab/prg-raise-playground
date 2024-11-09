import { endpoint, port } from "./enums";
import axios from 'axios';

export class LineDetector {
  private lastDetectedLine: number[][] = [];
  private isProcessing = false;
  private frameCount = 0;
  private allCoordinates: number[][][] = [];

  constructor(
    private raspberryPiIp: string, 
    private width = 640, 
    private height = 480,
    private threshold = 70  // Threshold for detecting dark pixels
  ) {}

  async detectLine(): Promise<number[][]> {
    if (this.isProcessing) return this.lastDetectedLine;
    this.isProcessing = true;

    try {
      // Get image from endpoint
      const response = await axios.get(
        `http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`,
        { responseType: 'arraybuffer' }
      );

      // Convert response to Uint8Array for pixel processing
      const buffer = Buffer.from(response.data);
      const pixels = new Uint8Array(buffer);
      
      // Process the image data to find dark pixels
      const lineCoordinates = this.processImageData(pixels);

      if (lineCoordinates.length > 0) {
        this.lastDetectedLine = lineCoordinates;
      }

      // Store coordinates for the first 7 frames (matching HTML version)
      if (this.frameCount < 7) {
        this.allCoordinates.push(lineCoordinates);
        this.frameCount++;
        if (this.frameCount === 7) {
          this.logCoordinates();
        }
      }

      return this.lastDetectedLine;
    } catch (error) {
      console.error('Error detecting line:', error);
      return this.lastDetectedLine;
    } finally {
      this.isProcessing = false;
    }
  }

  private processImageData(pixels: Uint8Array): number[][] {
    const lineCoordinates: number[][] = [];

    // Process only up to y < 400 (matching HTML version)
    for (let y = 0; y < Math.min(this.height, 400); y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (y * this.width + x) * 3; // RGB format
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        // Check if pixel is dark (below threshold)
        if (r < this.threshold && g < this.threshold && b < this.threshold) {
          lineCoordinates.push([x, y]);
        }
      }
    }

    // Sort coordinates by y-value (top to bottom)
    return lineCoordinates.sort((a, b) => a[1] - b[1]);
  }

  private logCoordinates(): void {
    // Log coordinates for debugging (similar to file writing in HTML version)
    console.log('Collected coordinates from 7 frames:');
    this.allCoordinates.forEach((frame, index) => {
      console.log(`Frame ${index + 1}:`);
      console.log(frame.map(coord => coord.join(',')).join('\n'));
    });
  }
}

export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
  const detector = new LineDetector(raspberryPiIp);
  return () => detector.detectLine();
}