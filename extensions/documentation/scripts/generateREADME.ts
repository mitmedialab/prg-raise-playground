import path from "path";
import fs from "fs";
import chalk from "chalk";
import Parser from "./utils/Parser";

const fileOptions = { encoding: "utf8" } as const;

const documentationRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(documentationRoot, "src");
const extensionsRoot = path.resolve(documentationRoot, "..");
const projectRoot = path.resolve(extensionsRoot, "..");
const fileToEdit = path.join(extensionsRoot, "README.md");

const process = async (pathToREADME: string): Promise<{ order: number, content: string, pathToREADME: string }> => {
  const orderError = "Error! This documentation could not be ordered correctly. Please contact the repo maintainer.";
  const snippetError = "Error! This snippet couldn't be located. Please contact the repo maintainer.";

  const lines = fs.readFileSync(pathToREADME, { encoding: "utf8" }).split("\n");

  const relativePath = path.relative(srcDir, pathToREADME);

  let order = Number.MAX_SAFE_INTEGER;

  let numberOfSnippets = 0;
  let orderSet = false;

  for (let index = lines.length; index >= 0; index--) {
    const request = { pathToREADME, query: lines[index] };
    const lineNumber = index + 1;

    await Parser.Process(request,
      {
        order: {
          success: ({ value }) => {
            order = value;
            lines.splice(index, 1);
            if (orderSet) console.log(chalk.red(`Multiple order settings given for: ${relativePath}`));
            orderSet = true;
          },
          failure: () => {
            console.error(chalk.red(`Unable to set order for ${relativePath} (line ${lineNumber}: ${lines[index]})`));
            lines[index] = orderError;
          }
        },
        snippet: {
          success: ({ content }) => {
            lines[index] = content;
            numberOfSnippets++;
          },
          failure: () => {
            console.error(chalk.red(`Unable to replace snippet in ${relativePath} on line ${index + 1}: ${lines[index]}`));
            lines[index] = snippetError;
          }
        }
      }
    );
  }

  const message = `Replaced ${numberOfSnippets} snippet${numberOfSnippets === 1 ? "" : "s"} in ${relativePath}`
    + (orderSet ? ` and order was set to '${order}'` : "");

  console.log(chalk.cyan(message));

  return { order, content: lines.join("\n"), pathToREADME };
}

const generatedGuard = "GeneratedContentGuard";

const invalidNames = [".", ".."];

const directories = fs.readdirSync(srcDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(({ name }) => name)
  .filter(name => !invalidNames.includes(name))
  .map(name => path.join(srcDir, name));

const readmeFiles = directories
  .map(directory => path.join(directory, "README.md"))
  .filter(readme => fs.existsSync(readme));

console.log(chalk.green(`Identified the following directories with READMEs to process inside of ${path.relative(projectRoot, srcDir)}:`));
console.log(chalk.green(`- ${readmeFiles.map(fullPath => path.relative(srcDir, path.dirname(fullPath))).join("\n- ")}`));

type Entry = Awaited<ReturnType<typeof process>>;
type Entries = Entry[];
type OrderedEntries = Omit<Entry, "order">[];

const sortByOrder = ({ order: a }: Entry, { order: b }: Entry) => a - b;

const sortEntries = (entries: Entries): OrderedEntries => {
  entries.sort(sortByOrder);
  return entries;
}

const addIsGeneratedWarning = (entries: OrderedEntries): OrderedEntries => {
  const warning = "\n> NOTE: This is a generated README section, so no edits you make to it in this file will be saved. \nIf you want to edit it, please go to ";
  const repoURL = "mitmedialab/prg-extension-boilerplate/tree/dev";
  return entries.map(({ content, pathToREADME }) => {
    const lines = content.split("\n");
    const relativeToDocumentation = path.relative(extensionsRoot, pathToREADME);
    const relativeToExtensions = path.join("extensions", path.relative(extensionsRoot, pathToREADME));
    lines.splice(1, 0, warning + `[${relativeToExtensions}](${relativeToDocumentation})`);
    return { pathToREADME, content: lines.join("\n") }
  });
}

const createTOC = (entries: OrderedEntries): OrderedEntries => {
  /**
   * @see https://stackoverflow.com/a/43276249
   */
  const toMarkdownAnchor = (header: string) => {
    const anchor = header
      .toLowerCase()
      .replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*/gm, "") // remove punctuation
      .replaceAll(" ", "-");
    return anchor.startsWith("-") ? `#${anchor.substring(1)}` : "#" + anchor;
  }

  const headers: { anchor: string, title: string }[] = entries
    .map(({ content }) => {
      const [firstLine,] = content.split("\n");
      const isHeader = /#+\s*([A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]+)/gm; // match any letter, digit, or punctuation with spaces
      return { match: isHeader.exec(firstLine), firstLine };
    })
    .filter(({ match }) => match !== null)
    .map(({ match: [_, title], firstLine }) => ({ anchor: toMarkdownAnchor(firstLine), title }))


  if (headers.length === 0) return entries;

  const toc = [
    "# Table of Contents",
    ...headers.map(({ anchor, title }, index) => `${index + 1}. [${title}](${anchor})`)
  ].join("\n");

  return [{ content: toc, pathToREADME: "Table of Contes" }, ...entries];
}

const concat = (entries: OrderedEntries) => entries.map(({ content }) => content).join("\n\n");

Promise.all(readmeFiles.map(process))
  .then(sortEntries)
  .then(addIsGeneratedWarning)
  .then(createTOC)
  .then(concat)
  .then(content => {

    const linesToEdit = fs.readFileSync(fileToEdit, fileOptions).split("\n");

    const guards = linesToEdit
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value.includes(generatedGuard));

    if (guards.length !== 2) {
      throw new Error(`Found ${guards.length} code generation guards, but expected 2 (one for start, one for end).`)
    }

    const [guardStart, guardEnd] = guards;

    const updates = [
      ...linesToEdit.slice(0, guardStart.index + 1),
      content,
      ...linesToEdit.slice(guardEnd.index)
    ].join("\n");

    fs.writeFileSync(fileToEdit, updates, fileOptions);

    console.log(chalk.green(`Content succesfully written to: ${path.relative(projectRoot, fileToEdit)}`));
  });