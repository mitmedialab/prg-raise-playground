const validRegEx = new RegExp('^[a-z0-9]+$', 'i');
const invalidRegEx = new RegExp('[^a-z0-9]+', 'gi');

export const isValidID = (id) => validRegEx.test(id);

const guard = 'prg';
const guards = [guard, guard.split("").reverse().join("")];

const guardsRegEx = new RegExp(`${guards[0]}([0-9]+)${guards[1]}`, 'g');

const wrap = (str) => `${guards[0]}${str}${guards[1]}`;

const replaceAll = (query, current, desired) => query.replaceAll(current, desired);

export const encode = (query: string): string => {
  const matches = [...query.matchAll(invalidRegEx)];
  const invalidCharacters = matches.reduce((set, current) => {
    current[0].split("").forEach(char => set.add(char));
    return set;
  }, new Set<string>());
  const replacements = [...invalidCharacters].map(char => ({ char, code: char.charCodeAt(0) }));
  return replacements.reduce((modified, { char, code }) => replaceAll(modified, char, wrap(code)), `${query}`);
}

export const decode = (query: string): string => {
  const matches = [...query.matchAll(guardsRegEx)];
  const replacements = matches.reduce((replacements, match) => {
    const [key, code] = match;
    return replacements.set(key, String.fromCharCode(code as any as number));
  }, new Map());
  return [...replacements].reduce((modified, [current, desired]) => replaceAll(modified, current, desired), `${query}`);
}