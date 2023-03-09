import { AbstractConstructor, ExtensionBlockMetadata, ExtensionInstance, ExtensionMetadata, NonAbstractConstructor, generateOpcodeName, isGenericExtension } from "$common";
import { GenericExtension } from "$testing/types";

const unAbstract = <T, C extends AbstractConstructor<T>>(c: C) => c as any as NonAbstractConstructor<T>;

export default function <T extends ExtensionInstance, C extends NonAbstractConstructor<T>>(Ctor: C) {
  abstract class _ extends (Ctor as AbstractConstructor<ExtensionInstance>) {
    initialize() {
      super.internal_init();
    }

    getInfo(): ExtensionMetadata {
      return super.getInfo();
    }

    getBlockInfo(): ExtensionBlockMetadata[] {
      return this.getInfo().blocks as ExtensionBlockMetadata[]
    }

    getBlockKeyForOpcode(opcode: string): string {
      return isGenericExtension(this) ? opcode.replace(generateOpcodeName(""), "") : opcode;
    }
  }

  return unAbstract<_, AbstractConstructor<_>>(_);
}