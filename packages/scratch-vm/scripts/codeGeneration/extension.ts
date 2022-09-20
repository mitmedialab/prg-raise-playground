import { readFileSync, writeFileSync, existsSync } from "fs";
import mime = require('mime-types')
import path = require("path");
import { ExtensionCodeGenerator, GenerationDetails } from ".";
import { encode } from "../../src/extension-support/extension-id-factory";
import { CodeGenArgs } from "../../src/typescript-support/Extension";

const newline = "\n";
const populatedConstructorIdentifier = 'var _this = _super !== null && _super.apply(this, arguments) || this;';
const emptyConstructorIdentifier = 'return _super !== null && _super.apply(this, arguments) || this;';

const codeGenVariableName = `_codeGenArgs`;
const codeGenVariableDeclaration = `const ${codeGenVariableName}`;

const generateCodeGenArgs = (args: Record<keyof CodeGenArgs, string>) => {
  const contents = Object.entries(args).map(([key, value]) => `${key}: '${value}'`).join(', ');
  return `${codeGenVariableDeclaration} = { ${contents} };`;
}

const getBlockIconURI = ({ details, cached, implementationDirectory }: GenerationDetails) => {
  const { insetIconURL } = details;
  if (cached?.insetIconURL === insetIconURL && cached?.blockIconURI) return cached.blockIconURI;

  const insetIconPath = path.join(implementationDirectory, insetIconURL);
  if (insetIconURL === "" || !insetIconURL || !existsSync(insetIconPath)) return "";

  console.error(insetIconPath);

  const encoding = "base64";
  const insetSVG = readFileSync(insetIconPath).toString(encoding);
  const mediaType = mime.lookup(insetIconPath);
  return `data:${mediaType};${encoding},${insetSVG}`;
}

const addConstructorArguments = (constructor: string) => {
  return constructor.replace("arguments", `[...arguments, ${codeGenVariableName}]`)
}

const addToConstructor = (content: string, args: Record<keyof CodeGenArgs, string>): string => {
  const lines = content.split(newline);

  const getWhiteSpace = (line: string, match: string) => line.substring(0, line.indexOf(match[0]));

  const declarationIndex = lines.findIndex(line => line.includes(codeGenVariableDeclaration));
  if (declarationIndex >= 0) {
    const line = lines[declarationIndex];
    const whiteSpace = getWhiteSpace(line, codeGenVariableDeclaration);
    lines[declarationIndex] = [whiteSpace, generateCodeGenArgs(args)].join("");
    return lines.join(newline);
  }

  try {
    const { index, match } = lines
      .map((line, index) => {
        if (line.includes(populatedConstructorIdentifier)) return { match: populatedConstructorIdentifier, index };
        if (line.includes(emptyConstructorIdentifier)) return { match: emptyConstructorIdentifier, index };
        return { match: undefined, index };
      })
      .find(({ match }) => match !== undefined);

    const line = lines[index];

    const whiteSpace = getWhiteSpace(line, match);
    const argsDeclaration = generateCodeGenArgs(args);
    const updatedConstructor = addConstructorArguments(line);
    lines[index] = [whiteSpace, argsDeclaration, newline, updatedConstructor].join("");

    return lines.join(newline);
  }
  catch {
    throw new Error(`Uh oh! File content did not include expected constructor code: \n ${content}`);
  }

}

export const fillInContentForExtensions: ExtensionCodeGenerator = (extensions) => {
  const encoding = "utf-8";

  for (const id in extensions) {
    const { implementationDirectory, details, cacheUpdates: updates, cached } = extensions[id];
    const index = path.join(implementationDirectory, "index.js");
    const content = readFileSync(index, { encoding });

    const { name } = details;
    const blockIconURI = getBlockIconURI(extensions[id]);

    const args = { name, id: encode(id), blockIconURI };
    const updated = addToConstructor(content, args);
    writeFileSync(index, updated, encoding);

    if (blockIconURI !== cached?.blockIconURI) extensions[id].cacheUpdates = { ...updates, blockIconURI };
  }
};