type numTup = [number,number];

/**
 * Set operations for {@link numTup} that treat different
 * {@link numTup} objects with the same values as equal.
 * Author: Dolev Artzi
 */
export class NumTupSet {

    static toStr = (tup:numTup) => { return `[${tup}]`};

    static fromStr = (str:string) : numTup => {
        const bracket_l = str.indexOf('[');
        const bracket_r = str.indexOf(']');
        const comma = str.indexOf(',');
        const l = parseFloat(str.slice(bracket_l+1,comma));
        const r = parseFloat(str.slice(comma+1,bracket_r));
        return [l,r];
    }


    static add = (S: Set<string>) => (tup: numTup) => {
        S.add(NumTupSet.toStr(tup));
    }

    static has = (S: Set<string>) => (tup: numTup) : boolean => {
        return S.has(NumTupSet.toStr(tup));
    }

    static delete_ = (S: Set<string>) => (tup: numTup) : boolean => {
        const str = NumTupSet.toStr(tup);
        return S.delete(str);
    }

    static values = (S: Set<string>) : Set<numTup> => {
        const strValues = S.values();
        const strArray = Array.from(strValues);
        let res : Set<numTup> = new Set();
        strArray.forEach(strTup => res.add(NumTupSet.fromStr(strTup)));
        return res;
    }

    static forEach = (S: Set<string>) => (f : ((tup:numTup) => any)) => {
        const vals = NumTupSet.values(S);
        vals.forEach(tup => f(tup));
    }
}
