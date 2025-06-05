export type ValueOf<ObjectType> = ObjectType[keyof ObjectType];

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? readonly [...UnionToTuple<Exclude<T, W>>, W]
  : readonly [];

export type KeysWithValuesOfType<T, V> = keyof { [P in keyof T as T[P] extends V ? P : never]: P };

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
export type UniqueKey<Base, T extends Base> = { [k in keyof T]: k extends keyof Base ? never : k }[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

export type MethodNames<T> = { [k in keyof T]: T[k] extends (...args: any) => any ? k : never }[keyof T];
export type Methods<T> = { [k in MethodNames<T>]: T[k] };

export type ValidKey<T> = { [k in keyof T]: T[k] extends never ? never : k }[keyof T];
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type Primitive<IncludeSymbol extends boolean = false> = IncludeSymbol extends true
  ? bigint | boolean | null | number | string | undefined | symbol
  : bigint | boolean | null | number | string | undefined;

export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
export type NonAbstractConstructor<T = any> = new (...args: any[]) => T;

export type ExlcudeFirst<F> = F extends [any, ...infer R] ? R : never;

export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
  ? T extends infer O
  ? { [K in keyof O]: ExpandRecursively<O[K]> }
  : never
  : T;

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never
  }[keyof T]
}