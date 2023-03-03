import { ExtensionBase } from "./ExtensionBase";
import supported from "./supported";

export const minimumExtension = supported(ExtensionBase, []);
export type MinimumExtension = InstanceType<typeof minimumExtension>;