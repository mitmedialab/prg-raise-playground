import { Description, IconURL, InsetIconURL } from "../../common";

type name = "Imported";
type Title<T extends string> = `${name}_${T}`;
 
export type title = Title<name>;
export type description = Description<name>;
export type iconURL = IconURL<name>;
export type insetIconURL = InsetIconURL<name>