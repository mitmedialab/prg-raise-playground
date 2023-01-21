import path from "path";
import fs from "fs";
import { init, parse } from "es-module-lexer";
import chalk from "chalk";
import { codeSnippet } from "documentation";

const deleteLineFlag = "__DELETE__";
const errorFlag = "Error! This snippet couldn't be located. Please contact the repo maintainer.";

const fileOptions = { encoding: "utf8" } as const;

const getLinks = (content: string) => {
  const urlRegEx = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
  const linkSeperator = "\n> * "
  const links = content.match(urlRegEx)?.join(linkSeperator);
  return links ? `\n\n> Included links:${linkSeperator}${links}` : null;
}

const snippetify = (content: string) => {
  const links = getLinks(content);

  const code = `\`\`\`ts
  ${content}
  \`\`\``;

  return links ? code + links : code;
};

const extractSetting = (query: string, kind: string) => {
  const setting = query.split("=");

  if (setting.length < 2) {
    console.error(chalk.red(`No setting was given for ${kind}. Use '[](...${kind}=___)'. Received:  ${query}`));
    return undefined;
  }

  return setting[1];
}

const extractOrder = (query: string, current: number) => {
  let update = current;

  const setting = extractSetting(query, "order");
  const value = parseFloat(setting);

  isNaN(value)
    ? console.error(chalk.red("Could not parse order preference: " + query))
    : (update = value);

  return update;
}

const getLineNumber = (section: string) => section.split("\n").length;

const getLineNumbersOfExportedSnippet = (content: string, exportName: string, exportLocation: { start: number, end: number }): { snippetStartLine: number, snippetEndLine: number } => {
  const { start, end } = exportLocation;

  const before = content.substring(0, start);
  const snippetStartLine = getLineNumber(before) + 1;

  const after = content.substring(end).split("\n").slice(1).join("\n");

  const endSnippetCall: keyof ReturnType<typeof codeSnippet> = "end";
  const endSnippetInvocation = `${exportName}.${endSnippetCall}`;

  const index = after.indexOf(endSnippetInvocation); // this could use regex if proves error prone;

  const snippetEndLine = after.substring(0, index).split("\n").length + snippetStartLine - 1;

  return { snippetStartLine, snippetEndLine };
}

const extractFromExport = (query: string, content: string, pathToFile: string, error: (msg: string) => void) => {
  const lines = content.split("\n");

  const exportName = extractSetting(query, "export");

  if (!exportName) return errorFlag;

  const exports = parse(content)[1];
  const found = exports.filter(({ n: name }) => name === exportName);

  if (found.length !== 1) {
    const seperator = "\n\t-";
    const allExportNames = seperator + exports.map(({ n }) => n).join(seperator);
    error([
      chalk.red(`Could not locate export: ${exportName}`),
      chalk.reset(`${pathToFile} exports: ${allExportNames}`)
    ].join("\n"));
    return errorFlag;
  }

  const [{ s: start, e: end }] = found;
  const { snippetStartLine, snippetEndLine } = getLineNumbersOfExportedSnippet(content, exportName, { start, end });
  return lines.slice(snippetStartLine - 1, snippetEndLine - 1).join("\n");
}

const extractSnippet = async (query: string, containgFile: string): Promise<string> => {
  const dir = path.dirname(containgFile);

  const error = (msg: string) => {
    console.error(chalk.redBright("Error in " + containgFile));
    console.error(msg);
  };

  const request = query.split("?");
  const [file] = request;

  const pathToFile = path.resolve(dir, file);

  if (!fs.existsSync(pathToFile)) {
    error(chalk.red(`Could not resolve file: ${file}`));
    return errorFlag;
  }

  const content = fs.readFileSync(pathToFile, fileOptions);

  const useEntireFile = request.length === 1;
  return snippetify(
    useEntireFile
      ? content
      : extractFromExport(request[1], content, pathToFile, error)
  )
}

const process = async (pathToREADME: string): Promise<{ order: number, content: string }> => {
  await init;

  const lines = fs.readFileSync(pathToREADME, { encoding: "utf8" }).split("\n");

  let order = Number.MAX_VALUE;

  for (let index = lines.length; index >= 0; index--) {
    const line = lines[index];

    // regex behaves weird when re-using it if the global 'g' flag is set, 
    // so we use this function to get a new one each time we use it
    const findSnippetSpecifier = () => /\[\]\((.+)\)/gm;

    if (!findSnippetSpecifier().test(line)) continue;
    const [_, url] = findSnippetSpecifier().exec(line);

    if (url.startsWith("order")) {
      order = extractOrder(url, order);
      lines[index] = deleteLineFlag;
      continue;
    }

    lines[index] = await extractSnippet(url, pathToREADME);
  }

  return { order, content: lines.filter(line => line !== deleteLineFlag).join("\n") };
}

const documentationRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(documentationRoot, "src");
const extensionsRoot = path.resolve(documentationRoot, "..");

const fileToEdit = path.join(extensionsRoot, "README.md");
const generatedGuard = "Generated Content Guard";

const invalidNames = [".", ".."];

const directories = fs.readdirSync(srcDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(({ name }) => name)
  .filter(name => !invalidNames.includes(name))
  .map(name => path.join(srcDir, name));

const readMes = directories
  .map(directory => path.join(directory, "README.md"))
  .filter(readme => fs.existsSync(readme));

type Entry = Awaited<ReturnType<typeof process>>;
type Entries = Entry[];

const sortByOrder = ({ order: a }: Entry, { order: b }: Entry) => a - b;

const sortEntries = (entries: Entries) => {
  entries.sort(sortByOrder);
  return entries;
}

const addIsGeneratedWarning = (entries: Entries) => {
  return entries;
}

const concat = (entries: Entries) => entries.map(({ content }) => content).join("\n\n");

Promise.all(readMes.map(process))
  .then(sortEntries)
  .then(addIsGeneratedWarning)
  .then(concat)
  .then(content => {

    const linesToEdit = fs.readFileSync(fileToEdit, fileOptions).split("\n");

    const guards = linesToEdit
      .filter(line => line.includes(generatedGuard))
      .map((value, index) => ({ value, index }));

    if (guards.length !== 2) {
      throw new Error(`Found ${guards.length} code generation guards, but expected 2 (one for start, one for end).`)
    }

    const [guardStart, guardEnd] = guards;
    const updates = [...linesToEdit.slice(0, guardStart.index), content, ...linesToEdit.slice(guardEnd.index)];

    console.log(updates);
  });