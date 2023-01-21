import { isString } from "$common";

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
