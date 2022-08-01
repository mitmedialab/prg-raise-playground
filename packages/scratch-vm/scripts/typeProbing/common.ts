import ts = require("typescript");
import path = require("path");
import { ExtensionMenuDisplayDetails, KeysWithValsOfType } from "../../src/typescript-support/types";

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
  //@ts-ignore
  const pathToMembers : any[] = type.getBaseTypes()[0].resolvedTypeArguments[0].symbol.declarations[0].members;

  let res = {};
  // type string_keys = KeysWithValsOfType<ExtensionMenuDisplayDetails,string>;
  // type boolean_keys = KeysWithValsOfType<ExtensionMenuDisplayDetails,boolean>;
  
  pathToMembers.forEach(member => {
    const key : string = member.symbol.escapedName;
    let val : string | boolean;
    const kind : number = member.type.literal.kind;
    
    switch (kind) {
      case 10:
        val = member.type.literal.text;
        break;
      case 95:
        val = false;
        break;
      case 110:
        val = true;
        break;
      default:
        throw new TypeError("unexpected value found");
    }

    res[key] = val;
  })

  const res_keys = Object.keys(res);
  console.assert(res_keys.includes('title') && res_keys.includes('description') && res_keys.includes('iconURL') && res_keys.includes('insertIconURL'));
  return res as ExtensionMenuDisplayDetails;
}
