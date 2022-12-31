import { BlockType, Extension } from "$common";
import BlockUtility from "$root/packages/scratch-vm/src/engine/block-utility";
import { AnyExtension, BlockKey, InputArray, KeyToBlockIndexMap, RenderedUI, RuntimeForTest } from "./types";
import { getEngineFile } from "./utils";

export class BlockRunner<T extends AnyExtension> {
  constructor(private map: KeyToBlockIndexMap, private instance: T) {

  }

  async invoke<K extends BlockKey<T>>(key: K, ...input: InputArray<T, K>):
    Promise<{ output: ReturnType<T["BlockDefinitions"][K]>, renderedUI?: RenderedUI }> {
    const { map, instance } = this;
    const { runtime } = instance;
    const { forTest } = runtime as RuntimeForTest<T>;

    const index = map.get(key);
    const { blockType, func, opcode } = Extension.TestGetBlocks(instance)[index];
    const blockFunction: Function = blockType === BlockType.Button ? runtime[func] : instance[opcode];
    const args = this.getBlockArgs(input);

    const output = await Promise.resolve(blockFunction(...args));
    const renderedUI = forTest.UIPromise ? await forTest.UIPromise : undefined;
    return { output, renderedUI };
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