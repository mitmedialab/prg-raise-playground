import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, Argument, ButtonBlock } from "$common";
import { createImage } from "$common/openai";
import englishIdioms from "./english";
import germanIdioms from "./german";
import chineseIdioms from "./chinese";

type Details = {
  name: "DallE-dioms",
  description: "Using AI to generate images with English-language idioms as prompts",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

type Blocks = {
  setAPIKey: ButtonBlock;

  defineIdiom: (idiom: string) => string;

  englishLanguageIdiom: (idiom: string) => string;
  germanIdiom: (idiom: string) => string;
  chineseIdiom: (idiom: string) => string;

  generateImage: (numberOf: number, idiom: string) => void;
}

const idiomBlock = (idioms: string[], language: string) => ({
  type: BlockType.Reporter,
  text: (idiom: string) => `From ${language}: ${idiom}`,
  arg: {
    type: ArgumentType.String,
    options: idioms,
  },
  operation: (idiom: string) => idiom
});

export default class ExtensionNameGoesHere extends Extension<Details, Blocks> {

  allIdioms: string[];
  definitionsByIdiom: Record<string, string>;
  apiKey: string = "";
  toDisplay: {
    url: string,
    alt: string,
  }[];

  get idiomsArgument(): Argument<string> {
    return {
      type: ArgumentType.String,
      options: {
        items: this.allIdioms,
        acceptsReporters: true,
        handler: (entry: any) => {
          if (this.allIdioms.includes(entry)) return entry;
          alert("You must provide one of the supported idioms. Returning first suppored idiom.");
          return this.allIdioms[0];
        }
      }
    }
  }

  init(env: Environment) {
    this.allIdioms = [englishIdioms, chineseIdioms, germanIdioms].map(obj => Object.keys(obj)).flat();
    this.definitionsByIdiom = { ...englishIdioms, ...chineseIdioms, ...germanIdioms };
  }

  async openAfterDelay() {
    await Promise.resolve();
    this.openUI("APIKey");
  }

  defineBlocks(): ExtensionNameGoesHere["BlockDefinitions"] {
    return {

      setAPIKey: {
        type: BlockType.Button,
        text: "Set API Key",
        operation: () => this.openUI("APIKey", "Enter your API Key")
      },

      defineIdiom: {
        type: BlockType.Reporter,
        text: (idiom) => `Define ${idiom}`,
        operation: (idiom) => this.definitionsByIdiom[idiom],
        arg: this.idiomsArgument
      },

      englishLanguageIdiom: idiomBlock(Object.keys(englishIdioms), "english"),
      chineseIdiom: idiomBlock(Object.keys(chineseIdioms), "chinese"),
      germanIdiom: idiomBlock(Object.keys(germanIdioms), "german"),

      generateImage: {
        type: BlockType.Command,
        args: [{ options: [1, 2, 3, 4, 5], type: ArgumentType.Number }, this.idiomsArgument],
        text: (numberOf, idiom) => `Generate ${numberOf} images of ${idiom}`,
        operation: async (numberOf, idiom) => {
          const { apiKey } = this;

          if (!apiKey || apiKey === "" || apiKey === "undefined") {
            this.openUI("APIKey", "Set your API Key and then try again")
            return;
          }

          const urls = await createImage({ apiKey, prompt: idiom, size: 512, numberOf });
          this.toDisplay = urls.map(url => ({ url, alt: `Generated image of ${idiom}` }));
          this.openUI("UI", idiom);
        },
      }
    }
  }
}

