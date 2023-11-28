const randomIndex = <T>(array: T[]) => Math.floor(Math.random() * array.length);

export const getItemOfArray = (item: "first" | "last" | "random" | "all" | `${number}` | number, array: (string | number)[]) => {
    if (item === 'first') return array[0];
    else if (item === 'last') return array[array.length - 1];
    else if (item === 'all') return array.join(' ');
    else if (item === 'random') return array[randomIndex(array)];

    let index = typeof item === "number" ? item : Number.parseInt(item);
    return index && index > 0 && index <= array.length ? array[index - 1] : "";
}

export const splitText = (text: string) => text
    .replace(/[^\w\s\'\-]|_/g, "") // don't erase apostrophes and dashes
    .replace(/\s+/g, " ") // remove extra spaces
    .split(/[\s']+/); // split on spaces and apostrophes

export const findMatchesLowercase = (input: string, candidates: string[]) => {
    const targetWords = candidates.map(word => word.toLowerCase());
    return splitText(input)
        .map(word => word.toLowerCase())
        .filter(lowered => targetWords.includes(lowered));
}