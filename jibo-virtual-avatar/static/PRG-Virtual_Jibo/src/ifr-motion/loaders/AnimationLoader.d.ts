/**
 * Simple result object for animation loading
 */
export function AnimationLoadResult(): void;
export class AnimationLoadResult {
    url: any;
    success: boolean;
    message: string;
    motion: any;
    defaultDOFNames: any;
    enumMaps: any;
    events: any;
}
/**
 * Animation loader, exactly matching original Node.js behavior
 */
export default function AnimationLoader(): void;
export default class AnimationLoader {
    _result: AnimationLoadResult;
    flattenEnums: boolean;
    resolvePaths: boolean;
    getResult(): AnimationLoadResult;
    /**
     * Load a .anim file via FileTools, then parse (matches original exactly)
     * @param {string} url
     * @param {function} callback
     */
    load(url: string, callback: Function): void;
    /**
     * Parse animation data (matches original logic exactly)
     * @param {Object} jsonData
     * @param {string} dataUrl
     */
    parseData(jsonData: any, dataUrl: string): void;
}
