import type Runtime from '../engine/runtime';
import { ArgumentType, BlockType } from './enums';
import type { Extension } from './Extension';
import type BlockUtility from '../engine/block-utility';


export type Environment = {
  runtime: Runtime
}

export type Operation = (...args: any) => any;

export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type Argument<T> = {
  type: ArgumentType;
  defaultValue?: T | undefined;
  options?: MenuItem<T>[] | undefined;
}

export type ToArguments<T extends [...any[]]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

type ParamsAndUtility<T extends Operation> = [...Parameters<T>, BlockUtility];

export type BlockInfo<T extends Operation> = {
  type: BlockType;
  operation: (...params: ParamsAndUtility<T>) => ReturnType<T>;
  arguments: ToArguments<Parameters<T>>;
  text: (...params: Parameters<T>) => string;
}

export type Block<T extends Operation> = (self: Extension<T>) => BlockInfo<T>;

export type Implementation<T extends Operation> = ReturnType<T>;
export type Implements<T extends Block<any>> = T;

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];