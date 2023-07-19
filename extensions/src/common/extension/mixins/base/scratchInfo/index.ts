import { castToType } from "$common/cast";
import CustomArgumentManager from "$common/extension/mixins/configurable/customArguments/CustomArgumentManager";
import { ArgumentType, BlockType } from "$common/types/enums";
import { BlockOperation, ValueOf, Menu, ExtensionMetadata, ExtensionBlockMetadata, ExtensionMenuMetadata, DynamicMenu, BlockMetadata, Argument, } from "$common/types";
import { registerButtonCallback } from "$common/ui";
import { isString, } from "$common/utils";
import type BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { menuProbe, asStaticMenu, getMenuName, convertMenuItemsToString } from "./menus";
import { Handler } from "./handlers";
import { BlockDefinition, getButtonID, isBlockGetter } from "./util";
import { convertToArgumentInfo, extractArgs, zipArgs } from "./args";
import { convertToDisplayText } from "./text";
import { CustomizableExtensionConstructor, MinimalExtensionInstance, } from "..";
import { ExtensionInstanceWithFunctionality } from "../..";

export const getImplementationName = (opcode: string) => `internal_${opcode}`;

const inlineImageAccessError = "ERROR: This argument represents an inline image and should not be accessed.";

/**
 * Wraps a blocks operation so that the arguments passed from Scratch are first extracted and then passed as indices in a parameter array.
 * @param _this What will be bound to the 'this' context of the underlying operation
 * @param operation The operation (function) to wrap
 * @param args The args that must be parsed before being passed to the underlying operation 
 * @returns 
 */
export const wrapOperation = <T extends MinimalExtensionInstance>(
  _this: T,
  operation: BlockOperation,
  args: { name: string, type: ValueOf<typeof ArgumentType>, handler: Handler }[]
) => _this.supports("customArguments")
    ? function (this: ExtensionInstanceWithFunctionality<["customArguments"]>, argsFromScratch: Record<string, any>, blockUtility: BlockUtility) {
      const castedArguments = args.map(({ name, type, handler }) => {
        if (type === ArgumentType.Image) return inlineImageAccessError;
        const param = argsFromScratch[name];
        switch (type) {
          case ArgumentType.Custom:
            const isIdentifier = isString(param) && CustomArgumentManager.IsIdentifier(param);
            const value = isIdentifier ? this.customArgumentManager.getEntry(param).value : param;
            return handler.call(_this, value);
          default:
            return castToType(type, handler.call(_this, param));
        }
      });
      return operation.call(_this, ...castedArguments, blockUtility);
    }
    : function (this: T, argsFromScratch: Record<string, any>, blockUtility: BlockUtility) {
      const castedArguments = args.map(({ name, type, handler }) =>
        type === ArgumentType.Image
          ? inlineImageAccessError
          : castToType(type, handler.call(_this, argsFromScratch[name]))
      );
      return operation.call(_this, ...castedArguments, blockUtility);
    }


