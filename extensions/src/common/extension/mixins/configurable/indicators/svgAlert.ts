import { ExtensionInstanceWithFunctionality } from "../..";

export const isSvgGroup = (element: Element): element is SVGGElement => element.nodeName === "g";
export const isSvgText = (element: Element): element is SVGTextElement => element.nodeName === "text";

type AlertType = Parameters<ExtensionInstanceWithFunctionality<["indicators"]>["indicate"]>[0]["type"];

const fills = {
  success: "#5ACA75",
  warning: "#FF8f39",
  error: "#db1f1f"
} satisfies Record<AlertType, string>;

const textColor = {
  success: "white",
  warning: "white",
  error: "white"
} satisfies Record<AlertType, string>;

export async function openAlert(container: SVGGElement, msg: string, type: AlertType) {
  const elements = createElements();
  const [rect, triangle, text] = elements;

  const padding = 12;
  const y = 55;
  const x = 0;
  const fill = fills[type];
  const color = textColor[type];

  applyAttributes(triangle, { points: equilateralTrianglePoints, fill });

  applyAttributes(text, {
    x: x + padding / 2,
    y,
    fill: color,
    "font-weight": "bold",
    "font-size": "14pt",
    "font-family": "\"Helvetica Neue\", Helvetica, Arial, sans-serif;"
  });

  text.innerHTML = msg;

  elements.forEach(el => container.appendChild(el));

  await Promise.resolve();

  const { width, height } = text.getBBox();
  applyAttributes(rect, { x, width: width + padding, height: height + padding, y: y - height, fill, rx: 5 });

  return {
    close() { elements.forEach(element => container.removeChild(element)); }
  };
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