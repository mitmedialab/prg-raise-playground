export const matchAnyLowerCase = "a-z" as const;
export const matchAnyUpperCase = "A-Z" as const;
export const matchAnyNumber = "0-9" as const;
export const matchAnyLetterOrNumber = matchAnyLowerCase + matchAnyUpperCase + matchAnyNumber;
export const matchOneOrMoreTimes = "+";
export const createMatchSelection = (query) => `[${query}]`;
export const createMatchGroup = (query) => `(${query})`;