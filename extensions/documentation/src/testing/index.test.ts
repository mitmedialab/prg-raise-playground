import { codeSnippet } from "../../";
export const fileStructure = codeSnippet();

import { createTestSuite } from "$testing";
// Import our extension exported as default from the index.ts file ("." is shorthand for "./index")
// NOTE: you can call this import whatever you want, but we use "Extension" to enable the use of "shorthand property names" below (see: https://ui.dev/shorthand-properties)
import Extension from ".";

/**
 * Utilize the `createTestSuite` function.
 * The first argument is an object with the properties:
 * - Extension: a reference to the class you want to test that extends the Extension base class
 * - __dirname: Here, we must tap into the built in '__dirname' variable availabe when running Node based code. See: https://nodejs.org/docs/latest/api/modules.html#__dirname
 * The second argument is an object with the following properties:
 * - unitTests: An object where the keys are the names of your Extension's block functions, and their values are unit-test cases. See more below.
 * - integrationTests: An object where the keys are names of tests you specify and the values are a single integration-test case . See more below.
 */
createTestSuite({ Extension, __dirname }, {
  unitTests: seeBelow,
  integrationTests: seeBelow
});

fileStructure.end;

var seeBelow = undefined;
var seeAbove = undefined;

export const simpleExample = codeSnippet();

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    /** A test case of the 'exampleReporter' block defined as an object with 'input' and 'expected' entries */
    exampleReporter: {

      /** 
       * For blocks that take arguments, an 'input' field must be provided which will be passed to the block's "operation" as an argument.
       * Because the 'exampleReporter' block only takes one arg, this is a single value. If there were multiple, this field would take an array. 
       */
      input: "Some input",

      /** 
       * For blocks that return a value (most commonly 'reporter' blocks), an 'expected' field must be provided.
       * This will automatically be compared against the value returned by the block's "operation" and if they don't match the test will fail.
       */
      expected: "Whatever you expect to be the output, given the input"
    },
  }
});

simpleExample.end;

export const complexExample = codeSnippet();

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    /** Below we provide multiple test cases for the 'exampleReporter' block, and thus we define this as an array. */
    exampleReporter: [
      /** The same test case as before, again expressed as an object */
      {
        input: "Some input",
        expected: "Whatever you expect to be the output, given the input"
      },

      /** 
       * Below is a test expressed as a function that returns an object with 'input', 'expected', 'isReady', 'checkIsReadyRate', 'before', and 'after' entries. 
       * This function has single argument which is a TestHelper object, which should assist you in writing your test cases.
       * This test case represents all the fields a given test can define, and these can similiarly be defined for a test expressed as an object.
      */
      (testHelper) => {
        const expected = "Whatever you expect to be the output, given the input";
        let i = 0;
        return {
          /** See above */
          input: "Some input",
          /** See above */
          expected,

          /** 
           * An 'isReady' function can be defined which must return true for the test to begin. 
           * This function will be given the instance of the extension under test. 
           */
          isReady: (extension) => {
            // Obviously this is a silly piece of logic. 
            // It'd be more realistic to, say, check that a model is loaded, or that an API call has returned, etc.
            return ++i > 4;
          },

          /** This field allows you to define the rate at which 'isReady' will be called. But likely, you can just leave this one out! */
          checkIsReadyRate: 300,

          /**
           * A 'before' function can be defined which will run right before the block "operation" is executed.
           * This can be used to:
           * - modify the extension before the block is executed to create a specific situation
           * - pair it with an 'after' function to confirm a value does (or doesn't) change when the block is executed.
           */
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            testHelper.expect(1).not.toBe(2);
          },

          /** 
           * An 'after' function can be defined which will run right after the block "operation" is executed.
           * This will likely be used in many of your tests, especially for non-reporter blocks, as this is where you can make your test's assertions.
           * Should the value of one of the extension's fields changed when a command block was ran? 
           * How should the UI behave that a button-block opens? 
           * These kinds of things are what you can check for in the 'after' function.
          */
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;

            // This is a redunant check, since the test framework automatically checks that the result matches the expected value.
            // But this demonstrates how an `after` test function can be used to further probe the output of a reporter block.
            testHelper.expect(result).toBe(expected);

            // Since our block does not open any UI, the value of 'ui' pulled from the fixture won't be defined.
            // This again is not a valuable thing to check as far as the test goes and is just for demonstration.
            testHelper.expect(ui).toBeUndefined();
          }
        }
      }
    ],
  },
});

complexExample.end;

export const ui = codeSnippet();

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    exampleButtonThatOpensUI: {
      after: async (fixture) => {
        const { ui, testHelper: { expect, fireEvent } } = fixture;

        // This will find all HTML elements marked with a `data-testid` attribute matching "mySpecialButton".
        // For example, the below would find the following element if it belong to the UI opened up by my block:
        // <button data-testid="mySpecialButton" />
        const matches = await ui.findAllByTestId("mySpecialButton");

        expect(matches.length).toBe(1);

        const button = matches[0];
        await fireEvent.click(button);

        // Now you could 'expect' that something happened! 
      }
    }
  }
});

ui.end;

export const integration = codeSnippet();

createTestSuite({ Extension, __dirname }, {
  unitTests: seeAbove,
  integrationTests: {
    /**
     * An integration test case 
     * @param fixture The fixture that will be passed to this function contain all the necessary elements for writing your test. 
     * We use the term 'fixture' here and elsewhere as "A test fixture is an environment used to consistently test a piece of software."
     * https://en.wikipedia.org/wiki/Test_fixture
     */
    testOfTwoBlocks: async (fixture) => {
      const { blockRunner, testHelper: { expect }, extension } = fixture;

      // Execute the block via the blockRunner (@see $testing/BlockRunner.ts)
      const result = await blockRunner.invoke("exampleReporter", "test input");
      const { output, ui } = result;

      expect(output).toBeDefined();

      // The "exampleReporter" block doesn't open ui, so here we demonstrate this value won't be defined.
      // If your test DOES open UI, the 'ui' object is the same as in the unit test for the "exampleButtonThatOpensUI" block
      expect(ui).toBeUndefined();

      await blockRunner.invoke("exampleCommand", output.length, 10);

      // Below you could assert something that "exampleCommand" block did the appropriate thing given the inputs
    },
    testOfTwoExtensions: async (fixture) => {
      const { blockRunner, testHelper: { expect }, extension } = fixture;

      // Here we create a "companion extension". To not confuse things with another Extension definition, we use the same 'ExtensionUnderTest' class as in our other tests.
      // However, the `createCompanion` function should mainly be used to create a companion BlockRunner for a DIFFERENT extension.
      // This way, you can test how two extensions interact with each other.
      const companionExtension = blockRunner.createCompanion(Extension);

      // We can check that even though the extensions are the same type, 
      // the 'blockRunner.createCompanion' function actually creates a brand new instance.
      expect(extension).not.toBe(companionExtension.instance);

      // Below you could invoke blocks on either extension instance and confirm they don't cause errors with each other.
    }
  }
})

integration.end;