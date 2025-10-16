export default MouseCoordinateWrangler;
declare namespace MouseCoordinateWrangler {
    /**
     * Get the offset rect of an element on the page. Rect will be relative to page top left, scroll-invariant
     * @param {Element} elem
     * @returns {{top: number, left: number, width: number, height: number}} rect of elem on entire page in pixels, from top-left, scroll-invariant
     */
    function getOffsetRect(elem: Element): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {THREE.Camera} camera
     * @returns {{x:number, y:number}} ndc 2D (-1 to 1) location for this 3d location
     */
    function projectToScreenNDC(x: number, y: number, z: number, camera: THREE.Camera): {
        x: number;
        y: number;
    };
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {THREE.Camera} camera
     * @param {Element} container
     * @param {boolean} [dropOutOfBounds] = false
     * @returns {?{x:number, y:number}} pixel location for this 3d location
     */
    function projectToScreenPixels(x: number, y: number, z: number, camera: THREE.Camera, container: Element, dropOutOfBounds?: boolean): {
        x: number;
        y: number;
    };
    /**
     *
     * @param {UIEvent} event
     * @param {Element} element
     * @returns {{x: number, y: number}} pixel location of the event relative to the top left of the element
     */
    function getLocalCoordinates(event: UIEvent, element: Element): {
        x: number;
        y: number;
    };
    /**
     *
     * @param {UIEvent} event
     * @param {Element} element
     * @returns {{x: number, y: number}} NDC location of the event relative to the bottom left of the element (0-1 from bottom left)
     */
    function getLocalCoordinatesNDC(event: UIEvent, element: Element): {
        x: number;
        y: number;
    };
    /**
     *
     * @param {UIEvent} event
     * @param {Element} element
     * @returns {{x: number, y: number}} NDC location of the event relative to the center of the element (-1 to 1, cartesian)
     */
    function getLocalCoordinatesNDCCentered(event: UIEvent, element: Element): {
        x: number;
        y: number;
    };
    /**
     *
     * @param {number} ndcCenteredScreenX - screen location x in centered NDC (-1 to 1)
     * @param {number} ndcCenteredScreenY - screen location y in centered NDC (-1 to 1)
     * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
     * @param {THREE.Vector3} pointOnPlane - any point on the target plane, (0,0,0) will be used if omitted
     * @param {THREE.Vector3} planeNormal - normal of the target plane, (0,1,0) will be used if omitted
     * @returns {THREE.Vector3} the point where the screen point intersects the given plane, or undefined if it doesn't intersect
     */
    function unprojectScreenToPlane(ndcCenteredScreenX: number, ndcCenteredScreenY: number, camera: THREE.PerspectiveCamera, pointOnPlane: THREE.Vector3, planeNormal: THREE.Vector3): THREE.Vector3;
    /**
     *
     * @param {UIEvent} event - event to project the location of
     * @param {Element} element - the gl element
     * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
     * @param {THREE.Vector3} pointOnPlane - any point on the target plane, (0,0,0) will be used if omitted
     * @param {THREE.Vector3} planeNormal - normal of the target plane, (0,1,0) will be used if omitted
     * @returns {THREE.Vector3} the point where the screen point intersects the given plane, or undefined if it doesn't intersect
     */
    function unprojectEventToPlane(event: UIEvent, element: Element, camera: THREE.PerspectiveCamera, pointOnPlane: THREE.Vector3, planeNormal: THREE.Vector3): THREE.Vector3;
}
