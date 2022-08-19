import assert = require("assert");
import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import { ExtensionCodeGenerator } from ".";
import { encode } from "../../src/extension-support/extension-id-factory";

const populatedConstructorIdentifier = 'var _this = _super !== null && _super.apply(this, arguments) || this;';
const emptyConstructorIdentifier = 'return _super !== null && _super.apply(this, arguments) || this;';

const declareProperty = (name: string, value: string) => `_this.${name} = '${value}';`;

const addToConstructor = (content: string, ...toAdd: string[]): string => {
  if (content.includes(populatedConstructorIdentifier)) {
    const withToAdd = [populatedConstructorIdentifier, ...toAdd].join(" ");
    return content.replace(populatedConstructorIdentifier, withToAdd);
  }

  if (content.includes(emptyConstructorIdentifier)) {
    const withToAddAndReturnStatement = `${[populatedConstructorIdentifier, ...toAdd].join(" ")} return _this;`;
    return content.replace(emptyConstructorIdentifier, withToAddAndReturnStatement);
  }
  
  throw new Error(`Uh oh! File content did not include expected constructor code: \n ${content}`);
}

export const fillInContentForExtensions: ExtensionCodeGenerator = (extensions, getExtensionLocation) => {
  const encoding = "utf-8";
  for (const id in extensions) {
    const dir = getExtensionLocation(id);
    const index = path.join(dir, "index.js");
    const content = readFileSync(index, { encoding });
    
    const { name } = extensions[id];
    const nameDeclaration = declareProperty('name', name);
    const idDeclaration = declareProperty('id', encode(id));

    const updated = addToConstructor(content, nameDeclaration, idDeclaration);
    writeFileSync(index, updated, encoding);
  }
};