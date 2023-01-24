import { ArgumentType, BlockType, Extension, Block, DefineBlock, Environment, ExtensionMenuDisplayDetails, Argument, ButtonBlock } from "$common";
import { createImage } from "$common/openai";

type Details = {
  name: "DallE-dioms",
  description: "Using AI to generate images with English-language idioms as prompts",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

type Blocks = {
  setAPIKey: ButtonBlock;
  defineIdiom: (idiom: string) => string;
  generateImage: (idiom: string) => void;
}

export default class ExtensionNameGoesHere extends Extension<Details, Blocks> {

  idioms: string[] = ["a bitter pill to swallow"];
  definitionsByIdiom: Record<string, string> = { ["a bitter pill to swallow"]: "Still waiting to dowload idioms" };
  apiKey: string = "";

  toDisplay: {
    url: string,
    alt: string,
  };

  idiomsArg: Argument<string> = {
    type: ArgumentType.String,
    options: () => this.idioms
  };

  init(env: Environment) {
    this.getIdioms();
  }

  async getIdioms() {
    const resp = await fetch("https://www.wikitable2json.com/api/English-language_idioms");
    if (!resp.ok) throw new Error("Failed to retrieve idiom data");

    const json = await resp.json();
    if (!(Array.isArray(json) && json.length === 1)) throw new Error("Unexpected format!");

    const items = json[0] as string[][];
    if (items[0][0] !== "Idiom") throw new Error("Unexpected format!");

    const idioms = items.slice(1);
    this.idioms = idioms.map(([idiom]) => idiom);
    this.definitionsByIdiom = idioms.reduce((acc, [idiom, definition]) => {
      acc[idiom] = definition;
      return acc;
    }, {});

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
        arg: this.idiomsArg
      },
      generateImage: {
        type: BlockType.Command,
        arg: this.idiomsArg,
        text: (idiom) => `What does ${idiom} look like?`,
        operation: async (idiom) => {
          const { apiKey } = this;

          if (!apiKey || apiKey === "" || apiKey === "undefined") {
            this.openUI("APIKey", "Set your API Key and then try again")
            return;
          }

          const url = await createImage({ apiKey, prompt: idiom, size: 512 });
          this.toDisplay = { url, alt: `Generated image of ${idiom}` };
          this.openUI("UI", idiom);
        },
      }
    }
  }
}

