import BaseMotionGenerator from "./BaseMotionGenerator.js";
import TimelineEventDispatcher from "./TimelineEventDispatcher.js";

/**
 * @param {AnimationUtilities} animUtils
 * @param {Motion[]} motionList
 * @param {RelativeTimeClip[]} clipList
 * @param {number} numLoops - number of times to loop through the motion list, 0 to loop forever
 * @param {jibo.animate.Time} startTime
 * @param {RobotInfo} robotInfo
 * @param {string[]} [dofNames]
 * @constructor
 * @extends BaseMotionGenerator
 */
class LoopedMotionGenerator extends BaseMotionGenerator {
    constructor(animUtils, motionList, clipList, numLoops, startTime, robotInfo, dofNames) {
        if (!motionList) {
            throw new Error("tried to construct LoopedMotionGenerator with empty motion list");
        }
        if (numLoops < 0) {
            throw new Error("numLoops value is negative: " + numLoops);
        }

        super(animUtils, motionList[0].getName(), startTime);

        if (dofNames === null || dofNames === undefined) {
            dofNames = motionList[0].getDOFs();
        }

        // check that all of the motions in the list have all of the dofs
        //for (m=0; m<motionList.length; m++)
        //{
        //	for (i=0; i<dofNames.length; i++)
        //	{
        //		if (!motionList[m].hasDOF(dofNames[i]))
        //		{
        //			throw new Error("LoopedMotionGenerator: motion "+m+" doesn't have a track for required DOF: "+dofNames[i]);
        //		}
        //	}
        //}

        let m;

        /** @type {number[]} */
        this._durationList = [];

        // calculate motion durations
        for (m = 0; m < motionList.length; m++) {
            this._durationList.push(clipList[m].getDuration());
        }

        /** @type {number} */
        this._loopDuration = 0;
        for (m = 0; m < motionList.length; m++) {
            this._loopDuration = this._loopDuration + this._durationList[m];
        }

        let endTime;
        if (numLoops === 0) {
            // loop forever
            endTime = null;
        } else {
            const duration = this._loopDuration * numLoops;
            endTime = startTime.add(duration);
        }

        this._initWithDOFNames(dofNames, endTime);

        //TODO: enable MotionValidator via DEBUG flag
        //for (m=0; m<motionList.length; m++)
        //{
        //	MotionValidator.valuesExist(motionList[m], dofNames);
        //}

        /** @type {RelativeTimeClip[]} */
        this._clipList = clipList;

        /** @type {InterpolatorSet} */
        const interpolatorSet = robotInfo.getKinematicInfo().getInterpolatorSet();

        const dofCount = this._dofMask.length;

        /** @type {string[]} */
        this._nameList = [];
        /** @type {Array.<MotionTrack[]>} */
        this._motionTracksList = [];
        /** @type {Interpolators.BaseInterpolator[]} */
        this._interpolators = new Array(dofCount).fill(null);

        for (m = 0; m < motionList.length; m++) {
            this._nameList.push(motionList[m].getName());
            this._motionTracksList.push(new Array(dofCount).fill(null));
        }

        for (let i = 0; i < dofNames.length; i++) {
            const dofIndex = this._dofs[i];
            const dofName = dofNames[i];
            this._interpolators[dofIndex] = interpolatorSet.getInterpolator(dofName);
            for (m = 0; m < motionList.length; m++) {
                this._motionTracksList[m][dofIndex] = motionList[m].getTracks()[dofName];
            }
        }

        /** @type {number} */
        this._numLoops = numLoops;

        /** @type {MotionEventIterator[]} */
        this._customEvents = null;
        /** @type {number} */
        this._eventLoopIndex = 0;

        /** @type {boolean[]} */
        this._sourceTimeReportingFlags = null;

        /** @type {number} */
        this._baseDOFIndex = this._animUtils.dofNamesToIndices[this._animUtils.dofs.BASE.getDOFs()[0]];
        /** @type {BlendMode} */
        this._baseBlendMode = null;
    }

    /**
     * @param {MotionEventIterator[]} motionEventsList
     */
    setEvents(motionEventsList) {
        if (motionEventsList.length !== this._durationList.length) {
            throw new Error("motionEventsList length " + motionEventsList.length + " doesn't match motionList length " + this._durationList.length);
        }
        this._customEvents = motionEventsList;
    }

    /**
     * @param {boolean[]} enabledFlags
     */
    setSourceTimeReportingEnabled(enabledFlags) {
        if (enabledFlags.length !== this._durationList.length) {
            throw new Error("enabledFlags length " + enabledFlags.length + " doesn't match motionList length " + this._durationList.length);
        }
        this._sourceTimeReportingFlags = enabledFlags;
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
        let time = this._currentTime;
        const endTime = this._dofEndTimes[dofIndex];
        if (endTime !== null && time.isGreater(endTime)) {
            time = endTime;
        }

        let sampleTime = time.subtract(this._startTime);
        sampleTime = Math.max(sampleTime, 0);

        let loopIndex = Math.floor(sampleTime / this._loopDuration);
        if (this._numLoops !== 0) {
            loopIndex = Math.min(loopIndex, this._numLoops - 1);
        }

        const loopTime = sampleTime - (this._loopDuration * loopIndex);

        let motionIndex = 0;
        let motionTime = loopTime;
        while (motionIndex < this._durationList.length - 1 && motionTime > this._durationList[motionIndex]) {
            motionTime = motionTime - this._durationList[motionIndex];
            motionIndex++;
        }

        const sourceMotionTime = this._clipList[motionIndex].getSourceTime(motionTime);
        const sample = this._motionTracksList[motionIndex][dofIndex].getDataAtTime(sourceMotionTime, this._interpolators[dofIndex]);

        if (this._sourceTimeReportingFlags && this._sourceTimeReportingFlags[motionIndex]) {
            if (!blackboard.sourceTimes) {
                blackboard.sourceTimes = {};
            }
            blackboard.sourceTimes[this._nameList[motionIndex]] = sourceMotionTime;
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
            let time = this._currentTime;
            if (this._endTime !== null && time.isGreater(this._endTime)) {
                time = this._endTime;
            }

            let sampleTime = time.subtract(this._startTime);
            sampleTime = Math.max(sampleTime, 0);

            let loopIndex = Math.floor(sampleTime / this._loopDuration);
            if (this._numLoops !== 0) {
                loopIndex = Math.min(loopIndex, this._numLoops - 1);
            }

            // iterate up through any loops we've completed
            while (this._eventLoopIndex < loopIndex) {
                let m;
                for (m = 0; m < this._customEvents.length; m++) {
                    while (this._customEvents[m].hasNext(this._durationList[m])) {
                        TimelineEventDispatcher.queueEvent(this._clipEventHandler, [this._customEvents[m].next(this._durationList[m])]);
                    }
                    this._customEvents[m].reset();
                }

                this._eventLoopIndex++;
            }

            const loopTime = sampleTime - (this._loopDuration * loopIndex);

            // iterate up through loopTime for the current loop
            let motionIndex = 0;
            let motionTime = loopTime;
            while (motionIndex < this._customEvents.length && motionTime >= 0) {
                while (this._customEvents[motionIndex].hasNext(motionTime)) {
                    TimelineEventDispatcher.queueEvent(this._clipEventHandler, [this._customEvents[motionIndex].next(motionTime)]);
                }

                motionTime = motionTime - this._durationList[motionIndex];
                motionIndex++;
            }
        }
    }
}

export default LoopedMotionGenerator;
