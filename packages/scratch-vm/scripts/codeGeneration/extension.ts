import { readFileSync, writeFileSync } from "fs";
import mime = require('mime-types')
import path = require("path");
import { ExtensionCodeGenerator, GenerationDetails } from ".";
import { encode } from "../../src/extension-support/extension-id-factory";
import { Extension } from "../../src/typescript-support/Extension";
import { ExtensionMenuDisplayDetails } from "../../src/typescript-support/types";

const populatedConstructorIdentifier = 'var _this = _super !== null && _super.apply(this, arguments) || this;';
const emptyConstructorIdentifier = 'return _super !== null && _super.apply(this, arguments) || this;';

const declareProperty = (name: keyof Extension<any, any>, value: string) => `_this.${name} = '${value}';`;

const getBlockIconURI = ({ details, cached, implementationDirectory }: GenerationDetails) => {
  const { insetIconURL } = details;
  if (cached?.insetIconURL === insetIconURL && cached?.blockIconURI) return cached.blockIconURI;

  const insetIconPath = path.join(implementationDirectory, insetIconURL);
  const encoding = "base64";
  const insetSVG = readFileSync(insetIconPath).toString(encoding);
  const mediaType = mime.lookup(insetIconPath);
  return `data:${mediaType};${encoding},${insetSVG}`;
}

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

export const fillInContentForExtensions: ExtensionCodeGenerator = (extensions) => {
  const encoding = "utf-8";

  for (const id in extensions) {
    const { implementationDirectory, details, cacheUpdates: updates, cached} = extensions[id];
    const index = path.join(implementationDirectory, "index.js");
    const content = readFileSync(index, { encoding });
    
    const nameDeclaration = declareProperty('name', details.name);
    const idDeclaration = declareProperty('id', encode(id));
    const blockIconURI = getBlockIconURI(extensions[id]);

    const blockIconDeclaration = declareProperty('blockIconURI', blockIconURI);

    const updated = addToConstructor(content, nameDeclaration, idDeclaration, blockIconDeclaration);
    writeFileSync(index, updated, encoding);

    if (blockIconURI !== cached?.blockIconURI) extensions[id].cacheUpdates = { ...updates, blockIconURI };
  }
};