import * as ts from "typescript";

export default class TypeProbe<TValue> {
  public value: TValue;
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

    this.value = this.objects[this.objects.length - 1];
  }

  print() {
    const spacing = "   ";
    for (let index = 0; index < this.keys.length; index++) {
      const key = this.keys[index];
      const isLast = index === this.keys.length - 1;
      console.log(`${spacing.repeat(index)}${key}${isLast ? `: ${this.value}` : ""}`)
    }
  }

  getSerializedDeclaration = () => {
    const typeName = (this as {}).constructor.name;
    const func = "FromSerialization"; // can't seem to get this
    const path = this.keys.join(TypeProbe.PathSeperator);
    return `${typeName}.${func}<${typeof this.value}>(type, "${path}")`;
  }

  findAllProbesForValue<TMatch>(valueToMatch: TMatch): TypeProbe<TMatch>[]  {
    const probes = [];
    for (let index = this.objects.length - 1; index >= 0; index--) {
      const element = this.objects[index];
      const probe = TypeProbe.ProbeTypeForValue(element as ts.Type, valueToMatch);
      if (probe !== undefined) probes.push(probe);
    }
    return probes;
  }

  static FromSerialization<TValueType>(type: ts.Type, serialized: string) {
    return new TypeProbe<TValueType>(type, TypeProbe.PathToKeys(serialized));
  };

  static ProbeTypeForValue<TValue>(type: ts.Type, valueToMatch: TValue): TypeProbe<TValue>[] {
    const paths = [];
    TypeProbe.FindPath(type, valueToMatch, paths);
    return paths.map(path => new TypeProbe(type, TypeProbe.PathToKeys(path)));
  }

  private static PathToKeys = (path: string) => path.split(TypeProbe.PathSeperator);

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