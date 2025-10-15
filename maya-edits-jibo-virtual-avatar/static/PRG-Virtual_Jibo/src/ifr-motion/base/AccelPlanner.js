"use strict";
import slog from "../../ifr-core/SLog.js";
const channel = "ACCEL_PLANNER";


class AccelPlan {
	constructor(initialVelocity, targetVelocity, acceleration, accelerateTime, decelerateTime, totalTime, distance){
		this._initialVelocity = initialVelocity;
		this._targetVelocity = targetVelocity;
		this._acceleration = acceleration;
		this._accelerateTime = accelerateTime;
		this._decelerateTime = decelerateTime;
		this._totalTime = totalTime;
		this._distance = distance;
	}

	displacementAtTime(tDelta){
		let newPosition = 0;
		if(tDelta > 0) {
			const useAccTime = Math.min(tDelta, this._accelerateTime);
			newPosition += (this._initialVelocity + (this._acceleration * useAccTime) / 2) * useAccTime;
			tDelta -= useAccTime;
		}
		if(tDelta > 0){
			const useDecTime = Math.min(tDelta, this._decelerateTime);
			newPosition += (this._initialVelocity + (this._acceleration * this._accelerateTime) - (this._acceleration* useDecTime/2))*useDecTime;
			tDelta -= useDecTime;
		}
		if(tDelta > 0){
			newPosition += this._targetVelocity * tDelta;
		}
		return newPosition;
	}

	velocityAtTime(tDelta){
		let newVelocity = this._initialVelocity;
		if(tDelta > 0) {
			const useAccTime = Math.min(tDelta, this._accelerateTime);
			newVelocity += this._acceleration * useAccTime;
			tDelta -= useAccTime;
		}
		if(tDelta > 0){
			const useDecTime = Math.min(tDelta, this._decelerateTime);
			newVelocity -= this._acceleration * useDecTime;
			tDelta -= useDecTime;
		}

		return newVelocity;
	}

	isConsistent(){

		if(isNaN(this._accelerateTime) || isNaN(this._decelerateTime)) {
			slog(channel, "Plan has NaN times! accelerationTime:"+this._accelerateTime+" decelerationTime:"+this._decelerateTime);
			return false;
		}

		if(!isFinite(this._accelerateTime) || !isFinite(this._decelerateTime)) {
			slog(channel, "Plan has non-finite times! accelerationTime:"+this._accelerateTime+" decelerationTime:"+this._decelerateTime);
			return false;
		}

		if(isNaN(this._acceleration)) {
			slog(channel, "Plan has NaN acceleration!: "+this._acceleration);
			return false;
		}

		if(!isFinite(this._acceleration)) {
			slog(channel, "Plan has non-finite acceleration!: "+this._acceleration);
			return false;
		}

		const totalTime = this._accelerateTime + this._decelerateTime;
		const targetDisplacement = this._distance + this._targetVelocity * totalTime;

		const ourDisplacement = (this._initialVelocity + (this._acceleration * this._accelerateTime)/2)*this._accelerateTime +
			(this._initialVelocity + (this._acceleration * this._accelerateTime) - (this._acceleration*this._decelerateTime/2))*this._decelerateTime;

		const ourFinalV = this._initialVelocity + this._acceleration * this._accelerateTime - this._acceleration*this._decelerateTime;

		if(this._accelerateTime < 0 || this._decelerateTime < 0){
			slog(channel, "Plan has negative times! accelerationTime:"+this._accelerateTime+" decelerationTime:"+this._decelerateTime);
			return false;
		}

		if(Math.abs(this._accelerateTime + this._decelerateTime - this._totalTime) > 0.0000001){
			slog(channel, "Plan time segments are not equal to target time! segments:"+(this._accelerateTime+this._decelerateTime)+" target:"+this._totalTime);
			return false;
		}

		if(Math.abs(ourDisplacement - targetDisplacement) > 0.000001){
			slog(channel, "Plan has incorrect integral! ourDisplacement:"+ourDisplacement+" pDelta:"+targetDisplacement);
			return false;
		}

		if(Math.abs(ourFinalV - this._targetVelocity) > 0.0000001){
			slog(channel, "Plan has incorrect final velocity resultV:"+ourFinalV+" pDelta:"+this._targetVelocity);
			return false;
		}

		return true;
	}

