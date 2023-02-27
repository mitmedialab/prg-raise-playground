import { BlockType, BlocksInfo, CodeGenArgs, Extension, ExtensionBase, ExtensionBlockMetadata, ExtensionCommon, NonAbstractConstructor, parseText } from "$common";
import { isLegacy } from "$common/extension/mixins/legacySupport";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { buildKeyBlockMap } from "$testing";
import testable from "./mixins/testable";
import { GenericExtension, BlockKey, InputArray, KeyToBlockIndexMap, RenderedUI, RuntimeForTest, Testable, ReportedValue, NamedInputArray } from "./types";
import { getEngineFile } from "./utils";

export class BlockRunner<T extends ExtensionCommon> {
  private blockData: ExtensionBlockMetadata[];

  constructor(private map: KeyToBlockIndexMap, public instance: Testable<T>) {
    this.blockData = instance.getBlockInfo();
  }

  getBlockMetaDataByKey<K extends BlockKey<T>>(key: K) {
    const { map, blockData } = this;
    const index = map.get(key);
    return blockData[index];
  }

  async invoke<K extends BlockKey<T>>(key: K, ...input: InputArray<T, K>) {
    const argNames = isLegacy(this.instance)
      ? this.instance.orderArgumentNamesByBlock.get(key)
      : Object.keys(input);

    return this.invokeWithArgs(key,
      Object.fromEntries((input as any[]).reduce(
        (args, value, index) => args.set(argNames[index], value),
        new Map<string, unknown>([["mutation", {}]])
      ))
    )
  }

  private async invokeWithArgs<K extends BlockKey<T>>(key: K, args: Object): Promise<{ output: Awaited<ReportedValue<T, K>>, ui?: RenderedUI }> {
    const { instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const { blockType, func, opcode } = this.getBlockMetaDataByKey(key);
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

    const output = await Promise.resolve(blockFunction.call(instance, ...[args, this.mockBlockUtility()]));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, ui: renderedUI };
  }

  createCompanion<TCompanion extends GenericExtension>(constructor: NonAbstractConstructor<TCompanion>) {
    const { instance: { runtime } } = this;
    const args: ConstructorParameters<typeof ExtensionBase> = [runtime, "", "", ""];
    const TestClass = testable(constructor);
    const companion = new TestClass(...args);
    companion.initialize();

    return new BlockRunner<TCompanion>(buildKeyBlockMap(companion), companion as Testable<TCompanion>);
  }

  private mockBlockUtility(): BlockUtility {
    const utility = new (jest.createMockFromModule(getEngineFile("block-utility")) as any)() as BlockUtility;
    // utility can be built up over time
    return utility;
  }
}