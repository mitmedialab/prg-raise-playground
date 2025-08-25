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
  returns: string;
  async: boolean;
  parameters?: { name: string; type: string }[];
}

// Convert TypeScript type annotations to simple App Inventor types
function tsTypeToAI(typeAnnotation: t.TSType | null | undefined): string {
  if (!typeAnnotation) return "object";
  if (t.isTSNumberKeyword(typeAnnotation)) return "number";
  if (t.isTSStringKeyword(typeAnnotation)) return "string";
  if (t.isTSBooleanKeyword(typeAnnotation)) return "boolean";
  return "object";
}

// Infer return type from AST nodes and function parameters
function inferReturnType(
  node: t.Expression | null | undefined,
  params: { name: string; type: string }[]
): string {
  if (!node) return "void"; // default for empty return
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

const blocks: BlockInfo[] = [];

traverse(ast, {
  ClassDeclaration(path) {
    path.traverse({
      ClassMethod(methodPath) {
        const methodNode = methodPath.node;
        let blockType: BlockInfo["type"] = "unknown";

        // Detect decorators
        if (methodNode.decorators) {
          for (const dec of methodNode.decorators) {
            const expr = dec.expression;

            // Tagged template: scratch.command`...`
            if (t.isTaggedTemplateExpression(expr)) {
              if (t.isMemberExpression(expr.tag) && t.isIdentifier(expr.tag.property)) {
                const prop = expr.tag.property.name;
                if (["command", "button", "reporter"].includes(prop)) blockType = prop as any;
              }
            }

            // Function call: scratch.command(...)
            if (t.isCallExpression(expr)) {
              if (t.isMemberExpression(expr.callee) && t.isIdentifier(expr.callee.property)) {
                const prop = expr.callee.property.name;
                if (["command", "button", "reporter"].includes(prop)) blockType = prop as any;
              }
            }
          }
        }

        if (blockType === "unknown") return;

        const methodName = t.isIdentifier(methodNode.key) ? methodNode.key.name : "anonymous";

        // Extract parameters (ignore destructured ones)
        const params: { name: string; type: string }[] = [];
        for (const p of methodNode.params) {
          if (t.isIdentifier(p)) {
            params.push({ name: p.name, type: tsTypeToAI(p.typeAnnotation?.typeAnnotation || null) });
          } else if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
            params.push({ name: p.left.name, type: tsTypeToAI(p.left.typeAnnotation?.typeAnnotation || null) });
          }
          // Ignore object patterns like { blockID }
        }

        // Infer return type
        let returnType: string | undefined;
        methodPath.traverse({
          ReturnStatement(retPath) {
            const arg = retPath.node.argument;
            returnType = inferReturnType(arg, params);
          },
        });

        // If no return statement found → default to "void"
        if (!returnType) {
          returnType = "void";
        }

        blocks.push({
          name: methodName,
          type: blockType,
          returns: returnType,
          async: methodNode.async ?? false,
          parameters: params.length > 0 ? params : undefined,
        });
      },
    });
  },
});

fs.writeFileSync(outputFile, JSON.stringify(blocks, null, 2), "utf-8");
console.log(`✅ Blocks JSON written to ${outputFile}`);
