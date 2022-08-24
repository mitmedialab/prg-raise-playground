import ts = require("typescript");
import path = require("path");
import { ExtensionMenuDisplayDetails, KeysWithValuesOfType, UnionToTuple } from "../../../src/typescript-support/types";
import assert = require("assert");

export const retrieveExtensionDetails = (program: ts.Program, testOverride: boolean = false): Record<string, ExtensionMenuDisplayDetails> => {
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
        details[testOverride ? type.symbol.name : dirName] = getMenuDisplayDetails(type);
      }
    });
  }

  return details;
}

export const isExtension = (type: ts.Type) => {
  const baseTypes = type.getBaseTypes();
  return baseTypes?.some(t => t.symbol.name === "Extension") ?? false;
}

type MenuText = KeysWithValuesOfType<ExtensionMenuDisplayDetails, string>;
type AllMenuText = UnionToTuple<MenuText>;

type MenuFlag = KeysWithValuesOfType<ExtensionMenuDisplayDetails, boolean>;
type AllMenuFlags = UnionToTuple<MenuFlag>;

const menuDetailTextKeys: AllMenuText = ["name", "description", "iconURL", "insetIconURL", "collaborator", "connectionIconURL", "connectionSmallIconURL", "connectionTipIconURL", "connectingMessage", "helpLink"];
const menuDetailFlagKeys: AllMenuFlags = ["internetConnectionRequired", "bluetoothRequired", "launchPeripheralConnectionFlow", "useAutoScan", "featured", "hidden", "disabled"];
const requiredKeys: (MenuText | MenuFlag)[] = ["name", "description", "iconURL", "insetIconURL"];

const getMenuDisplayDetails = (type: ts.Type): ExtensionMenuDisplayDetails => {
  //@ts-ignore
  const { members } = type.getBaseTypes()[0].resolvedTypeArguments[0].symbol.declarations[0];
    
  const details: Map<string, any> = members.reduce((map: Map<string, any>, member) => {
    const key: keyof ExtensionMenuDisplayDetails = member.symbol.escapedName;

    if (menuDetailTextKeys.includes(key as any)) return map.set(key, member.type.literal.text);

    if (menuDetailFlagKeys.includes(key as any)) {
        const { kind } = member.type.literal;
        switch (kind) {
          case 95:
            return map.set(key, false);
          case 110:
            return map.set(key, true);
        }
    } 
    
    throw new TypeError(`Unexpected key found: ${key}`);

  }, new Map())

  requiredKeys.forEach(key => assert(details.has(key)));
  return Object.fromEntries(details) as ExtensionMenuDisplayDetails;
}
