import { ExtensionMenuDisplayDetails, Block, BaseExtension, Argument, ValueOf, RGBObject, MenuThatAcceptsReporters, VerboseArgument, DynamicMenuThatAcceptsReporters, BlockOperation } from "./types";
import { BlockV2, ExtensionV2 } from "./ExtensionV2";
import type BlockUtility from "$scratch-vm/engine/block-utility";
import { identity, isFunction, isString } from "./utils";
import CustomArgumentManager from "./customArguments/CustomArgumentManager";
import { ArgumentType, BlockType } from "./enums";
import { extractLegacyInformation, getArgumentType } from "./ExtensionMixins/scratchInfo";
import { castToType } from "./cast";

type TypedMethodDecorator<
  This,
  Args extends any[],
  Return,
  Fn extends (...args: Args) => Return
> = (target: Fn, context: ClassMethodDecoratorContext<This, Fn>) => Fn;

type BlockInfo<Fn extends BlockOperation> = BlockV2<Fn>
type BlockGetter<This, Fn extends BlockOperation> = (this: This, self: This) => BlockV2<Fn>;

const isBlockGetter = <This, Fn extends BlockOperation>(details: BlockInfo<Fn> | BlockGetter<This, Fn>): details is BlockGetter<This, Fn> => isFunction(details);

export function block<
  This extends ExtensionV2,
  Args extends any[], Return,
  Fn extends (...args: Args) => Return
>
  (blockInfoOrGetter: BlockV2<Fn> | ((this: This, self: This) => BlockV2<Fn>)): TypedMethodDecorator<This, Args, Return, (...args: Args) => Return> {

  return function (target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, Fn>) {
    const block = isBlockGetter(blockInfoOrGetter) ? blockInfoOrGetter.call(this, this) as BlockV2<Fn> : blockInfoOrGetter;

    const { customArgumentManager } = this;

    context.addInitializer(function () {
      this.setInfo(context.name as string, block);
    });

    const { type, text } = block;

    if (type === "button") return target;

    const args: Argument<any>[] = block.arg ? [block.arg] : block.args;
    const isLegacy = extractLegacyInformation(block) !== undefined;

    type Handler = MenuThatAcceptsReporters<any>['handler'];
    const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';

    const handlers: (Handler | undefined)[] = args.map((element, index) => {
      const { options } = element as VerboseArgument<any>;
      if (!options || !(handlerKey in options)) return undefined;

      const { handler } = options as MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any>;
      handlers[index] = handler;
    });

    const orderedArgumentNames = isFunction(text)
      ? args.map((arg, index) => isLegacy ? extractLegacyInformation(arg)?.name : index)
      : [];

    return (
      function (argsFromScratch, blockUtility) {
        const { mutation } = argsFromScratch; // if we need it...

        const uncasted = isLegacy
          ? orderedArgumentNames.map(name => argsFromScratch[name])
          // NOTE: Assumption is that args order will be correct since their keys are parsable as ints (i.e. '0', '1', ...)
          : Object.values(argsFromScratch).slice(0, -1);

        const casted = uncasted.map((param: any, index) => {
          const type = getArgumentType(args[index]);
          const handler = handlers[index] ?? identity;

          return type !== ArgumentType.Custom
            ? castToType(type, handler(param))
            : !(isString(param) && CustomArgumentManager.IsIdentifier(param))
              ? handler(param)
              : handler(customArgumentManager.getEntry(param).value)
        });

        return (target as any)(...casted, blockUtility);
      }
    ) as any as Fn;
  };
}

export function buttonBlock<
  This extends ExtensionV2,
>(text: string): TypedMethodDecorator<This, [], void, () => void> {
  return block<This, [], void, () => void>({
    text,
    type: BlockType.Button
  });
}

type TypedClassDecorator<This, Args extends any[]> = (
  value: new (...args: Args) => This,
  context: ClassDecoratorContext
) => (new (...args: Args) => This) | void;

export function category<T extends ExtensionV2, Args extends any[]>(details: ExtensionMenuDisplayDetails): TypedClassDecorator<T, Args> {
  return (value) => {
    console.log(details);;
  }
}

