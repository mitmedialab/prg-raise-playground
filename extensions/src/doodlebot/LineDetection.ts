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

    // Parameters for line detection
    const threshold = 70;  // Threshold for dark pixels
    const minBlueness = 150;  // Minimum blue value for blue line detection
    const colorDiffThreshold = 50;  // Minimum difference between blue and other channels
    
    // Store points by row for better line tracking
    const pointsByRow: Map<number, number[]> = new Map();
    
    // First pass: collect potential line points
    for (let y = 0; y < maxY; y++) {
      const rowPoints: number[] = [];
      
      for (let x = 0; x < this.width; x++) {
        const index = (y * this.width + x) * 4; // RGBA format
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        // For black line detection
        const isBlack = r < threshold && g < threshold && b < threshold;
        
        // For blue line detection
        const isBlueDominant = b > minBlueness && 
                              b > (r + colorDiffThreshold) && 
                              b > (g + colorDiffThreshold);

        if (isBlack || isBlueDominant) {
          rowPoints.push(x);
        }
      }

      if (rowPoints.length > 0) {
        // Calculate median x-coordinate for this row to reduce noise
        rowPoints.sort((a, b) => a - b);
        const medianX = rowPoints[Math.floor(rowPoints.length / 2)];
        pointsByRow.set(y, [medianX]);
      }
    }

    // Second pass: Apply continuity constraints
    let lastValidY = -1;
    let lastValidX = -1;
    const maxJump = 30; // Maximum allowed pixel jump between consecutive points

    for (let y = 0; y < maxY; y++) {
      const points = pointsByRow.get(y);
      if (!points) continue;

      const x = points[0];

      // Check if this point is a reasonable continuation of the line
      if (lastValidY !== -1) {
        const yGap = y - lastValidY;
        const xGap = Math.abs(x - lastValidX);

        // If point is too far from previous point, skip it
        if (yGap > 2 || xGap > maxJump) {
          continue;
        }
      }

      // Add point to final line coordinates
      lineCoordinates.push([x, y]);
      lastValidY = y;
      lastValidX = x;
    }

    // Sort coordinates by y-value (top to bottom)
    const sortedCoordinates = lineCoordinates.sort((a, b) => a[1] - b[1]);
    
    // Apply smoothing to reduce jagged edges
    const smoothedCoordinates = this.smoothLine(sortedCoordinates);
    
    return smoothedCoordinates;
  }

  private smoothLine(coordinates: number[][]): number[][] {
    if (coordinates.length < 3) return coordinates;

    const smoothed: number[][] = [];
    const windowSize = 3;

    // Keep first point
    smoothed.push([...coordinates[0]]);

    // Smooth middle points
    for (let i = 1; i < coordinates.length - 1; i++) {
      const window = coordinates.slice(
        Math.max(0, i - Math.floor(windowSize/2)),
        Math.min(coordinates.length, i + Math.floor(windowSize/2) + 1)
      );

      const avgX = window.reduce((sum, point) => sum + point[0], 0) / window.length;
      smoothed.push([Math.round(avgX), coordinates[i][1]]);
    }

    // Keep last point
    if (coordinates.length > 1) {
      smoothed.push([...coordinates[coordinates.length - 1]]);
    }

    return smoothed;
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