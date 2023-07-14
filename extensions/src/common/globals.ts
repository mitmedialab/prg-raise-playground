export const openUIEvent = "OPEN_UI_FROM_EXTENSION";
export const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";
export const FrameworkID = "ExtensionFramework";
export const AuxiliaryExtensionInfo = "AuxiliaryExtensionInfo";

export const customArgumentFlag = "internal_IsCustomArgument";
export const customArgumentMethod = "tryProcessMenuItemAsCustomArgumentHack";

export const guiDropdownInterop = {
    runtimeKey: "prgDropdownCustomization",
    runtimeProperties: {
        stateKey: "state",
        entryKey: "entry",
        updateMethodKey: "update",
    },
    state: {
        open: "open",
        init: "init",
        update: "update",
        close: "close",
    },
} as const;

export const blockIDKey = "blockID";