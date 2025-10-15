import Motion from "../ifr-motion/base/Motion.js";
import MotionTrack from "../ifr-motion/base/MotionTrack.js";
import TimestampedBuffer from "../ifr-motion/base/TimestampedBuffer.js";
import TransitionBuilder from "./TransitionBuilder.js";

/**
 * Protected constructor for internal use only.
 *
 * LinearTransitionBuilders generate transition motions via simple linear blending.
 *
 * LinearTransitionBuilders can be created via the animation module's
 * [createLinearTransitionBuilder]{@link jibo.animate#createLinearTransitionBuilder} method.
 *
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @class LinearTransitionBuilder
 * @intdocs
 * @memberof jibo.animate
 * @extends jibo.animate.TransitionBuilder
 * @protected
 */
class LinearTransitionBuilder extends TransitionBuilder {
    constructor(robotInfo) {
        super();
        
        /** @type {number} */
        /** @private */
        this._transitionTime = 1;

        /** @type {number} */
        /** @private */
        this._defaultMaxVelocity = null;

        /** @type {Object<string,number>} */
        /** @private */
        this._maxVelocityByDOF = null;

        /** @type {RobotInfo} */
        /** @private */
        this._robotInfo = robotInfo;
    }

    /**
     * Sets this transition to use a fixed duration transition regardless of joint positions.
     *
     * Overrides previous settings from setTransitionTime or setMaxVelocity.
     * @method jibo.animate.LinearTransitionBuilder#setTransitionTime
     * @param {number} time - Fixed transition time.
     */
    setTransitionTime(time) {
        this._transitionTime = time;
        this._defaultMaxVelocity = null;
        this._maxVelocityByDOF = null;
    }

    /**
     * Sets this transition to compute time based on the distance to travel and max velocity
     * of the joints.
     *
     * Overrides previous settings from setTransitionTime or setMaxVelocity.
     * @method jibo.animate.LinearTransitionBuilder#setMaxVelocity
     * @param {number} defaultMaxVelocity - Use this velocity for all joints not in the map.
     * @param {Object<string,number>} maxVelocityByDOFMap - Override default for joints present in the map.
     */
    setMaxVelocity(defaultMaxVelocity, maxVelocityByDOFMap) {
        this._defaultMaxVelocity = defaultMaxVelocity;
        this._maxVelocityByDOF = maxVelocityByDOFMap;
        this._transitionTime = null;
    }

    /**
     *
     * Generates a procedural transition motion using the configuration specified by this builder.
     * @method jibo.animate.LinearTransitionBuilder#generateTransition
     * @param {Pose} fromPose - Starting pose for the transition.  Should have at least onDOFs, and also all unused DOFs (ancestors) required to calculate correct global paths.
     * @param {Motion} toMotion - Motion to use as the destination for the transition.  Should have at least onDOFs.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     *
     * @return {Motion}
     * @override
     */
    generateTransition(fromPose, toMotion, timeOffsetInTo, onDOFs) {
        let dofName, valueFrom, valueTo, di;

        //check validity
        for(di = 0; di < onDOFs.length; di++){
            dofName = onDOFs[di];
            if(!this._robotInfo.getDOFInfo(dofName)){
                throw new Error("Error transitioning, no dofInfo found for "+dofName);
            }
            //if(!toMotion.getTracks()[dofName]){
            //	throw new Error("Error transitioning, no TO value for "+dofName);
            //}
            const fromVar = fromPose.get(dofName, 0);
            if(fromVar == null || (Array.isArray(fromVar) && fromVar.length < 1)){ //null or undefined (eqnull)
                throw new Error("Error transitioning, no FROM value for "+dofName);
            }
        }
        //TODO: enable MotionValidator via DEBUG flag
        //MotionValidator.valuesExist(toMotion, onDOFs);

        const interpolatorSet = this._robotInfo.getKinematicInfo().getInterpolatorSet();

        const transition = new Motion("Transition:"+toMotion.getName());
        let duration = 0;

        const toPoseInMotion = toMotion.getPoseAtTime(timeOffsetInTo, interpolatorSet);
        const toPose = fromPose.getCopy();
        //toPose will be fromPose for all unaffected joints, and will get the position
        //from toMotion for affected joints.
        for (di = 0; di < onDOFs.length; di++){
            dofName = onDOFs[di];
            //We only copy position, as velocity will be assumed zero below
            toPose.set(dofName, toPoseInMotion.get(dofName, 0), 0);
        }

        const dga = this._robotInfo.getKinematicInfo().getDOFGlobalAlignment();
        dga.refineToGloballyClosestTargetPose(fromPose, toPose, onDOFs);

        if(this._transitionTime !== null){
            //fixed time is selected
            duration = this._transitionTime;
        }else {
            //var slowestJoint;
            //var slowestJointDistance;
            //velocity mode is selected, generate time based on distance to travel and selected velocity
            for (di = 0; di < onDOFs.length; di++) {
                dofName = onDOFs[di];
                if(this._robotInfo.getDOFInfo(dofName).isMetric()) { //non-metric cannot have a velocity
                    valueFrom = fromPose.get(dofName, 0);

                    //we are going to go to the animation with target velocity zero at arrival.  if non-zero velocity entertained,
                    //make sure to account for it above when setting up toPose (which currently has arbitrary velocities)
                    valueTo = toPose.get(dofName, 0);
                    let velocity = this._defaultMaxVelocity;
                    if (this._maxVelocityByDOF && this._maxVelocityByDOF[dofName]) {
                        //this dof has a custom velocity selected
                        velocity = this._maxVelocityByDOF[dofName];
                    }
                    const distance = Math.abs(valueTo - valueFrom);
                    const myTime = distance / velocity;
                    if (myTime > duration) {
                        duration = myTime;
                        //slowestJoint = dofName;
                        //slowestJointDistance = distance;
                    }
                }
            }
            //console.log("LinearTransitionBuilder: DOF:"+slowestJoint+" drove a transition time of "+duration+" for distance "+slowestJointDistance);
        }
        for (di = 0; di < onDOFs.length; di++) {
            dofName = onDOFs[di];
            valueFrom = fromPose.get(dofName);
            valueTo = toPose.get(dofName, 0);
            const dataNew = new TimestampedBuffer();
            dataNew.append(0, valueFrom);
            dataNew.append(duration, valueTo);
            transition.addTrack(new MotionTrack(dofName, dataNew, duration));
        }
        return transition;
    }

    /**
     * Clones this builder.
     * @method jibo.animate.LinearTransitionBuilder#clone
     * @return {jibo.animate.LinearTransitionBuilder}
     * @override
     */
    clone() {
        const t = new LinearTransitionBuilder(this._robotInfo);

        //shallow copy all primary fields.
        const keys = Object.keys(this);
        for(let i = 0; i < keys.length; i++){
            t[keys[i]] = this[keys[i]];
        }
        return t;
    }
}

export default LinearTransitionBuilder;
