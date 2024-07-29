export const openUIEvent = "OPEN_UI_FROM_EXTENSION";
export const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";
export const FrameworkID = "ExtensionFramework";
export const AuxiliaryExtensionInfo = "AuxiliaryExtensionInfo";

/**
 * Literal values that control the interaction between the extension framework and the Scratch GUI,
 * specifically how dropdowns (tied to dynamic menus) are co-opted to support custom block arguments (and their UIs).
 */
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