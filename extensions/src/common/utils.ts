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

export const isString = (query: any) => typeof query === 'string' || query instanceof String;

export const isFunction = (query: any) =>
  Object.prototype.toString.call(query) === "[object Function]"
  || "function" === typeof query
  || query instanceof Function;

export const isPrimitive = (query: any) => query !== Object(query);

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