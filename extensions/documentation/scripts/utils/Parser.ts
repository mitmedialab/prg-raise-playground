import { extractOrder, extractSnippet } from "./extract";

export type Kind = "order" | "snippet";

type Base<TKind extends Kind> = { kind: TKind }

type Failure = { failure: true }

type Optional<TKind extends Kind, T> = (T | Failure) & Base<TKind>;

const payloadDefaults = {
  "order": { value: Number.MAX_SAFE_INTEGER },
  "snippet": { content: "" },
} satisfies Record<Kind, any>;

export type Parsed<TKind extends Kind> = Optional<TKind, typeof payloadDefaults[TKind]>;

export type ParseRequest = { pathToREADME: string, query: string };
export type ParseMatch = { pathToREADME: string, match: string };

export type OnParse = {
  [k in Kind]: {
    success: (response: typeof payloadDefaults[k]) => void,
    failure: () => void,
  }
}

export const failed = <TK extends Kind>(parsed: Parsed<TK>): parsed is Failure & Parsed<TK> => "failure" in parsed;

export default class Parser {

  static Process = async ({ query, pathToREADME }: ParseRequest, onMatch: OnParse) => {
    if (!Parser.Regex.test(query)) return;

    const [_, match] = Parser.Regex.exec(query);
    const result = { match, pathToREADME };

    const extracted = match.startsWith("order")
      ? await Promise.resolve(extractOrder(result))
      : await extractSnippet(result);

    "failure" in extracted
      ? onMatch[extracted.kind].failure()
      : onMatch[extracted.kind].success(extracted as any);
  }

  /**
   * Global regex (mark with 'g' flag) can behave confusingly when being reused.
   * To make for the most readable code, we instead create a new instance everytime.
   * @see https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
   */
  private static get Regex() { return /\[\]\((.+)\)/gm }
}
