import { ExtensionMenuDisplayDetails } from "$common";
import { AbstractConstructor, ExtensionV2, ExtensionV2Constructor } from "../Extension";
import { TypedClassDecorator } from ".";

const registerDetailsIdentifier = "__registerMenuDetials";

export function extension<T extends ExtensionV2, Args extends any[]>(details: ExtensionMenuDisplayDetails): TypedClassDecorator<T, Args> {
  return (value) => {
    const isNode = typeof window === 'undefined';
    if (isNode) global?.[registerDetailsIdentifier]?.(details);
  }
}

export const registerExtensionDefinitionCallback = (callback: (details: ExtensionMenuDisplayDetails) => void) =>
  global[registerDetailsIdentifier] = (details) => {
    callback(details);
    delete global[registerDetailsIdentifier];
  };