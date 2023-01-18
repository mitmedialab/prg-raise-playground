import { BlockType, BlocksInfo, CodeGenArgs, Extension, ExtensionBlockMetadata, PopulateCodeGenArgs } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { buildKeyBlockMap } from "$testing";
import { AnyExtension, BlockKey, ExtensionConstructor, InputArray, KeyToBlockIndexMap, RenderedUI, RuntimeForTest } from "./types";
import { getEngineFile } from "./utils";

export class BlockRunner<T extends AnyExtension> {
  private blockData: ExtensionBlockMetadata[];

  constructor(private map: KeyToBlockIndexMap, private instance: T) {
    this.blockData = Extension.TestGetBlocks(instance);
  }

  getBlockMetaDataByKey<K extends BlockKey<T>>(key: K) {
    const { map, blockData } = this;
    const index = map.get(key);
    return blockData[index];
  }

  async invoke<K extends BlockKey<T>>(key: K, ...input: InputArray<T, K>):
    Promise<{ output: BlocksInfo<T>[K], renderedUI?: RenderedUI }> {
    const { instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const { blockType, func, opcode } = this.getBlockMetaDataByKey(key);
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];
    const args = this.getBlockArgs(input);

    const output = await Promise.resolve(blockFunction(...args));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, renderedUI };
  }

  createCompanion<TCompanion extends AnyExtension>(constructor: ExtensionConstructor<TCompanion>) {
    const { instance: { runtime } } = this;
    const args: PopulateCodeGenArgs = { name: "", blockIconURI: "", id: "" };
    const companion = new constructor(runtime as never, args as CodeGenArgs);
    Extension.TestInit(companion);
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