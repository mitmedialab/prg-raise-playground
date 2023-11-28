import { Tag } from "en-pos";
import { wordsToNumbers } from "words-to-numbers";

const tagsByPartOfSpeech = {
    noun: ["NN", "PRP", "WP"],
    "proper noun": ["NNP"],
    verb: ["VB"],
    adverb: ["RB", "WRB"],
    adjective: ["JJ"],
    number: ["CD"],
} as const;

export type PartOfSpeech = keyof typeof tagsByPartOfSpeech;

type PartOfSpeechTag = typeof tagsByPartOfSpeech[PartOfSpeech][number];

export const partsOfSpeech = Object.keys(tagsByPartOfSpeech) as PartOfSpeech[];

const tagIsIncludedInPartOfSpeech = (tag: string, partOfSpeech: PartOfSpeech) =>
    (tagsByPartOfSpeech[partOfSpeech] as readonly string[]).includes(tag);

const convertNumberToNumeral = (text: string) => wordsToNumbers(text) ?? text;

export const getWordsMatchingPartOfSpeech = (words: string[], partOfSpeech: PartOfSpeech, convertNumeralsToNumbers = false) => {
    const { tags } = new Tag(words).initial().smooth() as { tags: PartOfSpeechTag[] };
    return tags
        .map((tag, index) => {
            if (!tagIsIncludedInPartOfSpeech(tag, partOfSpeech)) return null;
            const word = words[index];
            return convertNumeralsToNumbers && partOfSpeech === "number" ? convertNumberToNumeral(word) : word;
        })
        .filter(Boolean);
} 