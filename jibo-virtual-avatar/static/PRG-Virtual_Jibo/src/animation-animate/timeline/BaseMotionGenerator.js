import MotionGenerator from "./MotionGenerator.js";
import TimelineEventDispatcher from "./TimelineEventDispatcher.js";

/**
 * @param {AnimationUtilities} animUtils
 * @param {string} name
 * @param {jibo.animate.Time} startTime
 * @constructor
 * @extends MotionGenerator
 */
class BaseMotionGenerator extends MotionGenerator {
    constructor(animUtils, name, startTime) {
        super();

        /** @type {AnimationUtilities} */
        this._animUtils = animUtils;

        /** @type {string} */
        this._name = name;

        /** @type {jibo.animate.Time} */
        this._startTime = startTime;

        /** @type {Timeline~ClipStartedHandler} */
        this._clipStartedHandler = null;
        /** @type {Timeline~ClipStoppedHandler} */
        this._clipStoppedHandler = null;
        /** @type {Timeline~ClipRemovedHandler} */
        this._clipRemovedHandler = null;
        /** @type {Timeline~ClipEventHandler} */
        this._clipEventHandler = null;

        const dofCount = this._animUtils.dofIndicesToNames.length;
        /** @type {number[]} */
        this._dofs = null;
        /** @type {boolean[]} */
        this._dofMask = new Array(dofCount).fill(false);
        /** @type {jibo.animate.Time[]} */
        this._dofEndTimes = new Array(dofCount).fill(null);

        /** @type {jibo.animate.Time} */
        this._endTime = null;

        /** @type {boolean} */
        this._entered = false;
        /** @type {boolean} */
        this._exited = false;
        /** @type {boolean} */
        this._interrupted = false;

        /** @type {jibo.animate.Time} */
        this._currentTime = null;
    }

    /**
     * @param {string[]} dofNames - include these DOFs
     * @param {jibo.animate.Time} endTime - end time, may be null for no end
     * @protected
     */
    _initWithDOFNames(dofNames, endTime) {
        const dofIndices = new Array(dofNames.length);
        for (let i = 0; i < dofNames.length; i++) {
            dofIndices[i] = this._animUtils.dofNamesToIndices[dofNames[i]];
        }
        this._initWithDOFIndices(dofIndices, endTime);
    }

    /**
     * @param {number[]} dofIndices - include these DOFs
     * @param {jibo.animate.Time} endTime - end time, may be null for no end
     * @protected
     */
    _initWithDOFIndices(dofIndices, endTime) {
        this._dofs = dofIndices;
        for (let i = 0; i < dofIndices.length; i++) {
            const dofIndex = dofIndices[i];
            this._dofMask[dofIndex] = true;
            this._dofEndTimes[dofIndex] = endTime;
        }
        this._endTime = endTime;
    }

    /**
     * @param {Timeline~ClipStartedHandler} clipStartedHandler
     * @param {Timeline~ClipStoppedHandler} clipStoppedHandler
     * @param {Timeline~ClipRemovedHandler} clipRemovedHandler
     * @param {Timeline~ClipEventHandler} clipEventHandler
     */
    setHandlers(clipStartedHandler, clipStoppedHandler, clipRemovedHandler, clipEventHandler) {
        this._clipStartedHandler = clipStartedHandler;
        this._clipStoppedHandler = clipStoppedHandler;
        this._clipRemovedHandler = clipRemovedHandler;
        this._clipEventHandler = clipEventHandler;
    }

    /**
     * @returns {string}
     * @override
     */
    getName() {
        return this._name;
    }

    /**
     * @returns {jibo.animate.Time}
     * @override
     */
    getStartTime() {
        return this._startTime;
    }

    /**
     * Returns true if this generator ends after the given time.
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @override
     */
    endsAfter(time) {
        return this._endTime === null || this._endTime.isGreater(time);
    }

    /**
     * Returns false if this generator has data for any DOF, true otherwise.
     * @returns {boolean}
     * @override
     */
    isEmpty() {
        return this._dofs.length === 0 || !this.endsAfter(this._startTime);
    }

