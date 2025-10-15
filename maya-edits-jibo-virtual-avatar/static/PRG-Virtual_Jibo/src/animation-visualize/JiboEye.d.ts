export default JiboEye;
declare class JiboEye {
    private constructor();
    /**
     * @param {CachedImageLoader} textureLoader
     */
    setTextureLoader(textureLoader: CachedImageLoader): void;
    _textureLoader: CachedImageLoader;
    load(callback: any): void;
    /**
     * @return {THREE.Object3D}
     */
    getModelRoot(): THREE.Object3D;
    /**
     * @return {ModelControlGroup}
     */
    getModelControlGroup(): ModelControlGroup;
    /**
     * @param {SceneInfo} sceneInfo
     * @return {THREE.Camera}
     */
    constructCamera(sceneInfo: SceneInfo): THREE.Camera;
    /**
     * @return {THREE.Scene}
     */
    constructScene(): THREE.Scene;
}
