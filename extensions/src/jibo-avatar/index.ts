import { scratch, extension, type Environment, type ExtensionMenuDisplayDetails } from "$common";

const details: ExtensionMenuDisplayDetails = {
  name: "Jibo Avatar",
  description: "Render and control the Virtual Jibo avatar on the Scratch stage",
  blockColor: "#1c7ed6",
  menuColor: "#364fc7",
  menuSelectColor: "#748ffc"
};

export default class JiboAvatarExtension extends extension(details) {
  private runtimeEnv?: Environment;
  private jiboScene?: any;

  async init(env: Environment) {
    this.runtimeEnv = env;
    const manager = (env.runtime as any).getJiboAvatar?.();
    if (manager) {
      this.jiboScene = manager;
      await manager.initialize();
      manager.resetPose();
    }
  }

  @(scratch.command`Reset Jibo pose`)
  resetPose() {
    this.jiboScene?.resetPose();
  }

  @(scratch.command`Rotate Jibo by ${{ type: "number", defaultValue: 15 }} degrees`)
  rotateBody(degrees: number) {
    this.jiboScene?.rotateBody(degrees);
  }

  @(scratch.command`Set Jibo eye color to ${{ type: "string", options: ["white", "red", "blue", "green", "yellow", "cyan", "magenta", "orange"] }}`)
  setEyeColorPreset(color: string) {
    const colors = {
      white: [1, 1, 1],
      red: [1, 0, 0],
      blue: [0, 0, 1],
      green: [0, 1, 0],
      yellow: [1, 1, 0],
      cyan: [0, 1, 1],
      magenta: [1, 0, 1],
      orange: [1, 0.5, 0]
    };
    const [r, g, b] = colors[color] || [1, 1, 1];
    this.jiboScene?.setEyeColor(r, g, b);
  }

  @(scratch.command`Set Jibo eye color r ${{ type: "number", defaultValue: 1 }}, g ${{ type: "number", defaultValue: 1 }}, b ${{ type: "number", defaultValue: 1 }}`)
  setEyeColor(r: number, g: number, b: number) {
    this.jiboScene?.setEyeColor(r, g, b);
  }
}
