import fs from "fs";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

const inputFile = process.argv[2] || "SimpleTypescript.ts";
const outputFile = process.argv[3] || "blocks.json";

const code = fs.readFileSync(inputFile, "utf-8");

const ast = parse(code, {
  sourceType: "module",
  plugins: ["typescript", "decorators", "classProperties", "dynamicImport"],
});

interface BlockInfo {
  name: string;
  type: "command" | "button" | "reporter" | "unknown";
  text?: string;
  returns: string;
  async: boolean;
  parameters?: { name: string; type: string; defaultValue?: any }[];
}

// ---- Type helpers ----------------------------------------------------------

function tsTypeToAI(typeAnnotation: t.TSType | null | undefined): string {
  if (!typeAnnotation) return "object";

  if (t.isTSStringKeyword(typeAnnotation)) return "string";
  if (t.isTSNumberKeyword(typeAnnotation)) return "number";
  if (t.isTSBooleanKeyword(typeAnnotation)) return "boolean";

  if (t.isTSLiteralType(typeAnnotation)) {
    if (t.isStringLiteral(typeAnnotation.literal)) return "string";
    if (t.isNumericLiteral(typeAnnotation.literal)) return "number";
    if (t.isBooleanLiteral(typeAnnotation.literal)) return "boolean";
    return "object";
  }

  if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName)) {
    // 🚨 Skip BlockUtilityWithID (we’ll filter later too)
    if (typeAnnotation.typeName.name === "BlockUtilityWithID") return "BlockUtilityWithID";
  }

  if (t.isTSUnionType(typeAnnotation)) {
    const kinds = new Set<string>();
    for (const m of typeAnnotation.types) {
      if (t.isTSLiteralType(m)) {
        if (t.isStringLiteral(m.literal)) kinds.add("string");
        else if (t.isNumericLiteral(m.literal)) kinds.add("number");
        else if (t.isBooleanLiteral(m.literal)) kinds.add("boolean");
        else kinds.add("object");
      } else if (t.isTSStringKeyword(m)) kinds.add("string");
      else if (t.isTSNumberKeyword(m)) kinds.add("number");
      else if (t.isTSBooleanKeyword(m)) kinds.add("boolean");
      else kinds.add("object");
    }
    if (kinds.size === 1) return kinds.values().next().value as string;
    return "object";
  }

  return "object";
}

function literalValue(node: t.Node | null | undefined): any {
  if (!node) return undefined;
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  return undefined;
}

function inferReturnType(
  node: t.Expression | null | undefined,
  params: { name: string; type: string }[]
): string {
  if (!node) return "void";
  if (t.isNumericLiteral(node)) return "number";
  if (t.isStringLiteral(node)) return "string";
  if (t.isBooleanLiteral(node)) return "boolean";
  if (t.isBinaryExpression(node)) return "number";
  if (t.isCallExpression(node)) return "unknown";
  if (t.isIdentifier(node)) {
    const p = params.find((p) => p.name === node.name);
    if (p) return p.type;
  }
  return "object";
}

function uniquify(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((n) => {
    if (!seen.has(n)) {
      seen.set(n, 1);
      return n;
    }
    const count = seen.get(n)! + 1;
    seen.set(n, count);
    return `${n}${count}`;
  });
}

// ---- Extraction ------------------------------------------------------------

const blocks: BlockInfo[] = [];

