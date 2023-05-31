import { isString } from "$common";

export const setUpMessagePassing = () => {
    window.onmessage = function (e) {
        // todo
    };
}

export const requestDanceMove = (move: "hop") =>
    window.top.postMessage({ destination: "unity", input: move, method: "Dance" }, '*')

export const untilMessageReceived = (message: string) => new Promise<void>(resolve => {
    const handler = ({ data }: MessageEvent) => {
        if (isString(data)) return;
        if (data.type !== "blocks") return;
        if (data.input !== message) return;
        removeEventListener("message", handler);
        resolve();
    };
    addEventListener("message", handler);
});