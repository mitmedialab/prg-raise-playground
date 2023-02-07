import { Argument, BlockOperation, DynamicMenu, DynamicMenuThatAcceptsReporters, ExtensionArgumentMetadata, ExtensionBlockMetadata, ExtensionMenuItems, Menu, MenuItem, MenuThatAcceptsReporters, ValueOf, VerboseArgument } from "$common/types";
import { BlockV2 } from "$common/ExtensionV2";
import { ExtensionConstructor } from ".";
import { isFunction, isPrimitive, isString } from "$common/utils";
import { ArgumentType, BlockType } from "$common/enums";
import { registerButtonCallback } from "$common/ui";

export default function <T extends ExtensionConstructor>(Ctor: T) {
  abstract class _ extends Ctor {

    private readonly internal_blocks: ExtensionBlockMetadata[] = [];
    private readonly internal_menus: (ExtensionMenuItems & { name: string })[] = [];
    private readonly menus: Menu<any>[] = []
    private readonly menuNames: string[] = [];

    private keyByLegacyName: Record<string | symbol, string> = undefined;

    setInfo<Fn extends BlockOperation>(key: string, block: BlockV2<Fn>) {
      const { type, text } = block;
      const args: Argument<any>[] = block.arg ? [block.arg] : block.args;

      const legacyInfo = extractLegacyInformation(block);
      const isLegacy = legacyInfo !== undefined;

      const { id, runtime, keyByLegacyName, menus, menuNames, internal_blocks } = this;

      const displayText = convertToDisplayText(key, text, args, isLegacy);
      const argumentsInfo = convertToArgumentInfo(key, args, menus, menuNames);

      const opcode = isLegacy ? legacyInfo.name : key;

      if (isLegacy) {
        keyByLegacyName ? keyByLegacyName[key] = legacyInfo.name : this.keyByLegacyName = { [key]: legacyInfo.name };
        this[legacyInfo.name] = this[key].bind(this);
      }

      const isButton = type === BlockType.Button;
      const buttonID = isButton ? getButtonID(id, opcode) : undefined;

      if (isButton) registerButtonCallback(runtime, buttonID, this[key].bind(this));

      internal_blocks.push({
        opcode,
        text: displayText,
        blockType: type,
        arguments: argumentsInfo,
        func: buttonID,
      });
    }

    private getInfo() {
      this.processMenus();
      const { id, internal_blocks: blocks, internal_menus: menus, name, blockIconURI } = this;
      const info = { id, blocks, name, blockIconURI };
      if (menus) info['menus'] = Object.values(this.internal_menus).reduce((obj, { name, ...value }) => {
        obj[name] = value;
        return obj;
      }, {});

      return info;
    }

    private processMenus() {
      const reporterItemsKey: keyof MenuThatAcceptsReporters<any> = "items";
      const reporterItemsGetterKey: keyof DynamicMenuThatAcceptsReporters<any> = "getItems";
      for (const [index, menu] of this.menus.entries()) {
        let acceptReporters = false;
        const name = this.menuNames[index];

        if (Array.isArray(menu)) {
          const items: any[] | MenuItem<any>[] = menu;
          this.addStaticMenu(items, acceptReporters, name);
          continue;
        }

        if (isFunction(menu)) {
          const getItems = menu as DynamicMenu<any>;
          this.addDynamicMenu(getItems, acceptReporters, name);
          continue;
        }

        acceptReporters = true;

        if (reporterItemsKey in menu) {
          const nonDynamic = menu as MenuThatAcceptsReporters<any>;
          this.addStaticMenu(nonDynamic.items, acceptReporters, name);
          continue;
        }

        if (reporterItemsGetterKey in menu) {
          const dynamicMenu = menu as DynamicMenuThatAcceptsReporters<any>;
          this.addDynamicMenu(dynamicMenu.getItems, acceptReporters, name);
          continue;
        }
      }
    }

    private addStaticMenu(items: MenuItem<any>[], acceptReporters: boolean, name: string) {
      this.internal_menus.push({
        name,
        acceptReporters,
        items: items.map(item => item /**TODO figure out how to format */).map(convertMenuItemsToString)
      });
    }

    private addDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean, name: string) {
      // this key might need to be adapted for legacy extensions
      const key = `internal_dynamic_${this.internal_menus.length}`;
      this[key] = () => {
        const items = getItems();
        return items.map(item => item).map(convertMenuItemsToString);
      };
      this.internal_menus.push({ acceptReporters, items: key, name });
    }
  }


  return _;
}

export const extractLegacyInformation = (item) => !isPrimitive(item) && "name" in item ? ({ name: item["name"] as string | undefined }) : undefined;

const format = (text: string, identifier: string, description: string): string => {
  return text; // make use of formatMessage in the future
}

const convertToDisplayText = (key: string, text: string | ((...args: any[]) => string), args: Argument<any>[], isLegacy: boolean) => {
  type TextFunc = (...params: any[]) => string;
  const resolvedText: string = isFunction(text)
    ? (text as TextFunc)(...args.map((arg, index) => {
      const name = isLegacy ? extractLegacyInformation(arg).name : index;
      return `[${name}]`
    }))
    : text as string;

  return format(resolvedText, key, `Block text for '${key}'`);
}

const convertToArgumentInfo = (key: string, args: Argument<any>[], menusToAdd: MenuItem<any>[], menuNames: string[]) => {
  if (!args) return undefined;

  type Entry = ExtensionArgumentMetadata & { name: string };

  const argumentsInfo = args
    .map((element, index) => {
      const entry = {} as Entry;
      entry.type = getArgumentType(element);
      entry.name = extractLegacyInformation(element)?.name ?? `${index}`;

      if (isPrimitive(element)) return entry;

      const { defaultValue, options } = element as VerboseArgument<any>;

      if (defaultValue !== undefined)
        entry.defaultValue = isString(entry)
          ? format(defaultValue, getArgTranslationID(key, index), `Default value for arg ${index + 1} of ${key} block`)
          : defaultValue;

      if (!options) return entry;

      const alreadyAddedIndex = menusToAdd.indexOf(options);
      const alreadyAdded = alreadyAddedIndex >= 0;
      const menuIndex = alreadyAdded ? alreadyAddedIndex : menusToAdd.push(options) - 1;
      const menuName = extractLegacyInformation(options)?.name ?? `${menuIndex}`;

      if (!alreadyAdded) menuNames.push(menuName);

      entry.menu = menuName;

      return entry;
    })
    .reduce((accumulation, { name, ...value }) => {
      accumulation[name] = value;
      return accumulation;
    }, {});

  return argumentsInfo;
}

const convertMenuItemsToString = (item: any | MenuItem<any>) =>
  isPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };

const getArgTranslationID = (blockname: string, index: number) => {
  return `${blockname}-arg${index}-default`;
}

const getButtonID = (id: string, opcode: string) => `${id}_${opcode}`;

export const getArgumentType = <T>(arg: Argument<T>): ValueOf<typeof ArgumentType> =>
  isPrimitive(arg) ? arg as ValueOf<typeof ArgumentType> : (arg as VerboseArgument<T>).type;