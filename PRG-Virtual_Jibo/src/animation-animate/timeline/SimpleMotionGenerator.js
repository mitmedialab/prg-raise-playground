import BaseMotionGenerator from "./BaseMotionGenerator.js";
import TimelineEventDispatcher from "./TimelineEventDispatcher.js";
import RelativeTimeClip from "../../ifr-motion/base/RelativeTimeClip.js";

/**
 * @param {AnimationUtilities} animUtils
 * @param {Motion} motion
 * @param {jibo.animate.Time} startTime
 * @param {RobotInfo} robotInfo
 * @param {string[]} [dofNames]
 * @param {RelativeTimeClip} [clip] - optional clip info
 * @constructor
 * @extends BaseMotionGenerator
 */
class SimpleMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils, motion, startTime, robotInfo, dofNames, clip) {
        if (dofNames === null || dofNames === undefined) {
            dofNames = motion.getDOFs();
        }
        if (!clip) {
            clip = new RelativeTimeClip(0, motion.getDuration(), 1);
        }

        super(animUtils, motion.getName(), startTime);
        this._initWithDOFNames(dofNames, startTime.add(clip.getDuration()));

        //TODO: enable MotionValidator via DEBUG flag
        //MotionValidator.valuesExist(motion, dofNames);

        /** @type {RelativeTimeClip} */
        this._clip = clip;

        /** @type {InterpolatorSet} */
        const interpolatorSet = robotInfo.getKinematicInfo().getInterpolatorSet();

        const dofCount = this._dofMask.length;
        /** @type {MotionTrack[]} */
        this._motionTracks = new Array(dofCount).fill(null);
        /** @type {Interpolators.BaseInterpolator[]} */
        this._interpolators = new Array(dofCount).fill(null);

        for (let i = 0; i < dofNames.length; i++) {
            const dofIndex = this._dofs[i];
            const dofName = dofNames[i];
            this._motionTracks[dofIndex] = motion.getTracks()[dofName];
            this._interpolators[dofIndex] = interpolatorSet.getInterpolator(dofName);
        }

        /** @type {MotionEventIterator} */
        this._customEvents = null;

        /** @type {boolean} */
        this._sourceTimeReportingEnabled = false;

        /** @type {number} */
        this._baseDOFIndex = this._animUtils.dofNamesToIndices[this._animUtils.dofs.BASE.getDOFs()[0]];
        /** @type {BlendMode} */
        this._baseBlendMode = null;
    }

    /**
     * @param {MotionEventIterator} motionEvents
     */
    setEvents(motionEvents) {
        this._customEvents = motionEvents;
    }

    /**
     * @param {boolean} enabled
     */
    setSourceTimeReportingEnabled(enabled) {
        this._sourceTimeReportingEnabled = enabled;
    }

    /**
     * @param {BlendMode} blendMode
     */
    setBaseBlendMode(blendMode) {
        this._baseBlendMode = blendMode;
    }

    /**
     * @param {number} dofIndex
     * @param {LayerState} partialRender
     * @param {Object} blackboard
     * @returns {number[]}
     * @override
     */
    getDOFState(dofIndex, partialRender, blackboard) { // eslint-disable-line no-unused-vars
        let sampleTime = this._currentTime;
        const endTime = this._dofEndTimes[dofIndex];
        if (endTime !== null && sampleTime.isGreater(endTime)) {
            sampleTime = endTime;
        }

        const relativeSampleTime = sampleTime.subtract(this._startTime);
        const motionTime = this._clip.getSourceTime(relativeSampleTime);
        const sample = this._motionTracks[dofIndex].getDataAtTime(motionTime, this._interpolators[dofIndex]);

        if (this._sourceTimeReportingEnabled) {
            if (!blackboard.sourceTimes) {
                blackboard.sourceTimes = {};
            }
            blackboard.sourceTimes[this.getName()] = motionTime;
        }

        if (this._baseBlendMode !== null && dofIndex === this._baseDOFIndex) {
            blackboard.baseBlendMode = this._baseBlendMode;
        }

        return sample;
    }

    /**
     * @override
     */
    queueCustomEvents() {
        if (this._clipEventHandler && this._customEvents) {
            let sampleTime = this._currentTime;
            if (this._endTime !== null && sampleTime.isGreater(this._endTime)) {
                sampleTime = this._endTime;
            }

            const relativeSampleTime = sampleTime.subtract(this._startTime);

            while (this._customEvents.hasNext(relativeSampleTime)) {
                TimelineEventDispatcher.queueEvent(this._clipEventHandler, [this._customEvents.next(relativeSampleTime)]);
            }
        }
    }
}

export default SimpleMotionGenerator;
