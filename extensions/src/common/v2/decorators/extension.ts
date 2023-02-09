import { ExtensionMenuDisplayDetails } from "../../types";
import { ExtensionV2 } from "../Extension";
import { TypedClassDecorator } from ".";

export function extension<T extends ExtensionV2, Args extends any[]>(details: ExtensionMenuDisplayDetails): TypedClassDecorator<T, Args> {
  return (value) => {
    console.log(details);;
  }
}

