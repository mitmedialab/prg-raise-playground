import { ArgumentType, BlockType } from "$common/types/enums";
import { ExtensionMetadata, ExtensionBlockMetadata, ValueOf, TypeByArgumentType, ExtensionMenuItems, ReturnTypeByBlockType, MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters } from "$common/types";
import { ObjValueTuple, TuplifyUnion } from "./TsMagic";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";

/**
 * Types to assist in extracting information from the return type of the old 'getInfo' method
 */
export type Blocks = ExtensionMetadata["blocks"];
export type Block = ExtensionMetadata["blocks"];

export type Arguments<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode; } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['arguments'] : never;
};

export type Types<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode; } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['blockType'] : never;
};

export type Opcodes<T extends ExtensionMetadata> = {
  [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never;
}[number];

export type OpArgs<T extends ExtensionMetadata, K extends Opcodes<T>> = ArgsArray<ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>>;
export type OpArgMenus<T extends ExtensionMetadata, K extends Opcodes<T>> = ArgsToMenusArray<ObjValueTuple<Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>, T>;

export type BlockType<T extends ExtensionMetadata, K extends Opcodes<T>> = Types<T["blocks"], K>[keyof Types<T["blocks"], K>] extends ValueOf<typeof BlockType> ? Types<T["blocks"], K>[keyof Types<T["blocks"], K>] : never;
export type OpReturn<T extends ExtensionMetadata, K extends Opcodes<T>, TBlockType extends BlockType<T, K> = BlockType<T, K>> = ReturnTypeByBlockType<TBlockType> | Promise<ReturnTypeByBlockType<TBlockType>>;

export type ReservedMenuNames<T extends ExtensionMetadata> = ValueOf<{
  [Op in Opcodes<T>]: ValueOf<{
    [Arg in OpArgMenus<T, Op>[number]as Arg["argumentIndex"]]: Arg extends { reservedDynamicMenuName: infer Name extends string; } ? Name : never;
  }>;
}> & string;

export type ArgumentNamesByBlock<T extends ExtensionMetadata> = {
  [K in Opcodes<T>]: TuplifyUnion<keyof Arguments<T["blocks"], K>[keyof Arguments<T["blocks"], K>]>;
};

type ArgsArray<T extends unknown[]> = T extends [] ? [] : T extends [infer H, ...infer R] ? H extends { type: infer X extends ValueOf<typeof ArgumentType>; } ? [TypeByArgumentType<X>, ...ArgsArray<R>] : ArgsArray<R> : T;

type ConditionalHandler<AcceptsReporters extends boolean, ArgumentType extends ValueOf<typeof ArgumentType>> = AcceptsReporters extends true ? { handler: MenuThatAcceptsReporters<TypeByArgumentType<ArgumentType>>["handler"]; } : {};

/**
 * Fields of elements in returned tuple:
 * - argumentIndex: an index value (number) that corresponds to the index of Item within T (see below)
 * - reservedDynamicMenuName: the name of a dynamic menu method
 * - getItems: a function that returns menu items (i.e. a dynamic menu)
 * - handler: an function used to validate the inputs of fields that accept reporters
 */
type ArgsToMenusArray<T extends unknown[], TData extends ExtensionMetadata> = T extends []
  ? []
  // If T is a Variadic Tuple Type, extract the types of the elements before the final element (Rest) and type of final element (Item)
  : T extends [...infer Rest, infer Item]
  // If the final item matches the shape of an argument, extract the types of the menu field (MenuName) and it's argument type (Type)
  ? Item extends { menu: infer MenuName extends keyof TData["menus"], type: infer Type extends ValueOf<typeof ArgumentType> }
  // If the menu (accessed by indexing the 'menus' object with MenuName) is a string value, the menu must be dynamic
  ? TData["menus"][MenuName] extends string
  // Return a tuple where the last element is Item mapped to an object with 'argumentIndex' and 'getOptions' + 'reservedDynamicMenuName' fields (described above)
  ? [
    ...ArgsToMenusArray<Rest, TData>,
    { reservedDynamicMenuName: MenuName, getItems: DynamicMenuThatAcceptsReporters<TypeByArgumentType<Type>>["getItems"], } &
    { argumentIndex: Rest["length"] }
  ]
  // If the menu matches the shape of a verbose menu (i.e. defines 'acceptReporters') extract the value of 'acceptReporters'
  : TData["menus"][MenuName] extends { acceptReporters: infer Accepts extends boolean }
  // If the verbose menu's 'items' field is a string value, it must be a dynamic menu
  ? TData["menus"][MenuName] extends { items: infer DynamicMenuName extends string }
  // Return a tuple where the last element Item is mapped to an object with 'argumentIndex' 'getOptions' + 'reservedDynamicMenuName', and potentially 'handler' fields (described above)
  ? [
    ...ArgsToMenusArray<Rest, TData>,
    { reservedDynamicMenuName: DynamicMenuName, getItems: DynamicMenuThatAcceptsReporters<TypeByArgumentType<Type>>["getItems"], } &
    ConditionalHandler<Accepts, Type> &
    { argumentIndex: Rest["length"] }
  ]
  // If the menu does accept reporters (and by this point, we know the menu is NOT dynamic)
  : Accepts extends true
  // Return a tuple where the last element is Item mapped to an object with 'argumentIndex' and 'handler' fields (described above)
  ? [...ArgsToMenusArray<Rest, TData>, ConditionalHandler<Accepts, Type> & { argumentIndex: Rest["length"] }]
  // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
  : ArgsToMenusArray<Rest, TData>
  // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
  : ArgsToMenusArray<Rest, TData>
  // Exclude Item from returned (e.g. argument didn't have a menu, or menu was static and didn't accept reporters)
  : ArgsToMenusArray<Rest, TData>
  // <Base case> (reached when T doesn't match a Variadic Tuple Type)
  : T;

export type LegacyMethods<T extends ExtensionMetadata> = {
  [k in Opcodes<T>]: (...args: (OpArgs<T, k> | [...OpArgs<T, k>, BlockUtility])) => OpReturn<T, k>;
};

export type Menus = ExtensionMetadata["menus"];
export type Items = ExtensionMenuItems["items"];

