import { BlockV2, ExtensionV2, ExtensionV2Constructor } from "$common/v2/Extension";
import { ExtensionMetadata } from "$common/types";

export type NoArgs = () => any;
export type OneArg = (arg: any) => any;
export type MultipleArgs = (...args: [any, any]) => any;
export type BlockVariant = BlockV2<NoArgs> | BlockV2<OneArg> | BlockV2<MultipleArgs>;
export type LegacyMap = Map<string, { block: BlockVariant, argNames: string[], argMenuNames: (string | undefined)[] }>;

export default function <T extends ExtensionV2Constructor>(Ctor: T, legacyInfo: ExtensionMetadata) {
  abstract class _ extends Ctor {
    abstract legacyMap: LegacyMap;
    private validatedInfo: ExtensionMetadata;

    protected getInfo(): ExtensionMetadata {

      if (!this.validatedInfo) {
        // @ts-ignore
        const { getInfo } = ExtensionV2.prototype;
        const info = (getInfo.call(this));
        this.validatedInfo = this.validateAndAttach(info);
      }

      return this.validatedInfo;
    }

    private validateAndAttach(info: ExtensionMetadata) {
      if (info.id !== legacyInfo.id) {
        throw new Error("ID mismatch! IDs should match ")
      }
      return legacyInfo;
    }
  }
  return _
}

