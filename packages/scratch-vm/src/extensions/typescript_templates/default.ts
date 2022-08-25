import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Environment } from "../../typescript-support/types";

type Details = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  // IMPORTANT! Place your icon image (typically a png) in the same directory as this index.ts file
  iconURL: "Replace with the name of your icon image file",
  // IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
  // NOTE: This icon will also appear on all of your extension's blocks
  insetIconURL: "Replace with the name of your inset icon image file"
};

class ExtensionNameGoesHere extends Extension<Details, {
  // Add function types here! The format is: 
  //    name_of_function: (argument1_name: argument1_type, argument2_name: argument2_type, ...etc...) => return_type
  // (New to types? Check out our primer on typescript: )
  // Each function type defined below represents a block that your extension implements.
  example: (argument: string) => void; // Replace this line! It's just an example of a 'command' block that takes a single string argument as input and doesn't return anything
}> {
  init(env: Environment) { }

  defineBlocks(): ExtensionNameGoesHere["BlockDefinitions"] {
    return {

      example: (self: ExtensionNameGoesHere) => ({
        // Hover over each of the below fields ('type', 'args', 'text', 'operation') to see what that field means and what values it can take on
        type: BlockType.Command, 
        args: [ArgumentType.String], 
        text: (argument) => `Replace with block's display text that references ${argument}`,
        operation: () => {          
          // Replace with what the block should do! 
        }
      }),

     }
  }
}

export = ExtensionNameGoesHere;