import { CodeGenArgs, Extension, PopulateCodeGenArgs, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent, waitForCondition, openUIEvent, openUI, isFunction, isString, splitOnCapitals } from "$common";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";
import { AnyExtension, BlockKey, BlockTestCase, ExtensionConstructor, RuntimeForTest, TestHelper, UnitTests, GetTestCase, TestCaseEntry, InputArray, KeyToBlockIndexMap, IntegrationTest } from "./types";
import { render, fireEvent } from '@testing-library/svelte';
import glob from "glob";
import fs from "fs";
import { executeAndSquashWarnings, getEngineFile } from "./utils";
import { BlockRunner } from "./BlockRunner";

type TestDetails<T extends AnyExtension, Key extends BlockKey<T>> = {
  Extension: ExtensionConstructor<T>,
  key: Key,
  directory: string,
  testHelper: TestHelper,
}

async function mockOpenUI<T extends AnyExtension>({ component }: Parameters<typeof openUI>["1"]) {
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

const mockRuntime = <T extends AnyExtension>(details: TestDetails<T, any>): RuntimeForTest<T> => {
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

const getInstance = <T extends AnyExtension>(details: TestDetails<T, any>): T => {
  const runtime = mockRuntime(details);
  const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
  const instance = new details.Extension(runtime, args as CodeGenArgs);
  Extension.TestInit(instance);
  return instance;
}

const getInputArray = <T extends AnyExtension, Key extends BlockKey<T>>(input: any): InputArray<T, Key> => {
  if (input === undefined) return [];
  return (Array.isArray(input) ? input : [input]) as InputArray<T, Key>;
}

const processUnitTest = <T extends AnyExtension, Key extends BlockKey<T>>(
  name: string,
  testCase: BlockTestCase<T, Key>,
  details: TestDetails<T, Key>,
  map: KeyToBlockIndexMap
) => test(name, async () => {
  const instance: T = getInstance(details);
  const { runtime } = instance;
  const { forTest } = runtime as RuntimeForTest<T>;

  forTest.extension = instance;

  const { key, testHelper } = details;

  const {
    isReady, before, after, checkIsReadyRate,
    // @ts-ignore 
    input, expected
  } = testCase;

  if (isReady) await waitForCondition(() => isReady(instance), checkIsReadyRate);

  await before?.bind(testHelper)?.(instance);

  const runner = new BlockRunner(map, instance);
  const { output, renderedUI } = await runner.invoke(key, ...getInputArray<T, Key>(input));

  const expectsResult = expected !== undefined;

  if (expectsResult) expect(output).toBe(expected);

  const afterArgs = expectsResult ? [instance, output, renderedUI] : [instance, renderedUI];
  await after?.bind(testHelper)?.(...afterArgs);
});

const processIntegrationTest = <T extends AnyExtension>(
  name: string,
  testCase: IntegrationTest<T>,
  details: TestDetails<T, BlockKey<T>>,
  map: KeyToBlockIndexMap
) => test(name, async () => {
  const instance: T = getInstance(details);
  const runner = new BlockRunner(map, instance);
  await testCase(runner, details.testHelper);
});

const toKeyToBlockMap = (map: KeyToBlockIndexMap, { opcode }: ExtensionBlockMetadata, index: number) =>
  map.set(Extension.GetKeyFromOpcode(opcode), index);

export const buildKeyBlockMap = <T extends AnyExtension>(instance: T): KeyToBlockIndexMap =>
  Extension.TestGetInfo(instance).blocks.reduce(toKeyToBlockMap, new Map<string, number>());

const getKeyBlockMap = <T extends AnyExtension>(details: TestDetails<T, any>) => buildKeyBlockMap(getInstance(details));

const getTestCase = <T extends AnyExtension, K extends BlockKey<T>>(testCase: TestCaseEntry<T, K>, { testHelper }: TestDetails<T, K>): BlockTestCase<T, K> =>
  isFunction(testCase) ? (testCase as GetTestCase<T, K>)(testHelper) : testCase as BlockTestCase<T, K>;

/**
 * 
 * @param extensionInfo
 * @param cases 
 */
export const createTestSuite = <T extends AnyExtension>(
  extensionInfo: { Extension: ExtensionConstructor<T>, __dirname: string },
  cases: { unitTests: UnitTests<T>, integrationTests?: Record<string, IntegrationTest<T>> },
) => {
  const { Extension, __dirname: directory } = extensionInfo;
  const { unitTests, integrationTests } = cases;

  const testHelper: TestHelper = {
    expect,
    fireEvent,
    updateInputValue: async (element, value) => fireEvent.input(element, { target: { value } })
  };

  const keyToBlockMap = getKeyBlockMap({ Extension, directory, key: undefined, testHelper });

  if (unitTests) describe(`${Extension.name} Unit Tests`, () => {
    for (const key in unitTests) {
      type Case = TestCaseEntry<T, typeof key>

      const asSingleOrFunc = unitTests[key] as Case;
      const asArray = unitTests[key] as Array<Case>;
      const args: TestDetails<T, typeof key> = { Extension, key, directory, testHelper };

      Array.isArray(unitTests[key])
        ? asArray
          .map(_case => getTestCase(_case, args))
          .map((_case, index) => processUnitTest(`${key} ${index + 1}`, _case, args, keyToBlockMap))
        : processUnitTest(key, getTestCase(asSingleOrFunc, args), args, keyToBlockMap);
    }
  });

  if (integrationTests) describe(`${Extension.name} Integration Tests`, () => {
    for (const key in integrationTests) {
      const name = splitOnCapitals(key).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
      const args: TestDetails<T, typeof key> = { Extension, key, directory, testHelper };
      processIntegrationTest(name, integrationTests[key], args, keyToBlockMap);
    }
  })
};