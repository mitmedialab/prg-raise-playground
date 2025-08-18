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
  returns?: string; // JS type of return value
}

// Helper to infer return type from AST nodes
function inferReturnType(node: t.Expression | null | undefined): string {
  if (!node) return "undefined";
  if (t.isNumericLiteral(node)) return "number";
  if (t.isStringLiteral(node)) return "string";
  if (t.isBooleanLiteral(node)) return "boolean";
  if (t.isBinaryExpression(node)) {
    if (["+", "-", "*", "/", "%", "**"].includes(node.operator)) return "number";
    return "object";
  }
  if (t.isIdentifier(node)) return "unknown"; // could attempt to infer from variable type
  if (t.isCallExpression(node)) return "unknown"; // result of a function call
  return "object"; // fallback
}

const blocks: BlockInfo[] = [];

traverse(ast, {
  ClassDeclaration(path) {
    path.traverse({
      ClassMethod(methodPath) {
        const methodNode = methodPath.node;
        let blockType: BlockInfo["type"] = "unknown";

        // Detect decorator type
        if (methodNode.decorators && methodNode.decorators.length > 0) {
          for (const dec of methodNode.decorators) {
            if (t.isCallExpression(dec.expression) && t.isMemberExpression(dec.expression.callee)) {
              const prop = dec.expression.callee.property;
              if (t.isIdentifier(prop)) {
                if (prop.name === "command") blockType = "command";
                else if (prop.name === "button") blockType = "button";
                else if (prop.name === "reporter") blockType = "reporter";
              }
            } else if (t.isTaggedTemplateExpression(dec.expression)) {
              const tag = dec.expression.tag;
              if (t.isMemberExpression(tag) && t.isIdentifier(tag.property)) {
                const propName = tag.property.name;
                if (propName === "command") blockType = "command";
                else if (propName === "button") blockType = "button";
                else if (propName === "reporter") blockType = "reporter";
              }
            }
          }
        }

        const methodName = t.isIdentifier(methodNode.key) ? methodNode.key.name : "anonymous";

        if (blockType !== "unknown") {
          let returnType: string | undefined = undefined;

          // Infer return type by checking all return statements
          methodPath.traverse({
            ReturnStatement(retPath) {
              const arg = retPath.node.argument;
              returnType = inferReturnType(arg);
            },
          });

          blocks.push({
            name: methodName,
            type: blockType,
            returns: returnType,
          });
        }
      },
    });
  },
});

fs.writeFileSync(outputFile, JSON.stringify(blocks, null, 2), "utf-8");
console.log(`✅ Blocks JSON with return types written to ${outputFile}`);
