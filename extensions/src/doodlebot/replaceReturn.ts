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
    if (path.node.decorators) path.node.decorators = null;
    if (path.node.async) return; // skip async

    const functionName = getFunctionName(path);
    let hasReturn = false;

    path.traverse({
      ReturnStatement(retPath) {
        hasReturn = true;

        const arg = retPath.node.argument || t.identifier("undefined");

        // Build the if/else call to type-specific setResult
        const callExpr = t.ifStatement(
          t.binaryExpression("===", t.unaryExpression("typeof", arg, true), t.stringLiteral("number")),
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier("AndroidBridge"), t.identifier("setResult_double")),
                [t.stringLiteral(functionName), arg, t.stringLiteral("number")]
              )
            ),
          ]),
          t.ifStatement(
            t.binaryExpression("===", t.unaryExpression("typeof", arg, true), t.stringLiteral("string")),
            t.blockStatement([
              t.expressionStatement(
                t.callExpression(
                  t.memberExpression(t.identifier("AndroidBridge"), t.identifier("setResult_string")),
                  [t.stringLiteral(functionName), arg, t.stringLiteral("string")]
                )
              ),
            ]),
            t.blockStatement([
              t.expressionStatement(
                t.callExpression(
                  t.memberExpression(t.identifier("AndroidBridge"), t.identifier("setResult")),
                  [t.stringLiteral(functionName), arg, t.unaryExpression("typeof", arg, true)]
                )
              ),
            ])
          )
        );

        retPath.insertBefore(callExpr);
      },
    });

    if (!hasReturn && path.node.body.body) {
      const call = t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier("AndroidBridge"), t.identifier("setResult")),
          [t.stringLiteral(functionName), t.identifier("undefined"), t.stringLiteral("undefined")]
        )
      );
      path.node.body.body.push(call);
    }
  },

  ClassMethod(path) {
    if (path.node.decorators) path.node.decorators = null;
  },
});

const output = generate(ast, {}, code).code;
fs.writeFileSync(outputFile, output, "utf-8");

console.log(
  `✅ AndroidBridge.setResult inserted and decorators removed: ${outputFile}`
);