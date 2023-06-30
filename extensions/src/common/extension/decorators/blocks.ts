import type BlockUtility from "$scratch-vm/engine/block-utility";
import { TypedMethodDecorator } from ".";
import { BlockType } from "$common/types/enums";
import { BlockMetadata } from "$common/types";
import { getImplementationName } from "../mixins/base/scratchInfo/index";
import { ExtensionInstance } from "..";

/**
 * This a decorator function that should be associated with methods of your Extension class, all in order to turn your class methods
 * into Blocks that can be executed in the Block Programming Environment.
 * @param {BlockMetadata} blockInfoOrGetter Either an object or a function that returns an object of the following specified shapes 
 * (which shape is required depends on your method's argument(s)):
 * @example 
 * Block method accepts no arguments
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: string // the display text of your block
 * }
 * ```
 * @example 
 * Block method accepts one argument
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: (arg) => string, // a function that returns a string, hover over the 'text' field in your code for more thourough documentation
 *  arg: Argument, // hover over the 'arg' field in your code for more thourough documentation
 * }
 * ```
* @example 
 * Block method accepts 2 or more arguments
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: (...args) => string, // a function that returns a string, hover over the 'text' field in your code for more thourough documentation
 *  args: Argument[], // hover over the 'args' field in your code for more thourough documentation
 * }
 * ```
 * @returns A manipulated version of the original method that is
 */
export function block<
  const This extends ExtensionInstance,
  const Args extends any[],
  const Return,
  const Fn extends (...args: Args) => Return,
  const TRemoveUtil extends any[] = Args extends [...infer R extends any[], BlockUtility] ? R : Args,
>
  (
    blockInfoOrGetter: (BlockMetadata<(...args: TRemoveUtil) => Return> | ((this: This, self: This) => BlockMetadata<(...args: TRemoveUtil) => Return>))
  ): TypedMethodDecorator<This, Args, Return, (...args: Args) => Return> {

  return function (this: This, target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, Fn>) {
    const opcode = target.name;
    const internalFuncName = getImplementationName(opcode);
    context.addInitializer(function () { this.pushBlock(opcode, blockInfoOrGetter, target) });
    return (function () { return this[internalFuncName].call(this, ...arguments) }) as Function as Fn;
  };
}


type BlockFromArgsAndReturn<Args extends any[], Return> = Args extends [...infer R extends any[], BlockUtility]
  ? BlockMetadata<(...args: R) => Return> : BlockMetadata<(...args: Args) => Return>;

/**
 * This is a short-hand for invoking the block command when your `blockType` is button
 * @param text 
 * @returns 
 * @see {@link block} 
 * @example
 * // Ignore the leading "_"
 * _@buttonBlock("The text of button block")
 * buttonMethod() {
 *    this.openUI("someUI")
 * }
 * 
 */
export function buttonBlock<
  This extends ExtensionInstance,
>(text: string): TypedMethodDecorator<This, [], void, () => void> {
  type Args = [] | [BlockUtility];
  type Return = void;
  type Fn = (...args: Args) => Return;

  return block<This, Args, Return, Fn>({
    text,
    type: BlockType.Button
  });
}