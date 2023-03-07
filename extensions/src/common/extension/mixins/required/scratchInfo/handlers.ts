import { Argument, DynamicMenuThatAcceptsReporters, Menu, MenuThatAcceptsReporters, VerboseArgument } from "$common/types";
import { isPrimitive, identity } from "$common/utils";

export type Handler = (MenuThatAcceptsReporters<any>['handler']);
const isVerbose = (arg: Argument<any>): arg is VerboseArgument<any> => !isPrimitive(arg);
const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
const hasHandler = (options: Menu<any>): options is MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any> => options && handlerKey in options;

export const extractHandlers = (args: readonly Argument<any>[]): Handler[] => args.map(element => {
  if (!isVerbose(element)) return identity;
  const { options } = element;
  if (!hasHandler(options)) return identity;
  return options.handler;
});