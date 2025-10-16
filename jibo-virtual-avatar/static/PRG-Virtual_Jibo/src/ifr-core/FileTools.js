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
const loadText = async function(url, callback) {
    try {
        // Add cache-busting parameter
        const cacheBuster = new Date().getTime();
        const separator = url.includes('?') ? '&' : '?';
        const urlWithCacheBuster = `${url}${separator}${cacheBuster}`;
        
        const response = await fetch(urlWithCacheBuster);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.text();
        if (callback) {
            callback(null, data);
        }
    } catch (error) {
        if (callback) {
            callback(`FileTools: ${error.message}`, null);
        }
    }
};

/**
 * Load JSON data from a URL.
 * @param {string} url
 * @param {FileLoadCallback} callback
 */
const loadJSON = async function(url, callback) {
    try {
        // Add cache-busting parameter
        const cacheBuster = new Date().getTime();
        const separator = url.includes('?') ? '&' : '?';
        console.log(cacheBuster)
        console.log(url);
        const urlWithCacheBuster = `${url}${separator}${cacheBuster}`;
        
        const response = await fetch(urlWithCacheBuster);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        if (callback) {
            callback(null, jsonData);
        }
    } catch (error) {
        if (callback) {
            callback(`FileTools: ${error.message}`, null);
        }
    }
};

const FileTools = {
    loadText,
    loadJSON
};

export default FileTools;
