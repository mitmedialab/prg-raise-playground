type FetchParams = {
  request: Parameters<typeof fetch>[0],
  options: Parameters<typeof fetch>[1]
}

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
};

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