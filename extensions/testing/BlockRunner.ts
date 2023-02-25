import { BlockType, BlocksInfo, CodeGenArgs, Extension, ExtensionBase, ExtensionBlockMetadata, ExtensionCommon, NonAbstractConstructor } from "$common";
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

  async invoke<K extends BlockKey<T>>(key: K, ...input: InputArray<T, K>):
    Promise<{ output: Awaited<ReportedValue<T, K>>, ui?: RenderedUI }> {
    const { instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const { blockType, func, opcode } = this.getBlockMetaDataByKey(key);
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];
    const args = this.getBlockArgs(input);

    const output = await Promise.resolve(blockFunction.call(instance, ...args));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, ui: renderedUI };
  }

  async x<K extends BlockKey<T>>(key: K, args: Object): Promise<{ output: Awaited<ReportedValue<T, K>>, ui?: RenderedUI }> {
    const { instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const { blockType, func, opcode } = this.getBlockMetaDataByKey(key);
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];

    const output = await Promise.resolve(blockFunction.call(instance, ...[args, this.mockBlockUtility()]));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, ui: renderedUI };
  }

  async invokeWithCustomArgNames<K extends BlockKey<T>>(key: K, ...input: NamedInputArray<T, K>) {
    const inputs = input as [string, unknown][];
    const map = new Map<string, any>([["mutation", {}]]); // Need to research what 'mutation' is for
    return this.x(key, Object.fromEntries(inputs.reduce((args, [name, value]) => args.set(name, value), map)))
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

  private getBlockArgs(input: any): [args: Object, utility: BlockUtility] | [utility: BlockUtility] {
    const utility = this.mockBlockUtility();
    if (input === undefined) return [utility];

    const mutation = {}; // Need to research what this is for

    const args = Array.isArray(input)
      ? (input as Array<any>).reduce((acc, curr, index) => {
        Array.isArray(curr) ? acc[curr[0]] = curr[1] : acc[index] = curr;
        return acc
      },
        { mutation } as object
      )
      : { mutation, 0: input }
    return [args, utility];
  }
}