import { BlockType, Extension, Environment, } from "$common";
import { OnnxRuntime } from "$common/onnx";

type Details = {
  name: "Onnx Example",
  description: "A demonstration that an onnx model can be used (not exciting, nor educationally valuable)",
  iconURL: "",
  insetIconURL: ""
};


type Blocks = {
  test: () => void
}

export default class ExtensionNameGoesHere extends Extension<Details, Blocks> {
  onnx = new OnnxRuntime();

  init(env: Environment) { }

  defineBlocks(): ExtensionNameGoesHere["BlockDefinitions"] {

    return {
      test: {
        type: BlockType.Command,
        text: "eee",
        operation: async () => {
          try {
            const { InferenceSession, Tensor } = await this.onnx.runtime;

            // create a new session and load the specific model.
            //
            // the model in this example contains a single MatMul node
            // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
            // it has 1 output: 'c'(float32, 3x3)
            const session = await InferenceSession.create(`${location.href}/static/model.onnx`);

            // prepare inputs. a tensor need its corresponding TypedArray as data
            const dataA = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            const dataB = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);
            const tensorA = new Tensor('float32', dataA, [3, 4]);
            const tensorB = new Tensor('float32', dataB, [4, 3]);

            // prepare feeds. use model input names as keys.
            const feeds = { a: tensorA, b: tensorB };

            // feed inputs and run
            const results = await session.run(feeds);

            // read from results
            const dataC = results.c.data;
            console.log(dataC);
          } catch (e) {
            console.error(`failed to inference ONNX model: ${e}.`);
          }
        }
      }
    }
  }
}