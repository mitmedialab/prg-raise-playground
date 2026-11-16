import { readFileSync } from "fs";
import type { ExtensionTutorial, TutorialPosition, TutorialUITarget } from "$common";

/**
 * Reading and checking an extension's `tutorial.json`.
 * The shape it should have is described by `ExtensionTutorial` (in the extension framework's types), and,
 * for editors, by `extensions/tutorial.schema.json`. Keep them in step with the lists below.
 */

const uiTargets = ["category", "palette", "stage", "green-flag", "workspace"] as const satisfies readonly TutorialUITarget[];
const positions = ["stage-bottom-left", "stage-bottom-right", "workspace-bottom-left", "workspace-bottom-right"] as const satisfies readonly TutorialPosition[];
const conditionTypes = ["blockPlaced", "scriptRun"] as const;

const tutorialKeys = ["$schema", "steps"];
const stepKeys = ["title", "text", "target", "position", "addBlocks", "waitFor"];
const targetKeys = ["block", "button", "ui"];
const conditionKeys = { blockPlaced: ["type", "label", "block", "inside", "onTopOf"], scriptRun: ["type", "label", "block"] };

type Problems = string[];

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const quoteAll = (values: readonly string[]) => values.map(value => `"${value}"`).join(", ");

const distance = (a: string, b: string) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = above;
    }
  }
  return row[b.length];
};

/** The known property that an unknown one looks most like (for "did you mean ...?"), if any is close enough */
const closest = (key: string, known: readonly string[]) => {
  const [best] = known.map(name => ({ name, distance: distance(key.toLowerCase(), name.toLowerCase()) })).sort((a, b) => a.distance - b.distance);
  return best && best.distance <= 2 ? best.name : undefined;
};

const checkKeys = (value: Record<string, unknown>, known: readonly string[], where: string, problems: Problems) => {
  for (const key of Object.keys(value)) {
    if (known.includes(key)) continue;
    const suggestion = closest(key, known);
    problems.push(`${where}: unknown property "${key}"${suggestion ? ` (did you mean "${suggestion}"?)` : `. The properties you can use here are: ${quoteAll(known)}`}`);
  }
};

const requireText = (value: Record<string, unknown>, key: string, where: string, problems: Problems) => {
  if (!isText(value[key])) problems.push(`${where}: "${key}" is required, and has to be some text`);
};

const checkOptionalText = (value: Record<string, unknown>, key: string, where: string, problems: Problems) => {
  if (key in value && !isText(value[key])) problems.push(`${where}: "${key}" has to be some text`);
};

const checkTarget = (target: unknown, where: string, problems: Problems) => {
  if (!isObject(target)) return problems.push(`${where}: has to be an object, like { "block": "myBlock" }`);
  checkKeys(target, targetKeys, where, problems);
  const used = targetKeys.filter(key => key in target);
  if (used.length !== 1) return problems.push(`${where}: needs exactly one of ${quoteAll(targetKeys)} (it has ${used.length})`);
  const [key] = used;
  if (key === "ui") {
    if (!(uiTargets as readonly unknown[]).includes(target.ui)) problems.push(`${where}: "ui" has to be one of ${quoteAll(uiTargets)}`);
  } else if (!isText(target[key])) problems.push(`${where}: "${key}" has to be some text`);
};

const checkCondition = (condition: unknown, where: string, problems: Problems) => {
  if (!isObject(condition)) return problems.push(`${where}: has to be an object`);
  const { type } = condition;
  if (!(conditionTypes as readonly unknown[]).includes(type)) {
    return problems.push(`${where}: "type" has to be one of ${quoteAll(conditionTypes)}`);
  }
  const known = conditionKeys[type as keyof typeof conditionKeys];
  checkKeys(condition, known, where, problems);
  requireText(condition, "label", where, problems);
  requireText(condition, "block", where, problems);
  if (type === "blockPlaced") {
    checkOptionalText(condition, "inside", where, problems);
    checkOptionalText(condition, "onTopOf", where, problems);
  }
};

const checkStep = (step: unknown, number: number, problems: Problems) => {
  const where = `Step ${number}`;
  if (!isObject(step)) return problems.push(`${where}: has to be an object`);
  const name = isText(step.title) ? `${where} ("${step.title}")` : where;

  checkKeys(step, stepKeys, name, problems);
  requireText(step, "title", name, problems);
  requireText(step, "text", name, problems);
  if ("target" in step) checkTarget(step.target, `${name}, "target"`, problems);
  if ("position" in step && !(positions as readonly unknown[]).includes(step.position)) {
    problems.push(`${name}: "position" has to be one of ${quoteAll(positions)}`);
  }
  if ("addBlocks" in step) {
    if (!Array.isArray(step.addBlocks) || !step.addBlocks.every(isText)) problems.push(`${name}: "addBlocks" has to be a list of block opcodes, like ["event_whenflagclicked"]`);
  }
  if ("waitFor" in step) {
    if (!Array.isArray(step.waitFor) || step.waitFor.length === 0) problems.push(`${name}: "waitFor" has to be a list with at least one condition`);
    else step.waitFor.forEach((condition, index) => checkCondition(condition, `${name}, "waitFor" item ${index + 1}`, problems));
  }
};

/**
 * Finds what is wrong with a tutorial.
 * @returns A sentence for each problem, each saying where it is (so an empty list means it is fine)
 */
export const validateTutorial = (tutorial: unknown): Problems => {
  const problems: Problems = [];
  if (!isObject(tutorial)) return ["The file has to contain an object, like { \"steps\": [ ... ] }"];
  checkKeys(tutorial, tutorialKeys, "The file", problems);
  if (!Array.isArray(tutorial.steps) || tutorial.steps.length === 0) {
    problems.push(`The file: "steps" is required, and has to be a list with at least one step`);
    return problems;
  }
  tutorial.steps.forEach((step, index) => checkStep(step, index + 1, problems));
  return problems;
};

/**
 * Reads an extension's `tutorial.json`, and makes sure it is valid.
 * @param file Path to the file
 * @throws An error that says what is wrong, if the file isn't valid JSON, or isn't a valid tutorial
 */
export const readTutorial = (file: string): ExtensionTutorial => {
  let content: unknown;
  try {
    content = JSON.parse(readFileSync(file, { encoding: "utf-8" }));
  } catch (error) {
    throw new Error(`Could not read ${file} as JSON: ${error instanceof Error ? error.message : error}`);
  }
  const problems = validateTutorial(content);
  if (problems.length > 0) throw new Error(`There are problems with the tutorial in ${file}:\n${problems.map(problem => `  - ${problem}`).join("\n")}`);
  // `$schema` only exists to help editors, so it isn't part of the tutorial
  const { $schema, ...tutorial } = content as ExtensionTutorial & { $schema?: string };
  return tutorial;
};
