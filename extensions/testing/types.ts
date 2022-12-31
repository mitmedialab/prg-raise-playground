import type { RenderResult, fireEvent } from '@testing-library/svelte';
import type { SvelteComponentDev } from "svelte/internal";
import { Extension, ExtensionBlocks, ExtensionMenuDisplayDetails, NonEmptyArray, InternalButtonKey, } from "$common";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";
import { expect } from '@jest/globals';

export type AnyExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;
export type BlockKey<T extends AnyExtension> = keyof T["BlockFunctions"] & string;

export interface ExtensionConstructor<T extends AnyExtension> {
  new(...args: ConstructorParameters<typeof Extension>): T;
}

export type TestHelper = {
  expect: typeof expect,
  fireEvent: typeof fireEvent,
  updateInputValue: (input: HTMLInputElement, value: string) => Promise<boolean>,
}

export type Hooks<T extends AnyExtension> = {
  before?: (this: TestHelper, extension: T) => void | Promise<void>,
  after?: (this: TestHelper, extension: T, ui?: RenderedUI) => void | Promise<void>,
};

export type Input<T extends AnyExtension, Key extends BlockKey<T>> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? { input: Parameters<T["BlockFunctions"][Key]> extends { length: 1 } ? Parameters<T["BlockFunctions"][Key]>[0] : Parameters<T["BlockFunctions"][Key]> }
  : {};

export type Expected<T extends AnyExtension, Key extends BlockKey<T>> =
  ReturnType<T["BlockFunctions"][Key]> extends void | Promise<void> | InternalButtonKey
  ? {}
  : { expected: ReturnType<T["BlockFunctions"][Key]> };

export type EnsureReady<T extends AnyExtension> = {
  isReady?: (extension: T) => boolean;
  checkIsReadyRate?: number;
};

export type BlockTestCase<T extends AnyExtension, Key extends BlockKey<T>> =
  Hooks<T> &
  EnsureReady<T> &
  Input<T, Key> &
  Expected<T, Key>;

export type SingleOrArray<T> = T | T[];
export type SingleOrFunc<T, Args extends any[]> = T | ((...args: Args) => T);

export type GetTestCase<T extends AnyExtension, K extends BlockKey<T>> = (helper: TestHelper) => BlockTestCase<T, K>;
export type TestCaseEntry<T extends AnyExtension, K extends BlockKey<T>> = SingleOrFunc<BlockTestCase<T, K>, Parameters<GetTestCase<T, K>>>;

export type UnitTests<T extends AnyExtension> = { [k in BlockKey<T>]?: SingleOrArray<SingleOrFunc<BlockTestCase<T, k>, Parameters<GetTestCase<T, k>>>> };

type RenderedUI = RenderResult<SvelteComponentDev, typeof import("/Users/parkermalachowsky/MIT/prg-extension-boilerplate/extensions/testing/node_modules/@testing-library/dom/types/queries")>;

export type RuntimeForTest<T extends AnyExtension> = Runtime & {
  forTest: {
    extension: T,
    UIPromise: Promise<RenderedUI>;
  }
}