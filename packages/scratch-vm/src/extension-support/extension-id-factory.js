const validRegEx = new RegExp('^[a-z0-9]+$', 'i');
const invalidRegEx = new RegExp('[^a-z0-9]+', 'gi');

/**
 * 
 * @param {string} id 
 * @returns {boolean}
 */
const isValidID = (id) => validRegEx.test(id);
exports.isValidID = isValidID;

const guard = 'prg';
const guards = [guard, guard.split("").reverse().join("")];

const guardsRegEx = new RegExp(`${guards[0]}([0-9]+)${guards[1]}`, 'g');

const wrap = (str) => `${guards[0]}${str}${guards[1]}`;

/**
 * 
 * @param {String} query 
 * @returns {String}
 */
const encode = (query) => {
  const matches = [...query.matchAll(invalidRegEx)];
  const invalidCharacters = matches.reduce((set, current) => {
    current[0].split("").forEach(char => set.add(char));
    return set;
  }, new Set());
  const replacements = [...invalidCharacters].map(char => ({ char, code: char.charCodeAt() }));
  return replacements.reduce((modified, {char, code}) => modified.replaceAll(char, wrap(code)), `${query}`);
}
exports.encode = encode;

/**
 * 
 * @param {String} query 
 * @returns {String}
 */
const decode = (query) => {
  const matches = [...query.matchAll(guardsRegEx)];
  const replacements = matches.reduce((replacements, match) => {
  	const [key, code] = match;
    return replacements.set(key, String.fromCharCode(code));
  }, new Map());
  return [...replacements].reduce((modified, [current, desired]) => modified.replaceAll(current, desired), `${query}`);
}
exports.decode = decode;