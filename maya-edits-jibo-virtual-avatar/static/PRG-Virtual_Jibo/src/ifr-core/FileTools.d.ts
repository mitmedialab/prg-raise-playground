export default FileTools;
export type FileLoadCallback = (error: string, data: any) => any;
declare namespace FileTools {
    export { loadText };
    export { loadJSON };
}
/**
 * @callback FileLoadCallback
 * @param {string} error - error message, null if file load succeeded
 * @param {*} data - loaded file contents
 * @intdocs
 */
/**
 * Load text data from a URL.
 * @param {string} url
 * @param {FileLoadCallback} callback
 */
declare function loadText(url: string, callback: FileLoadCallback): Promise<void>;
/**
 * Load JSON data from a URL.
 * @param {string} url
 * @param {FileLoadCallback} callback
 */
declare function loadJSON(url: string, callback: FileLoadCallback): Promise<void>;
