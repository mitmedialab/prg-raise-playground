// import { createCanvas, loadImage } from 'canvas';
// import { endpoint, port } from "./enums";

// export class LineDetector {
//   private lastDetectedLine: number[][] = [];
//   private isProcessing = false;
//   private canvas: any;
//   private ctx: any;

//   constructor(private raspberryPiIp: string, private width = 640, private height = 480) {
//     this.canvas = createCanvas(this.width, this.height);
//     this.ctx = this.canvas.getContext('2d');
//   }

//   async detectLine(): Promise<number[][]> {
//     if (this.isProcessing) return this.lastDetectedLine;
//     this.isProcessing = true;

//     try {
//       const image = await loadImage(`http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`);
//       this.ctx.drawImage(image, 0, 0, this.width, this.height);
//       const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
//       const lineCoordinates = this.processImageData(imageData);

//       if (lineCoordinates.length > 0) {
//         this.lastDetectedLine = lineCoordinates;
//       }

//       return this.lastDetectedLine;
//     } catch (error) {
//       console.error('Error detecting line:', error);
//       return this.lastDetectedLine;
//     } finally {
//       this.isProcessing = false;
//     }
//   }

//   private processImageData(imageData: ImageData): number[][] {
//     const lineCoordinates: number[][] = [];
//     const threshold = 50; 

//     for (let y = 0; y < this.height; y++) {
//       for (let x = 0; x < this.width; x++) {
//         const index = (y * this.width + x) * 4;
//         const r = imageData.data[index];
//         const g = imageData.data[index + 1];
//         const b = imageData.data[index + 2];
        
//         if (r < threshold && g < threshold && b < threshold) {
//           lineCoordinates.push([x, y]);
//         }
//       }
//     }
//     return lineCoordinates.sort((a, b) => a[1] - b[1]);
//   }
// }

// export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
//   const detector = new LineDetector(raspberryPiIp);
//   return () => detector.detectLine();
// }