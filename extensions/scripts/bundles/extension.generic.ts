import { FrameworkID, Language } from "$common";
import { announceWrite, createExtensionMenuAssets, fillInConstructorArgs, setupExtensionBundleEntry } from "../plugins";
import { commonAlias } from "../utils/aliases";
import { getThirdPartyPlugins, BundleInfo, stringifyCodeGenArgs, bundleExtensionBasedOnWatchMode } from ".";
import Transpiler from "../typeProbing/Transpiler";
import { printDiagnostics } from "../typeProbing/diagnostics";
import { isExtension, retrieveExtensionDetails } from "../typeProbing";
import { sendToParent } from "$root/scripts/comms";
import chalk from "chalk";
import path from "path";
import ts, { ClassLikeDeclarationBase, transform } from "typescript";
import TypeProbe from "scripts/typeProbing/TypeProbe";

const extractExtensionType = (derived: ts.Type, checker: ts.TypeChecker) =>
  checker.getTypeFromTypeNode((derived.symbol.declarations[0] as ClassLikeDeclarationBase).heritageClauses[0].types[0]);

const getPropertyMembers = (extensionType: ts.Type) =>
  (extensionType.aliasTypeArguments[0].symbol.declarations[0] as ts.TypeLiteralNode).members.map(e => e as ts.PropertySignature);

const getNameForProperty = ({ name }: ts.PropertySignature) => {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isComputedPropertyName(name)) {
    const expression = name.getText().replace("[", "").replace("]", "");
    return tryTreatAsLanguage(expression) ?? expression;
  };
  return "uh oh!";
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
  return tryParseAsJSON(type) ??
    tryTreatAsObject(type) ??
    tryTreatAsLanguage(type.getText()) ??
    "Error";
}

const extractExtensionDisplayMenuDetails = ({ indexFile }: BundleInfo, program: ts.Program) => {
  const checker = program.getTypeChecker();
  ts.forEachChild(program.getSourceFile(indexFile), child => {
    const type = checker.getTypeAtLocation(child);
    const name = type?.symbol?.name;
    if (name !== "default") return;
    const properties = getPropertyMembers(extractExtensionType(type, checker));
    const details = properties.reduce((map, property) =>
      map.set(getNameForProperty(property), getValueForProperty(property, checker)),
      new Map<string, any>()
    );
    console.log(details);
  });
}

export default async function (info: BundleInfo) {

  const customPRGPlugins = [
    setupExtensionBundleEntry(info),
    //transpileExtensions(info, { onSuccess: transpileComplete, onError: transpileFailed }),
    createExtensionMenuAssets(info),
    fillInConstructorArgs(info, stringifyCodeGenArgs),
    announceWrite(info),
  ];

  const { indexFile, bundleEntry } = info;

  const plugins = [...customPRGPlugins, ...getThirdPartyPlugins({
    tsTransformers: [
      (program) => {
        extractExtensionDisplayMenuDetails(info, program);
        return () => ({
          transformSourceFile: (node) => node,
          transformBundle: (node) => node,
        })
      }
    ]
  })];


  await bundleExtensionBasedOnWatchMode({ plugins, info });

};