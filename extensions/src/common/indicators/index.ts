import { openAlert } from "./svgAlert";

const topLevelClass = "blocklyFlyout";
const containerClass = "blocklyFlyoutLabel categoryLabel";
const textClass = "blocklyFlyoutLabelText";

export const indicateOnCategoryLabel = async (name: string, msg: string, type: "success" | "warning" | "error") => {
  const elements = getCategoryElements(name);
  if ("error" in elements) throw new Error(elements.error);
  const { container } = elements;
  const alert = await openAlert(container, msg, type);
  return alert;
}

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

const isSvgGroup = (element: Element): element is SVGGElement => {
  return element.nodeName === "g";
}

const isSvgText = (element: Element): element is SVGTextElement => {
  return element.nodeName === "text";
} 