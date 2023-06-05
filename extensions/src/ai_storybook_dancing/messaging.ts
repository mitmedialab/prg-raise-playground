import { isString } from "$common";

const identifier = "ai-storybook-dancing";

export const announce = (content: "ready") => window.top.postMessage({ identifier, source: "blocks", content }, '*');

export type DanceMove =  "hop" | "swivel left" | "swivel right" | "spin left" | "spin right";
export const requestDanceMove = (move: DanceMove) =>
    window.top.postMessage({ identifier, destination: "unity", input: move, method: "Dance" }, '*')

export const untilMessageReceived = (message: string) => new Promise<void>(resolve => {
    const handler = ({ data }: MessageEvent) => {
        console.log(`[RAISE Playground ('${message}') listener]\n${JSON.stringify(data, Object.keys(data).sort(), 3)}`)
        if (isString(data)) return;
        const { identifier: id, destination, content } = data;
        if (id !== identifier || destination !== "blocks" || content !== message) return;
        removeEventListener("message", handler);
        resolve();
    };
    addEventListener("message", handler);
});