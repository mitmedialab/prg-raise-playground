import fs from "fs";
import path from "path";
import type { ExtensionMenuDisplayDetails, PopulateCodeGenArgs } from "$common";
import rollup, { type Plugin } from "rollup";
import Transpiler, { TranspileEvent } from './typeProbing/Transpiler';
import { debug } from "./utils/debug";
import { getBlockIconURI } from "./utils/URIs";
import { populateMenuForExtensions } from "./extensionsMenu";

export const transpileExtensions = (options: { entry: string, onSuccess: TranspileEvent, onError: TranspileEvent }): Plugin => {
  let ts: Transpiler;
  const { entry, onSuccess, onError } = options;
  return {
    name: 'transpile-extension-typescript',
    buildStart() { ts ??= Transpiler.Make([entry], onSuccess, onError) },
    buildEnd() { if (this.meta.watchMode !== true) ts?.close(); },
  }
}

export const fillInCodeGenArgs = (options: { id: string, dir: string, menuDetails: ExtensionMenuDisplayDetails }) => {
  const { id, dir, menuDetails } = options;
  const { name } = menuDetails;
  const blockIconURI = getBlockIconURI(menuDetails, dir);
  return {
    name: 'fill-in-code-gen-args-for-extension',
    transform: {
      order: 'post',
      handler: (code: string, file: string) => {
        const codeGenArgs: PopulateCodeGenArgs = { id, name, blockIconURI };
        code = code.replace("= codeGenArgs", `= /* codeGenArgs */ ${JSON.stringify(codeGenArgs)}`);
        debug(code, file, true);
        return { code, map: null }
      }
    }
  };
}

export const createExtensionMenuAssets = () => {
  //populateMenuForExtensions();
}