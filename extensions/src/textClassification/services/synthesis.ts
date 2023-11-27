import { VoiceInfo } from "../voices";

type SearchParams = {
    locale: string,
    gender: VoiceInfo["gender"],
    text: string
}

export const getSynthesisURL = ({ locale, gender, text }: SearchParams) =>
    `https://synthesis-service.scratch.mit.edu/synth?locale=${locale}&gender=${gender}&text=${text}`