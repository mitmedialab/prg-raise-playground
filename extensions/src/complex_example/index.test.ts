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
        before: (extension) => { startingCount = extension.collection.length },
        after: ({ collection }) => {
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
      after(_, result) { this.expect(result).toBe(3) }
    }
  },
  integrationTests: {
    multipliesGiveSameResult: async (runner, { expect }) => {
      const left = 4;
      const right = 5;
      const { output: outputFromSelf } = await runner.invoke("multiplyUsingSelf", left, right);
      const { output: outputFromThis } = await runner.invoke("multiplyUsingThis", left, right);
      expect(outputFromSelf).toBe(outputFromThis);
      expect(outputFromSelf).toBe(left * right);
    },
    logMultiplicationResult: async (runner, { expect }) => {
      const simpleRunner = runner.createCompanion(Simple);
      const left = 4;
      const right = 5;
      const { output } = await runner.invoke("multiplyUsingSelf", left, right);
      const { log } = console;
      console.log = (message?: any) => expect(message).toBe(`${left * right}`);
      await simpleRunner.invoke("log", `${output}`);
      console.log = log;
    }
  }
})