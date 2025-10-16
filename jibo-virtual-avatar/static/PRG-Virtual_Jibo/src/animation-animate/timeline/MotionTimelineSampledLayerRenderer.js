import MotionTrack from "../../ifr-motion/base/MotionTrack.js";
import TimestampedBuffer from "../../ifr-motion/base/TimestampedBuffer.js";
import Motion from "../../ifr-motion/base/Motion.js";
import MotionTimelineLayerRenderer from "./MotionTimelineLayerRenderer.js";

/**
 *
 * @param {SampleCombiner} sampleCombiner
 * @param {InterpolatorSet} interpolatorSet
 * @constructor
 * @extends MotionTimelineLayerRenderer
 */
class MotionTimelineSampledLayerRenderer extends MotionTimelineLayerRenderer {
    constructor(sampleCombiner, interpolatorSet) {
        super();
        /** @type {SampleCombiner} */
        this._sampleCombiner = sampleCombiner;
        /** @type {InterpolatorSet} */
        this._interpolatorSet = interpolatorSet;
    }

    /**
     * //TODO: clip anchored at startTime but outside data not clipped
     * @private
     * @param {MotionTimelineClip[]} layerData
     * @param {string} dofName
     * @param {Time} startTime
     * @param {Time} endTime
     * @param {number[]} leftVal
     * @param {BaseInterpolator} interpolator
     *
     * @return {TimestampedBuffer}
     */
    static renderLayerForDOF(layerData, dofName, startTime, endTime, leftVal, interpolator) {
        let previousVal = leftVal;
        const buffer = new TimestampedBuffer();

        for (let ci = 0; ci < layerData.length; ci++) {
            const clip = layerData[ci];
            if (clip.getDurationForDOF(dofName) === null) {
                continue;
            }
            const durationForDOF = clip.getDurationForDOF(dofName);
            const track = clip.getMotion().getTracks()[dofName];
            const trackData = track.getMotionData();
            const offsetForThisClip = clip.getStartTime().subtract(startTime);

            if (durationForDOF !== null) {
                let si = 0;

                //TODO: should we add a t=0 and t=durationForDOF sample?

                const usingStartTime = 0;
                { //add a sample at the start
                    let sampleAtStart;
                    if (trackData.getTimestamp(0) === usingStartTime) { //TODO: need to find the index (not zero necessarily) when we have start insets
                        sampleAtStart = trackData.getData(0);
                    } else {
                        sampleAtStart = track.getDataAtTime(usingStartTime, interpolator);
                    }
                    buffer.append(offsetForThisClip, previousVal); //clamp previous to avoid unintended linear interpolation
                    buffer.append(offsetForThisClip, sampleAtStart);
                    previousVal = sampleAtStart;
                }

                while (si < trackData.size() && trackData.getTimestamp(si) <= durationForDOF) {
                    const sampleTime = trackData.getTimestamp(si);

                    if (sampleTime > usingStartTime) { //don't re-add the sample we added above as the start
                        const sampleValue = trackData.getData(si);

                        let ts = offsetForThisClip + sampleTime;

                        //round to nearest microseconds.  clips that have an "identical" end to the next one's start
                        //may have floating point error otherwise and be in the wrong order
                        ts = Math.round(ts * 1000000) / 1000000;
                        //if(si === 0){
                        //	//add the left-side lead in value
                        //	buffer.append(ts, previousVal);
                        //}

                        buffer.append(ts, sampleValue);
                        previousVal = sampleValue;
                    }
                    si++;
                }

                {//and add a sample at the end if we didn't happen to hit it exactly
                    let finalSampleTS = offsetForThisClip + durationForDOF;
                    finalSampleTS = Math.round(finalSampleTS * 1000000) / 1000000;
                    if (buffer.getTimestamp(buffer.size() - 1) < finalSampleTS) {
                        const finalSample = track.getDataAtTime(durationForDOF, interpolator);
                        buffer.append(finalSampleTS, finalSample);
                        previousVal = finalSample;
                    }
                }
            }
        }

        if (buffer.size() === 0) {
            buffer.append(0, previousVal);
        }

        return buffer;
    }

    /**
     *
     * @param {MotionTimelineClip[]} layerClips
     * @param {Pose} defaultPose
     * @param {Time} startTime
     * @param {Time} endTime
     * @param {Motion} motionSoFar
     * @return {Motion}
     * @override
     */
    render(layerClips, defaultPose, startTime, endTime, motionSoFar) {
        const motion = new Motion("render");

        for (let di = 0; di < defaultPose.getDOFNames().length; di++) {
            const dofName = defaultPose.getDOFNames()[di];
            const leftVal = defaultPose.get(dofName);
            const interpolator = this._interpolatorSet.getInterpolator(dofName);
            const buffer = MotionTimelineSampledLayerRenderer.renderLayerForDOF(layerClips, dofName, startTime, endTime, leftVal, interpolator);
            const newMotionTrack = new MotionTrack(dofName, buffer, buffer.getEndTime());
            if (motionSoFar && motionSoFar.getTracks().hasOwnProperty(dofName)) {
                const trackSoFar = motionSoFar.getTracks()[dofName];
                let t1i = 0;
                let t2i = 0;
                let t1 = trackSoFar.getMotionData().getTimestamp(t1i);
                let t2 = buffer.getTimestamp(t2i);
                const combined = new TimestampedBuffer();
                while (t1 !== null || t2 !== null) {
                    let t;
                    if (t1 !== null && t2 !== null && t1 === t2) {
                        t = t1;
                        t1i++;
                        t2i++;
                    } else if (t2 === null || (t1 !== null && t1 < t2)) {
                        t = t1;
                        t1i++;
                    } else if (t1 === null || t2 < t1) {
                        t = t2;
                        t2i++;
                    } else {
                        throw new Error("cannot happen");
                    }
                    if (t1i < trackSoFar.getMotionData().size()) {
                        t1 = trackSoFar.getMotionData().getTimestamp(t1i);
                    } else {
                        t1 = null;
                    }
                    if (t2i < buffer.size()) {
                        t2 = buffer.getTimestamp(t2i);
                    } else {
                        t2 = null;
                    }
                    combined.append(t, this._sampleCombiner.combineSamples(dofName, trackSoFar.getDataAtTime(t, interpolator), newMotionTrack.getDataAtTime(t, interpolator)));
                }
                motion.addTrack(new MotionTrack(dofName, combined, combined.getEndTime()));
            } else {
                motion.addTrack(newMotionTrack); //TODO: end time?
            }
        }

        if (motionSoFar !== null) {
            //pass through any tracks not addressed here
            const motionSoFarTrackNames = Object.keys(motionSoFar.getTracks());
            for (let ri = 0; ri < motionSoFarTrackNames.length; ri++) {
                if (!motion.getTracks().hasOwnProperty(motionSoFarTrackNames[ri])) {
                    motion.addTrack(motionSoFar.getTracks()[motionSoFarTrackNames[ri]]);
                }
            }
        }

        return motion;
    }
}

export default MotionTimelineSampledLayerRenderer;