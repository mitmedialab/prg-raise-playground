import Runtime from "../engine/runtime";
import { Extension as BaseExtension } from "./Extension";

export type ReactivityDependency = any | any[];

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

export const white = "var(--ui-white)";