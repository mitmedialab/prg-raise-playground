import { Argument, MenuThatAcceptsReporters, VerboseArgument, DynamicMenuThatAcceptsReporters, BlockOperation, Menu } from "../../types";
import { BlockV2, ExtensionV2 } from "../Extension";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { identity, isFunction, isPrimitive, isString } from "../../utils";
import CustomArgumentManager from "../../customArguments/CustomArgumentManager";
import { ArgumentType, BlockType } from "../../enums";
import { getArgumentType } from "../mixins/scratchInfo";
import { castToType } from "../../cast";
import { TypedMethodDecorator } from ".";

type BlockInfo<Fn extends BlockOperation> = BlockV2<Fn>
type BlockGetter<This, Fn extends BlockOperation> = (this: This, self: This) => BlockV2<Fn>;

const isBlockGetter = <This, Fn extends BlockOperation>(details: BlockInfo<Fn> | BlockGetter<This, Fn>): details is BlockGetter<This, Fn> => isFunction(details);

type BlockFromArgsAndReturn<Args extends any[], Return> = Args extends [...infer R extends any[], BlockUtility]
  ? BlockV2<(...args: R) => Return> : BlockV2<(...args: Args) => Return>;

export function block<
  This extends ExtensionV2,
  Args extends any[],
  const Return,
  Fn extends (...args: Args) => Return,
  BlockFunction extends BlockFromArgsAndReturn<Args, Return>
>
  (blockInfoOrGetter: BlockFunction | ((this: This, self: This) => BlockFunction)): TypedMethodDecorator<This, Args, Return, (...args: Args) => Return> {

  return function (this: This, target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, Fn>) {
    const block = isBlockGetter(blockInfoOrGetter) ? blockInfoOrGetter.call(this, this) as BlockV2<Fn> : blockInfoOrGetter;

    context.addInitializer(() => this.setInfo(context.name as string, block));

    if (block.type === BlockType.Button) return target;

    const args: Argument<any>[] = block.arg ? [block.arg] : block.args;
    const handlers = extractHandlers(args);

    return (
      function (argsFromScratch, blockUtility) {
        const castedArguments = this.getOrderedArgumentNames()
          .map(name => argsFromScratch[name])
          .map((param: any, index) => {
            const type = getArgumentType(args[index]);
            const handler = handlers[index] ?? identity;

            if (type !== ArgumentType.Custom) return castToType(type, handler(param));

            const notCustomArgument = !(isString(param) && CustomArgumentManager.IsIdentifier(param));
            if (notCustomArgument) return handler(param);

            const { value } = this.customArgumentManager.getEntry(param);
            return handler(value);
          });

        return (target as any)(...castedArguments, blockUtility);
      }
    ) as any as Fn;
  };
}

const isVerbose = (arg: Argument<any>): arg is VerboseArgument<any> => !isPrimitive(arg);
const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
const hasHandler = (options: Menu<any>): options is MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any> => options && handlerKey in options;

const extractHandlers = (args: Argument<any>[]): (MenuThatAcceptsReporters<any>['handler'] | undefined)[] => args.map(element => {
  if (!isVerbose(element)) return undefined;
  const { options } = element;
  if (!hasHandler(options)) return undefined;
  return options.handler;
});


export function buttonBlock<
  This extends ExtensionV2,
>(text: string): TypedMethodDecorator<This, [], void, () => void> {
  type Args = [] | [BlockUtility];
  type Return = void;
  type Fn = (...args: Args) => Return;

  return block<This, Args, Return, Fn, BlockFromArgsAndReturn<Args, Return>>({
    text,
    type: BlockType.Button
  });
}