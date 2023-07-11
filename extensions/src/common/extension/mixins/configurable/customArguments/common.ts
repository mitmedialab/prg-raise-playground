import { closeDropdownState, customArgumentFlag, dropdownEntryFlag, dropdownStateFlag, initDropdownState, openDropdownState, updateDropdownMethod, updateDropdownState } from "$common/globals";
import { Environment, MenuItem } from "$common/types";
import { CustomArgumentUIConstructor } from "./ui";

export type ArgumentEntry<T> = { text: string, value: T };
export type ArgumentEntrySetter<T, TReturn = void> = (entry: ArgumentEntry<T>) => TReturn;
export type ArgumentID = string;

export type CustomArgumentRecipe<T> = {
    /**
     * The svelte component to render the custom argument UI
     */
    component: string,
    /**
     * The starting value of the the custom argument (including both its value and text representation)
     */
    initial: ArgumentEntry<T>,
    /**
     * A function that must be defined if you'd like for your custom argument to accept reporters
     * @param x 
     * @returns 
     */
    acceptReportersHandler?: (x: any) => ArgumentEntry<T>
};

type CustomArgumentContainer = [Exclude<MenuItem<string>, string>];

export const isCustomArgumentContainer = (arr: Array<MenuItem<string>>): arr is CustomArgumentContainer => {
    if (arr.length !== 1) return false;
    const item = arr[0];
    if (typeof item !== "object") return false;
    const { text } = item;
    return text === customArgumentFlag;
}

export type RuntimeWithCustomArgumentSupport = Environment["runtime"] &
    { [k in typeof dropdownStateFlag]: typeof openDropdownState | typeof closeDropdownState | typeof initDropdownState | typeof updateDropdownState } &
    { [k in typeof dropdownEntryFlag]: ArgumentEntry<any> } &
    { [k in typeof updateDropdownMethod]: (id: string) => void };

export type ComponentGetter = (id: string, componentName: string) => CustomArgumentUIConstructor;

export const callingContext = {
    DrowpdownOpen: openDropdownState,
    DropdownClose: closeDropdownState,
    Init: initDropdownState,
    Update: updateDropdownState
} as const;