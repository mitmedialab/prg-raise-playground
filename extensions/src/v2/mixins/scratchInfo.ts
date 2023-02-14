import { ArgumentType, BlockType, registerButtonCallback, isFunction, isPrimitive, isString, Argument, BlockOperation, DynamicMenu, DynamicMenuThatAcceptsReporters, ExtensionArgumentMetadata, ExtensionBlockMetadata, ExtensionMenuItems, ExtensionMenuMetadata, ExtensionMetadata, Menu, MenuItem, MenuThatAcceptsReporters, ValueOf, VerboseArgument, CustomArgumentManager, castToType, identity } from "$common";
import { BlockV2, ExtensionBaseConstructor, ExtensionV2 } from "$v2/Extension";
import customArguments from "./customArguments";

export type BlockInfo<Fn extends BlockOperation> = BlockV2<Fn>
export type BlockGetter<This, Fn extends BlockOperation> = (this: This, self: This) => BlockV2<Fn>;
type BlockDefinition<T, Fn extends BlockOperation> = BlockInfo<Fn> | BlockGetter<T, Fn>;

export const extractArgNamesFromText = (text: string): string[] => {
  const textAndNumbersInBrackets = /\[([A-Za-z0-9]+)\]/gm;
  const argNames: string[] = [];
  for (const [_, result] of text.matchAll(textAndNumbersInBrackets)) {
    argNames.push(result);
  }
  return argNames;
}

export const getImplementationName = (opcode: string) => `${opcode}_implementation`;

export const wrapOperation = (context: any, operation: BlockOperation, args: { name: string, type: ValueOf<typeof ArgumentType>, handler: Handler }[]) => {
  return function (this: ExtensionV2, argsFromScratch, blockUtility) {
    const castedArguments = args.map(({ name, type, handler }) => {
      const param = argsFromScratch[name];
      switch (type) {
        case ArgumentType.Custom:
          const isIdentifier = isString(param) && CustomArgumentManager.IsIdentifier(param);
          const value = isIdentifier ? this.customArgumentManager.getEntry(param).value : param;
          return handler(value);
        default:
          return castToType(type, handler(param));
      }
    });
    return operation.call(context, ...castedArguments, blockUtility);
  }
}

export default function <T extends ExtensionBaseConstructor & ReturnType<typeof customArguments>>(Ctor: T) {
  type BlockEntry = { definition: BlockDefinition<_, BlockOperation>, operation: BlockOperation };
  type BlockMap = Map<string, BlockEntry>;

  abstract class _ extends Ctor {
    private readonly blockMap: BlockMap = new Map();

    private readonly menus: Menu<any>[] = [];
    private info: ExtensionMetadata;
    private readonly argumentsByOpcode = new Map<string, string[]>();

    pushBlock<Fn extends BlockOperation>(opcode: string, block: BlockDefinition<any, Fn>, operation: BlockOperation) {
      if (this.blockMap.has(opcode)) throw new Error(`Attempt to push block with opcode ${opcode}, but it was already set. This is assumed to be a mistake.`)
      this.blockMap.set(opcode, { definition: block, operation });
    }

    protected getInfo(): ExtensionMetadata {
      if (!this.info) {
        const blocks = Array.from(this.blockMap.entries()).map(entry => this.convertToInfo(entry));
        const { id, name, blockIconURI } = this;
        this.info = { id, blocks, name, blockIconURI, menus: this.collectMenus() };
      }
      return this.info;
    }

    private convertToInfo<Fn extends BlockOperation>(details: [opcode: string, entry: BlockEntry]) {
      const [opcode, entry] = details;
      const { definition, operation } = entry;
      const block = isBlockGetter<BlockOperation>(definition) ? definition.call(this, this) as BlockV2<Fn> : definition;

      const { type, text } = block;

      const args: Argument<any>[] = block.args ? block.args : block.arg ? [block.arg] : [];

      const { id, runtime, menus } = this;

      const displayText = convertToDisplayText(opcode, text, args);
      const argumentsInfo = convertToArgumentInfo(opcode, args, menus);

      const info: ExtensionBlockMetadata = { opcode, text: displayText, blockType: type, arguments: argumentsInfo };

      switch (type) {
        case BlockType.Button:
          const buttonID = getButtonID(id, opcode);
          registerButtonCallback(runtime, buttonID, operation.bind(this));
          info.func = buttonID;
          return info;
        default:
          const implementationName = getImplementationName(opcode);
          this[implementationName] = wrapOperation(this, operation, zipArgs(args));
          return info;
      }
    }

    private collectMenus() {
      const { isSimpleStatic, isSimpleDynamic, isStaticWithReporters, isDynamicWithReporters } = menuProbe;
      return Object.fromEntries(
        this.menus
          .map((menu, index) => {
            if (isSimpleStatic(menu)) return asStaticMenu(menu, false);
            if (isSimpleDynamic(menu)) return this.registerDynamicMenu(menu, false, index);
            if (isStaticWithReporters(menu)) return asStaticMenu(menu.items, true);
            if (isDynamicWithReporters(menu)) return this.registerDynamicMenu(menu.getItems, true, index);
            throw new Error("Unable to process menu");
          })
          .reduce((map, menu, index) => map.set(getMenuName(index), menu), new Map<string, ExtensionMenuMetadata>())
      );
    }

    private registerDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean, menuIndex: number) {
      const key = `internal_dynamic_${menuIndex}`; // legacy support?
      this[key] = () => getItems().map(item => item).map(convertMenuItemsToString);
      return { acceptReporters, items: key } satisfies ExtensionMenuMetadata
    }
  }

  return _;
}

