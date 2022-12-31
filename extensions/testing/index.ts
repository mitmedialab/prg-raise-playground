import { vmSrc } from "$root/scripts/paths";
import { CodeGenArgs, Extension, PopulateCodeGenArgs, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent, waitForCondition, openUIEvent, openUI } from "$common";
import Runtime from "$scratch-vm/engine/runtime";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";
import { AnyExtension, BlockKey, BlockTestCase, ExtensionConstructor, RuntimeForTest, UnitTests } from "./types";
import { render, fireEvent } from '@testing-library/svelte';
import glob from "glob";
import fs from "fs";

type TestDetails<T extends AnyExtension, Key extends BlockKey<T>> = {
  Extension: ExtensionConstructor<T>,
  key: Key,
  directory: string,
}

type KeyToBlockIndexMap = Map<string, number>;

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
  const runtime = jest.mock(path.join(vmSrc, "engine", "runtime")) as any as RuntimeForTest<T>;

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

const processUnitTest = async <T extends AnyExtension, Key extends BlockKey<T>>(
  testCase: BlockTestCase<T, Key>,
  details: TestDetails<T, Key>,
  map: KeyToBlockIndexMap
) => {
  const instance: T = getInstance(details);
  const { runtime } = instance;
  const { forTest } = runtime as RuntimeForTest<T>;

  forTest.extension = instance;

  const { key } = details;
  const index = map.get(key);
  const { blockType, func, opcode } = Extension.TestGetBlocks(instance)[index];

  const {
    isReady, before, after,
    // @ts-ignore 
    input, expected
  } = testCase;

  if (isReady) await waitForCondition(() => isReady(instance));

  await before?.(instance);

  const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

  const output = await Promise.resolve(
    input !== undefined
      ? blockFunction(...(Array.isArray(input) ? input : [input]))
      : blockFunction()
  );

  const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;

  if (expected !== undefined) expect(output).toBe(expected);

  const afterContext: ThisParameterType<typeof after> = {
    expect,
    fireEvent,
    updateInputValue: async (element, value) => fireEvent.input(element, { target: { value } })
  };

  await after?.bind(afterContext)?.(instance, renderedUI);
}

const getKeyBlockMap = <T extends AnyExtension>(details: TestDetails<T, any>): KeyToBlockIndexMap =>
  Extension.TestGetInfo(getInstance(details))
    .blocks.reduce((acc, { opcode }: ExtensionBlockMetadata, index) =>
      acc.set(Extension.GetKeyFromOpcode(opcode), index),
      new Map<string, number>()
    );

export const createTestSuite = <T extends AnyExtension>(
  extensionInfo: { Extension: ExtensionConstructor<T>, __dirname: string },
  cases: { unitTests: UnitTests<T>, integrationTests: any },
) => {
  const { Extension, __dirname: directory } = extensionInfo;
  const { unitTests } = cases;
  const keyToBlockMap = getKeyBlockMap({ Extension, directory, key: undefined });

  describe(Extension.name, () => {

    for (const key in unitTests) {
      const asArray = unitTests[key] as Array<BlockTestCase<T, typeof key>>;
      const asCase = unitTests[key] as BlockTestCase<T, typeof key>;
      const args = { Extension, key, directory };

      Array.isArray(unitTests[key])
        ? asArray.map((_case, index) => test(`${key} ${index + 1}`, () => processUnitTest(_case, args, keyToBlockMap)))
        : test(key, () => processUnitTest(asCase, args, keyToBlockMap));
    }

  });
};