/**
 * Mixin the ability for extension's to:
 * - build up block definitions incrementally (through the use of `pushBlock`)
 * - implement a valid `getInfo` method that interacts with the scratch-vm correctly  
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function (Ctor: CustomizableExtensionConstructor) {
  type BlockEntry = { definition: BlockDefinition<ScratchExtension, BlockOperation>, operation: BlockOperation };
  type Block = BlockMetadata<BlockOperation, ScratchExtension>;
  type BlockMap = Map<string, BlockEntry>;
  type Modifiers = ScratchExtension["modifiers"];
  type Modifier<TType extends keyof Modifiers> = Modifiers[TType][number];

  abstract class ScratchExtension extends Ctor {
    private readonly blockMap: BlockMap = new Map();
    private readonly menus: Menu<any>[] = [];
    private info: ExtensionMetadata;

    private modifiers: {
      block?: ((opcode: string, metadata: Block) => Block)[],
      args?: ((args: readonly Argument<unknown>[]) => readonly Argument<unknown>[])[]
    };

    protected addModifier<TType extends keyof Modifiers>(type: TType, modifier: Modifier<TType>) {
      this.modifiers ??= {};
      this.modifiers[type] ??= [];
      this.modifiers[type].push(modifier as any);
    }

    /**
     * Add a block 
     * @param opcode 
     * @param definition 
     * @param operation 
     */
    pushBlock<Fn extends BlockOperation>(opcode: string, definition: BlockDefinition<MinimalExtensionInstance, Fn>, operation: BlockOperation) {
      if (this.blockMap.has(opcode)) throw new Error(`Attempt to push block with opcode ${opcode}, but it was already set. This is assumed to be a mistake.`)
      this.blockMap.set(opcode, { definition, operation });
    }

    protected getInfo(): ExtensionMetadata {
      if (!this.info) {
        const { id, name, blockIconURI } = this;
        const blocks = Array.from(this.blockMap.entries()).map(entry => this.convertToInfo(entry));
        const color1 = this.blockColor;
        const color2 = this.menuColor;
        const color3 = this.menuSelectColor;
        this.info = { id, blocks, name, blockIconURI, menus: this.collectMenus(), color1, color2, color3 };
      }
      return this.info;
    }


    private resolveBlock(opcode: string, { definition }: BlockEntry): Block {
      const raw: Block = isBlockGetter(definition) ? definition.call(this, this) : definition;
      return this.modifiers?.block?.reduce((acc, callback) => callback(opcode, acc), raw) ?? raw;
    }

    private resolveArgs(block: Block) {
      const raw = extractArgs(block);
      return this.modifiers?.args?.reduce((acc, callback) => callback(acc), raw) ?? raw;
    }

    private convertToInfo(details: [opcode: string, entry: BlockEntry]) {
      const [opcode, entry] = details;
      const { operation } = entry;

      const block = this.resolveBlock(opcode, entry);
      const args = this.resolveArgs(block);

      const { type, text } = block;
      const { id, runtime, menus } = this;

      const displayText = convertToDisplayText(opcode, text, args);
      const argumentsInfo = convertToArgumentInfo(opcode, args, menus);

      const info: ExtensionBlockMetadata = { opcode, text: displayText, blockType: type, arguments: argumentsInfo };

      if (type === BlockType.Button) {
        const buttonID = getButtonID(id, opcode);
        registerButtonCallback(runtime, buttonID, operation.bind(this));
        info.func = buttonID;
      } else {
        const implementationName = getImplementationName(opcode);
        this[implementationName] = wrapOperation(this as MinimalExtensionInstance, operation, zipArgs(args));
      }

      return info;
    }

    private collectMenus() {
      const { isSimpleStatic, isSimpleDynamic, isStaticWithReporters, isDynamicWithReporters } = menuProbe;
      return Object.fromEntries(
        this.menus
          .map((menu, index) => {
            if (isSimpleStatic(menu)) return asStaticMenu(menu, false);
            if (isSimpleDynamic(menu)) return this.registerDynamicMenu(menu, false, index);
            if (isStaticWithReporters(menu)) return asStaticMenu(menu.items, true);
            if (isDynamicWithReporters(menu)) return this.registerDynamicMenu(menu.getItems, true, index);
            throw new Error("Unable to process menu");
          })
          .reduce((map, menu, index) => map.set(getMenuName(index), menu), new Map<string, ExtensionMenuMetadata>())
      );
    }

    private registerDynamicMenu(getItems: DynamicMenu<any>, acceptReporters: boolean, menuIndex: number) {
      const key = `internal_dynamic_${menuIndex}`; // legacy support?
      this[key] = () => getItems.call(this).map(item => item).map(convertMenuItemsToString);
      return { acceptReporters, items: key } satisfies ExtensionMenuMetadata
    }
  }

  return ScratchExtension;
}