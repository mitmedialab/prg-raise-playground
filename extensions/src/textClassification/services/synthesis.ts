import { VoiceInfo } from "../voices";

/**
 * The url of the synthesis server.
 * @type {string}
 */
const synthesisURL = new URL('https://synthesis-service.scratch.mit.edu/synth');

type SearchParams = {
    locale: string,
    gender: VoiceInfo["gender"],
    text: string
}

export const getSynthesisURL = (params: SearchParams) => {
    for (const key in params) synthesisURL.searchParams.set(key, params[key]);
    return synthesisURL.href;
}