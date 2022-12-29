import { vmSrc } from "$root/scripts/paths";
import { AllText, BlockDefinitions, CodeGenArgs, Environment, Extension, PopulateCodeGenArgs, ExtensionBlocks, ExtensionMenuDisplayDetails, NonEmptyArray, openUIEvent, InternalButtonKey, ExtensionMetadata, ExtensionBlockMetadata, BlockType, registerButtonCallbackEvent } from "$common";
import Runtime from "$scratch-vm/engine/runtime";
import { describe, expect, jest, test } from '@jest/globals';
import path from "path";

type AnyExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;
type BlockKey<T extends AnyExtension> = keyof T["BlockFunctions"] & string;

const mockRuntime = (): Runtime => {
  const runtime = jest.mock(path.join(vmSrc, "engine", "runtime")) as any as Runtime;

  // runtime can be built up over time

  runtime.emit = (eventName: string, args) => {
    const eventExists = eventName in runtime;
    if (eventExists) runtime[eventName](args);
    return eventExists;
  }

  runtime.on = (eventName: string, listener: Function) => {
    runtime[eventName] = listener;
    return runtime;
  }
  return runtime;
}

interface ExtensionConstructor<T extends AnyExtension> {
  new(...args: ConstructorParameters<typeof Extension>): T;
}

type Hooks<T extends AnyExtension> = {
  before?: (extension: T) => void,
  after?: (extension: T) => void,
};

type Input<T extends AnyExtension, Key extends BlockKey<T>> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? { input: Parameters<T["BlockFunctions"][Key]> extends { length: 1 } ? Parameters<T["BlockFunctions"][Key]>[0] : Parameters<T["BlockFunctions"][Key]> }
  : {};

type Expected<T extends AnyExtension, Key extends BlockKey<T>> =
  ReturnType<T["BlockFunctions"][Key]> extends void | Promise<void> | InternalButtonKey
  ? {}
  : { expected: ReturnType<T["BlockFunctions"][Key]> };

type EnsureReady<T extends AnyExtension> = {
  isReady?: (extension: T) => boolean;
  checkIsReadyRate?: number;
};

type BlockTestCase<T extends AnyExtension, Key extends BlockKey<T>> =
  Hooks<T> &
  EnsureReady<T> &
  Input<T, Key> &
  Expected<T, Key>;

type UnitTests<T extends AnyExtension> = { [k in BlockKey<T>]?: BlockTestCase<T, k> | BlockTestCase<T, k>[] };

const getInstance = <T extends AnyExtension>(extensionClass: ExtensionConstructor<T>): T => {
  const runtime = mockRuntime();
  const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
  const instance = new extensionClass(runtime, args as CodeGenArgs);
  // @ts-ignore
  instance.internal_init();
  return instance;
}

const processUnitTest = async <T extends AnyExtension, Key extends BlockKey<T>>(extensionClass: ExtensionConstructor<T>, key: Key, testCase: BlockTestCase<T, Key>, keyByBlockIndex: Map<string, number>) => {
  const instance: T = getInstance(extensionClass);
  const { runtime } = instance;
  // @ts-ignore
  const blocks = instance.getInfo().blocks;
  const { blockType, func, opcode } = blocks[keyByBlockIndex.get(key)] as ExtensionBlockMetadata;

  const {
    isReady, before, after,
    // @ts-ignore 
    input, expected
  } = testCase;

  if (isReady) {

  }

  if (before) {

  }

  const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

  const output = input
    ? blockFunction(...(Array.isArray(input) ? input : [input]))
    : blockFunction();

  if (expected) {
    expect(output).toBe(expected);
  }

  if (after) {

  }
}

export const createTestSuite = <T extends AnyExtension>(
  extensionClass: ExtensionConstructor<T>,
  cases: {
    unitTests: UnitTests<T>,
    integrationTests
  }
) => {

  const { unitTests } = cases;
  // @ts-ignore 
  const info = getInstance(extensionClass).getInfo();

  const keyByBlockIndex = info.blocks.reduce((acc, curr, index) => {
    const { opcode } = (curr as ExtensionBlockMetadata);
    const key = Extension.GetKeyFromOpcode(opcode);
    acc.set(key, index);
    return acc;
  }, new Map<string, number>());

  describe(extensionClass.name, () => {

    for (const key in unitTests) {
      type Case = BlockTestCase<T, typeof key>;

      Array.isArray(unitTests[key])
        ? (unitTests[key] as Array<Case>).map((testCase, index) =>
          test(`${key} ${index + 1}`, () => processUnitTest(extensionClass, key, testCase, keyByBlockIndex)))
        : test(key, () => processUnitTest(extensionClass, key, unitTests[key] as Case, keyByBlockIndex));
    }

  });
};