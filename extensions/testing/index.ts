import { vmSrc } from "$root/scripts/paths";
import { CodeGenArgs, Extension, PopulateCodeGenArgs, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent, waitForCondition, openUIEvent, openUI } from "$common";
import Runtime from "$scratch-vm/engine/runtime";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";
import { AnyExtension, BlockKey, BlockTestCase, ExtensionConstructor, RuntimeForTest, UnitTests } from "./types";
import { render, fireEvent, RenderResult } from '@testing-library/svelte';
import glob from "glob";
import fs from "fs";

type TestDetails<T extends AnyExtension, Key extends BlockKey<T>> = {
  extension: ExtensionConstructor<T>,
  key: Key,
  directory: string,
}

type KeyToBlockIndexMap = Map<string, number>;

async function mockOpenUI<T extends AnyExtension>({ component }: Parameters<typeof openUI>["1"]) {
  const { directory, extension, runtime } = this as any as TestDetails<T, any> & { runtime: RuntimeForTest };
  const fileName = component.endsWith(".svelte") ? component : `${component}.svelte`;
  const pathToComponent = fs.existsSync(path.join(directory, fileName))
    ? path.join(directory, fileName)
    : glob.sync(path.join(directory, "**", fileName))[0];
  runtime.forTest.UIPromise = import(pathToComponent)
    .then(module => render(module, { extension, close: () => { } }));
}

const mockRuntime = <T extends AnyExtension>(details: TestDetails<T, any>): RuntimeForTest => {
  const runtime = jest.mock(path.join(vmSrc, "engine", "runtime")) as any as RuntimeForTest;

  runtime.forTest = {
    UIPromise: undefined
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
  const instance = new details.extension(runtime, args as CodeGenArgs);
  // @ts-ignore
  instance.internal_init();
  return instance;
}

const processUnitTest = async <T extends AnyExtension, Key extends BlockKey<T>>(
  testCase: BlockTestCase<T, Key>,
  details: TestDetails<T, Key>,
  map: KeyToBlockIndexMap
) => {
  const { extension, key } = details;
  const instance: T = getInstance(details);
  const { runtime } = instance;
  const { forTest: { UIPromise } } = runtime as RuntimeForTest;

  // @ts-ignore
  const blocks = instance.getInfo().blocks;
  const { blockType, func, opcode } = blocks[map.get(key)] as ExtensionBlockMetadata;

  const {
    isReady, before, after,
    // @ts-ignore 
    input, expected
  } = testCase;

  if (isReady) await waitForCondition(() => isReady(instance));

  before?.(instance);

  const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

  const output = await Promise.resolve(
    input !== undefined
      ? blockFunction(...(Array.isArray(input) ? input : [input]))
      : blockFunction()
  );

  const renderedUI = UIPromise ? await UIPromise : undefined;

  if (expected !== undefined) expect(output).toBe(expected);

  after?.(instance, renderedUI);
}

const getKeyBlockMap = <T extends AnyExtension>(details: TestDetails<T, any>): KeyToBlockIndexMap =>
  getInstance(details)
    // @ts-ignore 
    .getInfo()
    .blocks.reduce((acc, { opcode }: ExtensionBlockMetadata, index) =>
      acc.set(Extension.GetKeyFromOpcode(opcode), index),
      new Map<string, number>()
    );

export const createTestSuite = <T extends AnyExtension>(
  extensionInfo: { extension: ExtensionConstructor<T>, __dirname: string },
  cases: { unitTests: UnitTests<T>, integrationTests: any },
) => {
  const { extension, __dirname: directory } = extensionInfo;
  const { unitTests } = cases;
  const keyToBlockMap = getKeyBlockMap({ extension, directory, key: undefined });

  describe(Extension.name, () => {

    for (const key in unitTests) {
      const asArray = unitTests[key] as Array<BlockTestCase<T, typeof key>>;
      const asCase = unitTests[key] as BlockTestCase<T, typeof key>;
      const args = { extension, key, directory };

      Array.isArray(unitTests[key])
        ? asArray.map((_case, index) => test(`${key} ${index + 1}`, () => processUnitTest(_case, args, keyToBlockMap)))
        : test(key, () => processUnitTest(asCase, args, keyToBlockMap));
    }

  });
};