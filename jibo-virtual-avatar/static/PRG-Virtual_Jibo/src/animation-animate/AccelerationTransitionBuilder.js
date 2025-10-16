import Motion from "../ifr-motion/base/Motion.js";
import MotionTrack from "../ifr-motion/base/MotionTrack.js";
import TimestampedBuffer from "../ifr-motion/base/TimestampedBuffer.js";
import AccelPlanner from "../ifr-motion/base/AccelPlanner.js";
import TransitionBuilder from "./TransitionBuilder.js";

/**
 * Protected constructor for internal use only.
 *
 * AccelerationTransitionBuilders generate transition motions using configurable
 * acceleration and velocity limits.
 *
 * AccelerationTransitionBuilders can be created via the animation module's
 * [createAccelerationTransitionBuilder]{@link jibo.animate#createAccelerationTransitionBuilder} method.
 *
 * @param {jibo.animate.RobotInfo} robotInfo - Protected constructor parameter.
 * @param {number} defaultMaxVelocity - Protected constructor parameter.
 * @param {number} defaultMaxAcceleration - Protected constructor parameter.
 * @class AccelerationTransitionBuilder
 * @memberof jibo.animate
 * @protected
 * @extends jibo.animate.TransitionBuilder
 */
class AccelerationTransitionBuilder extends TransitionBuilder {
    constructor(robotInfo, defaultMaxVelocity, defaultMaxAcceleration) {
        super();

        /** @type {number} */
        /** @private */
        this.minTransitionTime = null;

        /** @type {number} */
        /** @private */
        this.defaultMaxVelocity = defaultMaxVelocity;
        /** @type {number} */
        /** @private */
        this.defaultMaxAccel = defaultMaxAcceleration;

        /** @type {Object<string,number>} */
        /** @private */
        this.maxVelocityByDOF = {};
        /** @type {Object<string,number>} */
        /** @private */
        this.maxAccelByDOF = {};
        /** @type {Object<string,boolean>} */
        /** @private */
        this.preferValueByDOF = {};

        /** @type {RobotInfo} */
        /** @private */
        this.robotInfo = robotInfo;
        /** @type {AccelPlanner} */
        /** @private */
        this.planner = new AccelPlanner();
    }

    /**
     * Sets this transition to use the specified max velocity and acceleration by default; i.e. for
     * all joints that do not have their own custom settings.
     * @method jibo.animate.AccelerationTransitionBuilder#setDefaultLimits
     * @param {number} defaultMaxVelocity - Max velocity to use by default.
     * @param {number} defaultMaxAcceleration - Max acceleration to use by default.
     */
    setDefaultLimits(defaultMaxVelocity, defaultMaxAcceleration) {
        this.defaultMaxVelocity = defaultMaxVelocity;
        this.defaultMaxAccel = defaultMaxAcceleration;
    }

    /**
     * Sets this transition to use the specified minimum duration regardless of joint positions.
     * @method jibo.animate.AccelerationTransitionBuilder#setMinTransitionTime
     * @param {number} time - Minimum transition time.
     */
    setMinTransitionTime(time) {
        this.minTransitionTime = time;
    }

    /**
     * Sets this transition to use the specified max velocity and acceleration for the specified joints/DOFs.
     * @method jibo.animate.AccelerationTransitionBuilder#setLimits
     * @param {string[]} dofNames - DOF names for which the specified limits should apply.
     * @param {number} maxVelocity - Max velocity to use for the specified DOFs.
     * @param {number} maxAcceleration - Max acceleration to use for the specified DOFs.
     */
    setLimits(dofNames, maxVelocity, maxAcceleration) {
        for (let i=0; i<dofNames.length; i++) {
            this.maxVelocityByDOF[dofNames[i]] = maxVelocity;
            this.maxAccelByDOF[dofNames[i]] = maxAcceleration;
        }
    }

    /**
     * Sets this transition to prefer the boolean value provided for the dofs listed.  Assumes the dofs described are
     * boolean valued dofs, behavior undefined if these dofs are metric.
     *
     * @param {string[]} dofNames - DOF names for which the specified limits should apply.
     * @param {number} preferValue - value to prefer, 0 or 1
     */
    setPreferValue(dofNames, preferValue) {
        for (let i=0; i<dofNames.length; i++) {
            this.preferValueByDOF[dofNames[i]] = preferValue;
        }
    }

