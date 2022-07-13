import ts = require("typescript");
import path = require("path");
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";
import TypeProbe from "./TypeProbe";

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
  // need to use multiple paths
  const getPath = (index: number) => `symbol.declarations[0].nextContainer.members[${index}].type.literal.text`;
  const getValue = (index: number) => TypeProbe.FromSerialization<string>(type, getPath(index)).value;
  return {
    title: getValue(0),
    description: getValue(1),
    iconURL: getValue(2),
    insetIconURL: getValue(3),
  }
}
