import type { RenderResult, fireEvent } from '@testing-library/svelte';
import type { SvelteComponentDev } from "svelte/internal";
import { Extension, ExtensionBlocks, ExtensionMenuDisplayDetails, NonEmptyArray, InternalButtonKey, } from "$common";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { expect } from '@jest/globals';
import { BlockRunner } from './BlockRunner';

export type AnyExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;
export type BlockKey<T extends AnyExtension> = keyof T["BlockFunctions"] & string;
export type KeyToBlockIndexMap = Map<string, number>;

export interface ExtensionConstructor<T extends AnyExtension> {
  new(...args: ConstructorParameters<typeof Extension>): T;
}

export type TestHelper = {
  expect: typeof expect,
  fireEvent: typeof fireEvent,
  updateInputValue: (input: HTMLInputElement, value: string) => Promise<boolean>,
}

type ReturnsValue<T extends AnyExtension, Key extends BlockKey<T>> =
  ReturnType<T["BlockFunctions"][Key]> extends void | Promise<void> | InternalButtonKey
  ? false
  : true;

type ReportedValue<T extends AnyExtension, Key extends BlockKey<T>> = ReturnType<T["BlockFunctions"][Key]>;

export type Hooks<T extends AnyExtension, Key extends BlockKey<T>> = {
  /**
   * Ran before the block-under-test is executed (useful for initialization)
   * @param harness An object to help you define your test. Includes:
   * - extension: A reference to the extension instance being used in this test
   * - testHelper: An object with utility functions to support your test
   * @see https://en.wikipedia.org/wiki/Test_harness
   * @returns Nothing (but can be implemented as an async function)
   */
  before?: (harness: { extension: T, testHelper: TestHelper }) => void | Promise<void>,
  /**
   * Ran after the conclusion of a test, and thus is the best place to put test cases.
   * @param harness An object to help you define your test. Includes:
   * - extension: A reference to the extension instance being used in this test
   * - testHelper: An object with utility functions to support your test
   * - result: (If the block function under test returns a value) the returned value of the block function under test
   * - ui: (NOT DEFINED if the block function doesn't open a UI element) a reference to the RenderedUI
   * @see https://en.wikipedia.org/wiki/Test_harness
   * @returns Void (but can be implemented as an async function and thus return Promise<void>)
   */
  after?: ReturnsValue<T, Key> extends false
  ? (harness: { extension: T, ui?: RenderedUI, testHelper: TestHelper }) => void | Promise<void>
  : (harness: { extension: T, result: ReportedValue<T, Key>, ui?: RenderedUI, testHelper: TestHelper }) => void | Promise<void>
};

export type InputArray<T extends AnyExtension, Key extends BlockKey<T>> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? readonly [...Parameters<T["BlockFunctions"][Key]>]
  : [];

export type Input<T extends AnyExtension, Key extends BlockKey<T>> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? {
    /**
     * The input(s) that the block function (or "operation") under test should be given. 
     * If the block function takes one argument, then this will be a single value.
     * If the block function takes multiple arguments, then this field will be an array of values.
     */
    input: Parameters<T["BlockFunctions"][Key]> extends { length: 1 }
    ? Parameters<T["BlockFunctions"][Key]>[0]
    : readonly [...Parameters<T["BlockFunctions"][Key]>]
  }
  : {};

export type Expected<T extends AnyExtension, Key extends BlockKey<T>> =
  ReturnsValue<T, Key> extends true
  ? {
    /**
     * The expected value returned by the block function (or "operation") under test.
     * At the conclusion of the test, this value will be compared to the actual value returned (or "reported") by the function under test.
     */
    expected: ReportedValue<T, Key>
  }
  : {};

export type EnsureReady<T extends AnyExtension> = {
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

export type BlockTestCase<T extends AnyExtension, Key extends BlockKey<T>> =
  Hooks<T, Key> &
  EnsureReady<T> &
  Input<T, Key> &
  Expected<T, Key>;

export type SingleOrArray<T> = T | T[];
export type ObjectOrFunc<T, Args extends any[]> = T | ((...args: Args) => T);

export type GetTestCase<T extends AnyExtension, K extends BlockKey<T>> = (helper: TestHelper) => BlockTestCase<T, K>;
export type TestCaseEntry<T extends AnyExtension, K extends BlockKey<T>> = ObjectOrFunc<BlockTestCase<T, K>, Parameters<GetTestCase<T, K>>>;

export type UnitTests<T extends AnyExtension> = { [k in BlockKey<T>]?: SingleOrArray<ObjectOrFunc<BlockTestCase<T, k>, Parameters<GetTestCase<T, k>>>> };

export type RenderedUI = RenderResult<SvelteComponentDev, typeof import("/Users/parkermalachowsky/MIT/prg-extension-boilerplate/extensions/testing/node_modules/@testing-library/dom/types/queries")>;

export type RuntimeForTest<T extends AnyExtension> = Runtime & {
  forTest: {
    extension: T,
    UIPromise: Promise<RenderedUI>;
  }
}

/**
 * The word 'harness' is used for the funciton argument, 
 * as "In software testing, a test harness or automated test framework is a collection of software and test data configured to test a program unit by running it under varying conditions and monitoring its behavior and outputs. It has two main parts: the test execution engine and the test script repository."
 * @see https://en.wikipedia.org/wiki/Test_harness
 */
export type IntegrationTest<T extends AnyExtension> = (harness: { blockrunner: BlockRunner<T>, testHelper: TestHelper }) => void | Promise<void>;