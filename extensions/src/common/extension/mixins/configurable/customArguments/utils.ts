import { ExtensionBase } from "$common/extension/ExtensionBase";
import { guiDropdownInterop, } from "$common/globals";
import { Environment, ExpandRecursively, SvelteComponentConstructor, ValueOf } from "$common/types";
import { untilObject } from "$common/utils";

export type ArgumentEntry<T> = { text: string, value: T };
export type ArgumentEntrySetter<T, TReturn = void> = (entry: ArgumentEntry<T>) => TReturn;
export type ArgumentID = string;

export type ComponentProps<T, TExtension extends ExtensionBase> = {
    extension: TExtension,
    setter: ArgumentEntrySetter<T>,
    current: ArgumentEntry<T>
}

export type NonspecificComponentProps = ComponentProps<any, ExtensionBase>;

export type CustomArgumentComponent = SvelteComponentConstructor<NonspecificComponentProps>;

export type CustomArgumentRecipe<T, TExtension extends ExtensionBase> = {
    /**
     * The svelte component to render the custom argument UI
     */
    component: SvelteComponentConstructor<ComponentProps<T, TExtension>>,
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

type DropdownEntry = { [k in typeof guiDropdownInterop.runtimeProperties.entryKey]: ArgumentEntry<string> };
type DropdownState = { [k in typeof guiDropdownInterop.runtimeProperties.stateKey]: ValueOf<typeof guiDropdownInterop.state> };
type DropdownUpdateMethod = { [k in typeof guiDropdownInterop.runtimeProperties.updateMethodKey]: (id: string) => void };

export type RuntimeWithCustomArgumentSupport = Environment["runtime"] & {
    [k in typeof guiDropdownInterop.runtimeKey]: ExpandRecursively<DropdownEntry & DropdownState & DropdownUpdateMethod>
}

const findUniqueElementByClass = <T extends Element = Element>(container: Document | Element, className: string) => {
    const elements = container.getElementsByClassName(className);
    if (elements.length !== 1) throw new Error(`Uh oh! Expected 1 element with class '${className}', but found ${elements.length}`);
    return elements[0] as T;
}

const hideText = (element: Element) => (element as HTMLElement).style.display = "none";

export const renderToDropdown = async <TProps extends NonspecificComponentProps>(Compononent: SvelteComponentConstructor<TProps>, props: TProps) => {
    const dropdownContainerClass = "blocklyDropDownContent";
    const target = findUniqueElementByClass(document, dropdownContainerClass);
    const anchor = await untilObject(() => target.children[0]);
    const component = new Compononent({ target, anchor, props });
    hideText(anchor);
}