import { getValueFromMenuItem } from "$common";
import { createTestSuite } from "$testing";
import Extension, { Animal } from ".";
import Simple from "$src/simple_example";

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    add: { input: [4, 8], expected: 12 },
    addAnimalToCollection: ({ expect }) => {
      let startingCount: number;
      const input = Animal.Tiger;
      return {
        input,
        before: ({ extension: { collection } }) => { startingCount = collection.length },
        after: ({ extension: { collection } }) => {
          expect(collection.length).toBe(startingCount + 1);
          const animal = collection[startingCount];
          const value = getValueFromMenuItem(animal);
          expect(value).toBe(input);
        }
      }
    },
    selectAngle: {
      input: 3,
      expected: 3,
      after({ result, testHelper: { expect } }) { expect(result).toBe(3) }
    }
  },
  integrationTests: {
    multipliesGiveSameResult: async ({ blockRunner: blockrunner, testHelper: { expect } }) => {
      const left = 4;
      const right = 5;
      const { output: outputFromSelf } = await blockrunner.invoke("multiplyUsingSelf", left, right);
      const { output: outputFromThis } = await blockrunner.invoke("multiplyUsingThis", left, right);
      expect(outputFromSelf).toBe(outputFromThis);
      expect(outputFromSelf).toBe(left * right);
    },
    logMultiplicationResult: async ({ blockRunner: blockrunner, testHelper: { expect } }) => {
      const simpleRunner = blockrunner.createCompanion(Simple);
      const left = 4;
      const right = 5;
      const { output } = await blockrunner.invoke("multiplyUsingSelf", left, right);
      const { log } = console;
      console.log = (message?: any) => expect(message).toBe(`${left * right}`);
      await simpleRunner.invoke("log", `${output}`);
      console.log = log;
    }
  }
})