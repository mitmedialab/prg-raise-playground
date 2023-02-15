import { createTestSuite } from "$testing";
import Extension from "./ported";

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    exampleUpdatedBlock: {
      input: ["a", 0],
      expected: 0
    }
  }
})