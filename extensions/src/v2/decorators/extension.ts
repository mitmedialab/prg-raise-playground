import { ExtensionMenuDisplayDetails } from "$common";
import { AbstractConstructor, ExtensionV2, ExtensionV2Constructor } from "../Extension";
import { TypedClassDecorator } from ".";

export const registerDetailsIdentifier = "__registerMenuDetials";

export function extension<T extends ExtensionV2, Args extends any[]>(details: ExtensionMenuDisplayDetails): TypedClassDecorator<T, Args> {
  return (value) => {
    const isNode = typeof window === 'undefined';
    if (isNode) global?.[registerDetailsIdentifier]?.(details);
  }
}
