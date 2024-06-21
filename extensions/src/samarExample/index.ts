import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block } from "$common";
import BlockUtility from "$scratch-vm/engine/block-utility";


/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
/** @see {ExplanationOfInitMethod} */
export default class ExtensionNameGoesHere extends extension(details) {

  init(env: Environment) {
  }


  @block({
    type: "reporter",
    text: (row) => `row: ${row}`,
    arg: {
      type: "string",
      options: [
        "my row [example table]",
      ]
    }
  })
  getRowIndex(rowName: string) {
    return 0;
  }

  @block({
    type: "reporter",
    text: (row) => `col: ${row}`,
    arg: {
      type: "string",
      options: [
        "my col [example table]",
      ]
    }
  })
  getColIndex(colName: string) {
    return 0;
  }

  @block({
    type: "command",
    text: (row, col, table) => `Set ${row} row and col ${col} of ${table} table`,
    args: [
      {
        type: "number",
        defaultValue: 0,
      },
      {
        type: "number",
        defaultValue: 0
      },
      {
        type: "string",
        defaultValue: "default"
      }
    ]
  })
  setTable(row: number, col: number, table: string) {

  }
}