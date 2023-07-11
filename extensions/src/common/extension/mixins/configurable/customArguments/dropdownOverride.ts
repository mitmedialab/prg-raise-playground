import { ExtensionInstance } from "$common/extension";
import { untilObject } from "$common/utils";
import { RuntimeWithCustomArgumentSupport } from ".";
import { ArgumentEntry, ArgumentEntrySetter } from "./CustomArgumentManager";


/** Constructed based on Svelte documentation: https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component */
type CreateComponentOptions = {
  target: Element | HTMLElement;
  anchor?: Element | HTMLElement;
  props: {};
}

const findUniqueElementByClass = <T extends Element = Element>(container: Document | Element, className: string) => {
  const elements = container.getElementsByClassName(className);
  if (elements.length !== 1) throw new Error(`Uh oh! Expected 1 element with class '${className}', but found ${elements.length}`);
  return elements[0] as T;
}

export type CustomArgumentUIConstructor = (options: CreateComponentOptions) => void;

type Props<T> = {
  extension: ExtensionInstance,
  setter: ArgumentEntrySetter<T>,
  current: ArgumentEntry<T>
}

export const renderToDropdown = async <T>(runtime: RuntimeWithCustomArgumentSupport, compononentConstructor: CustomArgumentUIConstructor, props: Props<T>) => {
  const dropdownContainerClass = "blocklyDropDownContent";
  const target = findUniqueElementByClass(document, dropdownContainerClass);
  const anchor = await untilObject(() => target.children[0]);
  const component = new compononentConstructor({ target, anchor, props });
  centerDropdownContent(anchor);
}

const centerDropdownContent = (container: Element) => {
  type ClassAndStyleModification = [string, (syle: CSSStyleDeclaration) => void];

  const findElementAndModifyStyle = ([className, styleMod]: ClassAndStyleModification) =>
    styleMod(findUniqueElementByClass<HTMLElement>(container, className).style);

  const elements = [
    [
      "goog-menuitem goog-option",
      (style) => {
        style.margin = "auto";
        style.paddingLeft = style.paddingRight = "0px";
      }
    ],
    [
      "goog-menuitem-content",
      (style) => style.textAlign = "center"
    ]
  ] satisfies ClassAndStyleModification[];

  elements.forEach(findElementAndModifyStyle);
}