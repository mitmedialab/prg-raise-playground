import fs from "fs";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

const inputFile = process.argv[2] || "input.ts";
const outputFile = process.argv[3] || "output.ts";

const code = fs.readFileSync(inputFile, "utf-8");

const ast = parse(code, {
  sourceType: "module",
  plugins: [
    "typescript",
    "asyncGenerators",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "dynamicImport",
    ["decorators", { decoratorsBeforeExport: true }],
  ],
});

// Helper to get function name
function getFunctionName(path: any): string {
  const node = path.node;

  if (t.isFunctionDeclaration(node) && node.id) return node.id.name;

  if (
    (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) &&
    t.isVariableDeclarator(path.parent) &&
    t.isIdentifier(path.parent.id)
  ) {
    return path.parent.id.name;
  }

  if (t.isClassMethod(node) && t.isIdentifier(node.key)) {
    return node.key.name;
  }

  return "anonymous";
}

traverse(ast, {
  Function(path) {
    // 🔹 Remove decorators from functions
    if (path.node.decorators) {
      path.node.decorators = null;
    }

    if (path.node.async) return; // skip async functions

    const functionName = getFunctionName(path);
    let hasReturn = false;

    // Handle all return statements inside this function
    path.traverse({
      ReturnStatement(retPath) {
        hasReturn = true;

        if (!retPath.node.argument) {
          // return without value → setResult with undefined + type
          const undef = t.identifier("undefined");
          const setResultCall = t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.identifier("AndroidBridge"),
                t.identifier("setResult")
              ),
              [t.stringLiteral(functionName), undef, t.stringLiteral("undefined")]
            )
          );
          retPath.insertBefore(setResultCall);
        } else {
          // return with value → setResult(functionName, returnValue, typeof returnValue)
          const arg = retPath.node.argument;
          const setResultCall = t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.identifier("AndroidBridge"),
                t.identifier("setResult")
              ),
              [
                t.stringLiteral(functionName),
                arg,
                t.unaryExpression("typeof", arg, true),
              ]
            )
          );
          retPath.insertBefore(setResultCall);
        }
      },
    });

    // If no return statements, append setResult at the end
    if (!hasReturn && path.node.body.body) {
      const undef = t.identifier("undefined");
      const setResultCall = t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier("AndroidBridge"), t.identifier("setResult")),
          [t.stringLiteral(functionName), undef, t.stringLiteral("undefined")]
        )
      );
      path.node.body.body.push(setResultCall);
    }
  },

  // 🔹 Remove decorators from class methods too
  ClassMethod(path) {
    if (path.node.decorators) {
      path.node.decorators = null;
    }
  },
});

const output = generate(ast, {}, code).code;
fs.writeFileSync(outputFile, output, "utf-8");

console.log(
  `✅ AndroidBridge.setResult inserted and decorators removed: ${outputFile}`
);
