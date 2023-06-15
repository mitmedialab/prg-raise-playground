import { block, hideElementsWithClass } from "$common";

/**
 * Remove UI elements that aren't related to the block programming workspace.
 * @returns 
 */
export const hideNonBlocklyElements = () => [
    "gui_menu-bar-position_3U1T0",
    "gui_stage-and-target-wrapper_69KBf",
    "react-tabs_react-tabs__tab-list_17Wee",
    "backpack_backpack-container_2_wGr",
    "gui_extension-button-container_b4rCs",
    "blocklyZoom"
].forEach(hideElementsWithClass);

/**
 * Update the Blockly workspace wrapper to stretch the full size of its container. 
 */
export const stretchWorkspaceToScreen = () => {
    const wrapper = document.getElementsByClassName('gui_body-wrapper_-N0sA')[0] as HTMLDivElement;
    wrapper.style.height = "100%";

    window.dispatchEvent(new Event('resize'));
}

export const changeInlineImageSizes = () => {
    const blocklyDraggables = document.getElementsByClassName("blocklyDraggable")[0];
    const image = document.querySelectorAll(".blocklyDraggable g image");

    // blocklyDraggables.
    document.getEle
    
    
    // blocklyDraggables.style.
}