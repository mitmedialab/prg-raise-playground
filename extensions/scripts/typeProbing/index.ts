import ts from "typescript";
import assert from "assert";
import { ExtensionMenuDisplayDetails, KeysWithValuesOfType, UnionToTuple, Language, identity } from "$common";
import { BundleInfo, ProgramBasedTransformer } from "scripts/bundles";

type MenuText = KeysWithValuesOfType<ExtensionMenuDisplayDetails, string>;
type AllMenuText = UnionToTuple<MenuText>;

type MenuFlag = KeysWithValuesOfType<ExtensionMenuDisplayDetails, boolean>;
type AllMenuFlags = UnionToTuple<MenuFlag>;

//@ts-ignore 
const menuDetailTextKeys: AllMenuText = ["name", "description", "iconURL", "insetIconURL", "collaborator", "connectionIconURL", "connectionSmallIconURL", "connectionTipIconURL", "connectingMessage", "helpLink", "implementationLanguage"];
//@ts-ignore
const menuDetailFlagKeys: AllMenuFlags = ["internetConnectionRequired", "bluetoothRequired", "launchPeripheralConnectionFlow", "useAutoScan", "featured", "hidden", "disabled"];
//@ts-ignore
const requiredKeys: (MenuText | MenuFlag)[] = ["name", "description", "iconURL", "insetIconURL"];

export const populateDisplayMenuDetailsTransformer = (info: BundleInfo): ProgramBasedTransformer =>
  (program: ts.Program) => {
    const details = extractExtensionDisplayMenuDetails(info, program);
    for (const key in details) info.menuDetails[key] = details[key];
    return () => ({
      transformSourceFile: identity,
      transformBundle: identity,
    })
  }

const extractExtensionType = (derived: ts.Type, checker: ts.TypeChecker) =>
  checker.getTypeFromTypeNode((derived.symbol.declarations[0] as ts.ClassLikeDeclarationBase).heritageClauses[0].types[0]);

const getPropertyMembers = (extensionType: ts.Type) =>
  (extensionType.aliasTypeArguments[0].symbol.declarations[0] as ts.TypeLiteralNode).members.map(e => e as ts.PropertySignature);

const extractExpressionFromComputedProperyName = (name: ts.ComputedPropertyName) => {
  const text = name.getText();
  const lastIndex = text.length - 1;
  if (text[0] !== "[" || text[lastIndex] !== "]") throw Error("Un expected computed property format: " + text);
  return text.substring(1, lastIndex);
}

const getNameForProperty = ({ name }: ts.PropertySignature) => {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isComputedPropertyName(name)) {
    const expression = extractExpressionFromComputedProperyName(name);
    return tryTreatAsLanguage(expression) ?? expression;
  };
  return "Error -- Couldn't extract name.";
}

const tryParseAsJSON = (type: ts.TypeNode) => {
  try { return JSON.parse(type.getText()) }
  catch { return undefined }
}

const returnFromIIFE = (text: string) => `(() => (${text}))()`;

const tryTreatAsObject = (type: ts.TypeNode) => {
  try { return eval(returnFromIIFE(type.getText())) }
  catch { return undefined }
}

const tryTreatAsLanguage = (text: string) => {
  const elements = text.replace("typeof ", "").split(".");
  if (elements.length !== 2) return undefined;
  const key = elements[1];
  return Language[key];
}

const getValueForProperty = ({ type }: ts.PropertySignature, typeChecker: ts.TypeChecker) => {
  const resolvedType = typeChecker.getTypeFromTypeNode(type);
  if (resolvedType.isLiteral()) return resolvedType.value;
  return tryParseAsJSON(type) ?? tryTreatAsObject(type) ?? tryTreatAsLanguage(type.getText()) ?? "Error -- couldn't extract value";
}

const extractExtensionDisplayMenuDetails = ({ indexFile }: BundleInfo, program: ts.Program) => {
  const checker = program.getTypeChecker();
  let details;
  ts.forEachChild(program.getSourceFile(indexFile), child => {
    if (child.kind !== ts.SyntaxKind.ClassDeclaration) return;
    const type = checker.getTypeAtLocation(child);
    if (type?.symbol?.name !== "default") return;
    const properties = getPropertyMembers(extractExtensionType(type, checker));
    details = properties.reduce((map, property) =>
      map.set(getNameForProperty(property), getValueForProperty(property, checker)),
      new Map<string, any>()
    );
  });
  if (!details) throw new Error("Unable to extract details");
  requiredKeys.forEach(key => assert(details.has(key), new Error(`Required key '${key}' not found`)));
  return Object.fromEntries(details) as ExtensionMenuDisplayDetails;
}