import { encode, decode, isValidID } from "./extension-id-factory";

describe("extension-id-factory", () => {
  test("encode decode", () => {
    type TestCase = {query: string, containsInvalidCharacters: boolean};
    const testStrings: string[] = ["test_extension", "test-extension", "music", "7*)(#Wacky_^%"];
    const testCases: TestCase[] = testStrings.map(query => ({ query, containsInvalidCharacters: !isValidID(query) }));
    for (const {query, containsInvalidCharacters} of testCases) {
      const encoded = encode(query);
      const decoded = decode(encoded);
      expect(isValidID(encoded)).toBeTruthy();
      (containsInvalidCharacters) ? expect(encoded).not.toEqual(query) : expect(encoded).toEqual(query);
      expect(decoded).toEqual(query);
    }
  })
})