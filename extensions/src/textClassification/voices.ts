import formatMessage from "format-message";
import { info } from "./legacy";

export type Voice = (typeof info.menus.voices.items)[number]["value"];

const getVoiceName = (voice: Voice, detail: string) => formatMessage({
    id: `text2speech.${voice.toLocaleLowerCase()}`,
    default: voice.toLocaleLowerCase(),
    description: `Name for a funny voice with ${detail}.`
});

export type VoiceInfo = { name: string, gender: 'male' | 'female', playbackRate: number };

const semitonesToRate = (semitoneOffset: number) => Math.pow(2, semitoneOffset / 12);

export default {
    "SQUEAK": {
        name: getVoiceName("SQUEAK", "a high pitch"),
        gender: 'female',
        playbackRate: semitonesToRate(3)
    },
    "TENOR": {
        name: getVoiceName("TENOR", 'ambiguous gender'),
        gender: 'male',
        playbackRate: 1
    },
    "ALTO": {
        name: getVoiceName("ALTO", 'ambiguous gender'),
        gender: 'female',
        playbackRate: 1
    },
    "GIANT": {
        name: getVoiceName("GIANT", 'a low pitch.'),
        gender: 'male',
        playbackRate: semitonesToRate(-3)
    }
} satisfies Record<Voice, VoiceInfo>;