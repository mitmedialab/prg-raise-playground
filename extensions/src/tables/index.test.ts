import { createTestSuite } from "$testing";
import Extension from '.';

createTestSuite({ Extension, __dirname }, {
  unitTests: {
    createTable: [
      (testHelper) => {
        return {
          after: async (fixture) => {
            const { ui, extension, testHelper: { expect, fireEvent, updateHTMLInputValue } } = fixture;
            const inputs = await ui.findAllByTestId("makeNameInput");
            const subs = await ui.findAllByTestId("ok");
            expect(inputs.length).toBe(1);
            expect(subs.length).toBe(1);

            const input = inputs[0] as HTMLInputElement;
            const sub = subs[0] as HTMLButtonElement;

            await updateHTMLInputValue(input, 'newTable');
            expect(input.value).toBe('newTable')
            await fireEvent.click(sub);

            expect(extension.tables.newTable.length).toBe(1);
            delete extension.tables.newTable;
          }
        }
      },
      (testHelper) => {
        return {
          after: async (fixture) => {
            const { ui, extension, testHelper: { expect, fireEvent, updateHTMLInputValue } } = fixture;
            const inputs = await ui.findAllByTestId("makeNameInput");
            const subs = await ui.findAllByTestId("ok");
            expect(inputs.length).toBe(1);
            expect(subs.length).toBe(1);

            const input = inputs[0] as HTMLInputElement;
            const sub = subs[0] as HTMLButtonElement;

            await updateHTMLInputValue(input, 'myTable');
            expect(input.value).toBe('myTable')
            expect(sub.disabled).toBe(true)
          }
        }
      }
    ],
    showTable: {
      before: (fixture) => {
        const { extension, testHelper: { expect } } = fixture;
        extension.newTable({ name: 'newTable', rows: 2, columns: 2 });
        expect(extension.tables.newTable.length).toBe(2);
        expect(extension.rowNames.newTable[0]).toBe('row');
        expect(extension.columnNames.newTable[0]).toBe('col');
      },
      after: async (fixture) => {
        const { ui, extension, testHelper: { expect, fireEvent, updateHTMLInputValue } } = fixture;
        const myTable = await ui.findByText('myTable') as HTMLOptionElement;
        const newTable = await ui.findByText('newTable') as HTMLOptionElement;
        expect(myTable.selected).toBe(true);
        expect(newTable.selected).toBe(false);

        const selectors = await ui.findAllByTestId('tableSelect');
        const selector = selectors[0];
        await fireEvent.change(selector, { target: { value: 'newTable' } });

        expect(myTable.selected).toBe(false);
        expect(newTable.selected).toBe(true);
        const cells = await ui.findAllByTestId('tableCell');
        expect(cells.length).toBe(4);
        const cell = cells[0] as HTMLInputElement;

        const rows = await ui.findAllByTestId('rowNameCell');
        expect(rows.length).toBe(2);
        const row = rows[0] as HTMLInputElement;

        await fireEvent.change(cell, { target: { value: '3' } });
        await fireEvent.change(row, { target: { value: 'newName' } });
        expect(extension.tables.newTable[0][0]).toBe(3);
        expect(extension.rowNames.newTable[0]).toBe('newName');

        delete extension.tables.newTable;
      }
    },
    addTable: [
      (testHelper) => {
        return {
          name: "adds new table",
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
      (testHelper) => {
        return {
          name: "doesn't add if already exists",
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
          extension.rowNames.newTable = ['row'];
          extension.columnNames.newTable = ['col'];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable).toBe(undefined);
          expect(extension.rowNames.newTable).toBe(undefined);
          expect(extension.columnNames.newTable).toBe(undefined);
          delete extension.tables.newTable;
          delete extension.rowNames.newTable;
          delete extension.columnNames.newTable;
        }
      }
    },
    insertColumn: ({ expect }) => {
      return {
        input: 'newTable',
        before: ({ extension }) => {
          extension.tables.newTable = [[1]];
          extension.rowNames.newTable = ['row'];
          extension.columnNames.newTable = ['col'];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable[0].length).toBe(2);
          expect(extension.tables.newTable[0][1]).toBe(0);
          expect(extension.columnNames.newTable.length).toBe(2);
          expect(extension.rowNames.newTable.length).toBe(1);
          delete extension.tables.newTable;
          delete extension.rowNames.newTable;
          delete extension.columnNames.newTable;
        }
      }
    },
    insertRow: ({ expect }) => {
      return {
        input: 'newTable',
        before: ({ extension }) => {
          extension.tables.newTable = [[1]];
          extension.rowNames.newTable = ['row'];
          extension.columnNames.newTable = ['col'];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable.length).toBe(2);
          expect(extension.tables.newTable[1][0]).toBe(0);
          expect(extension.columnNames.newTable.length).toBe(1);
          expect(extension.rowNames.newTable.length).toBe(2);
          delete extension.tables.newTable;
          delete extension.rowNames.newTable;
          delete extension.columnNames.newTable;
        }
      }
    },
    deleteColumn: ({ expect }) => {
      return {
        input: ['newTable', 1],
        before: ({ extension }) => {
          extension.tables.newTable = [
            [0, 0],
            [1, 0]
          ];
          extension.rowNames.newTable = ['row', 'row'];
          extension.columnNames.newTable = ['col', 'col'];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable.length).toBe(2);
          expect(extension.tables.newTable[0].length).toBe(1);
          expect(extension.tables.newTable[0][0]).toBe(0);
          expect(extension.columnNames.newTable.length).toBe(1);
          expect(extension.rowNames.newTable.length).toBe(2);
          delete extension.tables.newTable;
          delete extension.rowNames.newTable;
          delete extension.columnNames.newTable;
        }
      }
    },
    deleteRow: ({ expect }) => {
      return {
        input: ['newTable', 1],
        before: ({ extension }) => {
          extension.tables.newTable = [
            [0, 0],
            [1, 1]
          ];
          extension.rowNames.newTable = ['row', 'row'];
          extension.columnNames.newTable = ['col', 'col'];
        },
        after: ({ extension }) => {
          expect(extension.tables.newTable.length).toBe(1);
          expect(extension.tables.newTable[0].length).toBe(2);
          expect(extension.tables.newTable[0][0]).toBe(1);
          expect(extension.columnNames.newTable.length).toBe(2);
          expect(extension.rowNames.newTable.length).toBe(1);
          delete extension.tables.newTable;
          delete extension.rowNames.newTable;
          delete extension.columnNames.newTable;
        }
      }
    },
    getValueAt: [
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for no table",
          input: ['blah', 2, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for row too high",
          input: ['addedTable', 3, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for column too high",
          input: ['addedTable', 2, 3] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = 1;
        return {
          name: "return value correctly",
          input: ['addedTable', 2, 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
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
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for wrong table",
          input: 'blah',
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = 2;
        return {
          name: "return value correctly",
          input: 'addedTable',
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 1]];
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
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for wrong table",
          input: ['blah', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = 4;
        return {
          name: "return value correctly",
          input: ['addedTable', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 4]];
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
      (testHelper) => {
        let expected = -1;
        return {
          name: "return -1 for wrong table",
          input: ['blah', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 4]];
          },
          after: (fixture) => {
            const { extension, testHelper, ui, result } = fixture;
            testHelper.expect(result).toBe(expected);
            delete extension.tables.addedTable;
          }
        }
      },
      (testHelper) => {
        let expected = 2;
        return {
          name: "return value correctly",
          input: ['addedTable', 2] as const,
          expected,
          before: (fixture) => {
            const { extension, testHelper } = fixture;
            extension.tables.addedTable = [[0, 1], [0, 4]];
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