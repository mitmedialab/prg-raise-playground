import { ArgumentType, BlockType, registerButtonCallback, isFunction, isPrimitive, isString, Argument, BlockOperation, DynamicMenu, DynamicMenuThatAcceptsReporters, ExtensionArgumentMetadata, ExtensionBlockMetadata, ExtensionMenuItems, ExtensionMenuMetadata, ExtensionMetadata, Menu, MenuItem, MenuThatAcceptsReporters, ValueOf, VerboseArgument } from "$common";
import { BlockV2 } from "$v2/Extension";
import { ExtensionBaseConstructor } from ".";

export const extractArgNamesFromText = ({ text, arguments: args }: ExtensionBlockMetadata): string[] => {
  const textAndNumbersInBrackets = /\[([A-Za-z0-9]+)\]/gm;
  const argNames: string[] = [];
  for (const [_, result] of text.matchAll(textAndNumbersInBrackets)) {
    argNames.push(result);
  }
  return argNames;
}

export default function <T extends ExtensionBaseConstructor>(Ctor: T) {
  abstract class _ extends Ctor {

    private readonly blocks: ExtensionBlockMetadata[] = [];
    private readonly menus: Menu<any>[] = [];
    private info: ExtensionMetadata;
    private readonly argumentsByOpcode = new Map<string, string[]>();

    getOrderedArgumentNames(opcode: string): string[] {
      if (this.argumentsByOpcode.has(opcode)) return this.argumentsByOpcode.get(opcode);

      const { blocks } = this.getInfo();
      const block = (blocks as ExtensionBlockMetadata[]).find(({ opcode: op }) => opcode = op);
      const argNames = extractArgNamesFromText(block);
      this.argumentsByOpcode.set(opcode, argNames);
      return extractArgNamesFromText(block);
    }

    setInfo<Fn extends BlockOperation>(opcode: string, block: BlockV2<Fn>) {
      const { type, text } = block;

      const args: Argument<any>[] = block.args ? block.args : block.arg ? [block.arg] : [];

      const { id, runtime, menus, blocks } = this;

      const displayText = convertToDisplayText(opcode, text, args);
      const argumentsInfo = convertToArgumentInfo(opcode, args, menus);

      const info: ExtensionBlockMetadata = { opcode, text: displayText, blockType: type, arguments: argumentsInfo };

      if (type === BlockType.Button) {
        const buttonID = getButtonID(id, opcode);
        registerButtonCallback(runtime, buttonID, this[opcode].bind(this));
        info.func = buttonID;
      }

      blocks.push(info);
    }

    protected getInfo(): ExtensionMetadata {
      if (!this.info) {
        const { id, blocks, name, blockIconURI } = this;
        this.info = { id, blocks, name, blockIconURI, menus: this.collectMenus() };
      }
      return this.info;
    }

    private collectMenus() {
      return Object.fromEntries(
        this.menus
          .map((menu, index) => {
            const { isSimpleStatic, isSimpleDynamic, isStaticWithReporters, isDynamicWithReporters } = menuProbe;
            if (isSimpleStatic(menu)) return asStaticMenu(menu, false);
            if (isSimpleDynamic(menu)) return this.registerDynamicMenu(menu, false, index);
            if (isStaticWithReporters(menu)) return asStaticMenu(menu.items, true);
            if (isDynamicWithReporters(menu)) return this.registerDynamicMenu(menu.getItems, true, index);
            throw new Error("Unable to process menu");
          })
          .reduce((map, menu, index) =>
            map.set(getMenuName(index), menu),
            new Map<string, ExtensionMenuMetadata>()
          )
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