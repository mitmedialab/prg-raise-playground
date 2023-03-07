import { extension } from "$common/extension";
import { ExtensionBase } from "$common/extension/ExtensionBase";
import { block } from "$common/extension/decorators/blocks";
import { getDependencies } from "$common/extension/mixins/dependencies";
import CustomArgumentManager from "$common/extension/mixins/optional/customArguments/CustomArgumentManager";
import customSaveData, { saveDataKey } from "$common/extension/mixins/optional/customSaveData";
import { ArgumentType, Environment } from "$common/types";
import { createTestSuite, describe, test, testID } from "$testing";

const initial = { text: `${Math.random()}`, value: { x: Math.random() } };

class ExtensionWithCustomArguments extends extension({ name: "" }, "customArguments") {
  init(env: Environment): void { }

  @block((self) => ({
    type: "command",
    text: (x) => "",
    arg: self.makeCustomArgument({ component: "", initial })
  }))
  dummy(dummy: typeof initial["value"]) {
  }
}

type WithSavingSupport = ReturnType<typeof customSaveData>["prototype"];

/**
 * **NOTE:** If this type begins erroring, it means that the value of `saveDataKey` has changed.
 * This could lead to all previously saved projects no longer working, and thus should ideally be avoided.
 */
const expectedSaveDataKey: typeof saveDataKey = "customSaveDataPerExtension";

createTestSuite({ Extension: ExtensionWithCustomArguments, __dirname }, {
  unitTests: undefined,
  integrationTests: {

    testDependency: ({ extension, testHelper: { expect } }) => {
      const actual = getDependencies("customArguments");
      const expected: typeof actual = ["customSaveData"];
      expect(actual).toEqual(expected);
      expect(extension.supports("customSaveData")).toBe(true);
    },

    testSave: ({ extension, testHelper: { expect } }) => {
      const saveable: WithSavingSupport = extension as any as WithSavingSupport;

      type Params = Parameters<typeof saveable["save"]>;

      const params: Params = [{ [expectedSaveDataKey]: undefined }, new Set()];

      saveable["save"](...params);

      const [container, idSet] = params;

      expect(idSet.has(testID)).toBe(true);

      const saved: Array<{ id: string, entry: typeof initial }> = container[expectedSaveDataKey][testID][CustomArgumentManager.SaveKey];

      expect(saved).not.toBeUndefined();
      expect(saved[0].entry).toEqual(initial);
    },

    testLoad: ({ extension, testHelper: { expect } }) => {
      const loadable: WithSavingSupport = extension as any as WithSavingSupport;

      const id = "testID";

      loadable["load"]({
        [expectedSaveDataKey]: {
          [testID]: {
            [CustomArgumentManager.SaveKey]: [{ id, entry: initial }]
          }
        }
      });

      const entry = extension.customArgumentManager.getEntry(id);
      expect(entry).toEqual(initial);
    }
  }
})