    /**
     *
     * Generates a procedural transition motion using the configuration specified by this builder.
     * @method jibo.animate.AccelerationTransitionBuilder#generateTransition
     * @param {Pose} fromPose - Starting pose for the transition. Should have at least onDOFs, and also all unused DOFs (ancestors) required to calculate correct global paths.
     * @param {Motion} toMotion - Motion to use as the destination for the transition.  Should have at least onDOFs.
     * @param {number} timeOffsetInTo - Time offset to target in the destination motion.
     * @param {string[]} onDOFs - DOFs to use for the transition.
     *
     * @return {Motion}
     * @override
     */
    generateTransition(fromPose, toMotion, timeOffsetInTo, onDOFs) {
        let dofName, valueFrom, velocityFrom, valueTo, di;
        const tickInterval = 1/30;

        //check validity
        for (di = 0; di < onDOFs.length; di++) {
            dofName = onDOFs[di];
            if (!this.robotInfo.getDOFInfo(dofName)) {
                throw new Error("Error transitioning, no dofInfo found for "+dofName);
            }
            const fromVar = fromPose.get(dofName, 0);
            if (fromVar == null || (Array.isArray(fromVar) && fromVar.length < 1)) {
                throw new Error("Error transitioning, no FROM value for "+dofName);
            }
        }
        //TODO: enable MotionValidator via DEBUG flag
        //MotionValidator.valuesExist(toMotion, onDOFs);

        const interpolatorSet = this.robotInfo.getKinematicInfo().getInterpolatorSet();

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

        const dga = this.robotInfo.getKinematicInfo().getDOFGlobalAlignment();
        dga.refineToGloballyClosestTargetPose(fromPose, toPose, onDOFs);

        //var slowestJoint;
        //var slowestJointDistance;
        for (di = 0; di < onDOFs.length; di++) {
            dofName = onDOFs[di];
            if (this.robotInfo.getDOFInfo(dofName).isMetric()) { //non-metric cannot have a velocity
                valueFrom = fromPose.get(dofName, 0);
                velocityFrom = fromPose.get(dofName, 1);
                if (velocityFrom === null) {
                    velocityFrom = 0;
                }
                valueTo = toPose.get(dofName, 0);
                let accel = this.defaultMaxAccel;
                if (this.maxAccelByDOF[dofName]) {
                    //this dof has a custom acceleration selected
                    accel = this.maxAccelByDOF[dofName];
                }

                //we are going to go to the animation with target velocity zero at arrival.  if non-zero velocity entertained,
                //make sure to account for it above when setting up toPose (which currently has arbitrary velocities)
                const myTime = this.planner.computeWithFixedAccel(velocityFrom, 0, valueTo - valueFrom, accel)._totalTime;
                if (myTime > duration) {
                    duration = myTime;
                    //slowestJoint = dofName;
                    //slowestJointDistance = Math.abs(valueTo - valueFrom);
                }
            }
        }
        //console.log("AccelerationTransitionBuilder: DOF:"+slowestJoint+" drove a transition time of "+duration+" for distance "+slowestJointDistance);

        if (this.minTransitionTime && this.minTransitionTime > duration) {
            duration = this.minTransitionTime;
        }

        /** @type {Object<string,AccelPlan>} */
        const accelPlans = {};
        for (di = 0; di < onDOFs.length; di++) {
            dofName = onDOFs[di];
            if (this.robotInfo.getDOFInfo(dofName).isMetric()) { //non-metric cannot have a velocity
                valueFrom = fromPose.get(dofName, 0);
                velocityFrom = fromPose.get(dofName, 1);
                if (velocityFrom === null) {
                    velocityFrom = 0;
                }
                valueTo = toPose.get(dofName, 0);

                if(duration > 0.0000000001){ //unstable to have fixed time very short plans, arbitrary accel.  (also, unnecessary)
                    accelPlans[dofName] = this.planner.computeWithFixedTime(velocityFrom, 0, valueTo - valueFrom, duration);
                }else{
                    accelPlans[dofName] = null;
                }
            }
        }

        let preferValue;
        for (di = 0; di < onDOFs.length; di++) {
            dofName = onDOFs[di];
            valueFrom = fromPose.get(dofName, 0);
            valueTo = toPose.get(dofName, 0);
            const dataNew = new TimestampedBuffer();

            const plan = accelPlans[dofName];
            if (plan) {
                dataNew.append(0, valueFrom);
                let t = tickInterval;
                while (t < duration) {
                    const planSample = valueFrom + plan.displacementAtTime(t);
                    dataNew.append(t, planSample);
                    t = t + tickInterval;
                }
                dataNew.append(duration, valueTo);
            }else if((preferValue = this.preferValueByDOF[dofName])!==undefined){
                if(preferValue === valueFrom || preferValue === valueTo){
                    //use preferValue for both from/to
                    dataNew.append(0, preferValue);
                    dataNew.append(duration, preferValue);
                }else{
                    //use original values
                    dataNew.append(0, valueFrom);
                    dataNew.append(duration, valueTo);
                }
            }else{
                //we'll just trust the interpolator if we have no accel plan and no preferred value
                dataNew.append(0, valueFrom);
                dataNew.append(duration, valueTo);
            }

            transition.addTrack(new MotionTrack(dofName, dataNew, duration));
        }

        return transition;
    }

    /**
     * Clones this builder.
     * @method jibo.animate.AccelerationTransitionBuilder#clone
     * @return {jibo.animate.AccelerationTransitionBuilder}
     * @override
     */
    clone() {
        const t = new AccelerationTransitionBuilder(this.robotInfo, this.defaultMaxVelocity, this.defaultMaxAccel);

        t.minTransitionTime = this.minTransitionTime;

        let i;
        const dofs = Object.keys(this.maxVelocityByDOF);
        for (i=0; i<dofs.length; i++) {
            t.maxVelocityByDOF[dofs[i]] = this.maxVelocityByDOF[dofs[i]];
        }

        const dofs2 = Object.keys(this.maxAccelByDOF);
        for (i=0; i<dofs2.length; i++) {
            t.maxAccelByDOF[dofs2[i]] = this.maxAccelByDOF[dofs2[i]];
        }

        const dofs3 = Object.keys(this.preferValueByDOF);
        for (i=0; i<dofs3.length; i++) {
            t.preferValueByDOF[dofs3[i]] = this.preferValueByDOF[dofs3[i]];
        }

        return t;
    }
}

export default AccelerationTransitionBuilder;
