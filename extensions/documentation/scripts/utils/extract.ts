import path from "path";
import fs from "fs";
import { init, parse } from "es-module-lexer";
import chalk from "chalk";
import { endSnippetCall } from "documentation";
import { Parsed, ParseMatch } from "./Parser";

type Range = { start: number, end: number };

const extractLinks = (content: string) => {
  const urlRegEx = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
  const linkSeperator = "\n> * "
  const links = content.match(urlRegEx)?.join(linkSeperator);
  return links ? `\n> Included links:${linkSeperator}${links}` : "";
}

const snippetify = (content: string) => ["```ts", content, "```", extractLinks(content)].join("\n");

const extractSetting = (query: string, kind: string) => {
  const setting = query.split("=");

  if (setting.length < 2) {
    console.error(chalk.red(`No setting was given for ${kind}. Use '[](...${kind}=___)'. Received:  ${query}`));
    return undefined;
  }

  return setting[1];
}

const getLineNumber = (section: string) => section.split("\n").length;

const getLineNumbersOfExportedSnippet = (content: string, exportName: string, { start, end }: Range): Range => {
  const before = content.substring(0, start);
  const snippetStartLine = getLineNumber(before) + 1;
  const after = content.substring(end).split("\n").slice(1).join("\n");
  const endSnippetInvocation = `${exportName}.${endSnippetCall}`;
  const index = after.indexOf(endSnippetInvocation); // this could use regex if proves error prone
  const snippetEndLine = after.substring(0, index).split("\n").length + snippetStartLine - 1;

  return { start: snippetStartLine, end: snippetEndLine };
}

const extractExportName = (query: string) => extractSetting(query, "export");

const exportNotGiven = (error: (msg: string) => void): Parsed<"snippet"> => {
  error("Export could not be parsed");
  return { kind: "snippet", failure: true };
}

const exportNotFound = (exportName: string, pathToFile: string, error: (msg: string) => void): Parsed<"snippet"> => {
  const seperator = "\n\t-";
  const allExportNames = seperator + exports.map(({ n }) => n).join(seperator);
  const { red, reset } = chalk;

  const msg = [red(`Could not locate export: ${exportName}`), reset(`${pathToFile} exports: ${allExportNames}`)];
  error(msg.join("\n"));
  return { kind: "snippet", failure: true };
}

const extractFromExport = (exportName: string,
  content: string,
  pathToFile: string,
  error: (msg: string) => void
): Parsed<"snippet"> => {
  const kind = "snippet";

  if (!exportName) return exportNotGiven(error);

  const lines = content.split("\n");
  const exports = parse(content)[1];
  const found = exports.filter(({ n: name }) => name === exportName);

  if (found.length !== 1) exportNotFound(exportName, pathToFile, error);

  const [{ s: start, e: end }] = found;
  const { start: snippetStart, end: snippetEnd } = getLineNumbersOfExportedSnippet(content, exportName, { start, end });
  const snippet = lines.slice(snippetStart - 1, snippetEnd - 1).join("\n");
  return { kind, content: snippetify(snippet) };
}

export const extractOrder = ({ pathToREADME, match }: ParseMatch): Parsed<"order"> => {
  const setting = extractSetting(match, "order");
  const value = parseFloat(setting);
  const valid = !isNaN(value);

  if (!valid) console.error(chalk.red(`Could not parse order preference in ${pathToREADME}: ${match}`));

  const kind = "order";
  return valid ? { kind, value } : { kind, failure: true };
}

export const extractSnippet = async ({ pathToREADME, match }: ParseMatch): Promise<Parsed<"snippet">> => {
  await init;

  const dir = path.dirname(pathToREADME);

  const error = (msg: string) => {
    console.error(chalk.redBright("Error in " + pathToREADME));
    console.error(msg);
  };

  const request = match.split("?");
  const [file] = request;

  const pathToFile = path.resolve(dir, file);

  if (!fs.existsSync(pathToFile)) {
    error(chalk.red(`Could not resolve file: ${file}`));
    return { kind: "snippet", failure: true };
  }

  const content = fs.readFileSync(pathToFile, { encoding: "utf8" });

  const useEntireFile = request.length === 1;
  const exportName = useEntireFile ? undefined : extractExportName(request[1]);

  return useEntireFile
    ? { kind: "snippet", content: snippetify(content) }
    : extractFromExport(exportName, content, pathToFile, error);
}