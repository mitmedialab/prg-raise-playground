export const openUIEvent = "OPEN_UI_FROM_EXTENSION";
export const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";
export const FrameworkID = "ExtensionFramework";
export const AuxiliaryExtensionInfo = "AuxiliaryExtensionInfo";

export const customArgumentFlag = "internal_IsCustomArgument";
export const customArgumentMethod = "tryProcessMenuItemAsCustomArgumentHack";

export const dropdown = {
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

export const dropdownStateFlag = "dropdownState";
export const dropdownEntryFlag = "dropdownEntry";
export const updateDropdownMethod = "manualDropdownUpdate";
export const initDropdownState = "init";
export const openDropdownState = "open";
export const closeDropdownState = "close";
export const updateDropdownState = "update";

export const blockIDKey = "blockID";