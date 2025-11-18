/**
 * 
 * @param input 
 * @example splitArgsString("hello ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello,ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello, ahoy"); // Output: ["hello", "ahoy"]
 * @example splitArgsString("hello"); // Output: ["hello"]
 * @example splitArgsString(""); // Output: []
 * @returns 
 */
export const splitArgsString = (input: string): string[] => {
    if (!input) return [];
    // Regular expression to split the string by either comma followed by optional space characters or by space characters alone
    const regex = /,\s*|\s+/;
    const words = input.split(regex);
    return words;
}


export const base64ToInt32Array = async (base64) => {
    const response = await fetch(`data:application/octet-stream;base64,${base64}`);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Int32Array(arrayBuffer);
}

export const makeWebsocket = (ip: string, path: string) => new WebSocket(`wss://${ip}${path}`);

export const testWebSocket = (ip: string, port: string | number, timeoutSeconds?: number) => {
    const websocket = makeWebsocket(ip, String(port));
    return new Promise<boolean>((resolve) => {
        websocket.onopen = () => websocket.close();
        websocket.onclose = (event) => resolve(event.wasClean);
        if (timeoutSeconds) setTimeout(() => resolve(false), timeoutSeconds * 1000);
    });
}

export const Max32Int = 2147483647;


export const deferred = <T>() => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve: resolve!, reject: reject! };
};

export const convertSvgUint8ArrayToPng = async (uint8Array: Uint8Array, width: number, height: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Convert Uint8Array to a string
      const svgString = new TextDecoder().decode(uint8Array);

      // Create an SVG Blob
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create an Image element
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to PNG data URL
        const pngDataUrl = canvas.toDataURL('image/png');

        // Convert the data URL to a Blob
        fetch(pngDataUrl)
          .then(res => res.blob())
          .then(blob => {
            // Clean up
            URL.revokeObjectURL(url);
            resolve(blob);
          })
          .catch(err => {
            URL.revokeObjectURL(url);
            reject(err);
          });
      };

      img.onerror = reject;
      img.src = url;
    });
  }

export type Deferred<T> = ReturnType<typeof deferred<T>>;