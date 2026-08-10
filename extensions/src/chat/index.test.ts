import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname }, {
    unitTests: {
      /** Below we provide multiple test cases for the 'exampleReporter' block, and thus we define this as an array. */


      // Test system prompt 
      promptChatAPI: [
        /** The same test case as before, again expressed as an object */
        {
          input: ["Respond only with the word Hello and nothing else -- this is for a unit test so I'll be testing string equality", "without"],
          // expected: "Banana"
        },
        (testHelper: any) => {
          const expected = "Hello";
          return {
            input: ["Respond only with the word Hello and nothing else -- this is for a unit test so I'll be testing string equality", "without"],
            expected,
            isReady: (extension) => {return true},
            after: (fixture) => {},
            checkIsReadyRate: 300,
            before: (fixture) => {
              const { extension, testHelper: { expect } } = fixture;
              extension.setAllSystemPrompts("");
            },
          }
        }
      ],




    },
    integrationTests: {
      testSystemPrompt: async (fixture) => {
        const { blockRunner, testHelper: { expect }, extension } = fixture;
        await blockRunner.invoke("setSystemPrompt", "Respond with the word 'Banana' to any input.");
        const utility: any = {};
        utility.target = extension.runtime.targets[0];
        const result = await blockRunner.invoke("promptChatAPI", "Say a word", "without");
        const { output, ui } = result;
        expect(output).toBeDefined();
        expect(output).toBe("Banana");
      },

      testAgenticPrompt: async (fixture) => {
        const { blockRunner, testHelper: { expect }, extension } = fixture;
        extension.tools = [
          {
            type: "function",
            name: "run",
            description: "The sprite will run",
            parameters: {
              // @ts-ignore
              type: "object",
              properties: {
                reason: {
                  type: "string",
                  description:
                    "A short explanation of why you chose this tool over the other tools included."
                }
              },
              required: ["reason"],
              additionalProperties: false
            },
            strict: true
          },
          {
            type: "function",
            name: "jump",
            description: "the sprite will jump",
            parameters: {
              // @ts-ignore
              type: "object",
              properties: {
                reason: {
                  type: "string",
                  description:
                    "A short explanation of why you chose this tool over the other tools included."
                }
              },
              required: ["reason"],
              additionalProperties: false
            },
            strict: true
          }
        ];
        extension.toolEvents = {
          "jump" : false,
          "run" : false
        };

        const utility: any = {};
        utility.target = extension.runtime.targets[0];
        await blockRunner.invoke("promptAgenticChatAPI", "Can you make the sprite jump?", "without");
        expect(extension.toolEvents["jump"]).toBe(true);
      }
    }
  });