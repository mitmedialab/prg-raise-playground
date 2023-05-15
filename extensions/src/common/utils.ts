import { MenuItem, Primitive, RGBObject } from "./types"

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

/**
 * A utility to wait a certain amount of milliseconds in an async function.
 * @param timeMs 
 * @returns 
 */
export async function untilTimePassed(timeMs: number) {
  let timeout: NodeJS.Timeout;
  return await new Promise<void>(
    (resolve) =>
      timeout = setTimeout(
        () => {
          clearTimeout(timeout);
          resolve();
        },
        timeMs)
  );
}

export async function untilObject<T>(getter: () => T, delay: number = 100): Promise<T> {
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

export async function untilCondition(condition: () => boolean, delay: number = 100): Promise<void> {
  let timeout: NodeJS.Timeout;
  while (!condition()) {
    await new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
  }
  clearTimeout(timeout);
};

export async function untilReady<T extends { ready: boolean }>(obj: T, delay: number = 100): Promise<void> {
  let timeout: NodeJS.Timeout;
  while (!obj.ready) {
    await new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
  }
  clearTimeout(timeout);
};

export const isString = (query: any): query is string => typeof query === 'string' || query instanceof String;

export const isFunction = (query: any): query is (...args: any[]) => any =>
  Object.prototype.toString.call(query) === "[object Function]"
  || "function" === typeof query
  || query instanceof Function;

export const isPrimitive = (query: any): query is Primitive => query !== Object(query);

export const splitOnCapitals = (query: string) => query.split(/(?=[A-Z])/);

/**
 * A type safe utility function for copy values from one object to another
 * @param param0 object containing the target to copy values to and the source of the values to copy
 */
export const copyTo = <TTarget extends object, TSource extends { [k in keyof TTarget]?: TTarget[k] }>({ target, source }: { target: TTarget, source: TSource }) => {
  for (const key in source) {
    if (!(key in target)) continue;
    // @ts-ignore -- the types of the function should ensure this is valid TS
    target[key] = source[key]
  }
}

export const identity = (x: any) => x;

export const loadExternalScript = (url: string, onLoad: () => void, onError?: () => void) => {
  const script = document.createElement('script');

  script.onload = onLoad;

  script.onerror = onError ?? (() => {
    throw new Error(`Error loading endpoint: ${url}`)
  });

  script.src = url;
  script.async = true;

  document.body.appendChild(script);
}

/**
 * 
 * @param url 
 * @returns 
 */
export const untilExternalScriptLoaded = async (url: string): Promise<void> => {
  const scriptLoaded = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = url;
    document.body.appendChild(script);
  });
  await scriptLoaded;
  return;
}

/**
 * 
 * @param url 
 * @param globalVariableName 
 * @returns 
 */
export const untilExternalGlobalVariableLoaded = async <T>(url: string, globalVariableName: string): Promise<T> => {
  if (window[globalVariableName]) return window[globalVariableName];
  await untilExternalScriptLoaded(url);
  return window[globalVariableName];
}

/**
 * Utilize javascript's "call" method (on Function.prototype) in a typesafe manner
 * @param fn 
 * @param _this 
 * @param args 
 * @returns 
 */
export const typesafeCall = <Args extends any[], Return, This, Fn extends (this: This, ...args: Args) => Return>(fn: Fn, _this: This, ...args: Args) => fn.call(_this, ...args) as Return;

export const set = <T extends object, K extends keyof T>(container: T, key: K, value: T[K]) => {
  container[key] = value;
  return container;
}

export const assertSameLength = (...collections: any[][]) => {
  const { size } = collections.reduce((set, { length }) => set.add(length), new Set<number>());
  if (size !== 1) throw new Error("Zip failed because collections weren't equal length");
}

/**
 * Convert a Scratch decimal color to a hex string, #RRGGBB.
 * @param {number} decimal RGB color as a decimal.
 * @return {string} RGB color as #RRGGBB hex string.
 */
const decimalToHex = (decimal: number) => {
  if (decimal < 0) {
    decimal += 0xFFFFFF + 1;
  }
  let hex = Number(decimal).toString(16);
  hex = `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
  return hex;
}

/**
 * Convert an RGB color object to a Scratch decimal color.
 * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
 * @return {!number} Number representing the color.
 */
function rgbToDecimal(rgb: RGBObject) {
  return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
}

/**
 * Convert an RGB color object to a hex color.
 * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
 * @return {!string} Hex representation of the color.
 */
export const rgbToHex = (rgb: RGBObject) => {
  return decimalToHex(rgbToDecimal(rgb));
}

/**
 * Hide all elements in the HTML document that have a given class
 * @param className 
 */
export const hideElementsWithClass = (className: string) => {
  for (const element of document.getElementsByClassName(className))
    element.setAttribute("style", "display: none;");
}