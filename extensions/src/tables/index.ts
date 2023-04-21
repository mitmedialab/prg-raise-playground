import {
  ArgumentType, ButtonBlock, BlockType,
  Environment, Extension,
  MenuItem, SaveDataHandler, validGenericExtension
} from "$common";

type Details = {
  name: "Tables",
  description: "Make and use tables with rows and columns",
  iconURL: "tables.png",
  insetIconURL: "tables.svg"
};

type Blocks = {
  createTable: ButtonBlock;
  addTable: (name: string, rows: number, columns: number) => void;
  removeTable: (table: string) => void;
  insertColumn: (table: string) => void;
  insertRow: (table: string) => void;
  deleteColumn: (table: string, column: number) => void;
  deleteRow: (table: string, row: number) => void;
  insertValueAt: (table: string, value: any, row: number, column: number) => void;
  getValueAt: (table: string, row: number, column: number) => number;
  numberOfRows: (table: string) => number;
  numberOfColumns: (table: string) => number;
  highestValueOfColumn: (table: string, column: number) => number;
  highestValueOfRow: (table: string, row: number) => number;
  indexOfHighestColumnValue: (table: string, column: number) => number;
  indexOfHighestRowValue: (table: string, row: number) => number;
  showTable: ButtonBlock;
}

@validGenericExtension()
export default class Tables extends Extension<Details, Blocks> {
  tables: Record<string, number[][]>;
  rowNames: Record<string, string[]>;
  columnNames: Record<string, string[]>;
  tableNamesArg: any;
  defaultNumberArg: any;

  // save tables to .sb3 when project is saved
  override saveDataHandler = new SaveDataHandler({
    Extension: Tables,
    onSave: (self) => {
      return {
        tables: self.tables,
        rowNames: self.rowNames,
        columnNames: self.columnNames
      };
    },
    onLoad: (self, data) => {
      self.tables = data.tables;
      self.rowNames = data.rowNames;
      self.columnNames = data.columnNames;
    },
  });

