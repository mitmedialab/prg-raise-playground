import { ExtensionBase } from "$v2";
import customArgumentSupport from "./customArguments";
import customSaveData, { SaveDataHandler } from "./customSaveData";
import scratchInfo, { getArgumentType } from "./scratchInfo";
import uiSupport from "./ui";
import legacySupport from "./legacySupport";

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type TypedConstructor<T> = new (...args: any[]) => T;
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

export { customArgumentSupport, customSaveData, SaveDataHandler, scratchInfo, getArgumentType, uiSupport, legacySupport };