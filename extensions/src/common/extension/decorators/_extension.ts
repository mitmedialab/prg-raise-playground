import { ExtensionMenuDisplayDetails } from "$common/types";
import { TypedClassDecorator } from ".";
import { ExtensionInstance } from "..";

const registerDetailsIdentifier = "__registerMenuDetials";

export function extension<T extends ExtensionInstance, Args extends any[]>(details: ExtensionMenuDisplayDetails): TypedClassDecorator<T, Args> {
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