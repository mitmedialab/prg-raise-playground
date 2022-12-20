import { ExtensionInfo } from "scripts/bundle";

export const runOncePerExtension = (): { check: () => boolean, internal?: any } =>
  ({ internal: 0, check() { return 0 === (this.internal++ as number) } });

export const runOnceAcrossAllExtensions = ({ indexInProcess }: ExtensionInfo): { check: () => boolean, internal?: any } =>
  indexInProcess === 0 ? runOncePerExtension() : { check: () => false }