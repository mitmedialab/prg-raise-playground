module.exports = function ({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        // 🔹 Remove decorators if they exist
        if (path.node.decorators) {
          path.node.decorators = null;
        }

        const funcName = path.node.id ? path.node.id.name : "anonymous";

        path.traverse({
          ReturnStatement(returnPath) {
            const arg = returnPath.node.argument;
            if (arg) {
              // Replace return X with setResult(funcName, X, typeof X)
              returnPath.replaceWith(
                t.returnStatement(
                  t.callExpression(
                    t.memberExpression(
                      t.identifier("AndroidBridge"),
                      t.identifier("setResult")
                    ),
                    [
                      t.stringLiteral(funcName),
                      arg,
                      t.unaryExpression("typeof", arg, true),
                    ]
                  )
                )
              );
            }
          },
        });

        // If no return statements exist, append a call at the end
        const hasReturn = path.get("body.body").some((stmt) => stmt.isReturnStatement());
        if (!hasReturn) {
          path.get("body").pushContainer(
            "body",
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier("AndroidBridge"),
                  t.identifier("setResult")
                ),
                [t.stringLiteral(funcName)]
              )
            )
          );
        }
      },

      FunctionExpression(path) {
        // 🔹 Remove decorators
        if (path.node.decorators) {
          path.node.decorators = null;
        }

        const name =
          path.node.id?.name ||
          (path.parent.type === "VariableDeclarator" && path.parent.id.name) ||
          "anonymous";

        path.traverse({
          ReturnStatement(returnPath) {
            const arg = returnPath.node.argument;
            if (arg) {
              returnPath.replaceWith(
                t.returnStatement(
                  t.callExpression(
                    t.memberExpression(
                      t.identifier("AndroidBridge"),
                      t.identifier("setResult")
                    ),
                    [
                      t.stringLiteral(name),
                      arg,
                      t.unaryExpression("typeof", arg, true),
                    ]
                  )
                )
              );
            }
          },
        });

        const hasReturn = path.get("body.body")?.some((stmt) => stmt.isReturnStatement());
        if (!hasReturn && path.node.body.type === "BlockStatement") {
          path.get("body").pushContainer(
            "body",
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier("AndroidBridge"),
                  t.identifier("setResult")
                ),
                [t.stringLiteral(name)]
              )
            )
          );
        }
      },

      // 🔹 Remove decorators from class methods too
      ClassMethod(path) {
        if (path.node.decorators) {
          path.node.decorators = null;
        }
      }
    },
  };
};
