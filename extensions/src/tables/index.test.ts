import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    createTable: {
      after: async (fixture) => {
        const { ui, extension, testHelper: { expect, fireEvent } } = fixture;
        const inputs = await ui.findAllByTestId("makeNameInput");
        const subs = await ui.findAllByTestId("ok");
        expect(inputs.length).toBe(1);
        expect(subs.length).toBe(1);
        
        // const input = inputs[0];
        // const sub = subs[0];

        // await fireEvent.change(input, {target: {value: 'newTable'}});
        // await fireEvent.click(sub);

        // expect(extension.tables.newTable.length).toBe(1);
        // delete extension.tables.newTable;
      }
    },
    addTable: [
      //adds new table
      (testHelper) => {
        return {
          input: ['addedTable', 1, 1] as const,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            global.alert = () => { return null; };
            testHelper.expect(extension.tables.myTable.length).toBe(1);
          },
          after: (fixture) => {
            const { extension, testHelper, ui } = fixture;
            testHelper.expect(extension.tables.addedTable.length).toBe(1);
            delete extension.tables.addedTable;
          }
        }
      },
      //doesn't add if already exists
      (testHelper) => {
        return {
          input: ['addedTable', 2, 2] as const,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0]];
            testHelper.expect(extension.tables.myTable.length).toBe(1);
          },
          after: (fixture) => {
            const { extension, testHelper, ui } = fixture;
            testHelper.expect(extension.tables.addedTable.length).toBe(1);
            delete extension.tables.addedTable;
          }
        }
      },
    ],
    removeTable: ({ expect }) => {
      return {
        input: 'newTable',
        before: ({ extension }) => {
          extension.tables.newTable = [[1]];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable).toBe(undefined);
          delete extension.tables.newTable;
        }
      }
    },
    insertColumn: ({ expect }) => {
      return {
        input: 'newTable',
        before: ({ extension }) => {
          extension.tables.newTable = [[1]];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable[0].length).toBe(2);
          expect(extension.tables.newTable[0][1]).toBe(0);
          delete extension.tables.newTable;
        }
      }
    },
    insertRow: ({ expect }) => {
      return {
        input: 'newTable',
        before: ({ extension }) => {
          extension.tables.newTable = [[1]];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable.length).toBe(2);
          expect(extension.tables.newTable[1][0]).toBe(0);
          delete extension.tables.newTable;
        }
      }
    },
    getValueAt: [
      // return -1 for no table
      (testHelper) => {
        let expected = -1;
        return {
          input: ['blah', 2, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return -1 for row too high
      (testHelper) => {
        let expected = -1;
        return {
          input: ['addedTable', 3, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return -1 for column too high
      (testHelper) => {
        let expected = -1;
        return {
          input: ['addedTable', 2, 3] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return value correctly
      (testHelper) => {
        let expected = 1;
        return {
          input: ['addedTable', 2, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
    ],
    numberOfRows: [
      // return -1 for wrong table
      (testHelper) => {
        let expected = -1;
        return {
          input: 'blah',
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return value correctly
      (testHelper) => {
        let expected = 2;
        return {
          input: 'addedTable',
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
    ],
    highestValueOfColumn: [
      // return -1 for wrong table
      (testHelper) => {
        let expected = -1;
        return {
          input: ['blah', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return value correctly
      (testHelper) => {
        let expected = 4;
        return {
          input: ['addedTable', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      }
    ],
    indexOfHighestColumnValue: [
      // return -1 for wrong table
      (testHelper) => {
        let expected = -1;
        return {
          input: ['blah', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      // return value correctly
      (testHelper) => {
        let expected = 2;
        return {
          input: ['addedTable', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0,1],[0,4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      }
    ]
  },
  integrationTests: undefined
});