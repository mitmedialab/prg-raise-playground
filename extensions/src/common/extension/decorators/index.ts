export type TypedClassDecorator<This, Args extends any[]> = (
  value: new (...args: Args) => This,
  context: ClassDecoratorContext<new (...args: Args) => This>
) => (new (...args: Args) => This) | void;

export type TypedMethodDecorator<
  This,
  Args extends any[],
  Return,
  Fn extends (...args: Args) => Return
> = (target: Fn, context: ClassMethodDecoratorContext<This, Fn>) => Fn;

export type TypedSetterDecorator<This, Arg, Fn extends (args: Arg) => void> =
  (target: Fn, context: ClassSetterDecoratorContext<This, Fn>) => Fn;

export type TypedGetterDecorator<This, Return> =
  (target: () => Return, context: ClassGetterDecoratorContext<This, Return>) => () => Return;