const zipArgs = (args: Argument<any>[], names?: string[]) => {
  const types = args.map(getArgumentType);
  const handlers = extractHandlers(args);
  names ??= types.map((_, index) => getArgName(index));
  const lengths = new Set();
  lengths.add(types.length).add(handlers.length).add(names.length);
  if (lengths.size !== 1) throw new Error("Zip failed because collections weren't equal length");
  return types.map((type, index) => ({ type, name: names[index], handler: handlers[index] }));
}

const isBlockGetter = <Fn extends BlockOperation>(details: BlockInfo<Fn> | BlockGetter<any, Fn>): details is BlockGetter<any, Fn> => isFunction(details);

const format = (text: string, identifier: string, description: string): string => {
  return text; // make use of formatMessage in the future
}

const isDynamicText = (text: Block.Any["text"]): text is (...args: any[]) => string => !isString(text);

const convertMenuItemsToString = (item: any | MenuItem<any>) =>
  isPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };

const getArgTranslationID = (blockname: string, index: number) => {
  return `${blockname}-arg${index}-default`;
}

const getButtonID = (id: string, opcode: string) => `${id}_${opcode}`;

export const getArgumentType = <T>(arg: Argument<T>): ValueOf<typeof ArgumentType> =>
  isPrimitive(arg) ? arg as ValueOf<typeof ArgumentType> : (arg as VerboseArgument<T>).type;

const convertToDisplayText = (opcode: string, text: Block.Any["text"], args: Argument<any>[]) => {
  if (!args || args.length === 0) return text as string;

  validateText(text, args.length);

  if (!isDynamicText(text)) return format(text, opcode, `Block text for '${opcode}'`);

  const argPlaceholders = args.map((_, index) => `[${getArgName(index)}]`);
  return format(text(...argPlaceholders), opcode, `Block text for '${opcode}'`);
}

const convertToArgumentInfo = (opcode: string, args: Argument<any>[], menus: Menu<any>[]) => {
  if (!args || args.length === 0) return undefined;

  const argumentsInfo = args
    .map((element, index) => {
      const entry = {} as ExtensionArgumentMetadata;
      entry.type = getArgumentType(element);

      if (isPrimitive(element)) return entry;

      const { defaultValue, options } = element as VerboseArgument<any>;

      setDefaultValue(entry, opcode, index, defaultValue);
      setMenu(entry, options, menus);

      return entry;
    })
    .reduce((accumulation, entry, index) => {
      accumulation[getArgName(index)] = entry;
      return accumulation;
    }, {});

  return argumentsInfo;
}


const getArgName = (index: number) => `${index}`;
const getMenuName = (index: number) => `${index}`;

const getDefaultValue = (defaultValue: any, opcode: string, index: number) => isString(defaultValue)
  ? format(defaultValue, getArgTranslationID(opcode, index), `Default value for arg ${index + 1} of ${opcode} block`)
  : defaultValue;

const setDefaultValue = (entry: ExtensionArgumentMetadata, opcode: string, index: number, defaultValue: any,) => {
  if (defaultValue === undefined) return;
  entry.defaultValue = getDefaultValue(defaultValue, opcode, index)
}

const addOptionsAndGetMenuName = (options: Menu<any>, menus: Menu<any>[],) => {
  const alreadyAddedIndex = menus.indexOf(options);
  const menuIndex = alreadyAddedIndex >= 0 ? alreadyAddedIndex : menus.push(options) - 1;
  return `${getMenuName(menuIndex)}`;
}

const setMenu = (entry: ExtensionArgumentMetadata, options: Menu<any>, menus: Menu<any>[]) => {
  if (!options) return;
  entry.menu = addOptionsAndGetMenuName(options, menus);
}

const validateText = (text: Block.Any["text"], argCount: number) => {
  // TODO: Check that no numbers within square brackets appear in text
  return true;
}

type Handler = (MenuThatAcceptsReporters<any>['handler']);
const isVerbose = (arg: Argument<any>): arg is VerboseArgument<any> => !isPrimitive(arg);
const handlerKey: keyof MenuThatAcceptsReporters<any> = 'handler';
const hasHandler = (options: Menu<any>): options is MenuThatAcceptsReporters<any> | DynamicMenuThatAcceptsReporters<any> => options && handlerKey in options;

const extractHandlers = (args: Argument<any>[]): Handler[] => args.map(element => {
  if (!isVerbose(element)) return identity;
  const { options } = element;
  if (!hasHandler(options)) return identity;
  return options.handler;
});

const reporterItemsKey: keyof MenuThatAcceptsReporters<any> = "items";
const reporterItemsGetterKey: keyof DynamicMenuThatAcceptsReporters<any> = "getItems";

const menuProbe = {
  isSimpleStatic: (menu: Menu<any>): menu is any[] | MenuItem<any>[] => Array.isArray(menu),
  isSimpleDynamic: (menu: Menu<any>): menu is DynamicMenu<any> => isFunction(menu),
  isStaticWithReporters: (menu: Menu<any>): menu is MenuThatAcceptsReporters<any> => reporterItemsKey in menu,
  isDynamicWithReporters: (menu: Menu<any>): menu is DynamicMenuThatAcceptsReporters<any> => reporterItemsGetterKey in menu,
}

const asStaticMenu = (items: MenuItem<any>[], acceptReporters: boolean) => ({
  acceptReporters,
  items: items
    .map(item => item /**TODO figure out how to format */)
    .map(convertMenuItemsToString)
} satisfies ExtensionMenuMetadata);

namespace Block {
  export type NoArgs = BlockV2<() => any>;
  export type OneArg = BlockV2<(arg: any) => any>;
  export type MultipleArgs = BlockV2<(...args: [any, any]) => any>;
  export type Any = NoArgs | OneArg | MultipleArgs;
}