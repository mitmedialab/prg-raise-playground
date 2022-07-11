export const notImplemented = () => { throw new Error("Method not implemented."); }

export type Title<name extends string> = `title_${name}`;
export type Description<name extends string> = `description_${name}`;
export type IconURL<name extends string> = `iconURL_${name}`;
export type InsetIconURL<name extends string> = `insetIconURL_${name}`;
