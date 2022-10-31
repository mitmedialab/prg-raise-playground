import Runtime from "../engine/runtime";

export const openUIEvent = "OPEN_UI_FROM_EXTENSION";
export const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";

type Methods<Extension> = { [K in keyof Extension]-?: Extension[K] extends (...args: any) => any ? K : never };
type MethodParams<Extension> = { [Key in keyof Extension]: Extension[Key] extends (...args: any) => any ? Parameters<Extension[Key]> : never };
type MethodReturns<Extension> = { [Key in keyof Extension]: Extension[Key] extends (...args: any) => any ? ReturnType<Extension[Key]> : never };

export type InvokeFromUI<Extension> = <T extends keyof Methods<Extension>>(funcName: T, ...args: MethodParams<Extension>[T]) => MethodReturns<Extension>;

export const invokeFromUI = <Extension, T extends keyof Methods<Extension>>(extension: Extension, funcName: T, args: MethodParams<Extension>[T]): MethodReturns<Extension> => {
  return (extension[funcName] as Function)(...args as []);
}

export const openUI = (runtime: Runtime, details: { id: string, name: string, component: string }) => runtime.emit(openUIEvent, details);

export const registerButtonCallback = (runtime: Runtime, buttonID: string, callback: (...args: any[]) => void) => {
  runtime.emit(registerButtonCallbackEvent, buttonID);
  runtime.on(buttonID, callback);
}