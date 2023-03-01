import { TypedClassDecorator, TypedMethodDecorator } from "../..";
import { ExtensionCommon } from "../../../ExtensionCommon";
import { BaseExtension, BlockOperation, DefineBlock, ExtensionMenuDisplayDetails, ExtensionMetadata } from "$common/types";
import { Arguments, BlockType, LegacyMethods, OpArgMenus, OpReturn, Opcodes, ReservedMenuNames } from "./LegacyProbe";
import { TupleToObject, TuplifyUnion } from "./TsMagic";
import { DecoratedExtension } from "$common/extension/DecoratedExtension";
import { Extension } from "$common/extension/GenericExtension";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { BlockMetadata } from "$common/extension";

export type BlockEntry = BlockMetadata<BlockOperation>;
export type BlockMap = Map<string, BlockEntry>;

export type LegacyExtension<TData extends ExtensionMetadata, TStrict extends boolean> = ExtensionCommon
  & (
    (DecoratedExtension & (TStrict extends true ? LegacyMethods<TData> : {})) |
    Extension<ExtensionMenuDisplayDetails, (TStrict extends true ? LegacyMethods<TData> : {})> & { [k in Opcodes<TData>]?: void }
  )
  & { [k in ReservedMenuNames<TData>]?: void };

export type LegacyExtensionDecorator<TExtension extends LegacyExtension<ExtensionMetadata, boolean>> = TypedClassDecorator<TExtension, ConstructorParameters<typeof ExtensionCommon>>;

export type ArgumentMethods<TData extends ExtensionMetadata, K extends keyof LegacyMethods<TData>> = {
  /**
   * An object containing the required methods for each argument of a legacy block. 
   * A method will be required for an argument of a legacy block if:
   * - It accepts reporters (which will require implementing a `handler` function)
   * - it uses a dynamic menu (which will require implementing a `getItems` function)
   * 
   * The keys of this object refer to the argument index of the arguments that require methods.
   * In other words, if the first argument (aka index 0) of a legacy block accepts reporters and thus requires a `handler` method, 
   * then this object will look like the following:
   * ```ts
   * argumentMethods: {
   *    0: { handler: (x: any) => {...} }
   * }
   * ```
   */
  argumentMethods: TupleToObject<OpArgMenus<TData, K>, "argumentIndex", "reservedDynamicMenuName">
}

export type ObjectOrGetter<T, This extends ExtensionCommon> = ((this: This, self: This) => T) | T;

export type BlockDefinitions<TInfo extends ExtensionMetadata, TExtension extends ExtensionCommon> = {
  [k in keyof LegacyMethods<TInfo>]: <TReturn extends OpReturn<TInfo, k>>(inputs: ObjectOrGetter<{
    /**
     * The underlying operation of your block
     * @param this The `this` keyword will automatically be bound to your extension.
     * @param args The args this blocks take (spread). The very last argument will be a BlockUtility.
     * @returns 
     */
    operation: (this: TExtension, ...args: [...Parameters<LegacyMethods<TInfo>[k]>, BlockUtility]) => TReturn,
  } & (OpArgMenus<TInfo, k> extends [] ? {} : ArgumentMethods<TInfo, k>), TExtension>
  ) => DefineBlock<BaseExtension, (...args: Parameters<LegacyMethods<TInfo>[k]>) => TReturn> & { type: BlockType<TInfo, k> }
};

export type BlockDecorators<TInfo extends ExtensionMetadata> = {
  [k in keyof LegacyMethods<TInfo>]:
  <This extends DecoratedExtension, Args extends Parameters<LegacyMethods<TInfo>[k]>, Return extends any>(
    ...args: OpArgMenus<TInfo, k> extends [] ? [] : [ArgumentMethods<TInfo, k> | ((self: This) => ArgumentMethods<TInfo, k>)]
  ) => TypedMethodDecorator<This, Args, Return, (...args: Args) => Return>
}

export type LegacySupport<TInfo extends ExtensionMetadata, TStrict extends boolean> = {
  /**
   * The for
   * @returns
   */
  for: <TExtension extends LegacyExtension<TInfo, TStrict>>() => {
    /**
     * The decorator
     */
    legacyExtension(): TypedClassDecorator<TExtension, ConstructorParameters<typeof ExtensionCommon>>;
    /**
     *
     */
    legacyDefinition: BlockDefinitions<TInfo, TExtension>;
    /**
     *
     */
    legacyBlock: BlockDecorators<TInfo>;
    /**
     *
     */
    ReservedNames: {
      Menus: TuplifyUnion<ReservedMenuNames<TInfo>>;
      Blocks: TuplifyUnion<Opcodes<TInfo>>;
      ArgumentNamesByBlock: {
        [K in Opcodes<TInfo>]: TuplifyUnion<keyof Arguments<TInfo["blocks"], K>[keyof Arguments<TInfo["blocks"], K>]>;
      };
    };
  };
};
