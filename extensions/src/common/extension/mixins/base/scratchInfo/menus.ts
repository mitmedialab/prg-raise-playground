import { MenuThatAcceptsReporters, DynamicMenuThatAcceptsReporters, Menu, MenuItem, DynamicMenu, ExtensionMenuMetadata, ExtensionArgumentMetadata } from "$common/types";
import { isFunction, isPrimitive } from "$common/utils";

const reporterItemsKey: keyof MenuThatAcceptsReporters<any> = "items";
const reporterItemsGetterKey: keyof DynamicMenuThatAcceptsReporters<any> = "getItems";

export const menuProbe = {
  isSimpleStatic: (menu: Menu<any>): menu is any[] | MenuItem<any>[] => Array.isArray(menu),
  isSimpleDynamic: (menu: Menu<any>): menu is DynamicMenu<any> => isFunction(menu),
  isStaticWithReporters: (menu: Menu<any>): menu is MenuThatAcceptsReporters<any> => reporterItemsKey in menu,
  isDynamicWithReporters: (menu: Menu<any>): menu is DynamicMenuThatAcceptsReporters<any> => reporterItemsGetterKey in menu,
}

export const getMenuName = (index: number) => `${index}`;

export const convertMenuItemsToString = (item: any | MenuItem<any>) =>
  isPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };

export const asStaticMenu = (items: MenuItem<any>[], acceptReporters: boolean) => ({
  acceptReporters,
  items: items
    .map(item => item /**TODO figure out how to format */)
    .map(convertMenuItemsToString)
} satisfies ExtensionMenuMetadata);

export const addOptionsAndGetMenuName = (options: Menu<any>, menus: Menu<any>[],) => {
  const alreadyAddedIndex = menus.indexOf(options);
  const menuIndex = alreadyAddedIndex >= 0 ? alreadyAddedIndex : menus.push(options) - 1;
  return `${getMenuName(menuIndex)}`;
}

export const setMenu = (entry: ExtensionArgumentMetadata, options: Menu<any>, menus: Menu<any>[]) =>
  options ? entry.menu = addOptionsAndGetMenuName(options, menus) : null;