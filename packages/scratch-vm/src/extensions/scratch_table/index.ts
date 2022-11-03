import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Argument, Block, ButtonBlock, DefineBlock, Environment, ExtensionMenuDisplayDetails, MenuItem } from "../../typescript-support/types";
import defineTranslations from "./translations";

/**
 * @summary This type describes how your extension will display in the extensions menu. 
 * @description Like all Typescript type declarations, it looks and acts a lot like a javascript object. 
 * It will be passed as the first generic argument to the Extension class that your specific extension `extends`
 * (see the class defintion below for more information on extending the Extension base class). 
 * @see ExtensionMenuDisplayDetails for all possible display menu properties.
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
type Details = {
  name: "Tables",
  description: "Make and use tables with rows and columns",
  iconURL: "paper-graph.png",
  /**
   * IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
   * NOTE: This icon will also appear on all of your extension's blocks
   */
  insetIconURL: "data-sheet.png"
};

/**
 * @summary This type describes all of the blocks your extension will/does implement. 
 * @description As you can see, each block is represented as a function.
 * In typescript, you can specify a function in either of the following ways (and which you choose is a matter of preference):
 * - Arrow syntax: `nameOfFunction: (argument1Name: argument1Type, argument2Name: argument2Type, ...etc...) => returnType;`
 * - 'Method' syntax: `nameOfFunction(argument1Name: argument1Type, argument2Name: argument2Type, ...etc...): returnType;`
 * 
 * The three included functions demonstrate some of the most common types of blocks: commands, reporters, and hats.
 * - Command functions/blocks take 0 or more arguments, and return nothing (indicated by the use of a `void` return type). 
 * - Reporter functions/blocks also take 0 or more arguments, but they must return a value (likely a `string` or `number`).
 * - Hat functions/blocks also take 0 or more arguments, but they must return a boolean value.
 * 
 * Feel free to delete these once you're ready to implement your own blocks.
 * 
 * This type will be passed as the second generic argument to the Extension class that your specific extension 'extends'
 * (see the class defintion below for more information on extending the Extension base class). 
 * @link https://www.typescriptlang.org/docs/handbook/2/functions.html Learn more about function types!
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html Learn more about object types! (This is specifically a 'type alias')
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics! 
 */
type Blocks = {
  createTable: ButtonBlock;
  removeTable: (table: string) => void;
  insertColumn: (table: string) => void;
  insertRow: (table: string) => void;
  insertValueAt: (table: string, value: any, row: number, column: number) => void;
  getValueAt: (table: string, row: number, column: number) => number;
  numberOfRows: (table: string) => number;
  numberOfColumns: (table: string) => number;
  highestValueOfColumn: (table: string, column: number) => number;
  highestValueOfRow: (table: string, row: number) => number;
  showTable: ButtonBlock;
}

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the base `Extension` class.
 * 
 * Hover over `Extension` to get a more in depth explanation of the base class, and what it means to `extend it`.
 */
class Tables extends Extension<Details, Blocks> {
  /**
   * @summary A field to demonstrate how Typescript Class fields work
   * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
   */
  tables: Record<string, number[][]>;
  changeMonitorVisibility: (id: any, visible: boolean) => void;

  private tableNamesArg: Argument<string>;
  private defaultNumberArg: Argument<number>;

  init(env: Environment) {
    this.tables = {};
    this.tables.myTable = [];
    this.tables.myTable.push([0]);
    this.tableNamesArg = {
      type: ArgumentType.String,
      options: this.getTableNames.bind(this),
    };
    this.defaultNumberArg = {
      type: ArgumentType.Number,
      defaultValue: 1
    }
  }

  getTableNames(): MenuItem<string>[] {
    return Object.keys(this.tables).map(
      tableName => ({
        text: tableName,
        value: tableName
      })
    );
  }


  newTable(info: { name: string, rows: number, columns: number }) {
    const { name, rows, columns } = info;
    this.tables[name] = [];
    for (let i = 0; i < rows; i++) {
      let newRow = [];
      for (let j = 0; j < columns; j++) newRow.push(0);
      this.tables[name].push(newRow);
    }
  }

  changeTableValue(info: { name: string, row: number, column: number, value: number }) {
    const { name, row, column, value } = info;
    this.tables[name][row][column] = value;
  }

  // Ignore! Translations coming soon...
  defineTranslations = defineTranslations as typeof this.defineTranslations;

  // All example definitions below are syntactically equivalent, 
  // and which you use is just a matter of preference.
  defineBlocks(): Tables["BlockDefinitions"] {
    return {
      createTable: () => ({
        type: BlockType.Button,
        text: 'new table',
        operation: () => this.openUI("make", "Add a table"),
      }),
      removeTable: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `remove ${table}`,
        operation: (table) => delete this.tables[table]
      }),
      insertColumn: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `add column to ${table}`,
        operation: (table) => {
          for (let i = 0; i < this.tables[table].length; i++) {
            this.tables[table][i].push(0);
          }
        }
      }),
      insertRow: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `add row to ${table}`,
        operation: (table) => {
          let newRow = [];
          for (let i = 0; i < this.tables[table][0].length; i++) {
            newRow.push(0);
          }
          this.tables[table].push(newRow);
        }
      }),
      insertValueAt: (self: Tables) => ({
        type: BlockType.Command,
        args: [self.tableNamesArg, ArgumentType.Number, self.defaultNumberArg, self.defaultNumberArg],
        text: (table, value, row, column) => `insert ${value} at row ${row} and column ${column} of ${table}`,
        operation: (table, value, row, column) => {
          if (this.tables[table].length < row) {
            alert(`That row value is too high!`);
          } else if (this.tables[table][0].length < column) {
            alert(`That column value is too high!`);
          } else {
            this.tables[table][row - 1][column - 1] = value;
          }
        }
      }),
      getValueAt: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg, self.defaultNumberArg],
        text: (table, row, column) => `item at row ${row} and column ${column} of ${table}`,
        operation: (table, row, column) => {
          if (this.tables[table].length < row) {
            alert(`That row value is too high!`);
            return -1;
          } else if (this.tables[table][0].length < column) {
            alert(`That column value is too high!`);
            return -1;
          } else {
            return this.tables[table][row - 1][column - 1]
          }
        }
      }),
      numberOfRows: (self: Tables) => ({
        type: BlockType.Reporter,
        arg: self.tableNamesArg,
        text: (table) => `number of rows in ${table}`,
        operation: (table) => this.tables[table].length
      }),
      numberOfColumns: (self: Tables) => ({
        type: BlockType.Reporter,
        arg: self.tableNamesArg,
        text: (table) => `number of columns in ${table}`,
        operation: (table) => this.tables[table][0].length
      }),
      highestValueOfColumn: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, column) => `highest value of column ${column} in ${table}`,
        operation: (table, column) => {
          return this.tables[table].reduce((max, current) => Math.max(max, current[column - 1]), -Infinity)
        }
      }),
      highestValueOfRow: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, row) => `highest value of row ${row} in ${table}`,
        operation: (table, row) => Math.max(...this.tables[table][row - 1])
      }),
      showTable: () => ({
        type: BlockType.Button,
        text: 'view tables',
        operation: () => this.openUI("view", "View / Edit Table Values"),
      }),
    }
  }
}

export = Tables;