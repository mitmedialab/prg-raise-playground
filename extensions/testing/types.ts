import type { RenderResult, fireEvent } from '@testing-library/svelte';
import type { SvelteComponentDev } from "svelte/internal";
import { Extension, ExtensionBlocks, ExtensionMenuDisplayDetails, NonEmptyArray, InternalButtonKey, Methods, MethodNames, ExtensionInstance, } from "$common";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { expect } from '@jest/globals';
import { BlockRunner } from './BlockRunner';
import testable from './mixins/testable';
import type BlockUtility from '$root/packages/scratch-vm/src/engine/block-utility';

export type GenericExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;

export type BlockMethods<T extends ExtensionInstance> = T extends GenericExtension ? T["BlockFunctions"] : Methods<T>;
export type BlockKey<T extends ExtensionInstance> = (T extends GenericExtension ? keyof T["BlockFunctions"] : MethodNames<T>) & string;

export type KeyToBlockIndexMap = Map<string, number>;

export type Testable<T> = InstanceType<ReturnType<typeof testable>> & T;

export type TestHelper = {
  expect: typeof expect,
  fireEvent: typeof fireEvent,
  updateHTMLInputValue: (input: HTMLInputElement, value: string) => Promise<boolean>,
}

type ReturnsValue<T extends ExtensionInstance, Key extends BlockKey<T>> =
  ReturnType<BlockMethods<T>[Key]> extends void | Promise<void> | InternalButtonKey
  ? false
  : true;

export type ReportedValue<T extends ExtensionInstance, Key extends BlockKey<T>> = ReturnType<BlockMethods<T>[Key]>;

export type Hooks<T extends ExtensionInstance, Key extends BlockKey<T>> = {
  /**
   * Ran before the block-under-test is executed (useful for initialization)
   * @param fixture An object to help you define your test. Includes:
   * - extension: A reference to the extension instance being used in this test
   * - testHelper: An object with utility functions to support your test
   * @see https://en.wikipedia.org/wiki/Test_fixture
   * @returns Nothing (but can be implemented as an async function)
   */
  before?: (fixture: { extension: T, testHelper: TestHelper }) => void | Promise<void>,
  /**
   * Ran after the conclusion of a test, and thus is the best place to put test cases.
   * @param fixture An object to help you define your test. Includes:
   * - extension: A reference to the extension instance being used in this test
   * - testHelper: An object with utility functions to support your test
   * - result: (If the block function under test returns a value) the returned value of the block function under test
   * - ui: (NOT DEFINED if the block function doesn't open a UI element) a reference to the RenderedUI
   * @see https://en.wikipedia.org/wiki/Test_fixture
   * @returns Void (but can be implemented as an async function and thus return Promise<void>)
   */
  after?: ReturnsValue<T, Key> extends false
  ? (fixture: { extension: T, ui?: RenderedUI, testHelper: TestHelper }) => void | Promise<void>
  : (fixture: { extension: T, result: ReportedValue<T, Key>, ui?: RenderedUI, testHelper: TestHelper }) => void | Promise<void>
};

export type InputArray<T extends ExtensionInstance, Key extends BlockKey<T>> =
  Parameters<BlockMethods<T>[Key]> extends NonEmptyArray<any>
  ? Parameters<BlockMethods<T>[Key]> extends [...infer X extends any[], BlockUtility?] ? readonly [...X] : readonly [...Parameters<BlockMethods<T>[Key]>]
  : [];

export type NamedInputArray<T extends ExtensionInstance, Key extends BlockKey<T>> = RemapToNamed<[...InputArray<T, Key>]>

type RemapToNamed<TArr extends unknown[]> = TArr extends [...infer Rest, infer _]
  ? [...RemapToNamed<Rest>, [names: string, value: _]]
  : []

export type Input<T extends ExtensionInstance, Key extends BlockKey<T>> =
  Parameters<BlockMethods<T>[Key]> extends NonEmptyArray<any>
  ? {
    /**
     * The input(s) that the block function (or "operation") under test should be given. 
     * If the block function takes one argument, then this will be a single value.
     * If the block function takes multiple arguments, then this field will be an array of values.
     */
    input: Parameters<BlockMethods<T>[Key]> extends { length: 1 }
    ? Parameters<BlockMethods<T>[Key]>[0]
    : readonly [...Parameters<BlockMethods<T>[Key]>]
  }
  : {};

export type Expected<T extends ExtensionInstance, Key extends BlockKey<T>> =
  ReturnsValue<T, Key> extends true
  ? {
    /**
     * The expected value returned by the block function (or "operation") under test.
     * At the conclusion of the test, this value will be compared to the actual value returned (or "reported") by the function under test.
     */
    expected: ReportedValue<T, Key>
  }
  : {};

export type EnsureReady<T extends ExtensionInstance> = {
  /**
   * Function invoked periodically before a test begins.
   * Once this function returns true (if defined), the test will begin.
   * @param extension 
   * @returns 
   */
  isReady?: (extension: T) => boolean;
  /**
   * How often (in ms) to invoke the isReady function. 
   * If not defined, a rate of 100ms will be used.
   */
  checkIsReadyRate?: number;
};

export type BlockTestCase<T extends ExtensionInstance, Key extends BlockKey<T>> =
  Hooks<T, Key> &
  EnsureReady<T> &
  Input<T, Key> &
  Expected<T, Key> &
  { name?: string };

export type SingleOrArray<T> = T | T[];
export type ObjectOrFunc<T, Args extends any[]> = T | ((...args: Args) => T);

export type GetTestCase<T extends ExtensionInstance, K extends BlockKey<T>> = (helper: TestHelper) => BlockTestCase<T, K>;
export type TestCaseEntry<T extends ExtensionInstance, K extends BlockKey<T>> = ObjectOrFunc<BlockTestCase<T, K>, Parameters<GetTestCase<T, K>>>;

/**
 * As you might notice, the two branches of the below type are exactly the same. 
 * For some reason, typescript struggles if they are not split in this way. 
 */
export type UnitTests<T extends ExtensionInstance> = T extends GenericExtension
  ? { [k in BlockKey<T>]?: SingleOrArray<ObjectOrFunc<BlockTestCase<T, k>, Parameters<GetTestCase<T, k>>>> }
  : { [k in BlockKey<T>]?: SingleOrArray<ObjectOrFunc<BlockTestCase<T, k>, Parameters<GetTestCase<T, k>>>> };

export type RenderedUI = RenderResult<SvelteComponentDev, typeof import("/Users/parkermalachowsky/MIT/prg-extension-boilerplate/extensions/testing/node_modules/@testing-library/dom/types/queries")>;

export type RuntimeForTest<T extends ExtensionInstance> = Runtime & {
  forTest: {
    extension: Testable<T>,
    UIPromise: Promise<RenderedUI>;
  }
}

/**
 @see https://en.wikipedia.org/wiki/Test_fixture
 */
export type IntegrationTest<T extends ExtensionInstance> = (fixture: { extension: Testable<T>, blockRunner: BlockRunner<T>, testHelper: TestHelper }) => void | Promise<void>;