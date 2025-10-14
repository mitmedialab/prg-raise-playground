export default AccelPlanner;
declare class AccelPlanner {
    /**
     * Compute the acceleration needed to intercept a target moving at
     * vTarget and starting pDelta away from our initial velocity vCurrent
     * in time totalTime.  Acceleration is the free variable, time is fixed.
     *
     * @param {number} vCurrent
     * @param {number} vTarget
     * @param {number} pDelta
     * @param {number} totalTime
     * @returns {AccelPlan}
     */
    computeWithFixedTime(vCurrent: number, vTarget: number, pDelta: number, totalTime: number): AccelPlan;
    /**
     *
     * @param {number} vCurrent
     * @param {number} vTarget
     * @param {number} pDelta
     * @param {number} acceleration
     * @returns {AccelPlan}
     */
    computeWithFixedAccel(vCurrent: number, vTarget: number, pDelta: number, acceleration: number): AccelPlan;
    /**
     * Simple plan where we go at a constant speed for degenerate cases etc.
     * @param vCurrent speed to go at
     * @returns {AccelPlan} plan to go at constant speed with zero accel.  plan length is 1
     */
    computeWithZeroAccel(vCurrent: any): AccelPlan;
    computeWithMaxAccel(vCurrent: any, vTarget: any, pDelta: any, maxAcceleration: any, targetInterceptTime: any): AccelPlan;
    /**
     * Create a trivial plan what will accelerate in the given direction forever.
     * This plan will not pass isConsistent, as it has no target, etc.
     *
     * @param {number} vInitial - start at this velocity
     * @param {number} accel - accelerate at this acceleration forever
     * @return {AccelPlan}
     */
    createPlanWithFixedAccelForever(vInitial: number, accel: number): AccelPlan;
}
declare class AccelPlan {
    constructor(initialVelocity: any, targetVelocity: any, acceleration: any, accelerateTime: any, decelerateTime: any, totalTime: any, distance: any);
    _initialVelocity: any;
    _targetVelocity: any;
    _acceleration: any;
    _accelerateTime: any;
    _decelerateTime: any;
    _totalTime: any;
    _distance: any;
    displacementAtTime(tDelta: any): number;
    velocityAtTime(tDelta: any): any;
    isConsistent(): boolean;
    /**
     * @returns {number}
     */
    getTotalTime(): number;
}
