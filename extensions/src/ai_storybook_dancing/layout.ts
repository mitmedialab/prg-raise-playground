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

const extractTransform = (image: Element) =>
    image.parentElement.getAttribute("transform")
        .replace("translate(", "")
        .replace(")", "")
        .split(",").map(Number);

/**
 * Updates the inline images to have the desired dimensions and positioning within the blocks.
 */
export const fixInlineImages = () => {
    const allImages = document.querySelectorAll(".blocklyDraggable g image");
    for (const image of allImages) {
        if (!image.getAttribute("xlink:href").startsWith("data")) continue;
        image.setAttribute("height", "30");
        image.setAttribute("width", "30");
        const [x, y] = extractTransform(image);
        image.setAttribute("transform", `translate(${x / 2}, ${y / 2})`);
    }
}