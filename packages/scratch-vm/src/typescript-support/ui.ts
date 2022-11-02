import Runtime from "../engine/runtime";
import { Extension as BaseExtension } from "./Extension";

export type ReactivityDependency = any | any[];

export const activeClass = true;

export const pixels = (numberOf: number) => `${numberOf}px`;

export const openUIEvent = "OPEN_UI_FROM_EXTENSION";
export const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";

type UniqueKeys<Extension> = Exclude<keyof Extension, keyof BaseExtension<any, any>>;
type Methods<Extension> = { [K in UniqueKeys<Extension>]-?: Extension[K] extends (...args: any) => any ? K : never };
type Properties<Extension> = { [K in UniqueKeys<Extension>]-?: Extension[K] extends (...args: any) => any ? never : K };
type MethodParams<Extension> = { [Key in UniqueKeys<Extension>]: Extension[Key] extends (...args: any) => any ? Parameters<Extension[Key]> : never };
type MethodReturns<Extension> = { [Key in UniqueKeys<Extension>]: Extension[Key] extends (...args: any) => any ? ReturnType<Extension[Key]> : never };

export type InvokeFromUI<Extension> = <T extends keyof Methods<Extension>>(funcName: T, ...args: MethodParams<Extension>[T]) => MethodReturns<Extension>[T];

export type GetFromUI<Extension> = <T extends keyof Properties<Extension>>(propertyName: T) => Extension[T];
export type SetFromUI<Extension> = <T extends keyof Properties<Extension>>(propertyName: T, value: Extension[T]) => void;

export const invokeFromUI = <Extension, T extends keyof Methods<Extension>>(extensionAssignment: Extension, funcName: T, args: MethodParams<Extension>[T]): MethodReturns<Extension>[T] => {
  return (extensionAssignment[funcName] as Function)(...args as []);
}

export const setFromUI = <Extension, T extends keyof Properties<Extension>>(extensionAssignment: Extension, propertyName: T, value: Extension[T]): void => {
  extensionAssignment[propertyName] = value;
}

export const openUI = (runtime: Runtime, details: { id: string, name: string, component: string, label?: string }) => runtime.emit(openUIEvent, details);

export const registerButtonCallback = (runtime: Runtime, buttonID: string, callback: (...args: any[]) => void) => {
  runtime.emit(registerButtonCallbackEvent, buttonID);
  runtime.on(buttonID, callback);
}

const enum Color {
  ui = "ui",
  text = "text",
  motion = "motion",
  red = "red",
  sound = "sound",
  control = "control",
  data = "data",
  pen = "pen",
  error = "error",
  extensions = "extensions",
  drop = "drop"
}

/**
 * Makes it easier to reference the css color variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
class CssVar {
  root: Color;

  constructor(root: Color) { this.root = root }

  get(...parts: string[]) { return `var(--${this.root}-${parts.join("-")})` }
  primary(...parts: string[]) { return this.get("primary", ...parts) }
  secondary(...parts: string[]) { return this.get("secondary", ...parts) }
  tertiary(...parts: string[]) { return this.get("tertiary", ...parts) }
  transparent(...parts: string[]) { return this.get("transparent", ...parts) }
  light(...parts: string[]) { return this.get("light", ...parts) }
}

const ui = new CssVar(Color.ui);
const text = new CssVar(Color.text);
const motion = new CssVar(Color.motion);
const red = new CssVar(Color.red);
const sound = new CssVar(Color.sound);
const control = new CssVar(Color.control);
const data = new CssVar(Color.data);
const pen = new CssVar(Color.pen);
const error = new CssVar(Color.error);
const extensions = new CssVar(Color.extensions);
const drop = new CssVar(Color.extensions);

/**
 * Color variable references corresponding to the css variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
export const color = {
  "ui": {
    primary: ui.primary(),
    secondary: ui.secondary(),
    tertiary: ui.tertiary(),
    modalOverlay: ui.get("modal", "overlay"),
    white: ui.get("white"),
    whiteDim: ui.get("white", "dim"),
    whiteTransparent: ui.get("white", "transparent"),
    transparent: ui.transparent(),
    blackTransparent: ui.get("black", "transparent"),
  },
  "text": {
    primary: text.primary(),
    primaryTransparent: text.transparent(),
  },
  "motion": {
    primary: motion.primary(),
    tertiary: motion.tertiary(),
    transparent: motion.get("transparent"),
    lightTansparent: motion.light("transparent"),
  },
  "red": {
    primary: red.primary(),
    tertiary: red.tertiary(),
  },
  "sound": {
    primary: sound.primary(),
    tertiary: sound.tertiary(),
  },
  "control": {
    primary: control.primary(),
  },
  "data": {
    primary: data.primary(),
  },
  "pen": {
    primary: pen.primary(),
    transparent: pen.transparent(),
  },
  "error": {
    primary: error.primary(),
    light: error.light(),
    transparent: error.transparent(),
  },
  "extensions": {
    primary: extensions.primary(),
    tertiary: extensions.tertiary(),
    light: extensions.light(),
    transparent: extensions.transparent(),
  },
  "drop": {
    highlight: drop.get("highlight")
  }
}