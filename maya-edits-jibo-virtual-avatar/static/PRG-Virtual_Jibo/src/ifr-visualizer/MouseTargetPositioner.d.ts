export default MouseTargetPositioner;
export type MouseEventSelectionFilter = (: MouseEvent) => boolean;
/**
 * @callback MouseEventSelectionFilter
 * @param {MouseEvent}
 * @return {boolean}
 * @intdocs
 */
/**
 *
 * @param {Element} element - the gl element
 * @param {THREE.PerspectiveCamera} camera - camera that is projecting this scene
 * @param {THREE.Vector3} defaultInitialPosition - initial position, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} pointOnGroundPlane - any point on the ground plane, (0,0,0) will be used if omitted
 * @param {THREE.Vector3} groundPlaneNormal - normal of the ground plane, (0,1,0) will be used if omitted
 * @param {string[]} [initialTargetNames] - names of initial target positioners.  defaults to ["default"].  pass [] to start with no positioners.
 * @constructor
 */
declare function MouseTargetPositioner(element: Element, camera: THREE.PerspectiveCamera, defaultInitialPosition: THREE.Vector3, pointOnGroundPlane: THREE.Vector3, groundPlaneNormal: THREE.Vector3, initialTargetNames?: string[]): void;
declare class MouseTargetPositioner {
    constructor(element: Element, camera: THREE.PerspectiveCamera, defaultInitialPosition: THREE.Vector3, pointOnGroundPlane: THREE.Vector3, groundPlaneNormal: THREE.Vector3, initialTargetNames?: string[]);
    /**
     * Set mouse filters for this positioner.  The "isForMeFilter" is first applied, and only
     * events that match this filter will be processed at all.  "isForGroupPlane" and "isForCamera"
     * filters will only be run on events that already passed the "isForMeFilter".  "isForGroundPlane"
     * is evaluated first, points will not be used for camera plane if they match for ground plane.
     *
     * @param {MouseEventSelectionFilter} [isForMeFilter] - specify filter for this positioner (default is NONE of alt, meta, ctrl down)
     * @param {MouseEventSelectionFilter} [isForGroundPlaneFilter] - specify filter for ground plane clicks (default is shift down)
     * @param {MouseEventSelectionFilter} [isForCameraPlaneFilter] - specify filter for camera plane clicks (default is shift up)
     */
    setMouseFilters: (isForMeFilter?: MouseEventSelectionFilter, isForGroundPlaneFilter?: MouseEventSelectionFilter, isForCameraPlaneFilter?: MouseEventSelectionFilter) => void;
    /**
     * @param {positionChangedCallback} cb
     */
    addPositionChangedCallback: (cb: positionChangedCallback) => void;
    /**
     * @param {positionChangedCallback} cb
     */
    removePositionChangedCallback: (cb: positionChangedCallback) => void;
    /**
     * @param {THREE.Vector3} position
     * @param {string} name
     */
    notifyPositionChangedCallbacks: (position: THREE.Vector3, name: string) => void;
    /**
     * @param {string} name
         * @param {THREE.Vector3} [initialPosition] defaults to value passed to MouseTargetPositioner constructor.
     */
    addTargetPositioner: (name: string, initialPosition?: THREE.Vector3) => void;
    removeTargetPositioner: (name: any) => void;
    getTargetPositionerNames: () => any[];
    /**
     * @param {?string} name - name of target to select, null to deselect all
     */
    selectTarget: (name: string | null) => void;
    installRendererIntoScene: (scene: any) => void;
    removeRendererFromScene: (scene: any) => void;
}
