import { BlockDefinitions, Environment, Extension } from "$ExtensionFramework";

type Details = {
  name: "Hand Pose v2",
  description: "Extension to detect hand position using Mediapipe model",
  iconURL: "",
  insetIconURL: "",
}

export default class HandPose extends Extension<Details, {}> {
  init(env: Environment): void {
    throw new Error("Method not implemented.");
  }
  defineBlocks(): BlockDefinitions<{}> {
    throw new Error("Method not implemented.");
  }
  defineTranslations(): HandPose["Translations"] {
    throw new Error("Method not implemented.");
  }
}