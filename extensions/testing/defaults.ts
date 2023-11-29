import { ExtensionMenuDisplayDetails } from "$common";

type MakeDefaults<TRequirement, TValue extends TRequirement> = TValue;

export type DefaultDisplayDetails = MakeDefaults<ExtensionMenuDisplayDetails,
  {
    name: "",
    description: "",
    iconURL: "",
    insetIconURL: ""
  }
>