import BaseMotionGenerator from "./BaseMotionGenerator.js";
import Motion from "../../ifr-motion/base/Motion.js";
import Pose from "../../ifr-motion/base/Pose.js";
import slog from "../../ifr-core/SLog.js";

/**
 * @description Enum of blending modes.
 * @enum {string}
 * @property {string} ABSOLUTE - DOF value is absolute (no blending).
 * @property {string} RELATIVE_TO_CURRENT - DOF value is relative to current heading.
 * @property {string} RELATIVE_TO_TARGET - DOF value is relative to target heading.
 */
const BlendMode = {
    ABSOLUTE: "ABSOLUTE",
    RELATIVE_TO_CURRENT: "RELATIVE_TO_CURRENT",
    RELATIVE_TO_TARGET: "RELATIVE_TO_TARGET"
};

/**
 * @param {AnimationUtilities} animUtils
 * @param {jibo.animate.Time} startTime
 * @constructor
 * @extends BaseMotionGenerator
 */
class LookatBlendGenerator extends BaseMotionGenerator {
    constructor(animUtils, startTime) {
        super(animUtils, "lookat blend generator", startTime);
        this._initWithDOFNames(animUtils.dofs.BASE.getDOFs(), null);

        /** @type {MotionTimeline} */
        this._timeline = animUtils.timeline;

        /** @type {string} */
        this._baseDOFName = animUtils.dofs.BASE.getDOFs()[0];

        /** @type {InterpolatorSet} */
        this._interpolatorSet = animUtils.robotInfo.getKinematicInfo().getInterpolatorSet();

        /** @type {number} */
        this._currentBaseHeading = 0;
        /** @type {number} */
        this._targetBaseHeading = 0;

        /** @type {BlendMode} */
        this._currentBaseBlendMode = BlendMode.ABSOLUTE;
    }

    /**
     * @param {string} layer
     * @param {Motion} toMotion - Motion to use as the destination for the transition.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     * @param {jibo.animate.TransitionBuilder} transition
     * @param {BlendMode} blendMode
     * @returns {Motion}
     */
    generateTransition(layer, toMotion, timeOffsetInTo, onDOFs, transition, blendMode) {
        /** @type {Pose} */
        let currentPose;
        /** @type {Motion} */
        let transitionMotion;

        if (layer === "default" && onDOFs.indexOf(this._baseDOFName) !== -1) {
            currentPose = this._timeline.getCurrentState(["default", "lookat"]).getPose();

            /** @type {Pose} */
            const targetPose = new Pose("target sample", onDOFs);
            toMotion.getPoseAtTime(timeOffsetInTo, this._interpolatorSet, targetPose);

            let valueToAdd;
            if (blendMode === BlendMode.RELATIVE_TO_CURRENT) {
                valueToAdd = this._currentBaseHeading;
            } else if (blendMode === BlendMode.RELATIVE_TO_TARGET) {
                valueToAdd = this._targetBaseHeading;
            } else {
                // absolute
                valueToAdd = 0;
            }
            targetPose.set(this._baseDOFName, targetPose.get(this._baseDOFName, 0) + valueToAdd, 0);

            const targetMotion = Motion.createFromPose(toMotion.getName() + " blended sample", targetPose, 1);
            transitionMotion = transition.generateTransition(currentPose, targetMotion, 0, onDOFs);
        } else {
            currentPose = this._timeline.getCurrentState([layer]).getPose();
            transitionMotion = transition.generateTransition(currentPose, toMotion, timeOffsetInTo, onDOFs);
        }

        return transitionMotion;
    }

    /**
     * @param {number} dofIndex
     * @param {LayerState} partialRender
     * @param {Object} blackboard
     * @returns {number[]}
     * @override
     */
    getDOFState(dofIndex, partialRender, blackboard) { // eslint-disable-line no-unused-vars
        // check blackboard for base blend mode
        const baseBlendMode = blackboard.baseBlendMode;
        if (baseBlendMode !== undefined && baseBlendMode !== null) {
            this._currentBaseBlendMode = baseBlendMode;
        }

        // check blackboard for lookat info
        const lookatInfo = blackboard.lookatInfo;
        if (lookatInfo !== undefined && lookatInfo !== null) {
            const currentHeading = lookatInfo.bottomSection_r.iForwardCur;
            if (currentHeading !== undefined && currentHeading !== null) {
                if (Number.isFinite(currentHeading)) {
                    this._currentBaseHeading = currentHeading;
                } else {
                    slog.warn("LookatBlendGenerator: got non-finite value for current heading: (" + currentHeading + ")");
                }
            }

            const targetHeading = lookatInfo.bottomSection_r.iForwardTarg;
            if (targetHeading !== undefined && targetHeading !== null) {
                if (Number.isFinite(targetHeading)) {
                    this._targetBaseHeading = targetHeading;
                    if (lookatInfo.bottomSection_r.AtTarget) {
                        this._currentBaseHeading = targetHeading;
                    }
                } else {
                    slog.warn("LookatBlendGenerator: got non-finite value for target heading: (" + targetHeading + ")");
                }
            }
        }

        let valueToAdd;
        if (this._currentBaseBlendMode === BlendMode.RELATIVE_TO_CURRENT) {
            valueToAdd = this._currentBaseHeading;
        } else if (this._currentBaseBlendMode === BlendMode.RELATIVE_TO_TARGET) {
            valueToAdd = this._targetBaseHeading;
        } else {
            // absolute
            valueToAdd = 0;
        }

        return [valueToAdd];
    }

    /**
     * @override
     */
    notifyRemoved() {
        throw new Error("LookatBlendGenerator removed from timeline; something has been added to the lookat layer in error!");
    }
}

LookatBlendGenerator.BlendMode = BlendMode;
export default LookatBlendGenerator;
