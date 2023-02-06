import { BlockType, BlocksInfo, CodeGenArgs, Extension, ExtensionBlockMetadata, ExtensionConstructor, PopulateCodeGenArgs } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { buildKeyBlockMap } from "$testing";
import { AnyExtension, BlockKey, InputArray, KeyToBlockIndexMap, RenderedUI, RuntimeForTest } from "./types";
import { getEngineFile } from "./utils";

export class BlockRunner<T extends AnyExtension> {
  private blockData: ExtensionBlockMetadata[];

  constructor(private map: KeyToBlockIndexMap, public instance: T) {
    this.blockData = Extension.TestGetBlocks(instance);
  }

  getBlockMetaDataByKey<K extends BlockKey<T>>(key: K) {
    const { map, blockData } = this;
    const index = map.get(key) ?? map.get(Extension.GetLegacyName(this.instance, key));
    return blockData[index];
  }

  async invoke<K extends BlockKey<T>>(key: K, ...input: InputArray<T, K>):
    Promise<{ output: ReturnType<BlocksInfo<T>[K]["operation"]>, ui?: RenderedUI }> {
    const { instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const { blockType, func, opcode } = this.getBlockMetaDataByKey(key);
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];
    const args = this.getBlockArgs(input);

    const output = await Promise.resolve(blockFunction(...args));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, ui: renderedUI };
  }

  async createCompanion<TCompanion extends AnyExtension>(constructor: ExtensionConstructor<TCompanion>) {
    const { instance: { runtime } } = this;
    const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
    const companion = new constructor(runtime as never, args as CodeGenArgs);
    await Extension.TestInit(companion);
    return new BlockRunner(buildKeyBlockMap(companion), companion);
  }

  private mockBlockUtility(): BlockUtility {
    const utility = new (jest.createMockFromModule(getEngineFile("block-utility")) as any)() as BlockUtility;
    // utility can be built up over time
    return utility;
  }

  private getBlockArgs(input: any): [args: Object, utility: BlockUtility] | [utility: BlockUtility] {
    const utility = this.mockBlockUtility();
    if (input === undefined) return [utility];

    const mutation = {}; // Need to research what this is for

    const args = Array.isArray(input)
      ? (input as Array<any>).reduce((acc, curr, index) => { acc[index] = curr; return acc }, { mutation } as object)
      : { mutation, 0: input }
    return [args, utility];
  }
}