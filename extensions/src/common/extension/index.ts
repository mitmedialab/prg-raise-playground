import type BlockUtility from "$scratch-vm/engine/block-utility";
import customSaveData from "$common/extension/mixins/customSaveData";
import scratchInfo from "$common/extension/mixins/scratchInfo";
import customArgumentSupport from "$common/extension/mixins/customArguments";
import uiSupport from "$common/extension/mixins/ui";
import { BlockOperation, Block, BaseExtension } from "$common/types";
import { ExtensionBase } from "./ExtensionBase";

export type BlockMetadata<Fn extends BlockOperation> = Parameters<Fn> extends [...infer R extends any[], BlockUtility]
  ? Omit<Block<BaseExtension, (...args: R) => ReturnType<Fn>>, "operation">
  : Omit<Block<BaseExtension, Fn>, "operation">;

export type CodeGenArgs = {
  name: never,
  id: never,
  blockIconURI: never,
}

type ExlcudeFirst<F> = F extends [any, ...infer R] ? R : never;
export type CodeGenParams = ExlcudeFirst<ConstructorParameters<typeof ExtensionBase>>;

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type NonAbstractConstructor<T> = new (...args: any[]) => T;
export type ExtensionBaseConstructor = AbstractConstructor<ExtensionBase>;

export const applyAllMixins = (base: ExtensionBaseConstructor) =>
  scratchInfo(
    customSaveData(
      customArgumentSupport(
        uiSupport(
          (
            base
          )
        )
      )
    )
  );

export const getAlternativeOpcodeName = (opcode: string) => `__block_${opcode}`;