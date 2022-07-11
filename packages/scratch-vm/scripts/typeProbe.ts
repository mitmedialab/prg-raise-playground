import * as ts from "typescript";

export default class TypeProbe {
  private keys: string[];
  private objects: any[];

  constructor(type: ts.Type, keys: string[]) {
    this.keys = keys;

    this.objects = [type];
    for (const key of keys) {
      const previous = this.objects[this.objects.length - 1];
      const current = TypeProbe.IsArray(key) ? TypeProbe.GetArrayElement(previous, key) : previous[key];
      this.objects.push(current);
    }
  }

  print() {
    const spacing = "   ";
    for (let index = 0; index < this.keys.length; index++) {
      console.log(`${spacing.repeat(index)}${this.keys[index]}`)
    }
  }

  findAllProbesForValue(valueToMatch: any): TypeProbe[]  {
    const probes = [];
    for (let index = this.objects.length - 1; index >= 0; index--) {
      const element = this.objects[index];
      const probe = TypeProbe.ProbeTypeForValue(element as ts.Type, valueToMatch);
      if (probe !== undefined) probes.push(probe);
    }
    return probes;
  }

  static ProbeTypeForValue(type: ts.Type, valueToMatch: any): TypeProbe[] {
    const paths = [];
    TypeProbe.FindPath(type, valueToMatch, paths);
    return paths.map(path => new TypeProbe(type, path.split(TypeProbe.PathSeperator)));
  }

  private static ArrayKey = (key: string, index: number): string => `${key}[${index}]`;
  private static IsArray = (key: string) => key.includes("[");
  private static PathSeperator = ".";

  private static GetArrayElement = (obj: any, key: string) => {
    const split = key.split("[");
    const index = parseInt(split[1].replace("]", ""));
    return obj[split[0]][index];
  }

  private static IsProbable = (value) => {
    return !!(value && typeof value === "object");
  };

  private static IsObject = (value) => {
    return !!(TypeProbe.IsProbable(value) && !Array.isArray(value));
  };
  
  private static FindPath = (object: any, valueToMatch: any, paths: string[], keys: string[] = [], cache: any[] = []): void => {
    if (cache.includes(object)) return;
  
    if (TypeProbe.IsProbable(object)) {
      for (const [key, objectValue] of Object.entries(object)) {
  
        if (objectValue === valueToMatch) {
          paths.push([...keys, key].join(TypeProbe.PathSeperator))
          continue;
        };
  
        if (TypeProbe.IsObject(objectValue)) {
          cache.push(object);
          TypeProbe.FindPath(objectValue, valueToMatch, paths, [...keys, key], cache);
        }
  
        if (Array.isArray(objectValue)) {
          cache.push(object);
          for (let index = 0; index < objectValue.length; index++) {
            const element = objectValue[index];
            const elementKey = TypeProbe.ArrayKey(key, index);
            TypeProbe.FindPath(element, valueToMatch, paths, [...keys, elementKey], cache);
          }
        }
      }
    }
  };
}