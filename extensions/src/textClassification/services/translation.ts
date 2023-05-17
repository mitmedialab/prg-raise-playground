import { fetchWithTimeout } from "$common";

const cachedTranslations = new Map<string, string>();
/**
 * The url of the translate server.
 * @type {string}
 */
const translationURL = new URL('https://translate-service.scratch.mit.edu/translate');

type SearchParams = {
    language: string,
    text: string
}

export const getTranslationURL = (params: SearchParams) => {
    for (const key in params) translationURL.searchParams.set(key, params[key]);
    return translationURL.href;
}

export const getTranslationToEnglish = async (words: string) => {
    if (cachedTranslations.has(words)) return cachedTranslations.get(words);
    const endpoint = getTranslationURL({ language: "en", text: encodeURIComponent(words) });
    try {
        const json: { result: string } = await (await fetchWithTimeout(endpoint, { timeout: 30 })).json();
        const translated = json.result;
        cachedTranslations.set(words, translated);
        return translated;
    }
    catch (error) {
        console.warn(`error fetching translate result! ${error}`);
        return '';
    }
}