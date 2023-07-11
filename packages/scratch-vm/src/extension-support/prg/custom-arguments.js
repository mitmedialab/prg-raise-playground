import { customArgumentMethod } from "../../dist/globals";
import { tryGetAuxiliaryObjectFromLoadedBundle } from "./bundle-loader";

/**
 * An extension instance
 * 
 * It could be a "classic" scratch extension or a PRG-framework-based extension (with or without custom argument support)
 * @typedef {object} Extension 
 */

/**
 * 
 * @param {Extension} extension 
 * @returns 
 */
export const tryResolveMenuItemAsCustomArgument = (extension, menuResult) =>
    extension[customArgumentMethod]?.(menuResult, tryGetAuxiliaryObjectFromLoadedBundle);