  init(env: Environment) {
    if (!this.tables) {
      this.tables = {};
      this.rowNames = {};
      this.columnNames = {};
      this.tables.myTable = [];
      this.tables.myTable.push([0]);
      this.rowNames.myTable = ['row'];
      this.columnNames.myTable = ['col'];
    }

    // dynamic retriever of table names for block dropdowns
    this.tableNamesArg = {
      type: ArgumentType.String,
      options: {
        getItems: this.getTableNames.bind(this),
        acceptsReporters: true,
        handler: (reported: any) => {
          if (this.getTableNames().indexOf(reported) === undefined) {
            alert(`no table with name ${reported} exists`);
            return 'myTable';
          }
          return reported;
        }
      }
    };

    this.defaultNumberArg = {
      type: ArgumentType.Number,
      defaultValue: 1
    };
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
    this.rowNames[name] = new Array(rows).fill('row');
    this.columnNames[name] = new Array(columns).fill('col');
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

  changeColumnName(info: { name: string, column: number, value: string }) {
    const { name, column, value } = info;
    this.columnNames[name][column] = value;
  }

  changeRowName(info: { name: string, row: number, value: string }) {
    const { name, row, value } = info;
    this.rowNames[name][row] = value;
  }

  defineBlocks(): Tables["BlockDefinitions"] {
    return {
      // button that opens a modal to create a new table
      createTable: () => ({
        type: BlockType.Button,
        text: 'new table',
        operation: () => this.openUI("Make", "Add a table"),
      }),
      // programmatic means for creating a new table
      addTable: (self: Tables) => ({
        type: BlockType.Command,
        args: [self.tableNamesArg, self.defaultNumberArg, self.defaultNumberArg],
        text: (name, rows, columns) => `add table called ${name} with ${rows} rows and ${columns} columns`,
        operation: (name, rows, columns) => {
          if (name in self.tables) {
            alert(`that table already exists`);
            return;
          }
          const info = {
            name: name,
            rows: rows,
            columns: columns
          };
          self.newTable(info);
        }
      }),
      // deletes table from project memory
      removeTable: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `remove ${table}`,
        operation: (table) => {
          if (this.tables[table]) {
            delete this.tables[table];
            delete this.rowNames[table];
            delete this.columnNames[table];
            return;
          } else {
            alert(`that table doesn't exist`);
            return;
          }
        }
      }),
      // adds a new column to the given table
      insertColumn: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `add column to ${table}`,
        operation: (table) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return;
          }
          for (let i = 0; i < this.tables[table].length; i++) {
            this.tables[table][i].push(0);
          }
          this.columnNames[table].push('col');
        }
      }),
      // add a row to the given table
      insertRow: (self: Tables) => ({
        type: BlockType.Command,
        arg: self.tableNamesArg,
        text: (table) => `add row to ${table}`,
        operation: (table) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return;
          }
          let newRow = [];
          for (let i = 0; i < this.tables[table][0].length; i++) {
            newRow.push(0);
          }
          this.tables[table].push(newRow);
          this.rowNames[table].push('row');
        }
      }),
      // removes the specified column from the table
      deleteColumn: (self: Tables) => ({
        type: BlockType.Command,
        args: [self.tableNamesArg, ArgumentType.Number],
        text: (table, column) => `delete column ${column} from ${table}`,
        operation: (table, column) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return;
          }
          if (
            column > this.tables[table][0].length || 
            column < 0
          ) {
            alert(`that column number doesn't exist.`);
            return;
          }
          for (let i = 0; i < this.tables[table].length; i++) {
            this.tables[table][i].splice((column - 1), 1);
          }
          this.columnNames[table].splice((column - 1), 1);
        }
      }),
      // removes the specified row from th table
      deleteRow: (self: Tables) => ({
        type: BlockType.Command,
        args: [self.tableNamesArg, ArgumentType.Number],
        text: (table, row) => `delete row ${row} from ${table}`,
        operation: (table, row) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return;
          }
          if (
            row > this.tables[table].length || 
            row < 0
          ) {
            alert(`that row number doesn't exist.`);
            return;
          }
          this.tables[table].splice((row - 1), 1);
          this.rowNames[table].splice((row - 1), 1);
        }
      }),
      // change the value in a given table cell
      insertValueAt: (self: Tables) => ({
        type: BlockType.Command,
        args: [self.tableNamesArg, ArgumentType.Number, self.defaultNumberArg, self.defaultNumberArg],
        text: (table, value, row, column) => `insert ${value} at row ${row} and column ${column} of ${table}`,
        operation: (table, value, row, column) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
          } else if (this.tables[table].length < row) {
            alert(`That row value is too high!`);
          } else if (this.tables[table][0].length < column) {
            alert(`That column value is too high!`);
          } else {
            this.tables[table][row - 1][column - 1] = value;
          }
        }
      }),
      // get value from a given cell
      getValueAt: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg, self.defaultNumberArg],
        text: (table, row, column) => `item at row ${row} and column ${column} of ${table}`,
        operation: (table, row, column) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          } else if (this.tables[table].length < row) {
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
        operation: (table) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          return this.tables[table].length;
        }
      }),
      numberOfColumns: (self: Tables) => ({
        type: BlockType.Reporter,
        arg: self.tableNamesArg,
        text: (table) => `number of columns in ${table}`,
        operation: (table) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          return this.tables[table][0].length
        }
      }),
      highestValueOfColumn: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, column) => `highest value of column ${column} in ${table}`,
        operation: (table, column) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          return this.tables[table].reduce((max, current) => Math.max(max, current[column - 1]), -Infinity)
        }
      }),
      highestValueOfRow: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, row) => `highest value of row ${row} in ${table}`,
        operation: (table, row) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          return Math.max(...this.tables[table][row - 1])
        }
      }),
      // gets the row # for the highest value in a given column
      indexOfHighestColumnValue: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, column) => `row # of highest value in column ${column} of ${table}`,
        operation: (table, column) => {
          if (!(table in self.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          let max = this.tables[table].reduce((curMax, current, index) => {
            if (curMax[1] >= current[column - 1]) {
              return curMax;
            } else {
              return [index, current[column - 1]];
            }
          }, [-1, -Infinity]);
          return (max[0] + 1);
        }
      }),
      // gets the column # for the highest value of a given row
      indexOfHighestRowValue: (self: Tables) => ({
        type: BlockType.Reporter,
        args: [self.tableNamesArg, self.defaultNumberArg],
        text: (table, row) => `column # of highest value in row ${row} of ${table}`,
        operation: (table, row) => {
          if (!(table in this.tables)) {
            alert(`that table does not exist.`);
            return -1;
          }
          let max = Math.max(...this.tables[table][row - 1]);
          return (this.tables[table][row - 1].indexOf(max) + 1);
        }
      }),
      // opens a modal to view a table, in which one can also change table values
      showTable: () => ({
        type: BlockType.Button,
        text: 'view tables',
        operation: () => this.openUI("View", "View / Edit Table Values"),
      }),
    }
  }
}
