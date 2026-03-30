/**
 * Equivalent to `Promise.withResolvers`, which is not yet widely available.
 * @todo Remove this function when `Promise.withResolvers` is widely available, likely around September 2026.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers}
 * @returns An object containing the promise along with its resolve and reject functions.
 */
export function PromiseWithResolvers<T>(): {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: unknown) => void
} {
  let resolve
  let reject
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  // The `as unknown as` casts are necessary because TypeScript doesn't
  // know that the Promise executor is called synchronously.
  return {
    promise,
    resolve: resolve as unknown as (value: T | PromiseLike<T>) => void,
    reject: reject as unknown as (reason?: unknown) => void,
  }
}
