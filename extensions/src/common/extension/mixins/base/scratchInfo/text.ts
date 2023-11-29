import { AnyBlock, OneArgBlock, MultipleArgsBlock, Argument } from "$common/types";
import { isString } from "$common/utils";
import { getArgName } from "./args";
import { format } from "./util";

const isDynamicText = (text: AnyBlock["text"]): text is (OneArgBlock["text"] | MultipleArgsBlock["text"]) => !isString(text);

export const convertToDisplayText = (opcode: string, text: AnyBlock["text"], args: readonly Argument<any>[]) => {
  if (!args || args.length === 0) return text as string;

  if (!isDynamicText(text)) return format(text, opcode, `Block text for '${opcode}'`);

  const textFunc: (...args: any[]) => string = text;
  const argPlaceholders = args.map((_, index) => `[${getArgName(index)}]`);
  return format(textFunc(...argPlaceholders), opcode, `Block text for '${opcode}'`);
}