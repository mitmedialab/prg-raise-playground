const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */
export const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

export const regex = {
    versionSuffix: {
        global: /_v(\d+)/g,
        local: /_v(\d+)/
    },
    /* Allowed ID characters are those matching the regular expression [\w-]: A-Z, a-z, 0-9, and hyphen ("-") */
    forbiddenSymbols: /[^\w-]/g
}

export const merge = <Key1, Value1, Key2, Value2>(map1: Map<Key1, Value1>, map2: Map<Key2, Value2>) =>
    new Map<Key1 & Key2, Value1 & Value2>([...map1.entries(), ...map2.entries()] as any);