import scratchInfo from "./scratchInfo/index";
import supported from "./supported";

export type CustomizableExtensionConstructor = ReturnType<typeof supported>;
export type CustomizableExtensionInstance = InstanceType<CustomizableExtensionConstructor>

export type MinimalExtensionConstructor = ReturnType<typeof scratchInfo>;
export type MinimalExtensionInstance = InstanceType<ReturnType<typeof scratchInfo>>;