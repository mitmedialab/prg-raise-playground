import { createTestSuite } from "$testing";
import Extension from "./legacy";

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    newBlock: {
      input: ["a", 0, "b", 1, 2, 3]
    }
  }
})