import { AbstractConstructor, ExtensionCommon } from "$common/extension/Extension";
import { ExtensionBlockMetadata, ExtensionMetadata } from "$common/types";
import { isString } from "$common/utils";
import { parseText } from "../decorators/legacy";
import { getImplementationName, wrapOperation } from "./scratchInfo";

type WrappedOperation = ReturnType<typeof wrapOperation>;
type WrappedOperationParams = Parameters<WrappedOperation>;

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

    private validateAndAttach({ id, blocks, menus, ...metaData }: ExtensionMetadata): ExtensionMetadata {
      const { id: legacyID, blocks: legacyBlocks, menus: legacyMenus } = legacyInfo;
      const mutableBlocks = [...blocks as ExtensionBlockMetadata[]];

      if (id !== legacyID) throw new Error(`ID mismatch! Legacy id: ${legacyID} vs. current id: ${id}`);

      const blockMap = mutableBlocks.reduce(
        (map, { opcode, ...block }, index) => map.set(opcode, { ...block, index }),
        new Map<string, Omit<ExtensionBlockMetadata, "opcode"> & { index: number }>()
      );

      const menusToAdd = new Array<string>();

      for (const legacyBlock of legacyBlocks) {
        if (isString(legacyBlock)) throw new Error("Block was unexpectedly a string: " + legacyBlock);
        const { opcode } = legacyBlock;
        if (!blockMap.has(opcode)) throw new Error(`Could not find legacy opcode ${legacyBlock} within currently defined blocks`);

        const { index } = blockMap.get(opcode);
        mutableBlocks[index] = legacyBlock;

        const { orderedNames } = parseText(legacyBlock);
        const remapper = (args: Record<string, any>) => orderedNames.reduce((remap, current, index) => {
          remap[`${index}`] = args[current];
          return remap;
        }, {})

        const implementation = this[getImplementationName(opcode)] as ReturnType<typeof wrapOperation>;
        this[opcode] = ((...[args, util]: WrappedOperationParams) => implementation.call(this, remapper(args), util)).bind(this);

        menusToAdd.push(...Object.values(legacyBlock.arguments).map(({ menu }) => menu).filter(Boolean));
      }

      for (const menu of menusToAdd) {
        if (menu in menus) throw new Error(`Menu '${menu}' has already been defined and risks being overwritten`);
        menus[menu] = legacyMenus[menu];
      }

      return {
        id, blocks: mutableBlocks, menus, ...metaData
      };
    }
  }
  return _
}

