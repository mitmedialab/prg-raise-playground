//
//class="blocklyFlyout" -- parent svg
//class="blocklyFlyoutLabel categoryLabel" -- <g>
//class="blocklyFlyoutLabelText" -- text element


export const indicate = async (name: string) => {
  const topLevel = document.body.getElementsByClassName("blocklyFlyout");
  if (topLevel.length !== 1) throw new Error("");

  let container: SVGGElement;
  let title: SVGTextElement;

  for (const inner of topLevel[0].getElementsByClassName("blocklyFlyoutLabel categoryLabel")) {
    for (const label of inner.getElementsByClassName("blocklyFlyoutLabelText")) {
      if (label.innerHTML !== name || !isSvgGroup(inner) || !isSvgText(label)) continue;
      container = inner;
      title = label;
    }
  }

  if (!container) throw new Error("");
  title.setAttribute("style", "color: red;")

  const padding = 10;

  const elements = createElements();
  const [rect, triangle, text] = elements;

  const y = 55;
  const x = 5;

  applyAttributes(triangle, { points: equilateralTrianglePoints });

  applyAttributes(text, { y, x: x + padding / 2, class: "blocklyFlyoutLabelText" });
  text.innerHTML = "HIIIIIIIII";

  elements.forEach(el => container.appendChild(el));

  await Promise.resolve();

  const { width, height } = text.getBBox();
  applyAttributes(rect, { x, width: width + padding, height: height + padding, y: y - height });
}

const applyAttributes = <T extends Record<string, any>>(element: Element, attributes: T) => {
  for (const key in attributes) {
    element.setAttribute(key, `${attributes[key]}`);
  }
}

const createElements = () => [createElement("rect"), createElement("polygon"), createElement("text")] as const;

const createElement = <T extends "text" | "rect" | "polygon">(type: T) =>
  document.createElementNS('http://www.w3.org/2000/svg', type);

const getEquilateralTrianglePoints = () => {
  const reduction = { x: 5, y: 14 };
  const shift = { x: 10, y: 26 };
  return [[50, 15], [100, 100], [0, 100]]
    .map(([x, y]) => [x / reduction.x + shift.x, y / reduction.y + shift.y])
    .map(([x, y]) => `${x} ${y}`)
    .join(", ");
}

const equilateralTrianglePoints = getEquilateralTrianglePoints();

const isSvgGroup = (element: Element): element is SVGGElement => {
  return element.nodeName === "g";
}

const isSvgText = (element: Element): element is SVGTextElement => {
  return element.nodeName === "text";
} 