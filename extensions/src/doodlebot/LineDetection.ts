import { endpoint, port } from "./enums";
import Doodlebot from "./Doodlebot";

const debug = {
  info: (msg: string, ...args: any[]) => console.log(`[LineDetector] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[LineDetector] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[LineDetector] ${msg}`, ...args),
  time: (label: string) => console.time(`[LineDetector] ${label}`),
  timeEnd: (label: string) => console.timeEnd(`[LineDetector] ${label}`)
};

export class LineDetector {
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastDetectedLine: number[][];
  private frameCount: number;
  private allCoordinates: number[][][];
  private threshold: number = 70;
  private collectLine: boolean = false;
  private isProcessing: boolean = false;
  private lastProcessTime: number = 0;
  private readonly MIN_PROCESS_INTERVAL = 100;
  private imageStream: HTMLImageElement | null = null;

  constructor(private raspberryPiIp: string, width = 640, height = 480) {
    debug.info('Initializing LineDetector', { raspberryPiIp, width, height });
    
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      debug.error('Failed to get canvas context');
      throw new Error('Failed to get canvas context');
    }
    
    this.ctx = ctx;
    this.lastDetectedLine = [];
    this.frameCount = 0;
    this.allCoordinates = [];
    
    debug.info('LineDetector initialized successfully');
  }

  async initialize(doodlebot: Doodlebot): Promise<void> {
    debug.info('Initializing image stream');
    try {
      this.imageStream = await doodlebot.getImageStream();
      if (!this.imageStream) {
        throw new Error('Failed to get image stream from Doodlebot');
      }
      debug.info('Successfully initialized image stream');
    } catch (error) {
      debug.error('Error initializing image stream:', error);
      throw error;
    }
  }

  private processImageData(imageData: ImageData): number[][] {
    debug.time('processImageData');
    
    const lineCoordinates: number[][] = [];
    const maxY = Math.min(this.height, 400);
    const data = imageData.data;
    const width = this.width;
    
    for (let y = 0; y < maxY; y += 2) {
      const rowOffset = y * width * 4;
      for (let x = 0; x < width; x += 2) {
        const index = rowOffset + (x * 4);
        if (data[index] < this.threshold && 
            data[index + 1] < this.threshold && 
            data[index + 2] < this.threshold) {
          lineCoordinates.push([x, y]);
        }
      }
    }
    
    debug.info(`Found ${lineCoordinates.length} line points`);
    debug.timeEnd('processImageData');
    
    return lineCoordinates.length > 0 
      ? lineCoordinates.sort((a, b) => a[1] - b[1])
      : [];
  }

  async detectLine(doodlebot: Doodlebot, retries: number = 3): Promise<number[][]> {
    const now = Date.now();
    
    if (this.isProcessing) {
      debug.warn('Detection already in progress, returning last result');
      return this.lastDetectedLine;
    }
    
    if ((now - this.lastProcessTime) < this.MIN_PROCESS_INTERVAL) {
      debug.warn('Called too soon after last detection, returning last result');
      return this.lastDetectedLine;
    }

    if (!this.imageStream) {
      debug.warn('Image stream not initialized, initializing now');
      await this.initialize(doodlebot);
    }

    debug.time('detectLine');
    this.isProcessing = true;
    let attempt = 0;

    try {
      while (attempt < retries) {
        try {
          debug.info(`Detection attempt ${attempt + 1}/${retries}`);
          
          debug.info('Clearing canvas and drawing new image');
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.ctx.drawImage(this.imageStream!, 0, 0, this.width, this.height);
          
          debug.info('Getting image data from canvas');
          const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
          
          debug.info('Processing image data');
          const lineCoordinates = this.processImageData(imageData);

          if (lineCoordinates.length > 0) {
            debug.info('Line detected successfully', {
              points: lineCoordinates.length,
              firstPoint: lineCoordinates[0],
              lastPoint: lineCoordinates[lineCoordinates.length - 1]
            });
            
            this.lastDetectedLine = lineCoordinates;
            
            if (this.collectLine) {
              this.allCoordinates.push(lineCoordinates);
              this.frameCount++;
              this.collectLine = false;
              debug.info('Line collected, frame count:', this.frameCount);
            }
            
            this.lastProcessTime = now;
            this.isProcessing = false;
            debug.timeEnd('detectLine');
            return lineCoordinates;
          }

          debug.warn('No line detected in this attempt');
          attempt++;
          const backoffTime = 100 * Math.pow(2, attempt);
          debug.info(`Waiting ${backoffTime}ms before next attempt`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          
        } catch (error) {
          debug.error(`Processing attempt ${attempt + 1} failed:`, error);
          attempt++;
          
          if (attempt === retries) {
            debug.warn('Max retries reached, returning last known good result');
            this.isProcessing = false;
            debug.timeEnd('detectLine');
            return this.lastDetectedLine;
          }
          
          const backoffTime = 100 * Math.pow(2, attempt);
          debug.info(`Waiting ${backoffTime}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    } catch (error) {
      debug.error('Error getting image stream:', error);
      this.isProcessing = false;
      debug.timeEnd('detectLine');
      return this.lastDetectedLine;
    }

    this.isProcessing = false;
    debug.timeEnd('detectLine');
    return this.lastDetectedLine;
  }

  setThreshold(value: number) {
    const oldThreshold = this.threshold;
    this.threshold = Math.max(0, Math.min(255, value));
    debug.info('Threshold updated:', { old: oldThreshold, new: this.threshold });
  }

  getLastDetectedLine(): number[][] {
    debug.info('Returning last detected line', { 
      points: this.lastDetectedLine.length 
    });
    return this.lastDetectedLine;
  }

  startCollecting() {
    debug.info('Starting line collection');
    this.collectLine = true;
  }

  stopCollecting() {
    debug.info('Stopping line collection');
    this.collectLine = false;
  }

  clearHistory() {
    debug.info('Clearing detection history');
    this.allCoordinates = [];
    this.frameCount = 0;
  }
}

export async function createLineDetector(raspberryPiIp: string): Promise<(doodlebot: Doodlebot) => Promise<number[][]>> {
  debug.info('Creating new LineDetector instance');
  const detector = new LineDetector(raspberryPiIp);
  return (doodlebot: Doodlebot) => detector.detectLine(doodlebot);
}