import { MenuItem, Primitive, RGBObject, BlockUtilityWithID } from "./types";

type FetchParams = {
  request: Parameters<typeof fetch>[0],
  options: Parameters<typeof fetch>[1]
}

export const getValueFromMenuItem = <T>(item: MenuItem<T>) => typeof item === "object" ? (item as { value: T }).value : item;

export const getTextFromMenuItem = <T>(item: MenuItem<T>) => typeof item === "object" ? (item as { text: string }).text : item;

export async function fetchWithTimeout(
  resource: FetchParams["request"],
  options: FetchParams["options"] & { timeoutMs: number }
) {
  const { timeoutMs: timeout } = options;

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

export const decimalToRgb = (decimal: number) => {
  const a = (decimal >> 24) & 0xFF;
  const r = (decimal >> 16) & 0xFF;
  const g = (decimal >> 8) & 0xFF;
  const b = decimal & 0xFF;
  return { r: r, g: g, b: b, a: a > 0 ? a : 255 } satisfies RGBObject & { a: number };
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
export const rgbToHex = (rgb: RGBObject) => decimalToHex(rgbToDecimal(rgb));

export const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null satisfies RGBObject;
}

/**
 * Keep a number between two limits, wrapping "extra" into the range.
 * e.g., wrapClamp(7, 1, 5) == 2
 * wrapClamp(0, 1, 5) == 5
 * wrapClamp(-11, -10, 6) == 6, etc.
 * @param {!number} n Number to wrap.
 * @param {!number} min Minimum limit.
 * @param {!number} max Maximum limit.
 * @return {!number} Value of n wrapped between min and max.
 */
export const wrapClamp = (n, min, max) => {
  const range = (max - min) + 1;
  return n - (Math.floor((n - min) / range) * range);
}

/**
 * Create an event (within extension framework code, i.e. `extensions/src`) that can be subscribed to at _bundling time_. 
 * 
 * As a mental short-hand, you can think of this as a macro-esque mechanism.
 * 
 * @see macro-link Macros
 * 
 * @description
 * This **_works_** as it tries to create an object in the global scope, which is interacted with both from bundling-related code, 
 * as well as the extension framework code 
 * (as long as that code is executed at the _top-level_, and the runtime is NodeJS, not the browser). 
 * 
 * The reason why it's important the framework-based code is _top-level_ is because the framework sourcecode will actually be evaluated at _bundle time_, 
 * meaning all _top-level_ expressions will be executed. 
 * 
 * This allows for the desired event mechanism: 
 * > 1. Bundling-related code associates callbacks with a certain event (an entry to an object in global scope), 
 * > 2. Framework code tries to fire the callbacks of a given event (when it is executed after step 1)
 * 
 * @see top-level Top-level Code

 * **NOTE:** This function returns a non-null value only in NodeJS environments.
 * @param identifier 
 * @returns 
 */
export const tryCreateBundleTimeEvent = <Payload>(identifier: string) => {
  const environment = typeof window === 'undefined' ? "node" : "browser";

  if (environment !== "node") return null;

  const key = `Bundle Time Event: ${identifier}`;

  type Unregister = () => void;
  type Callback = (details: Payload, removeSelf: Unregister) => void;
  type Register = (callback: Callback) => Unregister;
  type Callbacks = Record<symbol, Callback>;

  const get = () => {
    global[key] ??= {};
    return global[key] as Callbacks;
  }

  const registerCallback: Register = (callback) => {
    const id = Symbol(key);
    get()[id] = callback;
    return () => delete get()?.[id];
  };

  type Fire = (details: Payload) => void;

  const fire: Fire = (details) => {
    const callbackIDs = Object.getOwnPropertySymbols(get());
    for (const id of callbackIDs) get()[id]?.(details, () => delete get()?.[id]);
  };

  return { registerCallback, fire };
}

/**
 * from: https://www.geeksforgeeks.org/how-to-create-a-guid-uuid-in-javascript/
 * @returns 
 */
export const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  .replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

export const checkContext = (blockInstance: BlockUtilityWithID, target: string) => {
  const topBlock = blockInstance.thread.topBlock;
  const blocks = blockInstance.thread.blockContainer._blocks;
  const topOpcode = blocks[topBlock].opcode;
  const methodName = topOpcode.split("_")[1];
  if (methodName == target) {
    return true;
  }
  return false;
}
