import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, Expand, ExpandRecursively, CustomArgument } from "$common";
import BlockUtility from "$scratch-vm/engine/block-utility";
import CustomReportUI from "./CustomReportUI.svelte";
import CustomArgUI from "./CustomArgUI.svelte";

const details: ExtensionMenuDisplayDetails = {
  name: "Hi",
};

type FixedSizeArray<N extends number, T> = ExpandRecursively<
  N extends 0 ? never[] : {
    0: T;
    length: N;
  } & ReadonlyArray<T>
>;

type Matrix<TRows extends number, TColumns extends number = TRows> = FixedSizeArray<TRows, FixedSizeArray<TColumns, number>>;

const matrixArg2D: CustomArgument<Matrix<2>, ExtensionNameGoesHere> = {
  type: ArgumentType.Custom,
  component: CustomArgUI,
  defaultEntry: { text: "3", value: [[1, 0], [0, 1]] },
}

export default class ExtensionNameGoesHere extends extension(details, "customArguments", "customReportValue") {

  init(env: Environment) { }

  @block({
    type: "reporter",
    text: (a, b) => `(2x2) ${a} x ${b}`,
    args: [matrixArg2D, matrixArg2D],
    reportValueUI: CustomReportUI
  })
  exampleReporter(a: Matrix<2>, b: Matrix<2>) {
    return a;
  }
}