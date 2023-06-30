import { Environment, extension } from "$common";
import { legacyIncrementalSupport, legacyFullSupport, info } from "./legacy";

/**
 * Invoke the `for` function on `legacyIncrementalSupport`, 
 * and provide your Extension as the Generic Argument.
 * 
 * Once you've implemented all legacy blocks, change 'legacyIncrementalSupport' to 'legacyFullSupport'.
 * The `legacyFullSupport` function will ensure that your extension implements all necessary blocks. 
 * This must be done before you're extension is allowed to merge to dev.
 */
const { legacyBlock } = legacyIncrementalSupport.for<SomeBlocks>();

const details = {
  name: "Some Blocks",
  description: "A demonstration of some blocks",
};

export default class SomeBlocks extends extension(details, "legacySupport") {
  /**
   * Impelement the required `getLegacyInfo` function, returning the `info` import from the legacy file
   */
  protected getLegacyInfo() { return info }

  init(env: Environment) { }

  /** 
   * For this simple block, we aren't required to define any block specific data 
   * (instead, that info will be pulled from the legacy info). 
   * We only need to implement the method to tie to the legacy block.
   * */
  @legacyBlock.exampleSimpleBlock()
  exampleSimpleBlock() {
    /* Do something */ console.log(info.blocks[0].opcode);
  }

  @legacyBlock.moreComplexBlockWithArgumentAndDynamicMenu({
    /** 
     * Because this block has arguments that are more complex (accept reporters & use dynamic menu(s)),
     * We need to define the below `argumentMethods` object.
     */
    argumentMethods: {
      /**
       * Because our first (and only) argumen, which is the "0th index" argument, 
       * both accepts reporters uses a dynamic menu, 
       * we must include a `0` entry in the `argumentMethods` object.
       */
      0: {

        /**
         * Because the legacy block's argument enabled accepting reporters (i.e. `acceptReporters = true`),
         * we must implement a `handler` method, 
         * which will ensure that the arguments ultimately passed to our block match what we expect.
         * @param reported 
         * @returns 
         */
        handler: (reported: unknown) => {
          const parsed = parseFloat(`${reported}`);
          return isNaN(parsed) ? 0 : parsed;
        },

        /**
         * Because the legacy block's argument made use of a dynamic menu, we are required to implement a `getItems` method.
         * This method should behave the exact same as the old extension's dynamic menu method. 
         * You should go look at the implementation of the old extension to see how to do this. 
         * @returns An array of menu entries which will be used for this dynamic menu
         */
        getItems: () => [1, 2, 3, 4, 5].map(value => ({ text: `${value}`, value }))
      }
    }
  })
  moreComplexBlockWithArgumentAndDynamicMenu(data: number) {
    /* Do something */ console.log(info.blocks[0].opcode, data)
  }
}