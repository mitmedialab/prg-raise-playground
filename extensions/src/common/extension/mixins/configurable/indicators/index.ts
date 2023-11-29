import { untilTimePassed } from "$common/utils";
import { MinimalExtensionConstructor } from "../../base";
import { isSvgGroup, isSvgText, openAlert } from "./svgAlert";

type IndicatorPayload = { position?: "category", msg: string, type?: "success" | "warning" | "error" };

/**
 * Mixin the ability for extensions to add an indicator message to the workspace.
 * @param Ctor 
 * @returns 
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
export default function <T extends MinimalExtensionConstructor>(Ctor: T) {
  abstract class ExtensionThatIndicates extends Ctor {
    readonly IndicatorType: Required<IndicatorPayload>["type"];

    /**
     * Add an indicator message to the workspace.
     * @param param0 Details
     * - `position`: Where to place the indicator. Currently only "category" is supported, which places the message immediately below the extensions name.
     * - `msg`: The message to display.
     * - `type`: The type of indicator to display. Currently "success", "warning" and "error", which effect the color of the indicator.
     * @returns 
     */
    async indicate({ position = "category", msg, type = "success" }: IndicatorPayload) {

      const elements = position === "category"
        ? getCategoryElements(this.name)
        : { error: "Unsupported indicator position" };

      if ("error" in elements) throw new Error(elements.error);
      const { container } = elements;
      const alert = await openAlert(container, msg, type);
      return alert;
    }

    async indicateFor({ position = "category", msg, type = "success" }: IndicatorPayload, seconds: number) {
      const { close } = await this.indicate({ position, msg, type });
      await untilTimePassed(seconds * 1000);
      close();
    }
  }

  return ExtensionThatIndicates;
}

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