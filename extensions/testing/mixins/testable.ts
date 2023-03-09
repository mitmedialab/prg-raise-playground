import { AbstractConstructor, ExtensionBlockMetadata, ExtensionInstance, ExtensionMetadata, NonAbstractConstructor, getAlternativeOpcodeName } from "$common";
import { GenericExtension } from "$testing/types";

const unAbstract = <T, C extends AbstractConstructor<T>>(c: C) => c as any as NonAbstractConstructor<T>;

type UniqueKey<Base, T extends Base> = { [k in keyof T]: k extends keyof Base ? never : k }[keyof T];

const isGenericExtension = (ext: ExtensionInstance): ext is GenericExtension => {
  const key: UniqueKey<ExtensionInstance, GenericExtension> = "defineBlocks";
  return key in ext;
}

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
      return isGenericExtension(this) ? opcode.replace(getAlternativeOpcodeName(""), "") : opcode;
    }
  }

  return unAbstract<_, AbstractConstructor<_>>(_);
}