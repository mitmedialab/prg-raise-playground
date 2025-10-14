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

  @(scratch.command`Make Jibo blink`)
  async blink() {
    if (this.jiboScene) {
      await this.jiboScene.blink();
    }
  }

  @(scratch.command`Play Jibo ${{ type: "string", options: ["neutral", "happy", "sad", "surprised", "calm", "confused", "excited", "worried", "scared", "proud"] }} animation`)
  async playEmotion(emotion: string) {
    if (this.jiboScene) {
      await this.jiboScene.playEmotionAnimation(emotion);
    }
  }

  @(scratch.command`Make Jibo look at mouse ${{ type: "string", options: ["on", "off"] }}`)
  setLookAtMouse(state: string) {
    this.jiboScene?.setLookAtMouse(state === "on");
  }

  @(scratch.command`Set Jibo body color to ${{ type: "string", options: ["white", "warm grey", "cool grey", "light blue", "light pink", "mint", "lavender", "peach"] }}`)
  setBodyColorPreset(color: string) {
    const colors = {
      white: [255, 255, 255],
      "warm grey": [210, 195, 175],
      "cool grey": [180, 200, 215],
      "light blue": [185, 215, 250],
      "light pink": [250, 200, 215],
      mint: [195, 250, 215],
      lavender: [225, 195, 250],
      peach: [250, 220, 185]
    };
    const [r, g, b] = colors[color] || [255, 255, 255];
    this.jiboScene?.setBodyColor(r, g, b);
  }

  @(scratch.command`Set Jibo body color r ${{ type: "number", defaultValue: 1 }}, g ${{ type: "number", defaultValue: 1 }}, b ${{ type: "number", defaultValue: 1 }}`)
  setBodyColor(r: number, g: number, b: number) {
    this.jiboScene?.setBodyColor(r, g, b);
  }
}
