import { CustomArgumentManager, Argument, MenuThatAcceptsReporters, VerboseArgument, DynamicMenuThatAcceptsReporters, BlockOperation, Menu, identity, isFunction, isPrimitive, isString, ArgumentType, BlockType, castToType } from "$common";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { TypedMethodDecorator, BlockV2, ExtensionV2, getArgumentType } from "$v2/index";

type BlockInfo<Fn extends BlockOperation> = BlockV2<Fn>
type BlockGetter<This, Fn extends BlockOperation> = (this: This, self: This) => BlockV2<Fn>;

const isBlockGetter = <This, Fn extends BlockOperation>(details: BlockInfo<Fn> | BlockGetter<This, Fn>): details is BlockGetter<This, Fn> => isFunction(details);

type BlockFromArgsAndReturn<Args extends any[], Return> = Args extends [...infer R extends any[], BlockUtility]
  ? BlockV2<(...args: R) => Return> : BlockV2<(...args: Args) => Return>;

export function block<
  This extends ExtensionV2,
  const Args extends any[],
  const Return,
  const Fn extends (...args: Args) => Return,
  BlockFunction extends BlockV2<Fn>
>
  (blockInfoOrGetter: BlockFunction | ((this: This, self: This) => BlockFunction)): TypedMethodDecorator<This, Args, Return, (...args: Args) => Return> {

  return function (this: This, target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, Fn>) {
    const block = isBlockGetter(blockInfoOrGetter) ? blockInfoOrGetter.call(this, this) as BlockV2<Fn> : blockInfoOrGetter;

    const opcode = target.name;

    context.addInitializer(function () { this.setInfo(opcode, block) });

    if (block.type === BlockType.Button) return target;

    const args: Argument<any>[] = block.arg ? [block.arg] : block.args;
    const argTypes = args.map(getArgumentType);
    const handlers = extractHandlers(args);

    return (
      function (this: This, argsFromScratch, blockUtility) {
        const castedArguments = this.getOrderedArgumentNames(opcode)
          .map(name => argsFromScratch[name])
          .map((param, index) => ({ param, type: argTypes[index], handler: handlers[index] }))
          .map(({ param, handler, type }) => {
            switch (type) {
              case ArgumentType.Custom:
                const isIdentifier = isString(param) && CustomArgumentManager.IsIdentifier(param);
                const value = isIdentifier ? this.customArgumentManager.getEntry(param).value : param;
                return handler(value);
              default:
                return castToType(type, handler(param));
            }
          });

        return (target as any)(...castedArguments, blockUtility);
      }
    ) as Function as Fn;
  };
}

const isVerbose = (arg: Argument<any>): arg is VerboseArgument<any> => !isPrimitive(arg);
const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
const hasHandler = (options: Menu<any>): options is MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any> => options && handlerKey in options;

const extractHandlers = (args: Argument<any>[]): (MenuThatAcceptsReporters<any>['handler'])[] => args.map(element => {
  if (!isVerbose(element)) return identity;
  const { options } = element;
  if (!hasHandler(options)) return identity;
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