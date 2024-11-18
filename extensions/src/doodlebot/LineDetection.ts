import { endpoint, port } from "./enums";
import axios from 'axios';

export class LineDetector {
  private raspberryPiIp: string;
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastDetectedLine: number[][];
  private frameCount: number;
  private allCoordinates: number[][][];
  private threshold: number = 70;
  private collectLine: boolean = false;

  constructor(raspberryPiIp: string, width = 640, height = 480) {
    this.raspberryPiIp = raspberryPiIp;
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.lastDetectedLine = [];
    this.frameCount = 0;
    this.allCoordinates = [];
  }

  private processImageData(imageData: ImageData): number[][] {
    const lineCoordinates: number[][] = [];
    const maxY = Math.min(this.height, 400);
    
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (y * this.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];

        if (r < this.threshold && g < this.threshold && b < this.threshold) {
          lineCoordinates.push([x, y]);
        }
      }
    }
    
    return lineCoordinates.sort((a, b) => a[1] - b[1]);
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async detectLine(): Promise<number[][]> {
    try {
      const image = await this.loadImage(`http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`);
      this.ctx.drawImage(image, 0, 0, this.width, this.height);
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      const lineCoordinates = this.processImageData(imageData);
      
      if (lineCoordinates.length > 0) {
        this.lastDetectedLine = lineCoordinates;
      }

      if (this.collectLine) {
        this.allCoordinates.push(lineCoordinates);
        this.frameCount++;
        this.collectLine = false;
      }

      return lineCoordinates;
    } catch (error) {
      console.error('Error detecting line:', error);
      return [];
    }
  }

  // ... keep existing helper methods like loadImage, smoothLine, etc ...
}

export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
  console.log("Creating new LineDetector instance");
  const detector = new LineDetector(raspberryPiIp);
  return () => detector.detectLine();
}