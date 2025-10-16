export default SceneInfo;
declare class SceneInfo {
    /**
     * @param {string} url
     * @param callback
     */
    load(url: string, callback: any): void;
    loadURL: string;
    /**
     * @param {Object} jsonData
     */
    parseData(jsonData: any): void;
    loadSucceeded: boolean;
    loadMessage: string;
    faceScreenMeshName: any;
    faceScreenWidth: any;
    faceScreenHeight: any;
}