    /**
     * Returns true if this generator has data for the specified DOF past the given time.
     * @param {number} dofIndex
     * @param {jibo.animate.Time} time
     * @returns {boolean}
     * @override
     */
    dofEndsAfter(dofIndex, time) {
        if (this._dofMask[dofIndex]) {
            const endTime = this._dofEndTimes[dofIndex];
            return endTime === null || endTime.isGreater(time);
        } else {
            return false;
        }
    }

    /**
     * Force this motion to end the specified tracks at or before cropTime.  If a track
     * already ends before cropTime it is unchanged.  If a track starts after
     * cropTime it is completely removed.
     *
     * @param {jibo.animate.Time} cropTime - crop to end at this time if necessary
     * @param {number[]} dofIndices - crop tracks for these dofs
     * @override
     */
    cropEnd(cropTime, dofIndices) {
        let didCrop = false;
        let i, dofIndex;
        let endTime;

        if (cropTime.isGreater(this._startTime)) {
            // update end times for affected DOFs
            for (i = 0; i < dofIndices.length; i++) {
                dofIndex = dofIndices[i];
                if (this._dofMask[dofIndex]) {
                    endTime = this._dofEndTimes[dofIndex];
                    if (endTime === null || endTime.isGreater(cropTime)) {
                        this._dofEndTimes[dofIndex] = cropTime;
                        didCrop = true;
                    }
                }
            }
        } else {
            // fully remove affected DOFs
            for (i = 0; i < dofIndices.length; i++) {
                dofIndex = dofIndices[i];
                if (this._dofMask[dofIndex]) {
                    this._dofMask[dofIndex] = false;
                    didCrop = true;
                }
            }
        }

        if (didCrop) {
            // recalculate our end time
            let newEndTime = this._startTime;
            for (i = 0; i < this._dofs.length; i++) {
                dofIndex = this._dofs[i];
                if (this._dofMask[dofIndex]) {
                    endTime = this._dofEndTimes[dofIndex];
                    if (endTime === null) {
                        // at least one DOF has no end, so we have no end
                        newEndTime = null;
                        break;
                    } else if (endTime.isGreater(newEndTime)) {
                        newEndTime = endTime;
                    }
                }
            }

            // check to see if we have been interrupted as a result of this cropping
            if (newEndTime !== null) {
                if (this._endTime === null || this._endTime.isGreater(newEndTime)) {
                    this._interrupted = true;
                }
            }

            this._endTime = newEndTime;
        }
    }

    /**
     * get all DOFs that are involved in this motion
     *
     * @returns {number[]}
     * @override
     */
    getDOFIndices() {
        return this._dofs;
    }

    /**
     * @param {jibo.animate.Time} currentTime
     * @override
     */
    notifyUpdateStarted(currentTime) {
        this._currentTime = currentTime;
    }

    /**
     * @param {jibo.animate.Time} currentTime
     * @override
     */
    notifyUpdateFinished(currentTime) {
        if (!this._entered && currentTime.isGreaterOrEqual(this._startTime)) {
            this._entered = true;
            if (this._clipStartedHandler) {
                TimelineEventDispatcher.queueEvent(this._clipStartedHandler, []);
            }
        }
        if (this._entered && !this._exited) {
            this.queueCustomEvents();
        }
        if (this._entered && !this._exited && !this.endsAfter(currentTime)) {
            this._exited = true;
            if (this._clipStoppedHandler) {
                TimelineEventDispatcher.queueEvent(this._clipStoppedHandler, [this._interrupted]);
            }
        }
    }

    /**
     * @override
     */
    notifyRemoved() {
        if (this._clipRemovedHandler) {
            TimelineEventDispatcher.queueEvent(this._clipRemovedHandler, [this._entered, this._exited]);
        }
    }

    /**
     * @virtual
     */
    queueCustomEvents() {
        // Virtual method - same signature as original
    }
}

export default BaseMotionGenerator;