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

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
const wrap = (str) => `${guards[0]}${str}${guards[1]}`;

/**
 * (TODO: Use String.prototype.matchAll once possible)
 * @param {RegEx} regEx 
 * @param {string} str 
 * @returns {RegExpExecArray[]} 
 */
const matchAll = (regEx, str) => {
  const clone = new RegExp(regEx);
  const matches = [];
  let capture = [];
  while ((capture = clone.exec(str)) !== null) matches.push(capture);
  return matches; 
};

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
const escapeRegExp = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
 * (TODO: Use String.prototype.replaceAll once possible)
 * @param {string} query 
 * @param {string} current 
 * @param {string} desired 
 * @returns {string}
 */
const replaceAll = (query, current, desired) => query.replace(new RegExp(escapeRegExp(current), 'g'), desired);

/**
 * 
 * @param {String} query 
 * @returns {String}
 */
const encode = (query) => {
  const matches = [...matchAll(invalidRegEx, query)];
  const invalidCharacters = matches.reduce((set, current) => {
    current[0].split("").forEach(char => set.add(char));
    return set;
  }, new Set());
  const replacements = [...invalidCharacters].map(char => ({ char, code: char.charCodeAt() }));
  return replacements.reduce((modified, {char, code}) => replaceAll(modified, char, wrap(code)), `${query}`);
}
exports.encode = encode;

/**
 * 
 * @param {String} query 
 * @returns {String}
 */
const decode = (query) => {
  const matches = [...matchAll(guardsRegEx, query)];
  const replacements = matches.reduce((replacements, match) => {
  	const [key, code] = match;
    return replacements.set(key, String.fromCharCode(code));
  }, new Map());
  return [...replacements].reduce((modified, [current, desired]) => replaceAll(modified, current, desired), `${query}`);
}
exports.decode = decode;