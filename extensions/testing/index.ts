import { vmSrc } from "$root/scripts/paths";
import { AllText, BlockDefinitions, CodeGenArgs, Environment, Extension, PopulateCodeGenArgs, ExtensionBlocks, ExtensionMenuDisplayDetails, NonEmptyArray } from "$common";
import Runtime from "$scratch-vm/engine/runtime";
import { describe, jest, test } from '@jest/globals';
import path from "path";

type AnyExtension = Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>;

const mockEnvironment = (): Environment => {
  return {
    runtime: jest.mock<Runtime>(path.join(vmSrc, "engine", "runtime")) as any as Runtime,
    videoFeed: undefined
  }
}

interface ExtensionConstructor<T extends AnyExtension> {
  new(...args: ConstructorParameters<typeof Extension>): T;
}

type Hooks = {
  before?: () => void,
  after?: () => void,
};

type Input<T extends AnyExtension, Key extends keyof T["BlockFunctions"]> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? { input: Parameters<T["BlockFunctions"][Key]> extends { length: 1 } ? Parameters<T["BlockFunctions"][Key]>[0] : Parameters<T["BlockFunctions"][Key]> }
  : {};

type Expected<T extends AnyExtension, Key extends keyof T["BlockFunctions"]> =
  Parameters<T["BlockFunctions"][Key]> extends NonEmptyArray<any>
  ? { input: Parameters<T["BlockFunctions"][Key]> extends { length: 1 } ? Parameters<T["BlockFunctions"][Key]>[0] : Parameters<T["BlockFunctions"][Key]> }
  : {};

type EnsureReady = {
  isReady?: () => boolean;
};

type BlockTestCase<T extends AnyExtension, Key extends keyof T["BlockFunctions"]> =
  Hooks &
  EnsureReady &
  Input<T, Key> &
  Expected<T, Key>;

type UnitTests<T extends AnyExtension> = { [k in keyof T["BlockFunctions"]]: BlockTestCase<T, k> | BlockTestCase<T, k>[] };

const getInstance = <T extends AnyExtension>(extensionClass: ExtensionConstructor<T>): [T, Environment] => {
  const environment = mockEnvironment();
  const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
  const instance = new extensionClass(environment.runtime, args as CodeGenArgs);
  return [instance, environment];
}

export const createTestSuite = <T extends AnyExtension>(
  extensionClass: ExtensionConstructor<T>,
  cases: {
    unitTests: UnitTests<T>,
    integrationTests
  }
) => {
  const { runtime } = mockEnvironment();
  const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
  const instance = new extensionClass(runtime, args as CodeGenArgs);

  describe(extensionClass.name, () => {
    for (const key in cases) {
      if (Array.isArray(cases[key])) {
        const arr: Array<any> = cases[key];
        for (const iterator of arr) {

        }
      }

    }

  });
};