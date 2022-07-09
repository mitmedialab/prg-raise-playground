import * as ts from "typescript";

const isObject = (value) => {
  return !!(value && typeof value === "object" && !Array.isArray(value));
};

type Level = {
  object: any,
  key: string
}

export const findPathToValueInType = (type: ts.Type, valueToMatch: string) => {
  const path = internalFindPath(type, valueToMatch);
  if (path === null || path === undefined) return undefined;

  const keys = (path as string).split(".");
  const objects: Level[] = [{object: type, key: "<root>"}];

  for (const key of keys) {
    const previous = objects[objects.length - 1];
    if (!key.includes("[")) {
      objects.push({object: previous[key], key});
      continue;
    }

    const split = key.split("[");
    const index = parseInt(split[1].replace("]", ""));
    objects.push({object:previous[split[0]][index], key});
  }

  return objects;
}

export const internalFindPath = (object: any, valueToMatch: string, keys: string[] = [], cache: any[] = []) => {
  if (cache.includes(object)) return null;

  if (isObject(object)) {
    for (const [key, objectValue] of Object.entries(object)) {

      if (objectValue === valueToMatch) {
        return [...keys, key].join(".");
      }

      if (isObject(objectValue)) {
        cache.push(object);
        const child = internalFindPath(objectValue, valueToMatch, [...keys, key], cache);

        if (child !== null) {
          return child;
        }
      }

      if (Array.isArray(objectValue)) {
        cache.push(object);

        let i = 0;
        for (const item of objectValue) {
          const child = internalFindPath(item, valueToMatch, [...keys, `${key}[${i}]`], cache);
          i++;
          if (child !== null) {
            return child;
          } 
        }
      }
    }
  }

  return null;
  /*if (cache.includes(object)) return null;
  if (typeof object !== "object") return null;

  for (const [key, objectValue] of Object.entries(object)) {
    if (objectValue === valueToMatch) return [...keys, key].join(".");

    if (isObject(objectValue)) {
      cache.push(object);
      const child = internalFindPath(objectValue, valueToMatch, [...keys, key], cache);

      if (child !== null) return child;
    }

    if (Array.isArray(objectValue)) {
      cache.push(object);

      for (let index = 0; index < objectValue.length; index++) {
        const item = objectValue[index];
        const child = internalFindPath(item, valueToMatch, [...keys, `${key}[${index}]`], cache);
        if (child !== null) return child;
      }
    }
  }*/
};