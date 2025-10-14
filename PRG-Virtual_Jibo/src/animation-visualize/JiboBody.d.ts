export default JiboBody;
declare class JiboBody {
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
     * @return {THREE.WebGLRenderTarget}
     */
    constructFaceScreenRenderTarget(sceneInfo: SceneInfo): THREE.WebGLRenderTarget;
}
