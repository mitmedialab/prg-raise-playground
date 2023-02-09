import { ExtensionBase } from "$common/v2/Extension";
import customArgumentSupport from "./customArguments";
import customSaveData from "./customSaveData";
import legacySupport from "./legacySupport";
import scratchInfo from "./scratchInfo";
import uiSupport from "./ui";

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
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
