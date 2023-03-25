const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

class ExampleLegacyExtension {
  constructor(runtime) { }

  getItems() { return [{ text: "0", value: 0 }, { text: "1", value: 1 }]; }

  getInfo() {
    return {
      id: 'someBlocks',

      color1: '#FF8C1A',
      color2: '#DB6E00',
      
      name: formatMessage({
          id: 'extensionName',
          default: 'Some Blocks',
          description: 'The name of the "Some Blocks" extension'
      }),

      blocks: [
          {
              opcode: 'exampleLegacyBlock', 
              blockType: BlockType.REPORTER,
              text: formatMessage({
                  id: 'exampleLegacyBlock',
                  defaultMessage: 'Example text with [someArg] and [someArgWithMenu]',
                  description: 'Label on exampleLegacyBlock'
              }),
              arguments: {
                someArg: {
                  type: ArgumentType.STRING,
                },
                someArgWithMenu: {
                  type: ArgumentType.NUMBER,
                  menu: "someMenu"
                }
              }
          }
      ],
      menus: {
        someMenu: {
          items: this.getItems(),
          acceptReporters: false,
        },
      },
    };
  };

  exampleLegacyBlock(args) {
    // ... some implementation
  }
}