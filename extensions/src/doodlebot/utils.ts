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


export const base64ToFloat32Array = async (base64) => {
    const response = await fetch(`data:application/octet-stream;base64,${base64}`);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Float32Array(arrayBuffer);
}

export const makeWebsocket = (ip: string, port: string | number) => new WebSocket(`ws://${ip}:${port}`);