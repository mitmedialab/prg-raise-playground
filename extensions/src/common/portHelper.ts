import { BaseExtension, Block, ExtensionBlockMetadata, ExtensionMetadata } from "./types";

type SerializedBlockData = Pick<ExtensionMetadata, "blocks" | "menus">;

export const mockFormatMessage = (args: { id: string, default: string, description: string }): string => "";

type Opcodes<T extends SerializedBlockData> = { [k in keyof T["blocks"]]: T["blocks"][k] extends ExtensionBlockMetadata ? T["blocks"][k]["opcode"] : never }[number];

type Arguments<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['arguments'] : never;
};

type Type<A extends ExtensionMetadata["blocks"], Opcode extends string> = {
  [E in keyof A as A[E] extends { opcode: infer K extends Opcode } ? K : never]: A[E] extends ExtensionBlockMetadata ? A[E]['blockType'] : never;
}

type Extracted<T extends SerializedBlockData> = { [k in Opcodes<T>]: { type: Type<T["blocks"], k>, args: Arguments<T["blocks"], k> } }

export const extractFromGetInfo = <T extends SerializedBlockData>(data: T) => ({
  legacySupport: <TKey extends Opcodes<T>, TBlock>(string: TKey, block: TBlock & { type: Extracted<T>[TKey] }): TBlock => {
    return block;
  },
});

export type ExtractType<T extends SerializedBlockData, TKey extends Opcodes<T>> = {
  type: Extracted<T>[TKey]["type"]
}