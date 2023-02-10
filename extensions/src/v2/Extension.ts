import { AbstractConstructor, applyAllMixins } from "$v2/index";
import Runtime from "$scratch-vm/engine/runtime";
import { BaseExtension, Block, BlockOperation, Environment } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";

export type BlockV2<Fn extends BlockOperation> = Parameters<Fn> extends [...infer R extends any[], BlockUtility]
  ? Omit<Block<BaseExtension, (...args: R) => ReturnType<Fn>>, "operation">
  : Omit<Block<BaseExtension, Fn>, "operation">;

export type CodeGenArgs = {
  name: never,
  id: never,
  blockIconURI: never,
}

const extensionsMap = new Map<string, ExtensionV2>();

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

export abstract class ExtensionV2 extends applyAllMixins(ExtensionBase) {
  abstract init(env: Environment);

  constructor(runtime: never, codeGenArgs?: CodeGenArgs) {
    const { name, id, blockIconURI } = codeGenArgs;
    //super(runtime, name, id, blockIconURI);
    super(runtime, "Super Simple Typescript Extension!", "simpleprg95grpexample", undefined)
    extensionsMap.set(id, this);
  }
}

export type ExtensionV2Constructor = AbstractConstructor<ExtensionV2>;