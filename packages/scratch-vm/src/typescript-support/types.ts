import type Runtime from '../engine/runtime';
import { ArgumentType, BlockType } from './enums';
import type ExtensionBase from './ExtensionBase';

export type Environment = {
  runtime: Runtime
}

export type Extension<T> = ExtensionBase<T> & { [k in keyof T]: T[k] };

export type Operation = (...args: any) => any;

export type MenuItem<T> = T | {
  value: T;
  text: string;
};

export type Argument<T> = {
  type: ArgumentType;
  defaultValue?: T;
  options?: MenuItem<T>[];
}

export type ToArguments<T extends [...any[]]> =
  T extends [infer Head, ...infer Tail]
  ? [Argument<Head>, ...ToArguments<Tail>]
  : [];

export type BlockInfo<T extends Operation> = {
  type: BlockType;
  operation: (...params: Parameters<T>) => ReturnType<T>;
  arguments: ToArguments<Parameters<T>>;
  text: (...params: Parameters<T>) => string;
}

export type Block<T extends Operation> = (self: ExtensionBase<T>) => BlockInfo<T>;

export type Output<T extends Operation> = ReturnType<T>;  