import type BlockUtility from "$scratch-vm/engine/block-utility";
import { TypedMethodDecorator } from ".";
import { BlockV2, DecoratedExtension } from "$common/extension/Extension";
import { getImplementationName } from "$common/extension/mixins/scratchInfo";
import { BlockType } from "$common/enums";

type BlockFromArgsAndReturn<Args extends any[], Return> = Args extends [...infer R extends any[], BlockUtility]
  ? BlockV2<(...args: R) => Return> : BlockV2<(...args: Args) => Return>;

export function block<
  This extends DecoratedExtension,
  const Args extends any[],
  const Return,
  const Fn extends (...args: Args) => Return,
  BlockFunction extends BlockV2<Fn>
>
  (blockInfoOrGetter: BlockFunction | ((this: This, self: This) => BlockFunction)): TypedMethodDecorator<This, Args, Return, (...args: Args) => Return> {

  return function (this: This, target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, Fn>) {
    const opcode = target.name;
    const internalFuncName = getImplementationName(opcode);
    context.addInitializer(function () { this.pushBlock(opcode, blockInfoOrGetter, target) });
    return (function () { return this[internalFuncName].call(this, ...arguments) }) as Function as Fn;
  };
}

export function buttonBlock<
  This extends DecoratedExtension,
>(text: string): TypedMethodDecorator<This, [], void, () => void> {
  type Args = [] | [BlockUtility];
  type Return = void;
  type Fn = (...args: Args) => Return;

  return block<This, Args, Return, Fn, BlockFromArgsAndReturn<Args, Return>>({
    text,
    type: BlockType.Button
  });
}