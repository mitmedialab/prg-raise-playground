import { ExtensionV2, ExtensionV2Constructor } from "$v2/Extension";
import { ExtensionMetadata } from "$common";

export default function <T extends ExtensionV2Constructor>(Ctor: T, legacyInfo: ExtensionMetadata) {
  abstract class _ extends Ctor {
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

