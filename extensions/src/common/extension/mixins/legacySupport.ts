import { ExtensionCommon } from "../ExtensionCommon";
import { AbstractConstructor, ExtensionArgumentMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, ExtensionMetadata } from "$common/types";
import { isString, set } from "$common/utils";
import { isDynamicMenu, parseText } from "../decorators/legacySupport/index";
import { getImplementationName, wrapOperation } from "./scratchInfo";

type WrappedOperation = ReturnType<typeof wrapOperation>;
type WrappedOperationParams = Parameters<WrappedOperation>;
type WithLegacySupport = InstanceType<ReturnType<typeof legacyMixin>>;
type BlockMap = Map<string, Omit<ExtensionBlockMetadata, "opcode"> & { index: number }>;

export const isLegacy = (extension: ExtensionCommon | WithLegacySupport): extension is WithLegacySupport => {
  const key: keyof WithLegacySupport = "__isLegacy";
  return key in extension;
}

const validBlock = (legacyBlock: string | ExtensionBlockMetadata, blockMap: BlockMap): legacyBlock is ExtensionBlockMetadata => {
  if (isString(legacyBlock)) throw new Error("Block was unexpectedly a string: " + legacyBlock);
  if (!blockMap.has(legacyBlock.opcode)) {
    console.error(`Could not find legacy opcode ${legacyBlock.opcode} within currently defined blocks`);
    return false;
  };
  return true;
}

const validArg = (pair: { legacy: ExtensionArgumentMetadata, modern: ExtensionArgumentMetadata }): typeof pair => {
  if (typeof pair.legacy.menu !== typeof pair.modern.menu) throw new Error("Menus don't match")
  return pair;
}

const getDynamicMenuName = (menu: ExtensionMenuMetadata): string => {
  if (isDynamicMenu(menu)) return menu;
  if (isDynamicMenu(menu.items)) return menu.items;
  throw new Error("Menu is not dynamic: " + menu);
}

/**
 * Mixin the ability for extensions to make use of 'legacy' `getInfo` json, 
 * so that extensions ported to the framework can support old, serialized projects
 * @param Ctor 
 * @param legacyInfo 
 * @returns 
 */
function legacyMixin<T extends AbstractConstructor<ExtensionCommon>>(Ctor: T, legacyInfo: ExtensionMetadata) {
  abstract class _ extends Ctor {
    private validatedInfo: ExtensionMetadata;

    public __isLegacy = true;
    public orderArgumentNamesByBlock: Map<string, string[]> = new Map();

    protected getInfo(): ExtensionMetadata {

      if (!this.validatedInfo) {
        // @ts-ignore
        const { getInfo } = ExtensionCommon.prototype;
        const info = (getInfo.call(this));
        this.validatedInfo = this.validateAndAttach(info);
      }

      return this.validatedInfo;
    }

    private getArgNames = (legacyBlock: ExtensionBlockMetadata) => {
      const { opcode } = legacyBlock;

      if (!this.orderArgumentNamesByBlock.has(opcode)) {
        const { orderedNames } = parseText(legacyBlock);
        this.orderArgumentNamesByBlock.set(opcode, orderedNames);
      }

      return this.orderArgumentNamesByBlock.get(opcode);
    }

    private validateAndAttach({ id, blocks, menus, ...metaData }: ExtensionMetadata): ExtensionMetadata {
      const { id: legacyID, blocks: legacyBlocks, menus: legacyMenus } = legacyInfo;
      const mutableBlocks = [...blocks as ExtensionBlockMetadata[]];

      if (id !== legacyID) throw new Error(`ID mismatch! Legacy id: ${legacyID} vs. current id: ${id}`);

      const blockMap = mutableBlocks.reduce(
        (map, { opcode, ...block }, index) => map.set(opcode, { ...block, index }),
        new Map() as BlockMap
      );

      const self = this;

      const updates = legacyBlocks
        .map(legacyBlock => validBlock(legacyBlock, blockMap) ? legacyBlock : undefined)
        .filter(Boolean)
        .map(legacyBlock => {
          const { opcode, arguments: legacyArgs } = legacyBlock;
          const { index, arguments: modernArgs } = blockMap.get(opcode);
          const argNames = this.getArgNames(legacyBlock);

          if (!argNames) return { replaceAt: { index, block: legacyBlock } };

          const remapper = (args: Record<string, any>) => argNames.reduce(
            (remap, current, index) => set(remap, index, args[current]),
            {} as Record<number, any>);

          const implementation: WrappedOperation = this[getImplementationName(opcode)];

          this[opcode] = (
            (...[args, util]: WrappedOperationParams) => implementation.call(self, remapper(args), util)
          ).bind(self);

          const menuUpdates = argNames
            .map((legacyName, index) => ({ legacy: legacyArgs[legacyName], modern: modernArgs[index] }))
            .map(validArg)
            .map(({ legacy: { menu: legacyName }, modern: { menu: modernName } }) => ({ legacyName, modernName }))
            .filter(menus => menus.legacyName && menus.modernName)
            .map(({ legacyName, modernName }) =>
              ({ legacyName, modernName, legacy: legacyMenus[legacyName], modern: menus[modernName] }))
            .map(({ legacy, modern, legacyName, modernName }) => !isDynamicMenu(legacy) && !isDynamicMenu(legacy.items)
              ? { type: "static" as const, legacy: legacyName, modern: modernName }
              : { type: "dynamic" as const, legacy: legacyName, modern: modernName, methods: { legacy: getDynamicMenuName(legacy), modern: getDynamicMenuName(modern) } }
            );

          return { menuUpdates, replaceAt: { index, block: legacyBlock } };
        });

      updates.forEach(({ replaceAt: { index, block } }) => mutableBlocks[index] = block);

      updates
        .map(({ menuUpdates }) => menuUpdates)
        .flat()
        .filter(Boolean)
        .map(menu => {
          const { legacy } = menu;
          if (legacy in menus) throw new Error(`Somehow, there was already a menu called ${legacy}, which will cause issues in the next step.`);
          return menu;
        })
        .forEach(({ type, legacy, methods }) => {
          menus[legacy] = legacyMenus[legacy];
          if (type === "dynamic") self[methods.legacy] = () => self[methods.modern]();
        });

      return {
        id, blocks: mutableBlocks, menus, ...metaData
      };
    }
  }
  return _
}

export default legacyMixin;
