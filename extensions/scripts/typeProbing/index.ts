import ts from "typescript";
import assert from "assert";
import { ExtensionInstance, ExtensionMenuDisplayDetails, KeysWithValuesOfType, ScratchExtension, getAccessorPrefix, identity, setAccessorPrefix } from "$common";
import { BundleInfo, ProgramBasedTransformer } from "scripts/bundles";
import type appInventor from "$common/extension/mixins/optional/appInventor";

type MenuText = KeysWithValuesOfType<ExtensionMenuDisplayDetails, string>;
type MenuFlag = KeysWithValuesOfType<ExtensionMenuDisplayDetails, boolean>;
const requiredKeys: (MenuText | MenuFlag)[] = ["name", "description", "iconURL", "insetIconURL"];

type MethodTypeInformation = { parameterTypes: (readonly [string, ts.Type])[], returnType: ts.Type, typeChecker: ts.TypeChecker };
const methodsByExtension = new Map<string, Map<string, MethodTypeInformation>>();

export const getMethodsForExtension = ({ id }: BundleInfo) => methodsByExtension.get(id);

export const populateDisplayMenuDetailsTransformer = (info: BundleInfo): ProgramBasedTransformer =>
  (program: ts.Program) => {
    extractExtensionDisplayMenuDetails(info, program)
      .forEach((value, key) => info.menuDetails[key] = value);
    return identityTransformation;
  }

export const extractMethodTypesFromExtension = (info: BundleInfo): ProgramBasedTransformer =>
  (program: ts.Program) => {
    const { type, checker, node } = probeExtensionProgram(info, program);
    const properties = checker.getPropertiesOfType(type);

    if (!shouldProbeExtensionMethods(properties)) return identityTransformation;

    const nameAndTypeFromParameter = (parameter: ts.Symbol) =>
      [parameter.name, checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration)] as const;

    const methods = properties
      .map(property => {
        const { name } = property;
        const propertyType = checker.getTypeOfSymbolAtLocation(property, node);
        const entries = new Array<MethodTypeInformation & { name: string }>();
        if (isGetter(property))
          entries.push({ name: `${getAccessorPrefix}${name}`, parameterTypes: [], returnType: propertyType, typeChecker: checker });
        if (isSetter(property))
          entries.push({ name: `${setAccessorPrefix}${name}`, parameterTypes: [["value", propertyType]], returnType: null, typeChecker: checker });
        if (isMethod(property)) {
          const callSignature = propertyType.getCallSignatures()?.[0]; // Only the first? Are multiple signatures for overloads?
          const parameterTypes = callSignature.parameters?.map(nameAndTypeFromParameter);
          const returnType = checker.getReturnTypeOfSignature(callSignature);
          entries.push({ name, parameterTypes, returnType, typeChecker: checker });
        }
        return entries;
      })
      .flat()
      .reduce((map, { name, ...types }) => map.set(name, types), new Map<string, MethodTypeInformation>());

    methodsByExtension.set(info.id, methods);
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

const shouldProbeExtensionMethods = (properties: ts.Symbol[]) => {
  const propertyNames = properties.map(({ name }) => name);
  type AppInventorExtension = InstanceType<ReturnType<typeof appInventor>>
  const appInventorKey: Exclude<keyof AppInventorExtension, keyof ExtensionInstance> = "withinAppInventor";
  return propertyNames.includes(appInventorKey);
};

const identityTransformation: ReturnType<ProgramBasedTransformer> = () => ({
  transformSourceFile: identity,
  transformBundle: identity,
});

const isGetter = ({ flags }: ts.Symbol) => flags & ts.SymbolFlags.GetAccessor;
const isSetter = ({ flags }: ts.Symbol) => flags & ts.SymbolFlags.SetAccessor;
const isMethod = ({ flags }: ts.Symbol) => flags & ts.SymbolFlags.Method;
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