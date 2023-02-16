import { AbstractConstructor, ExtensionCommon } from "$common/extension/Extension";
import { ExtensionMetadata } from "$common/types";

export default function <T extends AbstractConstructor<ExtensionCommon>>(Ctor: T, legacyInfo: ExtensionMetadata) {
  abstract class _ extends Ctor {
    private validatedInfo: ExtensionMetadata;

    protected getInfo(): ExtensionMetadata {

      if (!this.validatedInfo) {
        // @ts-ignore
        const { getInfo } = ExtensionCommon.prototype;
        const info = (getInfo.call(this));
        this.validatedInfo = this.validateAndAttach(info);
      }

      return this.validatedInfo;
    }

    private validateAndAttach({ id, blocks }: ExtensionMetadata) {
      const { id: legacyID, blocks: legacyBlocks } = legacyInfo;

      if (id !== legacyID) {
        throw new Error("ID mismatch! IDs should match ")
      }

      for (const key in legacyBlocks) {

      }
      return legacyInfo;
    }
  }
  return _
}

