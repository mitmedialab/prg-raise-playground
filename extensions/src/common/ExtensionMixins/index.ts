import { ExtensionBase } from "$common/ExtensionV2";
import customArgumentSupport from "./customArguments";
import customSaveData from "./customSaveData";
import scratchInfo from "./scratchInfo";
import uiSupport from "./ui";

export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type ExtensionConstructor = AbstractConstructor<ExtensionBase>;

export const applyAllMixins = (base: ExtensionConstructor) =>
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
