import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block, DefineBlock, Environment, ExtensionMenuDisplayDetails } from "../../typescript-support/types";
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
  name: "Spotify",
  description: "This extension plays 30 second previews of songs from Spotify. It's a resurrection of Eric Rosenbaum's https://github.com/ericrosenbaum/spotify-extension/blob/gh-pages/extension.js",
  /**
   * IMPORTANT! Place your icon image (typically a png) in the same directory as this index.ts file
   */
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  /**
   * IMPORTANT! Place your inset icon image (typically an svg) in the same directory as this index.ts file
   * NOTE: This icon will also appear on all of your extension's blocks
   */
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
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
  /*exampleCommand(exampleString: string, exampleNumber: number): void;
  exampleReporter: () => number;
  exampleHat(condition: boolean): boolean;*/
  searchAndPlay(query: string): void;
  // TODO uncomment when blocks are implemented
  /*searchAndPlayWait(query: string): void;
  playNextBeat(): void;
  playBeat(beatNum: number): void;
  playBeatAndWait(beatNum: number): void;*/
  trackData(trackAttr: string): string;
  /*currentBeat(): number;
  everyBeat(): boolean;
  everyBar(): boolean;
  stopMusic(): void; */
}

/**
 * @summary This is the class responsible for implementing the functionality of your blocks.
 * @description You'll notice that this class `extends` (or 'inherits') from the base `Extension` class.
 * 
 * Hover over `Extension` to get a more in depth explanation of the base class, and what it means to `extend it`.
 */
class Spotify extends Extension<Details, Blocks> {
  /**
   * @summary A field to demonstrate how Typescript Class fields work
   * @link https://www.typescriptlang.org/docs/handbook/2/classes.html#fields
   */
  // Example field 1
  //exampleField: number;
  
  currentArtistName: string;
  currentTrackName: string;
  currentAlbumName: string;

  init(env: Environment) {
    this.currentArtistName = 'no artist';
    this.currentTrackName = 'no track';
    this.currentAlbumName = 'no album';
  }

  // Ignore! Translations coming soon...
  defineTranslations = defineTranslations as typeof this.defineTranslations;

  // All example definitions below are syntactically equivalent, 
  // and which you use is just a matter of preference.
  defineBlocks(): Spotify["BlockDefinitions"] {

    // Example 1
    //type DefineExampleCommand = DefineBlock<Blocks["exampleCommand"]>;

    // Example 2
    /*const exampleCommand: DefineExampleCommand = () => ({
      type: BlockType.Command,
      args: [ArgumentType.String, { type: ArgumentType.Number, defaultValue: 789 }],
      text: (exampleString, exampleNumber) => `This is where the blocks display text goes, with arguments --> ${exampleString} and ${exampleNumber}`,
      operation: (exampleString, exampleNumber, util) => {
        alert(`This is a command! Here's what it received: ${exampleString} and ${exampleNumber}`); // Replace with what the block should do! 
        console.log(util.stackFrame.isLoop); // just an example of using the BlockUtility
      }
    });*/

    return {
      // Example 1?
      //exampleCommand,

      // Example 3
      /*exampleReporter: function (self: Spotify): Block<Blocks["exampleReporter"]> {
        return {
          type: BlockType.Reporter,
          text: "This increments an internal field and then reports it's value",
          operation: () => {
            return ++self.exampleField;
          }
        }
      },*/

      // Example 4
      // exampleHat: pickFromOptions,
      searchAndPlay: searchAndPlay,
      /*searchAndPlayWait: searchAndPlayWait,
      playNextBeat: playNextBeat,
      playBeat: playBeat,
      playBeatAndWait: playBeatAndWait,*/
      trackData: getTrackData,
      /*currentBeat: getCurrentBeat,
      everyBeat: everyBeat,
      everyBar:everyBar,
      stopMusic: stopMusic*/
    }
  }
}

// FEEDBACK is it redundant to have to define all of these blocks then make the function for them?
// Example 4
//type WithOptionsBlock = Blocks["exampleHat"];
/*const pickFromOptions = (): Block<WithOptionsBlock> => ({
  type: BlockType.Hat,
  arg: { type: ArgumentType.Boolean, options: [{ text: 'Yes', value: true }, { text: 'No', value: false }] },
  text: (argument1) => `Should the below block execute? ${argument1}`,
  operation: function (argument1) {
    return argument1;
  }
});*/

type SearchBlock = Blocks["searchAndPlay"];
const searchAndPlay = (): Block<SearchBlock> => ({
  type: BlockType.Command,
  arg: { type: ArgumentType.String, defaultValue: 'tacos' },
  text: (searchQuery) => `play music like ${searchQuery}`,
  operation: function(searchQuery) {
    console.log("play music like " + searchQuery);
  }
});

type TrackData = Blocks["trackData"];
const getTrackData = (): Block<TrackData> => ({
  type: BlockType.Reporter,
  arg: {
      type: ArgumentType.String, 
      defaultValue: 'full',
      options: ["track", "artist", "album", "full"]
  },
  text: (requestedData) => `${requestedData} name`,
  operation: function(requestedData) {
    switch (requestedData) {
      case 'track':
          return this.currentTrackName;
      case 'artist':
          return this.currentArtistName;
      case 'album':
          return this.currentAlbumName;
      case 'full':
          return this.currentTrackName + ' by ' + this.currentArtistName + ' from ' + this.currentAlbumName;
      default:
          return '';                    
  }
  }
});

export = Spotify;