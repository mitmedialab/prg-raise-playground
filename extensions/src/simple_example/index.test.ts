import { createTestSuite } from "$testing";
import extension from '.';

createTestSuite({ extension, __dirname },
  {
    unitTests: {
      log: [{
        input: "s",
      }],
      dummyUI: [
        {

        }
      ],
      counterUI: [],
    },
    integrationTests: undefined
  });