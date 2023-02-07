import { Extension } from "./Extension";
import { applyAllMixins } from "./ExtensionMixins";
import { openUI } from "./ui";
import Runtime from "$scratch-vm/engine/runtime";
import { BaseExtension, Block, BlockOperation } from "./types";

export type BlockV2<Fn extends BlockOperation> = Omit<Block<BaseExtension, Fn>, "operation">;

export abstract class ExtensionBase {
  runtime: Runtime;

  /**
   * The ID of this extension.
   * NOTE: The `never` type is used to prevent users from defining their own extension ID (which will be filled in through code generation).
   */
  readonly id: string & never;

  /**
   * The name of this extension.
   * NOTE: The `never` type is used to prevent users from re-defining an extension Name (which is already defined through ExtensionMenuDisplayDetails)
   */
  readonly name: string & never;

  /**
   * NOTE: The `never` type is used to prevent users from re-defining the blockIconURI (the insetIconURI from ExtensionMenuDisplayDetails will be encoded and used)
   */
  readonly blockIconURI: never;
}

export class ExtensionV2 extends applyAllMixins(ExtensionBase) { }