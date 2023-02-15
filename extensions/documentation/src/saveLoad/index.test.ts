import { SaveDataHandler } from "$common";
import { createTestSuite } from "$testing";
import Extension from ".";

createTestSuite({ Extension, __dirname }, {
  unitTests: undefined,
  integrationTests: {
    saveLoad: ({ extension, testHelper: { expect } }) => {
      type Data = typeof extension.somePersistentData;
      const testData: Data = { x: 23, input: "this is a test" };
      extension.somePersistentData = testData;
      const { hooks: { onSave, onLoad } }: SaveDataHandler<Extension, Data> = extension.saveDataHandler;
      expect(onSave(extension)).toEqual(testData);
      extension.somePersistentData = undefined;
      expect(extension.somePersistentData).toBeUndefined();
      onLoad(extension, testData);
      expect(extension.somePersistentData).toEqual(testData);
    }
  }
})