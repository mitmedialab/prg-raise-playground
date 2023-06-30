import { MinimalExtensionConstructor } from "../../base";
import { isSvgGroup, isSvgText, openAlert } from "./svgAlert";

const topLevelClass = "blocklyFlyout";
const containerClass = "blocklyFlyoutLabel categoryLabel";
const textClass = "blocklyFlyoutLabelText";

const getCategoryElements = (text: string): { error: string } | { container: SVGGElement, title: SVGTextElement } => {
  const topLevel = document.body.getElementsByClassName(topLevelClass);
  if (topLevel.length !== 1) return { error: "No top level element found." };

  for (const container of topLevel[0].getElementsByClassName(containerClass)) {
    for (const title of container.getElementsByClassName(textClass)) {
      if (title.innerHTML !== text || !isSvgGroup(container) || !isSvgText(title)) continue;
      return { container, title };
    }
  }
  return { error: "No title found matching given name" };
}


/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionThatIndicates extends Ctor {
    async indicate({ position, msg, type }: { position: "category", msg: string, type: "success" | "warning" | "error" }) {

      const elements = position === "category"
        ? getCategoryElements(this.name)
        : { error: "Unsupported indicator position" };

      if ("error" in elements) throw new Error(elements.error);
      const { container } = elements;
      const alert = await openAlert(container, msg, type);
      return alert;
    }
  }

  return ExtensionThatIndicates;
}
