import { createCanvas, loadImage } from 'canvas';
import { endpoint, port } from "./enums";

export class LineDetector {
  private lastDetectedLine: number[][] = [];
  private isProcessing = false;
  private canvas: any;
  private ctx: any;

  constructor(private raspberryPiIp: string, private width = 640, private height = 480) {
    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext('2d');
  }

  async detectLine(): Promise<number[][]> {
    if (this.isProcessing) return this.lastDetectedLine;
    this.isProcessing = true;

    try {
      const image = await loadImage(`http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`);
      this.ctx.drawImage(image, 0, 0, this.width, this.height);
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      const preprocessedImageData = this.preprocessImage(imageData);
      const lineCoordinates = this.processImageData(preprocessedImageData);
      const filteredCoordinates = this.filterContinuousLine(lineCoordinates);

      console.log("coordinates");
      console.log(filteredCoordinates);

      if (filteredCoordinates.length > 0) {
        this.lastDetectedLine = filteredCoordinates;
      }

      return this.lastDetectedLine;
    } catch (error) {
      console.error('Error detecting line:', error);
      return this.lastDetectedLine;
    } finally {
      this.isProcessing = false;
    }
  }

  private preprocessImage(imageData: ImageData): ImageData {
    const data = imageData.data;
    const threshold = this.calculateBlackThreshold(data);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const brightness = (r + g + b) / 3;
      
      if (brightness < threshold) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
    
    return imageData;
  }

  private calculateBlackThreshold(data: Uint8ClampedArray): number {
    let brightnessValues: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      brightnessValues.push(brightness);
    }
    brightnessValues.sort((a, b) => a - b);
    return brightnessValues[Math.floor(brightnessValues.length * 0.3)];
  }

  private processImageData(imageData: ImageData): number[][] {
    const lineCoordinates: number[][] = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (y * this.width + x) * 4;
        const r = imageData.data[index];
        
        if (r === 0) {
          lineCoordinates.push([x, y]);
        }   
      }
    }
    return lineCoordinates.sort((a, b) => a[1] - b[1]);
  }

  private filterContinuousLine(coordinates: number[][]): number[][] {
    if (coordinates.length < 2) return coordinates;

    const filteredCoordinates: number[][] = [coordinates[0]];
    const maxDistance = 20;

    for (let i = 1; i < coordinates.length; i++) {
      const [prevX, prevY] = filteredCoordinates[filteredCoordinates.length - 1];
      const [currentX, currentY] = coordinates[i];
      
      const distance = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
      
      if (distance <= maxDistance) {
        filteredCoordinates.push(coordinates[i]);
      }
    }

    return filteredCoordinates;
  }
}

export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
  const detector = new LineDetector(raspberryPiIp);
  return () => detector.detectLine();
}