import { createTestSuite } from "$testing";
import Extension from "./example";
import { output } from "./format-message";

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    myReporter: {
      input: ["dummy", 4],
      expected: output
    }
  }
})