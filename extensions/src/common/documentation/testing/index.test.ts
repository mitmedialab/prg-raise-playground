// Snippet Start
import { createTestSuite } from "$testing";
// Import our extension exported as default from the index.ts file ("." is shorthand for "./index")
// NOTE: you can call this import whatever you want, but we use "Extension" to enable the use of "shorthand property names" below (see: https://ui.dev/shorthand-properties)
import Extension from ".";

/**
 * Utilize the `createTestSuite` function.
 * The first argument is an object with the properties:
 * - Extension: a reference to the class you want to test the extends the Extension base class
 * - __dirname: This is intented to be passed
 * The second argument is an object with the following properties:
 * - 
 * - 
 */
createTestSuite({ Extension, __dirname }, {
  unitTests: seeBelow,
  integrationTests: seeBelow
});
// Snippet End

var seeBelow = undefined;
var seeAbove = undefined;

// Snippet Start
createTestSuite({ Extension, __dirname }, {
  unitTests: {
    exampleReporter: [
      // A test case expressed as an object with 'input' and 'expected' entries
      {
        /** For blocks that take arguments, an input to block as an argument -- because there's only, this is a single value */
        input: "Some input",
        /** s */
        expected: "Whatever you expect to be the output, given the input"
      },

      // A test case expressed as a function that returns an object with 'input', 'expected', and 'after' entries
      (testHelper) => {
        const expected = "Whatever you expect to be the output, given the input";
        return {
          /** See above */
          input: "Some input",
          /** See above */
          expected,
          /** */
          after: (harness) => {
            const { extension, testHelper, ui, result } = harness;

            // This is a redunant check, since the test framework automatically checks that the result matches the expected.
            // But this demonstrates how an `after` test function can be used to further probe the output of a reporter block.
            testHelper.expect(result).toBe(expected);
          }
        }
      }
    ],
    exampleCommand: {
      before: (harness) => {
        const { extension, testHelper } = harness;
        testHelper.expect(1).not.toBe(2);
      },
      input: [4, 5],
      after: (harness) => {
        const { extension, testHelper: { expect }, ui } = harness;

        harness.

          // This block doesn't render UI, so that entry in the harness object should be undefined
          expect(ui).toBeUndefined();
      }
    },
  },
  integrationTests: seeBelow
});