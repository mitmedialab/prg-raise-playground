import { AbstractConstructor, applyAllMixins } from "./mixins";
import Runtime from "$scratch-vm/engine/runtime";
import { BaseExtension, Block, BlockOperation, Environment } from "../types";

export type BlockV2<Fn extends BlockOperation> = Omit<Block<BaseExtension, Fn>, "operation">;

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
    super(runtime, name, id, blockIconURI);
    extensionsMap.set(id, this);
  }
}

export type ExtensionV2Constructor = AbstractConstructor<ExtensionV2>;