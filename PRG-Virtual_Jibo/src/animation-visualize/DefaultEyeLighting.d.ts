export default DefaultEyeLighting;
declare class DefaultEyeLighting {
    /**
     * Called initially, once per renderer the plugin is installed into.
     *
     * @param {THREE.Scene} bodyScene - Body scene to install any setup into (may be null if renderer is eye-only).
     * @param {THREE.Scene} eyeScene - Eye scene to install any setup into (may be null if renderer is body-only).
     * @abstract
     */
    install(bodyScene: THREE.Scene, eyeScene: THREE.Scene): void;
    /**
     * Called whenever RobotRenderer.display is called, after dofValues have been applied
     * to the modelControlGroups. If this plugin is installed into multiple renderers, will be called separately
     * for each scene.
     *
     * @param {THREE.Scene} bodyScene - Body scene to modify if desired (may be null if renderer is eye-only).
     * @param {THREE.Scene} eyeScene - Eye scene to modify if desired (may be null if renderer is body-only).
     * @param {Object.<string, Object>} dofValues - Update display according to these values.
     * @abstract
     */
    update(bodyScene: THREE.Scene, eyeScene: THREE.Scene, dofValues: {
        [x: string]: any;
    }): void;
    /**
     * Called when this module is removed from a renderer it was previously installed into,
     * once for each renderer the module is removed from.
     *
     * @param {THREE.Scene} bodyScene - Body scene to removed any modifications from (may be null if renderer is eye-only).
     * @param {THREE.Scene} eyeScene - Eye scene to removed any modifications from (may be null if renderer is body-only).
     * @abstract
     */
    uninstall(bodyScene: THREE.Scene, eyeScene: THREE.Scene): void;
}