traverse(ast, {
  ClassDeclaration(path) {
    path.traverse({
      ClassMethod(methodPath) {
        const methodNode = methodPath.node;

        let blockType: BlockInfo["type"] = "unknown";
        let blockText: string | undefined = undefined;

        const fnParamNames: string[] = [];
        const fnParamTypes: string[] = [];

        for (const p of methodNode.params) {
          if (t.isIdentifier(p)) {
            fnParamNames.push(p.name);
            fnParamTypes.push(tsTypeToAI(p.typeAnnotation?.typeAnnotation || null));
          } else if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
            fnParamNames.push(p.left.name);
            fnParamTypes.push(tsTypeToAI(p.left.typeAnnotation?.typeAnnotation || null));
          } else {
            fnParamNames.push("arg");
            fnParamTypes.push("object");
          }
        }

        let params: { name: string; type: string; defaultValue?: any }[] = fnParamNames.map(
          (name, i) => ({ name, type: fnParamTypes[i] || "object" })
        );

        if (methodNode.decorators) {
          for (const dec of methodNode.decorators) {
            const expr = dec.expression;

            if (t.isTaggedTemplateExpression(expr)) {
              if (t.isMemberExpression(expr.tag) && t.isIdentifier(expr.tag.property)) {
                const prop = expr.tag.property.name;
                if (["command", "button", "reporter"].includes(prop)) {
                  blockType = prop as any;
                }
              }
            }

            if (t.isCallExpression(expr)) {
              if (t.isMemberExpression(expr.callee) && t.isIdentifier(expr.callee.property)) {
                const prop = expr.callee.property.name;
                if (["command", "button", "reporter"].includes(prop)) {
                  blockType = prop as any;
                }
              }

              if (t.isIdentifier(expr.callee) && expr.callee.name === "block") {
                const options = expr.arguments[0];
                if (t.isObjectExpression(options)) {
                  const typeProp = options.properties.find(
                    (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === "type"
                  ) as t.ObjectProperty | undefined;

                  if (typeProp && t.isStringLiteral(typeProp.value)) {
                    blockType = typeProp.value.value as BlockInfo["type"];
                  }

                  const textProp = options.properties.find(
                    (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === "text"
                  ) as t.ObjectProperty | undefined;

                  if (textProp) {
                    if (t.isStringLiteral(textProp.value)) {
                      blockText = textProp.value.value;
                    } else {
                      blockText = "<dynamic text>";
                    }
                  }

                  const argsProp = options.properties.find(
                    (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === "args"
                  ) as t.ObjectProperty | undefined;

                  if (argsProp && t.isArrayExpression(argsProp.value)) {
                    const decoratorArgs = argsProp.value.elements.filter(t.isObjectExpression);

                    params = decoratorArgs.map((argObj, idx) => {
                      const paramNameFromFn = fnParamNames[idx] ?? `arg${idx + 1}`;
                      const typeProp = argObj.properties.find(
                        (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === "type"
                      ) as t.ObjectProperty | undefined;

                      const defaultProp = argObj.properties.find(
                        (p) =>
                          t.isObjectProperty(p) &&
                          t.isIdentifier(p.key) &&
                          p.key.name === "defaultValue"
                      ) as t.ObjectProperty | undefined;

                      const typeFromDecorator =
                        typeProp && t.isStringLiteral(typeProp.value)
                          ? typeProp.value.value
                          : undefined;

                      const type =
                        typeFromDecorator ??
                        (fnParamTypes[idx] ? fnParamTypes[idx] : "object");

                      const defaultValue = defaultProp ? literalValue(defaultProp.value) : undefined;

                      return { name: paramNameFromFn, type, defaultValue };
                    });

                    if (fnParamNames.length > decoratorArgs.length) {
                      for (let i = decoratorArgs.length; i < fnParamNames.length; i++) {
                        params.push({
                          name: fnParamNames[i] ?? `arg${i + 1}`,
                          type: fnParamTypes[i] ?? "object",
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (blockType === "unknown") return;

        // 🚨 Filter out BlockUtilityWithID
        params = params.filter((p) => p.type !== "BlockUtilityWithID");

        const unique = uniquify(params.map((p) => p.name));
        params = params.map((p, i) => ({ ...p, name: unique[i] }));

        const methodName = t.isIdentifier(methodNode.key)
          ? methodNode.key.name
          : "anonymous";

        let returnType: string | undefined;
        methodPath.traverse({
          ReturnStatement(retPath) {
            const arg = retPath.node.argument;
            returnType = inferReturnType(
              arg,
              params.map(({ name, type }) => ({ name, type }))
            );
          },
        });
        if (!returnType) returnType = "void";

        const block: BlockInfo = {
          name: methodName,
          type: blockType,
          returns: returnType,
          async: methodNode.async ?? false,
          parameters: params.length > 0 ? params : undefined,
        };
        if (blockText) block.text = blockText;

        blocks.push(block);
      },
    });
  },
});

fs.writeFileSync(outputFile, JSON.stringify(blocks, null, 2), "utf-8");
console.log(`✅ Blocks JSON written to ${outputFile}`);
