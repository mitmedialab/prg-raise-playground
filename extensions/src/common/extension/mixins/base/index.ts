import scratchInfo from "./scratchInfo/index";
import scratchVersioning from "./scratchVersioning/index";
import supported from "./supported";

export type CustomizableExtensionConstructor = ReturnType<typeof supported>;
export type CustomizableExtensionInstance = InstanceType<CustomizableExtensionConstructor>

export type BaseScratchExtensionConstuctor = ReturnType<typeof scratchInfo>;
export type BaseScratchExtensionInstance = InstanceType<BaseScratchExtensionConstuctor>;

export type MinimalExtensionConstructor = ReturnType<typeof scratchVersioning>;
export type MinimalExtensionInstance = InstanceType<ReturnType<typeof scratchVersioning>>;