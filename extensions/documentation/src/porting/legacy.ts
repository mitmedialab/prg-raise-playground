import { codeSnippet } from "../../";

export const extract = codeSnippet();

import { ArgumentType, BlockType, extractLegacySupportFromOldGetInfo } from "$common";
// To make things easier, we provide a 'mockFormatMessage' you can use when copying over legacy code
import { mockFormatMessage as formatMessage } from "$common";

/**
 * Copy and paste over the of the object returned by the old extension's 'getInfo' method 
 * (making the necessary changes outlined below, and note that only the 'blocks' and 'menus' fields are required)
 * and pass it as an argument to the 'extractLegacySupportFromOldGetInfo' function.
 * If you're doing this in a seperate file from your Extension, make sure to export the return value.
 * NOTE: The object makes use of the 'as const' assertion applied to the argument object 
 * (see below, at the end of the function call).
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
 */
export default extractLegacySupportFromOldGetInfo({
  id: 'someBlocks', // not required 

  color1: '#FF8C1A',  // not required 
  color2: '#DB6E00',  // not required 

  name: formatMessage({  // not required 
    id: 'extensionName',
    default: 'Some Blocks',
    description: 'The name of the "Some Blocks" extension'
  }),

  blocks: [
    {
      opcode: 'exampleLegacyBlock',
      blockType: BlockType.Reporter, // Update to use new BlockType object (note the Pascal Case)
      text: formatMessage({
        id: 'exampleLegacyBlock',
        default: 'Example text with [someArg] and [someArgWithMenu]',
        description: 'Label on exampleLegacyBlock'
      }),
      arguments: {
        someArg: {
          type: ArgumentType.String, // Update to use new ArgumentType object (note the Pascal Case)
        },
        someArgWithMenu: {
          type: ArgumentType.Number,
          menu: "someMenu"
        }
      }
    }
  ],
  menus: {
    someMenu: {

      /**
       * Extract the values returned from the method previously used to populate the 'items' array.
       * The contents of 'items' will be validated against the corresponding 'options' array within the new block definition.
       * If the items array was already implemented as an array, you can leave it as-is. 
       */
      items: [{ text: "0", value: 0 }, { text: "1", value: 1 }],
      /**
       * NOTE: If you do not want an items array to be checked (or if it cannot, say if the menu was 'dynamic'),
       * you can set the items field to 'undefined' or an empty array ('[]'), or delete the menu item altogether.
       * This will simply mean that the menu values won't be validated automatically,
       * so you must manually work to make sure the 'options' provided by your new block match the old block it recreates.
       */

      acceptReporters: false,
    },
  },
} as const); // VERY IMPORTANT! Note the use of 'as const' on the object passed to the function

/**
 * By using 'as const', 
 * we ensure typescript is able to extract as much information from the old getInfo object as possible
 */

extract.end;