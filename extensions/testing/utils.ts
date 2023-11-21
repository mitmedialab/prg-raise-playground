import { ExtensionConstructorParams, isString } from "$common";
import type Runtime from "$scratch-vm/engine/runtime";
import { vmSrc } from "$root/scripts/paths";
import path from "path";

export const executeAndSquashWarnings = <T extends (...args: any[]) => any>(operation: T, msgsToIgnore?: string[]): ReturnType<T> => {
  const { warn } = console;
  console.warn = msgsToIgnore
    ? (...args: Parameters<typeof warn>) => {
      const [message] = args;
      if (isString(message) && msgsToIgnore.some(identifier => (message as string).includes(identifier))) return;
      warn(...args)
    }
    : () => { };
  const result = operation();
  console.warn = warn;
  return result;
};

export const getEngineFile = (name: string) => path.join(vmSrc, "engine", name);

const stubbed: Map<object, Record<keyof any, any>> = new Map();

export const stub = <const TContainer extends object, const TKey extends keyof TContainer>(
  container: TContainer,
  key: TKey,
  replacement: TContainer[TKey]
) => {
  const current = container[key];
  stubbed.has(container)
    ? stubbed.get(container)[key] = current
    : stubbed.set(container, { [key]: current });
  container[key] = replacement;
}

export const restore = <const TContainer extends object, const TKey extends keyof TContainer>(
  container: TContainer,
  key: TKey,
) => {
  container[key] = stubbed.get(container)[key];
}

export const extensionConstructorArgs = (
  runtime: Runtime,
  testName = "Unamed Test",
  testID = "Default Test ID",
  blockIconURI: string = null,
  blockColor = "#000",
  menuColor = "#111",
  menuSelectColor = "#222"
): ExtensionConstructorParams =>
  [runtime, testName, testID, blockIconURI, blockColor, menuColor, menuSelectColor];