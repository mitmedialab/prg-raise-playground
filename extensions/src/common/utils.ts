import { Extension } from "./Extension";
import { MenuItem } from "./types"

type FetchParams = {
  request: Parameters<typeof fetch>[0],
  options: Parameters<typeof fetch>[1]
}

export const getValueFromMenuItem = <T>(item: MenuItem<T>) => typeof item === "object" ? (item as { value: T }).value : item;

export const getTextFromMenuItem = <T>(item: MenuItem<T>) => typeof item === "object" ? (item as { text: string }).text : item;

export async function fetchWithTimeout(
  resource: FetchParams["request"],
  options: FetchParams["options"] & { timeout: number }
) {
  const { timeout } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });

  clearTimeout(id);

  return response;
}

export async function waitForObject<T>(getter: () => T, delay: number = 100): Promise<T> {
  let timeout: NodeJS.Timeout;
  let value: T = getter();
  while (!value) {
    await new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
    value = getter();
  }
  clearTimeout(timeout);
  return value;
}

export async function waitForCondition(condition: () => boolean, delay: number = 100): Promise<void> {
  let timeout: NodeJS.Timeout;
  while (!condition()) {
    await new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
  }
  clearTimeout(timeout);
};

export const isString = (query: any) => (query) => typeof query === 'string' || query instanceof String;

export const isFunction = (query: any) =>
  Object.prototype.toString.call(query) === "[object Function]"
  || "function" === typeof query
  || query instanceof Function;

export const splitOnCapitals = (query: string) => query.split(/(?=[A-Z])/);

/**
 * Async version of the `array.some()` method.
 * Allows for checking that an async predicate resolves to `true` for at least one entry in the provided array 
 * (and if so, it early returns `true` without evaluating any other entries).
 * If no predicates resolve to `true`, then return `false`
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 * @param arr array of elements (that will be indivuadlly passed to the `predicate` function)
 * @param predicate async function that is incrementally invoked with entries of the array `arr`
 * @returns `true` the first time the `predicate` resolves to true. `false` if no entries cause the `predicate` to resolve to `true`.
 */
export const asyncSome = async <T>(arr: T[], predicate: (item: T) => Promise<boolean>) => {
  for (const item of arr) {
    if (await predicate(item)) return true;
  }
  return false;
};