import Runtime from "$scratch-vm/engine/runtime";
import { BaseExtension, Block, BlockOperation, Environment } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { customArgumentSupport, customSaveData, scratchInfo, uiSupport } from "./mixins/index";

export type BlockV2<Fn extends BlockOperation> = Parameters<Fn> extends [...infer R extends any[], BlockUtility]
  ? Omit<Block<BaseExtension, (...args: R) => ReturnType<Fn>>, "operation">
  : Omit<Block<BaseExtension, Fn>, "operation">;

export type CodeGenArgs = {
  name: never,
  id: never,
  blockIconURI: never,
}

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type TypedConstructor<T> = new (...args: any[]) => T;
export type ExtensionBaseConstructor = AbstractConstructor<ExtensionBase>;

const applyAllMixins = (base: ExtensionBaseConstructor) =>
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

export abstract class ExtensionBase {
  /**
   * 
   * @param runtime The 'runtime' connected to the scratch-vm that enables your extension to interact with the scratch workspace
   * @param name The name of this extension.
   * @param id The ID of this extension.
   * @param blockIconURI 
   */
  constructor(readonly runtime: Runtime, readonly name: string, readonly id: string, readonly blockIconURI: string) { }
}

export const extensionsMap = new Map<string, ExtensionV2>();

export abstract class ExtensionV2 extends applyAllMixins(ExtensionBase) {
  abstract init(env: Environment);

  constructor(runtime: never, codeGenArgs?: CodeGenArgs) {
    //const { name, id, blockIconURI } = codeGenArgs;
    //super(runtime, name, id, blockIconURI);
    const id = "simpleprg95grpexample";
    super(runtime, "Super Simple Typescript Extension!", "simpleprg95grpexample", undefined)
    extensionsMap.set(id, this);
  }
}

export type ExtensionV2Constructor = AbstractConstructor<ExtensionV2>;