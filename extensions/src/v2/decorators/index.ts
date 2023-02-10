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

export * from "$src/v2/decorators/blocks";
export * from "$src/v2/decorators/extension";
export * from "$src/v2/decorators/legacy";