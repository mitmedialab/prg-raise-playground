import ts = require("typescript");
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import TypeProbe from "./TypeProbe";
import { cachedPathsToMenuDetails } from "./extensionArchetypes";

export type DisplayDetailsRetrievalPaths = Record<keyof ExtensionMenuDisplayDetails, string[]>;

export const retrieveExtensionDetails = (program: ts.Program): Record<string, ExtensionMenuDisplayDetails> => {
  const details: Record<string, ExtensionMenuDisplayDetails> = {}; 

  const typeChecker = program.getTypeChecker();
  const sources = program.getSourceFiles();
  const roots = program.getRootFileNames();
  const rootSources = sources.filter(source => roots.includes(source.fileName));

  for (const root of rootSources) {
    ts.forEachChild(root, node => {
      const type = typeChecker.getTypeAtLocation(node);
      
      if (isExtension(type)) {
        const dirName = path.basename(path.dirname(root.fileName));
        details[dirName] = getMenuDisplayDetails(type);
      }
    });
  }

  return details;
}

export const isExtension = (type: ts.Type) => {
  const baseTypes = type.getBaseTypes();
  return baseTypes?.some(t => t.symbol.name === "Extension") ?? false;
}

const getMenuDisplayDetails = (type: ts.Type): ExtensionMenuDisplayDetails => {
  const baseExtensionType = type.getBaseTypes()?.find(t => t.symbol.name === "Extension");
  const paths = cachedPathsToMenuDetails;

  return {
    title: TypeProbe.FromSerialization<string>(baseExtensionType, paths.title[0]).value,
    description: TypeProbe.FromSerialization<string>(baseExtensionType, paths.description[0]).value,
    iconURL: TypeProbe.FromSerialization<string>(baseExtensionType, paths.iconURL[0]).value,
    insetIconURL: TypeProbe.FromSerialization<string>(baseExtensionType, paths.insetIconURL[0]).value,
  }
}
