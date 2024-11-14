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
  ) {
    console.log(`LineDetector initialized with IP: ${raspberryPiIp}`);
    console.log(`Parameters: width=${width}, height=${height}, threshold=${threshold}`);
  }

  async detectLine(): Promise<number[][]> {
    if (this.isProcessing) {
      console.log("Already processing, returning last detected line");
      return this.lastDetectedLine;
    }
    
    console.log("Starting line detection...");
    this.isProcessing = true;

    try {
      const url = `http://${this.raspberryPiIp}:${port.camera}/${endpoint.video}`;
      console.log(`Fetching DEBUG image from: ${url}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        console.log("Fetch request timed out");
      }, 5000);

      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'multipart/x-mixed-replace; boundary=frame'
          },
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Response received, getting reader...");
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        console.log("Reading stream...");
        const { value, done } = await reader.read();
        
        if (done || !value) {
          throw new Error('Stream ended unexpectedly');
        }

        console.log(`Received chunk of size: ${value.length}`);
        // Debug the first few bytes to see what we're getting
        console.log("First 20 bytes:", Array.from(value.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '));

        // Look for the multipart boundary
        const data = new TextDecoder().decode(value);
        console.log("First 100 chars of data:", data.substring(0, 100));

        // Try to find the content-type header
        const contentTypeMatch = data.match(/Content-Type: ([^\r\n]+)/i);
        if (contentTypeMatch) {
          console.log("Content-Type found:", contentTypeMatch[1]);
        }

        // Try to find the actual image data after headers
        const headerEndIndex = data.indexOf('\r\n\r\n');
        if (headerEndIndex !== -1) {
          console.log("Headers found, image data starts at:", headerEndIndex + 4);
          const blobData = value.slice(headerEndIndex + 4);
          
          // Create blob from image data
          const blob = new Blob([blobData], { type: 'image/jpeg' });
          console.log("Created blob of size:", blob.size);

          // Convert to image
          const img = new Image();
          const imageUrl = URL.createObjectURL(blob);
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = (e) => {
              console.error("Image load error:", e);
              reject(e);
            };
            img.src = imageUrl;
          });

          // Clean up the stream
          reader.cancel();
          
          console.log("Image loaded, dimensions:", img.width, "x", img.height);

          // Create canvas to get pixel data
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Get pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Got image data, processing pixels...");
          
          // Process the image data
          const lineCoordinates = this.processImageData(imageData.data);

          // Clean up
          URL.revokeObjectURL(imageUrl);

          if (lineCoordinates.length > 0) {
            this.lastDetectedLine = lineCoordinates;
          }

          return this.lastDetectedLine;
        } else {
          console.error("Could not find end of headers in response");
          return this.lastDetectedLine;
        }

      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        if (fetchError.name === 'AbortError') {
          console.log("Request was aborted due to timeout");
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error detecting line:', error);
      return this.lastDetectedLine;
    } finally {
      this.isProcessing = false;
      console.log("Line detection process completed");
    }
  }

  private processImageData(pixels: Uint8ClampedArray): number[][] {
    const lineCoordinates: number[][] = [];
    const maxY = Math.min(this.height, 400);
    
    console.log(`Processing image data: ${this.width}x${maxY}`);
    console.log(`Pixel array length: ${pixels.length}, Expected length: ${this.width * this.height * 3}`);

    // Add sample pixel values logging
    const samplePixels: {[key: string]: number[]} = {};
    
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < this.width; x++) {
        const index = (y * this.width + x) * 3; // RGB format
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        // Log a few sample pixels
        if (y % 100 === 0 && x % 100 === 0) {
          samplePixels[`${x},${y}`] = [r, g, b];
        }

        // Check if pixel is dark (below threshold)
        if (r < this.threshold && g < this.threshold && b < this.threshold) {
          lineCoordinates.push([x, y]);
        }
      }
    }

    console.log("Sample pixel values:", samplePixels);
    console.log(`Found ${lineCoordinates.length} dark pixels`);

    // Sort coordinates by y-value (top to bottom)
    const sortedCoordinates = lineCoordinates.sort((a, b) => a[1] - b[1]);
    console.log("First few coordinates:", sortedCoordinates.slice(0, 5));
    
    return sortedCoordinates;
  }

  private logCoordinates(): void {
    console.log('=== Collected coordinates from 7 frames ===');
    this.allCoordinates.forEach((frame, index) => {
      console.log(`Frame ${index + 1}: ${frame.length} points`);
      if (frame.length > 0) {
        console.log('First 3 coordinates:', frame.slice(0, 3));
        console.log('Last 3 coordinates:', frame.slice(-3));
      }
    });
  }
}

export function createLineDetector(raspberryPiIp: string): () => Promise<number[][]> {
  console.log("Creating new LineDetector instance");
  const detector = new LineDetector(raspberryPiIp);
  return () => detector.detectLine();
}