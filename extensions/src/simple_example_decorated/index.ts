import { ArgumentType, BlockType, Environment, Menu, SaveDataHandler, block, buttonBlock, extension, DecoratedExtension, tryCastToArgumentType, legacy, legacyFactory } from "$common";

const info = {
  id: "",
  blocks: [
    {
      opcode: "log",
      blockType: "command",
      text: "",
      arguments: {
        x: {
          type: ArgumentType.String
        }
      }
    }
  ]
} as const;

const { legacyExtension, ...legacyBlocks } = legacyFactory(info);

// legacyBlocks.log.decorator();

// legacyBlocks.log.definition();

@extension({
  name: "Super Simple Typescript Extension (decorted)!",
  description: "Skeleton for a typescript extension",
  iconURL: "",
  insetIconURL: "",
})
@legacyExtension()
export default class SimpleTypescript extends DecoratedExtension {
  count: number = 0;

  logOptions: Menu<string> = {
    items: ['1', 'two', 'three'],
    acceptsReporters: true,
    handler: (x: any) => tryCastToArgumentType(ArgumentType.String, x, () => {
      alert(`Unsopported input: ${x}`);
      return "";
    })
  }

  saveDataHandler = new SaveDataHandler({
    Extension: SimpleTypescript,
    onSave: ({ count }) => ({ count }),
    onLoad: (self, { count }) => self.count = count
  });

  increment() {
    this.count++;
  }

  incrementBy(amount: number) {
    this.count += amount;
  }

  init(env: Environment) { }

  @block((self) => ({
    type: BlockType.Command,
    text: (msg) => `Log ${msg} to the console`,
    arg: { type: ArgumentType.String, options: self.logOptions }
  }))
  @legacyBlocks.log.decorator()
  log(msg: string) {
    console.log(msg);
  }

  @block({ type: BlockType.Button, text: `Dummy UI` })
  dummyUI() {
    this.openUI("Dummy", "Howdy");
  }

  @block({ type: BlockType.Button, text: "Open Counter" })
  counterUI() {
    this.openUI("Counter", "Pretty cool, right?");
  }

  @buttonBlock("Show colors")
  colorUI() {
    this.openUI("Palette");
  }
}