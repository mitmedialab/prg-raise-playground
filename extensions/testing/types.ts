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

type TestHelper = {
  expect: typeof expect,
  fireEvent: typeof fireEvent,
  updateInputValue: (input: HTMLInputElement, value: string) => Promise<boolean>,
}

export type Hooks<T extends AnyExtension> = {
  before?: (extension: T) => void | Promise<void>,
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

export type UnitTests<T extends AnyExtension> = { [k in BlockKey<T>]?: BlockTestCase<T, k> | BlockTestCase<T, k>[] };

type RenderedUI = RenderResult<SvelteComponentDev, typeof import("/Users/parkermalachowsky/MIT/prg-extension-boilerplate/extensions/testing/node_modules/@testing-library/dom/types/queries")>;

export type RuntimeForTest<T extends AnyExtension> = Runtime & {
  forTest: {
    extension: T,
    UIPromise: Promise<RenderedUI>;
  }
}