	/**
	 * @returns {number}
	 */
	getTotalTime(){
		return this._totalTime;
	}
}

class AccelPlanner {
	constructor(){

	}

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
	computeWithFixedTime(vCurrent, vTarget, pDelta, totalTime){
		//slog(channel, "Find (accel) plan for vTarget="+vTarget+" vCurrent="+vCurrent+" totalTime="+totalTime+" pDelta="+pDelta);

		if(totalTime < 0.0000000001){
			slog(channel, "Asked for fixed time plan with time of "+totalTime+", returning null");
			return null;
		}

		let aChoiceT1, aChoiceT2;

		const term1 = (((vTarget - vCurrent)*totalTime/2) + pDelta);
		let tosqrt = Math.pow((vCurrent - vTarget) * totalTime / 2 - pDelta, 2) -
			Math.pow(totalTime, 2) * (vTarget * vCurrent / 2 - Math.pow(vCurrent, 2) / 4 - Math.pow(vTarget, 2) / 4);

		if(tosqrt < 0){
			if(tosqrt > -0.0000000001) {
				//could occasionally, when values are very borderline, be slightly below zero here in an otherwise ok condition
				tosqrt = 0;
			}else {
				slog(channel, "Inconsistent CWFT Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", totalTime:"+totalTime+", tsqrt:"+tosqrt);
				return null;
			}
		}

		const term2 = Math.sqrt(tosqrt);
		const term3 = Math.pow(totalTime,2)/2;

		let sign = 1;
		if (pDelta < 0.5 * totalTime * (vCurrent - vTarget)) {
			sign = -1;
		}

		let aChoice = (term1 + sign*term2)/term3;

		if(aChoice === 0) { //special handling if acceleration is zero, times are arbitrary
			aChoiceT1 = totalTime;
			aChoiceT2 = 0;
		}else if(Math.abs(aChoice) < 0.0000000001){
			//if accel is so small, plan may be compromised numerically
			//also, plan can be approximated by doing nothing.
			aChoice = 0;
			aChoiceT1 = totalTime;
			aChoiceT2 = 0;
		}else{
			aChoiceT1 = totalTime/2 + (vTarget - vCurrent)/(2*aChoice);
			aChoiceT2 = totalTime/2 + (vCurrent - vTarget)/(2*aChoice);
		}

		if(aChoiceT1 < 0){
			if(aChoiceT1 > -0.0000000001){
				aChoiceT1 = 0;
			}else{
				slog(channel, "Inconsistent CWFTaT1 Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", totalTime:"+totalTime+", aChoiceT1:"+aChoiceT1);
				return null;
			}
		}
		if(aChoiceT2 < 0){
			if(aChoiceT2 > -0.0000000001){
				aChoiceT2 = 0;
			}else{
				slog(channel, "Inconsistent CWFTaT2 Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", totalTime:"+totalTime+", aChoiceT2:"+aChoiceT2);
				return null;
			}
		}

		const accelPlan = new AccelPlan(vCurrent, vTarget, aChoice, aChoiceT1, aChoiceT2, totalTime, pDelta);
		return accelPlan;
	}

	/**
	 *
	 * @param {number} vCurrent
	 * @param {number} vTarget
	 * @param {number} pDelta
	 * @param {number} acceleration
	 * @returns {AccelPlan}
	 */
	computeWithFixedAccel(vCurrent, vTarget, pDelta, acceleration){
		//slog(channel, "Find (time) plan for vTarget="+vTarget+" vCurrent="+vCurrent+" acceleration="+acceleration+" pDelta="+pDelta);

		//var plans = [];

		//if we go positive first, the smallest distance we can travel
		//is to go straight to the target velocity
		// (zero t2 in +deltaV cases, zero t1 in -deltaV cases)
		// thus if we need less distance than this path, we need -a

		if(acceleration < 0.0000000001){
			slog(channel, "Asked for fixed acceleration plan with acceleration of "+acceleration+", returning null");
			return null;
		}


		let useAcceleration = acceleration;
		let useSign = 1;

		//var timeToReachTargetVelocity = Math.abs((vTarget - vCurrent)/acceleration);
		//var distanceTraveled = (vTarget + vCurrent)/2 * timeToReachTargetVelocity;
		//var needToCoverDistance = pDelta + vTarget * timeToReachTargetVelocity;
		//
		//if(distanceTraveled > needToCoverDistance){
		//	useAcceleration = -acceleration;
		//}

		//simplified

		if ((vCurrent - vTarget) * Math.abs(vTarget - vCurrent) / (2 * acceleration) > pDelta) {
			useAcceleration = -acceleration;
			useSign = -1;
		}

		const term1 = 2*vTarget - 2*vCurrent;
		let tosqrt = 2 * Math.pow(vCurrent - vTarget, 2) + 4 * useAcceleration * pDelta;

		if(tosqrt < 0){
			if(tosqrt > -0.0000000001) {
				//can occasionally, when values are very borderline, be slightly below zero here in an otherwise ok condition
				//e.g., vCurrent = -0.3385816504064119, vTarget = 0, pDelta = -0.019106255665321623, acceleration = 3
				tosqrt = 0;
			}else {
				slog(channel, "Inconsistent CWFA Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", acceleration:"+acceleration+", tsqrt:"+tosqrt);
				return null;
			}
		}

		const term2 = Math.sqrt( tosqrt );
		const term3 = 2*useAcceleration;

		let time1Choice = (term1 + useSign*term2) / term3;
		let time2Choice = vCurrent/useAcceleration + time1Choice - vTarget/useAcceleration;

		if(time1Choice < 0){
			if(time1Choice > -0.0000000001){
				time1Choice = 0;
			}else{
				slog(channel, "Inconsistent CWFAt1 Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", acceleration:"+acceleration+", t1Choice:"+time1Choice);
				return null;
			}
		}
		if(time2Choice < 0){
			if(time2Choice > -0.0000000001){
				time2Choice = 0;
			}else{
				slog(channel, "Inconsistent CWFAt2 Plan for vCurrent:"+vCurrent+", vTarget:"+vTarget+", pDelta:"+pDelta+", acceleration:"+acceleration+", t2Choice:"+time2Choice);
				return null;
			}
		}


		return new AccelPlan(vCurrent, vTarget, useAcceleration, time1Choice, time2Choice, (time1Choice+time2Choice), pDelta);

	}

	/**
	 * Simple plan where we go at a constant speed for degenerate cases etc.
	 * @param vCurrent speed to go at
	 * @returns {AccelPlan} plan to go at constant speed with zero accel.  plan length is 1
	 */
	computeWithZeroAccel(vCurrent){
		const accelPlan = new AccelPlan(vCurrent, vCurrent, 0, 1, 0, 1, 0);
		return accelPlan;
	}

	computeWithMaxAccel(vCurrent, vTarget, pDelta, maxAcceleration, targetInterceptTime){
		if(maxAcceleration < 0.000001){
			return this.computeWithZeroAccel(vCurrent);
		}
		const fixedTimePlan = this.computeWithFixedTime(vCurrent, vTarget, pDelta, targetInterceptTime);
		if(Math.abs(fixedTimePlan._acceleration)<=maxAcceleration){
			return fixedTimePlan;
		}else{
			const fixedAccelPlan = this.computeWithFixedAccel(vCurrent, vTarget, pDelta, maxAcceleration);
			return fixedAccelPlan;
		}
	}

	/**
	 * Create a trivial plan what will accelerate in the given direction forever.
	 * This plan will not pass isConsistent, as it has no target, etc.
	 *
	 * @param {number} vInitial - start at this velocity
	 * @param {number} accel - accelerate at this acceleration forever
	 * @return {AccelPlan}
	 */
	createPlanWithFixedAccelForever(vInitial, accel){
		return new AccelPlan(vInitial, NaN, accel, Infinity, 0, Infinity, Infinity);
	}
}

export default AccelPlanner;