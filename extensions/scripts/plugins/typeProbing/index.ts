import ts = require("typescript");
import path = require("path");
import assert = require("assert");
import { ExtensionMenuDisplayDetails, KeysWithValuesOfType, UnionToTuple, Language, LanguageKeys } from "$ExtensionFramework";
import TypeProbe from "./TypeProbe";

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

type MenuTranslations = KeysWithValuesOfType<ExtensionMenuDisplayDetails, Partial<Record<Language, any>>>;
type AllMenuTranslations = UnionToTuple<MenuTranslations>;

const menuDetailTextKeys: AllMenuText = ["name", "description", "iconURL", "insetIconURL", "collaborator", "connectionIconURL", "connectionSmallIconURL", "connectionTipIconURL", "connectingMessage", "helpLink", "implementationLanguage"];
const menuDetailFlagKeys: AllMenuFlags = ["internetConnectionRequired", "bluetoothRequired", "launchPeripheralConnectionFlow", "useAutoScan", "featured", "hidden", "disabled"];
const requiredKeys: (MenuText | MenuFlag)[] = ["name", "description", "iconURL", "insetIconURL"];

const getMenuDisplayDetails = (type: ts.Type): ExtensionMenuDisplayDetails => {
  //@ts-ignore
  const { members } = type.getBaseTypes()[0].resolvedTypeArguments[0].symbol.declarations[0];


  let implementationLanguage: string = undefined;

  const details: Map<string, any> = members.reduce((map: Map<string, any>, member) => {
    const key: keyof ExtensionMenuDisplayDetails = member.symbol.escapedName;

    if (key === "implementationLanguage") {
      implementationLanguage = Language[member.type.typeName.right.escapedText] as Language;
      return map;
    }

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

    if (LanguageKeys.includes(member.name?.expression?.name?.escapedText)) {
      const language = Language[member.name.expression.name.escapedText] as Language;

      const entries = (member.type.members as Array<any>)?.map(child => {
        const childKey = child.symbol.escapedName as "name" | "description";
        const value: string = child.type.literal.text;
        return [childKey, value];
      }).reduce((container, [childKey, value]) => {
        container[childKey] = value;
        return container;
      }, {});

      map.set(language, entries);
      return map;
    }

    throw new TypeError(`Unexpected key found: ${key}`);
  }, new Map());

  if (details.has(implementationLanguage)) {
    throw new Error(`Attempt to ovveride translation for language '${implementationLanguage}' in Extension '${type.symbol.name}'. It was cited both as the implementationLanguage, and a translation was given`);
  }

  const defaultLanguage = Language.English;

  if (!implementationLanguage && details.has(defaultLanguage)) {
    throw new Error(`A translation was given for '${defaultLanguage}', but since no implementationLanguage was given, we assume the default name and description are in laguage '${defaultLanguage}'. Either specify the correct implementation language, or remove the unnecessary translation.`);
  }

  details.set(implementationLanguage ?? defaultLanguage, { name: details.get("name"), description: details.get("description") });

  requiredKeys.forEach(key => assert(details.has(key)));
  return Object.fromEntries(details) as ExtensionMenuDisplayDetails;
}
