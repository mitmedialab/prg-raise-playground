import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname }, {
    unitTests: {
      /** Below we provide multiple test cases for the 'exampleReporter' block, and thus we define this as an array. */
      promptChatAPI: [
        /** The same test case as before, again expressed as an object */
        {
          input: ["Say a word", "without"],
          // expected: "Banana"
        },

        /** 
         * Below is a test expressed as a function that returns an object with 'input', 'expected', 'isReady', 'checkIsReadyRate', 'before', and 'after' entries. 
         * This function has single argument which is a TestHelper object, which should assist you in writing your test cases.
         * This test case represents all the fields a given test can define, and these can similiarly be defined for a test expressed as an object.
        */
        (testHelper: any) => {
          const expected = "Banana";
          let i = 0;
          return {
            /** See above */
            input: ["Say a word", "without"],
            /** See above */
            expected,

            isReady: (extension) => {
              // Obviously this is a silly piece of logic. 
              // It'd be more realistic to, say, check that a model is loaded, or that an API call has returned, etc.
              return ++i > 4;
            },

            after: (fixture) => {

            },

            checkIsReadyRate: 300,

            before: (fixture) => {
              const { extension, testHelper } = fixture;
              extension.setAllSystemPrompts("Respond with the word 'Banana' to any input.");
    
            },
          }
        }
      ],
    },
  });