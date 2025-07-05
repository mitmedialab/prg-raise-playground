import { scratch, extension, type ExtensionMenuDisplayDetails, type BlockUtilityWithID, type Environment } from "$common";
import FileArgument from "./FileArgument.svelte"



/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be deleted whenever you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part (the text inside of the {...} curly brackets) 
to get a popup that tells you more about that concept.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Pixi3D Test",
  description: "An implementation of Pixi3D in the Playground",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
export default class Pixi3D extends extension(details, "customArguments") {

  pixi3d;
  /** @see {ExplanationOfInitMethod} */
  async init(env: Environment) {
    this.exampleField = 0;
    // @ts-ignore
    this.pixi3d = env.runtime.getPixi3D();
    await this.pixi3d.createApplication();
    await this.pixi3d.importGltf("static/assets/Doodlebot5.glb", [0,0,0], 1)
  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  /** @see {ExplanationOfExampleReporter}*/
  // @(scratch.command`Create cube with position x: ${{type: "number", defaultValue: 0}}, y ${{type: "number", defaultValue: 0}}, z ${{type: "number", defaultValue: -2}}, scale ${{type: "number", defaultValue: 0.5}}, color r: ${{type: "number", defaultValue: 1}}, g: ${{type: "number", defaultValue: 0}}, b: ${{type: "number", defaultValue: 1}}, and animation: ${{type: "string", options: ["true", "false"]}}`)
  // createCube(x: number, y: number, z: number, scale: number, r: number, g: number, b: number, animated: string) {
  //   this.pixi3d.createCube([x, y, z], scale, [r, g, b], animated == "true");
  // }

  // @(scratch.command`Create plane with position x: ${{type: "number", defaultValue: 0}}, y: ${{type: "number", defaultValue: 0}}, z: ${{type: "number", defaultValue: -2}}, scale ${{type: "number", defaultValue: 0.5}}, color r: ${{type: "number", defaultValue: 1}}, g: ${{type: "number", defaultValue: 0}}, b: ${{type: "number", defaultValue: 1}}`)
  // createPlane(x: number, y: number, z: number, scale: number, r: number, g: number, b: number) {
  //   this.pixi3d.createPlane([x, y, z], scale, [r, g, b]);
  // }

  // @(scratch.command`Create sphere with position x: ${{type: "number", defaultValue: 0}}, y: ${{type: "number", defaultValue: 0}}, z: ${{type: "number", defaultValue: -2}}, scale ${{type: "number", defaultValue: 0.5}}, color r: ${{type: "number", defaultValue: 1}}, g: ${{type: "number", defaultValue: 0}}, b: ${{type: "number", defaultValue: 1}}`)
  // createSphere(x: number, y: number, z: number, scale: number, r: number, g: number, b: number) {
  //   this.pixi3d.createSphere([x, y, z], scale, [r, g, b]);
  // }

  // @(scratch.command((self, $) => $`Upload model ${self.makeCustomArgument({ component: FileArgument, initial: { value: "", text: "File" } })} with scale ${{type: "number", defaultValue: 1}}`))
  // uploadSoundFile(test: string, scale: number) {
  //   this.pixi3d.importGltf(test, [0, 0, -2], scale);
  // }

  @(scratch.command`Arc with angle ${"number"} and radius ${"number"}`)
  arcDoodlebot(angle: number, radius: number) {
    this.pixi3d.animateArc(angle, radius);
  }

  @(scratch.command`Drive straight for ${"number"}`)
  forwardDoodlebot(radius: number) {
    this.pixi3d.animateStraight(radius);
  }

  @(scratch.command`Spin ${"number"} degrees`)
  spinDoodlebot(radius: number) {
    this.pixi3d.animateStraight(radius);
  }

  // @(scratch.command`Create cylinder with position x: ${{type: "number", defaultValue: 0}}, y: ${{type: "number", defaultValue: 0}}, z: ${{type: "number", defaultValue: -2}}, radius ${{type: "number", defaultValue: 1}}, height ${{type: "number", defaultValue: 3}}, color r: ${{type: "number", defaultValue: 1}}, g: ${{type: "number", defaultValue: 0}}, b: ${{type: "number", defaultValue: 1}}`)
  // createCylinder(x: number, y: number, z: number, radius: number, height: number, r: number, g: number, b: number) {
  //   this.pixi3d.createSphere([x, y, z], radius, height, [r, g, b]);
  // }

}