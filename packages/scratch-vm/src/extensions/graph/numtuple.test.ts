import { NumTupSet } from './numtuple';

describe("Testing the NumTupSet class", () => {
  test("Test add", () => {
    let S : Set<string> = new Set();
    const add = NumTupSet.add(S);
    add([1,2]);
    add([   1,   2 ]);
    expect(S.size).toBe(1); //should only have added one
  })

  test("Test fromStr", () => {
    const X = NumTupSet.fromStr('[1,2]');
    expect(X[0] === 1 && X[1] === 2).toBe(true);

  })

  test("Test has", () => {
    let S : Set<string> = new Set();
    const add = NumTupSet.add(S);
    const has = NumTupSet.has(S);
    add([1,2]);
    expect(has([1,2])).toBe(true);
  })

  test("Test delete", () => {
    let S : Set<string> = new Set();
    const add = NumTupSet.add(S);
    const has = NumTupSet.has(S);
    add([1,2]);
    expect(has([1,2])).toBe(true);
    expect(NumTupSet.delete_(S)([1,2])).toBe(true);
    expect(has([1,2])).toBe(false);
  })

  test("Test values", () => {
    let S : Set<string> = new Set();
    const add = NumTupSet.add(S);
    add([1,2]);
    add([2,3]);
    const S2 = NumTupSet.values(S);
    let i = 0;
    S2.forEach((a) => {
      let [l,r] = [a[0],a[1]];
      if (i === 0) {
        expect(l).toBe(1);
        expect(r).toBe(2);
      } else {
        expect(l).toBe(2);
        expect(r).toBe(3);
      }
      i++;
    })
  })

  test("Test for each on empty", () => {
    let S: Set<string> = new Set();
    const forEach = NumTupSet.forEach(S);
    const f = (([x,y]) => { expect(true).toBe(false) });
    forEach(f);
  })

  test("Test for each on non-empty set", () => {
    let S: Set<string> = new Set();
    const add = NumTupSet.add(S);
    add([1,2]);
    add([2,4]);
    add([3,6]);
    let res = [];
    const forEach = NumTupSet.forEach(S);
    const f = (([x,y]) => { res.push(x) });
    forEach(f);
    expect(res[0] === 1 && res[1] === 2 && res[2] === 3).toBe(true);
  })
})