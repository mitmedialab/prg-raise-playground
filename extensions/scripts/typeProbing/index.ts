import ts from "typescript";
import assert from "assert";
import { ExtensionMenuDisplayDetails, KeysWithValuesOfType, identity } from "$common";
import { BundleInfo, ProgramBasedTransformer } from "scripts/bundles";

type MenuText = KeysWithValuesOfType<ExtensionMenuDisplayDetails, string>;
type MenuFlag = KeysWithValuesOfType<ExtensionMenuDisplayDetails, boolean>;
const requiredKeys: (MenuText | MenuFlag)[] = ["name", "description", "iconURL", "insetIconURL"];

type MethodTypeInformation = { parameterTypes: ts.Type[], returnType: ts.Type };
export const methodsByExtension = new Map<string, Map<string, MethodTypeInformation>>();

const identityTransformation: ReturnType<ProgramBasedTransformer> = () => ({
  transformSourceFile: identity,
  transformBundle: identity,
});

export const populateDisplayMenuDetailsTransformer = (info: BundleInfo): ProgramBasedTransformer =>
  (program: ts.Program) => {
    extractExtensionDisplayMenuDetails(info, program)
      .forEach((value, key) => info.menuDetails[key] = value);
    return identityTransformation;
  }

export const extractMethodTypesFromExtension = (info: BundleInfo): ProgramBasedTransformer =>
  (program: ts.Program) => {
    const { type, checker, node } = probeExtensionProgram(info, program);

    const methods = checker.getPropertiesOfType(type)
      .filter(property => property.flags & ts.SymbolFlags.Method)
      .map(property => {
        const { name } = property;
        const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        const callSignature = propertyType.getCallSignatures()?.[0]; // only the first? is this for overloads?
        const parameterTypes = callSignature?.parameters?.map(parameter => checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration));
        const returnType = callSignature ? checker.getReturnTypeOfSignature(callSignature) : null;
        // TODO: Reduce types down to their most primitive form (strings, numbers, booleans, arrays, & objects)
        return { name, parameterTypes, returnType };
      })
      .reduce((map, { name, ...types }) => map.set(name, types), new Map<string, MethodTypeInformation>());

    checker.getPropertiesOfType(type).filter(property => property.flags & ts.SymbolFlags.GetAccessor)
      .forEach(property => {
        const { name } = property;
        const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        methods.set(`__getter__${name}`, { parameterTypes: [], returnType: propertyType });
      });

    checker.getPropertiesOfType(type).filter(property => property.flags & ts.SymbolFlags.SetAccessor)
      .forEach(property => {
        const { name } = property;
        const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        const parameterTypes = [propertyType];
        methods.set(`__setter__${name}`, { parameterTypes, returnType: null });
      });

    methodsByExtension.set(info.id, methods);
    console.log(methodsByExtension);
    return identityTransformation;
  }

const probeExtensionProgram = ({ indexFile }: BundleInfo, program: ts.Program) => {
  const checker = program.getTypeChecker();
  const container = { checker, type: null as ts.InterfaceType, node: null as ts.Node, base: null as ts.BaseType };
  ts.forEachChild(program.getSourceFile(indexFile), child => {
    if (child.kind !== ts.SyntaxKind.ClassDeclaration) return;
    const type = checker.getTypeAtLocation(child);
    if (!type.isClass() || type?.symbol?.name !== "default") return;
    container.type = type;
    container.node = child;
    container.base = checker.getBaseTypes(type)[0];
  });
  if (!container.type) throw new Error("Unable to locate extension type");
  if (!container.base) throw new Error("Unable to locate base extension type");
  return container;
}

const typeReferenceKey: keyof Omit<ts.TypeReference, keyof ts.Type> = "target";
const isTypeReference = (type: ts.Type): type is ts.TypeReference => typeReferenceKey in type;
const tryParseJSON = (text: string) => { try { return JSON.parse(text) } catch { return undefined } }
const tryEvaluate = (text: string) => {
  const cleaned = text.replaceAll(";", ",");
  const iife = `(() => (${cleaned}))()`;
  try { return eval(iife) } catch { return undefined }
}

const extractExtensionDisplayMenuDetails = (info: BundleInfo, program: ts.Program) => {
  let details: Map<string, any> & ExtensionMenuDisplayDetails;
  const { checker, node, base } = probeExtensionProgram(info, program);

  if (!isTypeReference(base)) throw new Error("Unexpected base type");

  details = base.typeArguments[0]
    .getProperties()
    .map(property => {
      const { name } = property;
      const type = checker.getTypeOfSymbolAtLocation(property, node);
      if (type.isLiteral()) return { name, value: type.value };
      const text = checker.typeToString(type);
      return { name, value: tryParseJSON(text) ?? tryEvaluate(text) ?? `Error parsing value: ${text}` }
    })
    .reduce((map, { name, value }) => map.set(name, value), new Map() as typeof details);

  requiredKeys.forEach(key => assert(details.has(key), new Error(`Required key '${key}' not found`)));
  return details;
}