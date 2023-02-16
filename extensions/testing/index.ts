import { CodeGenArgs, Extension, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent, untilCondition, openUIEvent, openUI, isFunction, isString, splitOnCapitals, ExtensionBase, ExtensionBaseConstructor, AbstractConstructor, DecoratedExtension, ExtensionCommon, NonAbstractConstructor } from "$common";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";
import { BlockKey, BlockTestCase, RuntimeForTest, TestHelper, UnitTests, GetTestCase, TestCaseEntry, InputArray, KeyToBlockIndexMap, IntegrationTest, Testable } from "./types";
import { render, fireEvent } from '@testing-library/svelte';
import glob from "glob";
import fs from "fs";
import { executeAndSquashWarnings, getEngineFile } from "./utils";
import { BlockRunner } from "./BlockRunner";
import testable from "./mixins/testable";

export { describe, expect, test };

type TestDetails<T extends ExtensionCommon, Key extends BlockKey<T>> = {
  Extension: NonAbstractConstructor<ExtensionCommon>,
  key: Key,
  directory: string,
  testHelper: TestHelper,
}

async function mockOpenUI<T extends ExtensionCommon>({ component }: Parameters<typeof openUI>["1"]) {
  const { directory, runtime } = this as any as TestDetails<T, any> & { runtime: RuntimeForTest<T> };
  const fileName = component.endsWith(".svelte") ? component : `${component}.svelte`;
  const pathToComponent = fs.existsSync(path.join(directory, fileName))
    ? path.join(directory, fileName)
    : glob.sync(path.join(directory, "**", fileName))[0];
  const { forTest } = runtime;
  const { extension } = forTest;
  const ignoreWarnings = ["created with unknown prop"];

  forTest.UIPromise = import(pathToComponent)
    .then(module => executeAndSquashWarnings(() => render(module, { extension, close: () => { } }), ignoreWarnings));
}

const mockRuntime = <T extends ExtensionCommon>(details: TestDetails<T, any>): RuntimeForTest<T> => {
  const runtime = jest.createMockFromModule(getEngineFile("runtime")) as any as RuntimeForTest<T>;

  runtime.forTest = {
    UIPromise: undefined,
    extension: undefined,
  };

  // runtime can be built up over time
  runtime[openUIEvent] = mockOpenUI.bind({ ...details, runtime });

  runtime.emit = (eventName: string, ...args: any[]) => {
    runtime[eventName]?.(...args);
    return eventName in runtime;
  }

  runtime.on = (eventName: string, listener: Function) => {
    runtime[eventName] = listener;
    return runtime;
  }

  return runtime;
}

const getInstance = <T extends ExtensionCommon>(details: TestDetails<T, any>): Testable<T> => {
  const runtime = mockRuntime(details);
  const args: ConstructorParameters<typeof ExtensionBase> = [runtime, "", "", ""];
  const TestClass = testable(details.Extension);
  const instance = new TestClass(...args);
  instance.initialize();

  return instance as Testable<T>;
}

const getInputArray = <T extends ExtensionCommon, Key extends BlockKey<T>>(input: any): InputArray<T, Key> => {
  if (input === undefined) return [];
  return (Array.isArray(input) ? input : [input]) as InputArray<T, Key>;
}

const processUnitTest = <T extends ExtensionCommon, Key extends BlockKey<T>>(
  name: string,
  testCase: BlockTestCase<T, Key>,
  details: TestDetails<T, Key>,
  map: KeyToBlockIndexMap
) => test(name, async () => {
  const instance = getInstance(details);
  const { runtime } = instance;
  const { forTest } = runtime as RuntimeForTest<T>;

  forTest.extension = instance;

  const { key, testHelper } = details;

  const {
    isReady, before, after, checkIsReadyRate,
    // @ts-ignore 
    input, expected
  } = testCase;

  if (isReady) await untilCondition(() => isReady(instance), checkIsReadyRate);

  await before?.({ extension: instance, testHelper });

  const runner = new BlockRunner(map, instance);
  const { output: result, ui } = await runner.invoke(key, ...getInputArray<T, Key>(input));

  const expectsResult = expected !== undefined;

  if (expectsResult) expect(result).toBe(expected);

  await after?.({ extension: instance, result, ui, testHelper });
});

const processIntegrationTest = <T extends ExtensionCommon>(
  name: string,
  testCase: IntegrationTest<T>,
  details: TestDetails<T, BlockKey<T>>,
  map: KeyToBlockIndexMap
) => test(name, async () => {
  const instance = getInstance(details);
  const blockRunner = new BlockRunner(map, instance);
  await testCase({ extension: instance, blockRunner, testHelper: details.testHelper });
});

export const buildKeyBlockMap = <T extends ExtensionCommon>(instance: Testable<T>): KeyToBlockIndexMap =>
  instance.getBlockInfo().reduce((map, { opcode }, index) => {
    return map.set(instance.getBlockKeyForOpcode(opcode), index)
  }, new Map<string, number>());

const getKeyBlockMap = <T extends ExtensionCommon>(details: TestDetails<T, any>) => buildKeyBlockMap(getInstance(details));

const getTestCase = <T extends ExtensionCommon, K extends BlockKey<T>>(testCase: TestCaseEntry<T, K>, { testHelper }: TestDetails<T, K>): BlockTestCase<T, K> =>
  isFunction(testCase) ? (testCase as GetTestCase<T, K>)(testHelper) : testCase as BlockTestCase<T, K>;

/**
 * 
 * @param extensionInfo
 * @param cases 
 */
export const createTestSuite = <T extends ExtensionCommon>(
  extensionInfo: { Extension: NonAbstractConstructor<T>, __dirname: string },
  cases: { unitTests: UnitTests<T>, integrationTests?: Record<string, IntegrationTest<T>> },
) => {
  const { Extension, __dirname: directory } = extensionInfo;
  const { unitTests, integrationTests } = cases;

  const testHelper: TestHelper = {
    expect,
    fireEvent,
    updateHTMLInputValue: async (element, value) => fireEvent.input(element, { target: { value } })
  };

  const keyToBlockMap = getKeyBlockMap({ Extension, directory, key: undefined, testHelper });

  if (unitTests) describe(`${Extension.name} Unit Tests`, () => {
    for (const key in unitTests) {
      const blockKey = key as any as BlockKey<T>;
      type Case = TestCaseEntry<T, typeof blockKey>;

      const asSingleOrFunc = unitTests[key] as Case;
      const asArray = unitTests[key] as Array<Case>;
      const args: TestDetails<T, typeof blockKey> = { Extension, key: blockKey, directory, testHelper };

      Array.isArray(unitTests[key])
        ? asArray
          .map(_case => getTestCase(_case, args))
          .map((_case, index) => processUnitTest(`${key} ${index + 1}`, _case, args, keyToBlockMap))
        : processUnitTest(key, getTestCase(asSingleOrFunc, args), args, keyToBlockMap);
    }
  });

  if (integrationTests) describe(`${Extension.name} Integration Tests`, () => {
    for (const key in integrationTests) {
      const blockKey = key as BlockKey<T>
      const name = splitOnCapitals(key).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
      const args: TestDetails<T, typeof blockKey> = { Extension, key: blockKey, directory, testHelper };
      processIntegrationTest(name, integrationTests[key], args, keyToBlockMap);
    }
  })
};