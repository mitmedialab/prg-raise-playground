/** WORK IN PROGRESS */
import { Extension } from "$common/extension/GenericExtension";
import { BaseGenericExtension } from ".";
import { Language } from "../enums";
import { ValueOf } from "../utils";
import { ScratchArgument, VerboseArgument } from "./arguments";
import { BlockOperation, Block } from "./blocks";

type ArgsTextCommon = {
  options?: (string)[]
}

type ArgsText<T> = T extends ScratchArgument<string> | VerboseArgument<string>
  ? ({
    defaultValue?: string,
  } & ArgsTextCommon)
  : ArgsTextCommon;

type ToArgumentsText<T extends any[]> =
  T extends [infer Head, ...infer Tail]
  ? [ArgsText<Head>, ...ToArgumentsText<Tail>]
  : [];


type ExtractTextFromBlock<TOp extends BlockOperation, TBlock extends Block<BaseGenericExtension, TOp>> =
  TBlock["args"] extends never
  ? TBlock["arg"] extends never
  ? string | { blockText: TBlock["text"] }
  : {
    blockText: TBlock["text"],
    argsText?: ArgsText<TBlock["arg"]>,
  }
  : TBlock["text"] extends (...args: [any]) => any
  ? {
    blockText: TBlock["text"],
    argsText?: ToArgumentsText<TBlock["args"]>,
  }
  : never // shouldn't happen

export type AllText<T extends Extension<any, any>> = {
  [k in keyof T["BlockFunctions"]]: ExtractTextFromBlock<T["BlockFunctions"][k], Block<BaseGenericExtension, T["BlockFunctions"][k]>>
};

export type Translations<T extends Extension<any, any>> = Partial<{ [k in ValueOf<typeof Language>]: AllText<T> | undefined }>;