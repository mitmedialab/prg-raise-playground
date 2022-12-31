import { vmSrc } from "$root/scripts/paths";
import { CodeGenArgs, Extension, PopulateCodeGenArgs, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent, waitForCondition, openUIEvent, openUI, isFunction } from "$common";
import Runtime from "$scratch-vm/engine/runtime";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";
import { AnyExtension, BlockKey, BlockTestCase, ExtensionConstructor, RuntimeForTest, SingleOrFunc, TestHelper, UnitTests, GetTestCase, TestCaseEntry } from "./types";
import { render, fireEvent } from '@testing-library/svelte';
import glob from "glob";
import fs from "fs";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

type TestDetails<T extends AnyExtension, Key extends BlockKey<T>> = {
  Extension: ExtensionConstructor<T>,
  key: Key,
  directory: string,
  testHelper: TestHelper,
}

type KeyToBlockIndexMap = Map<string, number>;

const getEngineFile = (name: string) => path.join(vmSrc, "engine", name);

async function mockOpenUI<T extends AnyExtension>({ component }: Parameters<typeof openUI>["1"]) {
  const { directory, runtime } = this as any as TestDetails<T, any> & { runtime: RuntimeForTest<T> };
  const fileName = component.endsWith(".svelte") ? component : `${component}.svelte`;
  const pathToComponent = fs.existsSync(path.join(directory, fileName))
    ? path.join(directory, fileName)
    : glob.sync(path.join(directory, "**", fileName))[0];
  const { forTest } = runtime;
  const { extension } = forTest;
  forTest.UIPromise = import(pathToComponent)
    .then(module => render(module, { extension, close: () => { } }));
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

const mockBlockUtility = <T extends AnyExtension>(details: TestDetails<T, any>): BlockUtility => {
  const utility = new (jest.createMockFromModule(getEngineFile("block-utility")) as any)() as BlockUtility;
  // utility can be built up over time
  return utility;
}

const getInstance = <T extends AnyExtension>(details: TestDetails<T, any>): T => {
  const runtime = mockRuntime(details);
  const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
  const instance = new details.Extension(runtime, args as CodeGenArgs);
  Extension.TestInit(instance);
  return instance;
}

const processUnitTest = <T extends AnyExtension, Key extends BlockKey<T>>(
  name: string,
  testCase: BlockTestCase<T, Key>,
  details: TestDetails<T, Key>,
  map: KeyToBlockIndexMap
) =>
  test(name, async () => {
    const instance: T = getInstance(details);
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    forTest.extension = instance;

    const { key, testHelper } = details;
    const index = map.get(key);
    const { blockType, func, opcode } = Extension.TestGetBlocks(instance)[index];

    const {
      isReady, before, after,
      // @ts-ignore 
      input, expected
    } = testCase;

    if (isReady) await waitForCondition(() => isReady(instance));

    await before?.bind(testHelper)?.(instance);

    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

    const mutation = {}; // Need to research what this is for

    const args = input !== undefined
      ? Array.isArray(input)
        ? (input as Array<any>).reduce((acc, curr, index) => acc[index] = curr, { mutation })
        : { mutation, 0: input }
      : undefined;

    const utility = mockBlockUtility(details);

    const output = await Promise.resolve(
      args !== undefined ? blockFunction(args, utility) : blockFunction(utility)
    );

    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;

    if (expected !== undefined) expect(output).toBe(expected);

    await after?.bind(testHelper)?.(instance, renderedUI);
  });

const getKeyBlockMap = <T extends AnyExtension>(details: TestDetails<T, any>): KeyToBlockIndexMap =>
  Extension.TestGetInfo(getInstance(details))
    .blocks.reduce((acc, { opcode }: ExtensionBlockMetadata, index) =>
      acc.set(Extension.GetKeyFromOpcode(opcode), index),
      new Map<string, number>()
    );

const getTestCase = <T extends AnyExtension, K extends BlockKey<T>>(testCase: TestCaseEntry<T, K>, { testHelper }: TestDetails<T, K>): BlockTestCase<T, K> =>
  isFunction(testCase) ? (testCase as GetTestCase<T, K>)(testHelper) : testCase as BlockTestCase<T, K>;

export const createTestSuite = <T extends AnyExtension>(
  extensionInfo: { Extension: ExtensionConstructor<T>, __dirname: string },
  cases: { unitTests: UnitTests<T>, integrationTests: any },
) => {
  const { Extension, __dirname: directory } = extensionInfo;
  const { unitTests } = cases;

  const testHelper: TestHelper = {
    expect,
    fireEvent,
    updateInputValue: async (element, value) => fireEvent.input(element, { target: { value } })
  };

  const keyToBlockMap = getKeyBlockMap({ Extension, directory, key: undefined, testHelper });


  describe(Extension.name, () => {
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
};