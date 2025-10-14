import MotionLookat from "../ifr-motion/lookat/MotionLookat.js";
import LookatNode from "../ifr-motion/lookat/LookatNode.js";
import LookatMotionNode from "../ifr-motion/lookat/LookatMotionNode.js";
import OcularStabilizationTracker from "../ifr-motion/lookat/OcularStabilizationTracker.js";
import DiskStabilizationTracker from "../ifr-motion/lookat/DiskStabilizationTracker.js";
import RotationalLookatDOF from "../ifr-motion/lookat/RotationalLookatDOF.js";
import RotationalPlaneAlignmentLookatDOF from "../ifr-motion/lookat/RotationalPlaneAlignmentLookatDOF.js";
import PlaneDisplacementLookatDOF from "../ifr-motion/lookat/PlaneDisplacementLookatDOF.js";
import PlaneAlignmentWithRollLookatDOF from "../ifr-motion/lookat/PlaneAlignmentWithRollLookatDOF.js";
import PlaneAlignmentWithRollLookatNode from "../ifr-motion/lookat/PlaneAlignmentWithRollLookatNode.js";
import Pose from "../ifr-motion/base/Pose.js";
import Motion from "../ifr-motion/base/Motion.js";
import THREE from "@jibo/three";
import SimpleMotionGenerator from "./timeline/SimpleMotionGenerator.js";
import slog from "../ifr-core/SLog.js";
import LookatMultiLayerStatusManager from "./timeline/LookatMultiLayerStatusManager.js";
import DOFSet from "../geometry-info/DOFSet.js";
import LookatNodeTrackPolicy from "../ifr-motion/lookat/trackpolicy/LookatNodeTrackPolicy.js";
import TrackPolicyTriggerAlways from "../ifr-motion/lookat/trackpolicy/TrackPolicyTriggerAlways.js";
import TrackPolicyTriggerDiscomfort from "../ifr-motion/lookat/trackpolicy/TrackPolicyTriggerDiscomfort.js";
import TrackPolicyTriggerMovementTerminated from "../ifr-motion/lookat/trackpolicy/TrackPolicyTriggerMovementTerminated.js";
import TrackPolicyTriggerOnOtherNode from "../ifr-motion/lookat/trackpolicy/TrackPolicyTriggerOnOtherNode.js";
import LookatBlinkManager from "../ifr-motion/lookat/LookatBlinkManager.js";
import LookatNodeTargetAdjuster from "../ifr-motion/lookat/LookatNodeTargetAdjuster.js";
import LookatWindupPolicy from "../ifr-motion/lookat/LookatWindupPolicy.js";
import LookatOrientationStatusReporter from "../ifr-motion/lookat/LookatOrientationStatusReporter.js";
import WorldTargetAdjuster from "../ifr-motion/lookat/WorldTargetAdjuster.js";

const channel = "LOOKAT";

/**
 * @callback LookatEventCallback
 * @param {string} eventName
 * @param {LookatInstance} lookatInstance - lookat instance that generated this event
 * @param {Object.<string,*>} payload - extra information provided here, depending on event (See LookatEventType)
 * @private
 */

/**
 * Enum Values for lookat builder event types.
 * @enum {string}
 * @private
 */
const LookatEventType = { //TODO: reference these (from where?) instead of recreating them here?
	STARTED: "STARTED",
	TARGET_REACHED: "TARGET_REACHED", //reported when look has reached target
	TARGET_SUPERSEDED: "TARGET_SUPERSEDED", //reported when look given new target before reaching previous

	/**
	 * reported when look stops; check interrupted boolean description property in payload
	 * (interrupted is true if look stopped without reaching target)
	 */
	STOPPED: "STOPPED",
	CANCELLED: "CANCELLED" //will not start
};

/**
 * Enum Values for overall lookat mode
 * @enum {string}
 * @private
 */
const LookatConfig = {
	SQUARE_BASE: "SQUARE_BASE",
	LEVEL_HEAD: "LEVEL_HEAD"
};

/**
 * @param {number} acceleration
 * @param {number} velocity
 * @param {?number} [TPTDLimitInner] - inner limit to start accumulating discomfort.  null here will mean no discomfort accumulation (move always policy will be used instead)
 * @param {?number} [TPTDLimitOuter]
 * @param {?number} [TPTDAccumInner]
 * @param {?number} [TPTDAccumOuter]
 * @param {?boolean} [TPTDMoveImmediatelyPastOuter]
 * @param {?boolean} [TPTPMoveIfParentMoves] - true to trigger a motion if parent moves independently of my own discomfort
 * @param {?number} [TPTMTDeadZone] - spatial deadzone radius.  null here will mean no termination criteria
 * @param {?number} [TPTMTDeadTime]
 * @param {?number} [TPTMTDeadVelocity]
 * @param {?number} [BPTriggerDelta] - trigger a blink when a target is this far away.  null here will mean no blink manager
 * @param {?number} [BPRetriggerTimeSameTrajectory] - this much time must pass between blinks on a single trajectory (no stop between them)
 * @param {?number} [BPRetriggerTimeCrossTrajectory] - this much time must pass between blinks on separate trajectories (a stop occured between them)
 * @param {?number} [BPTrajectorySeparatorDelta] - this small of a delta indicates a stop happened (relevant for arbitrating between the 2 previous timings)
 * @param {?number} [TAUndershootDistance] - if provided, node will use a target adjuster and this will be the undershoot distance
 * @param {?number} [WPTargetDeltaToTriggerNewWindup] - worldspace target delta to trigger new windup (also triggered on new lookat)
 * @param {?number} [WPMaxAllowedTriggerSpeed] - Windup/Overshoot: maximum speed (for any particular dof) allowable for starting a new windup/overshoot trajectory
 * @param {?number} [WPMinAllowedTriggerDistance] - Windup/Overshoot: minimum current-to-target distance allowable for starting a new windup/overshoot trajectory
 * @param {?number} [WPMaxAllowedTriggerDistance] - Windup/Overshoot: maximum current-to-target distance allowable for starting a new windup/overshoot trajectory
 * @param {?number} [WMWindupDistanceRatio] - Windup: fraction of current-to-target distance which defines the windup distance
 * @param {?number} [WPWindupMinDistance] - Windup: clamp windup distance to this minimum (windups will be no smaller)
 * @param {?number} [WPWindupMaxDistance] - Windup: clamp windup distance to this maximum (windups will be no larger)
 * @param {?number} [WPOvershootDistanceRatio] - Overshoot: fraction of current-to-target distance which defines the overshoot distance
 * @param {?number} [WPOvershootMinDistance] - Overshoot: clamp overshoot distance to this minimum (overshoots will be no smaller)
 * @param {?number} [WPOvershootMaxDistance] - Overshoot: clamp overshoot distance to this maximum (overshoot will be no larger)
 * @param {?number} [WTALeft] - rotate world target location left by this amount
 * @param {?number} [WTADown] - rotate world target location down by this amount
 * @param {?boolean} [LHForbidTilt] - forbid poses with tilt when in level head
 * @param {?SOLUTION_POLICY} [LHSolutionPolicy] - choose policy for which of multiple solutions to choose
 * @constructor
 * @private
 */
const LookatNodeRuntimeConfig = function(velocity, acceleration,
									TPTDLimitInner, TPTDLimitOuter, TPTDAccumInner, TPTDAccumOuter, TPTDMoveImmediatelyPastOuter,
									TPTPMoveIfParentMoves,
									TPTMTDeadZone, TPTMTDeadTime, TPTMTDeadVelocity,
									BPTriggerDelta, BPRetriggerTimeSameTrajectory,
									BPRetriggerTimeCrossTrajectory, BPTrajectorySeparatorDelta, BPOnlyAtOrAfterWindupPhase,
									TAUndershootDistance,
									WPTargetDeltaToTriggerNewWindup,
									WPMaxAllowedTriggerSpeed, WPMinAllowedTriggerDistance, WPMaxAllowedTriggerDistance,
									WMWindupDistanceRatio, WPWindupMinDistance, WPWindupMaxDistance,
									WPOvershootDistanceRatio, WPOvershootMinDistance, WPOvershootMaxDistance,
									WTALeft, WTADown, LHForbidTilt, LHSolutionPolicy){

	//filter parameters
	/** @type {number} */
	this.velocity = velocity;
	/** @type {number} */
	this.acceleration = acceleration;

	//discomfort motion trigger
	/** @type {?number} */
	this.TPTDLimitInner = TPTDLimitInner;
	/** @type {?number} */
	this.TPTDLimitOuter = TPTDLimitOuter;
	/** @type {?number} */
	this.TPTDAccumInner = TPTDAccumInner;
	/** @type {?number} */
	this.TPTDAccumOuter = TPTDAccumOuter;
	/** @type {?boolean} */
	this.TPTDMoveImmediatelyPastOuter = TPTDMoveImmediatelyPastOuter;

	/** @type {?boolean} */
	this.TPTPMoveIfParentMoves = TPTPMoveIfParentMoves;

	//motion termination trigger
	/** @type {?number} */
	this.TPTMTDeadZone = TPTMTDeadZone;
	/** @type {?number} */
	this.TPTMTDeadTime = TPTMTDeadTime;
	/** @type {?number} */
	this.TPTMTDeadVelocity = TPTMTDeadVelocity;

	//blink policy
	/** @type {?number} */
	this.BPTriggerDelta = BPTriggerDelta;
	/** @type {?number} */
	this.BPRetriggerTimeSameTrajectory = BPRetriggerTimeSameTrajectory;
	/** @type {?number} */
	this.BPRetriggerTimeCrossTrajectory = BPRetriggerTimeCrossTrajectory;
	/** @type {?number} */
	this.BPTrajectorySeparatorDelta = BPTrajectorySeparatorDelta;
	/** @type {?number} */
	this.BPOnlyAtOrAfterWindupPhase = BPOnlyAtOrAfterWindupPhase;

	//target adjuster (lazy undershoot)
	/** @type {?number} */
	this.TAUndershootDistance = TAUndershootDistance;

	//windup policy
	this.WPTargetDeltaToTriggerNewWindup = WPTargetDeltaToTriggerNewWindup;
	/** @type {?number} */
	this.WPMaxAllowedTriggerSpeed = WPMaxAllowedTriggerSpeed;
	/** @type {?number} */
	this.WPMinAllowedTriggerDistance = WPMinAllowedTriggerDistance;
	/** @type {?number} */
	this.WPMaxAllowedTriggerDistance = WPMaxAllowedTriggerDistance;
	/** @type {?number} */
	this.WMWindupDistanceRatio = WMWindupDistanceRatio;
	/** @type {?number} */
	this.WPWindupMinDistance = WPWindupMinDistance;
	/** @type {?number} */
	this.WPWindupMaxDistance = WPWindupMaxDistance;
	/** @type {?number} */
	this.WPOvershootDistanceRatio = WPOvershootDistanceRatio;
	/** @type {?number} */
	this.WPOvershootMinDistance = WPOvershootMinDistance;
	/** @type {?number} */
	this.WPOvershootMaxDistance = WPOvershootMaxDistance;

	/** @type {?number} */
	this.WTALeft = WTALeft;
	/** @type {?number} */
	this.WTADown = WTADown;

	/** @type {?boolean} */
	this.LHForbidTilt = LHForbidTilt;
	/** @type {?SOLUTION_POLICY} */
	this.LHSolutionPolicy = LHSolutionPolicy;
};

/**
 * @param {number} min
 * @param {number} max
 * @constructor
 * @private
 */
const LookatDOFRuntimeConfig = function(min, max){
	/** @type {number} */
	this.min = min;
	/** @type {number} */
	this.max = max;
};

const LookatDOFGeometryConfig = {
	BaseLookatDOF:{
		LookatDOFName:"BaseLookatDOF",
		DOFName:"bottomSection_r",
		Forward:new THREE.Vector3(0, 0, -1)
	},
	TorsoLookatDOF:{
		LookatDOFName:"TorsoLookatDOF",
		DOFName:"middleSection_r",
		PlaneNormal:new THREE.Vector3(9.509979E-9, 0.9271838, 0.37460676),
		DistanceAlongAxisToDOFPlane:0.18703285,
		AngleAbovePlane:0.29670632
	},
	TrunkLookatDOF:{
		LookatDOFName:"TrunkLookatDOF",
		OrientDOFName:"bottomSection_r",
		TiltDOFName:"middleSection_r",
		SwivelDOFName:"topSection_r",
		OrientDOFMinForward:0,
		TiltDOFMinForward:Math.PI,
		DistanceAlongAxisToDOFPlane:0.2174,
		AngleAbovePlane:0.29670632,
		SwingArmFactor:0.676
	},
	TopLookatDOF:{
		LookatDOFName:"TopLookatDOF",
		DOFName:"topSection_r",
		Forward:new THREE.Vector3(0, 0, -1)
	},
	EyeLeftRight:{
		LookatDOFName:"EyeLeftRight",
		DOFName:"eyeSubRootBn_t",
		CentralTransformName:"eyeRootBn",
		Forward:new THREE.Vector3(0, 0, 1),
		PlaneNormal:new THREE.Vector3(0, 1, 0),
		InternalDistance:0.0165,
		MinValue:-0.03450607937,
		MaxValue:0.03450607937
	},
	EyeUpDown:{
		LookatDOFName:"EyeUpDown",
		DOFName:"eyeSubRootBn_t_2",
		CentralTransformName:"eyeRootBn",
		Forward:new THREE.Vector3(0, 0, 1),
		PlaneNormal:new THREE.Vector3(-1, 0, 0),
		InternalDistance:0.013,
		MinValue:-0.00609550625,
		MaxValue:0.00609550625
	}
};

/**
 * @param {AnimationUtilities} animUtils
 * @param {MotionTimeline} timeline
 * @param {RobotInfo} robotInfo
 * @param {TransitionBuilder} transition
 * @param {LookatEventCallback} [globalDelegate]
 * @param {BlinkDelegate} [blinkDelegate]
 * @constructor
 * @private
 */
const SingleLookatBuilder = function(animUtils, timeline, robotInfo, transition, globalDelegate, blinkDelegate){ // eslint-disable-line no-unused-vars

	const self = this;

	/** @type {LookatConfig} */
	let lookatConfig = LookatConfig.SQUARE_BASE;

	/** @type {Object.<string,LookatNodeRuntimeConfig>} */
	const lookatNodeRuntimeConfigs = {
		//BaseLookatNode:new LookatNodeRuntimeConfig(null, 3, 0.1, 0.9, 0.2, 3, true, 0.1, 0.05),
		TrunkLookatNode:new LookatNodeRuntimeConfig(null, 3, 0.00001, 0.00001, null, null, true, false, 0.001, 0.01, 0.018, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, false, PlaneAlignmentWithRollLookatDOF.SOLUTION_POLICY.CLOSEST),
		BaseLookatNode:new LookatNodeRuntimeConfig(null, 3, 0.00001, 0.00001, null, null, true, false, 0.001, 0.01, 0.018, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
		TorsoLookatNode:new LookatNodeRuntimeConfig(null, 2.5, 0.00001, 0.00001, null, null, true, false, 0.001, 0.01, 0.018, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
		TopLookatNode:new LookatNodeRuntimeConfig(null, 3, 0.00001, 0.00001, null, null, true, false, 0.001, 0.01, 0.018, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
		Eye:new LookatNodeRuntimeConfig(null, 1, 0.000001, 0.000001, null, null, true, false, 0.0001, 0.01, 0.0005, null, 2, 1, 0.001, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
	};

	/** @type {Object.<string,LookatDOFRuntimeConfig>} */
	const lookatDOFRuntimeConfigs = {
		bottomSection_r:new LookatDOFRuntimeConfig(null, null),
		middleSection_r:new LookatDOFRuntimeConfig(null, null),
		topSection_r:new LookatDOFRuntimeConfig(null, null),
		eyeSubRootBn_t:new LookatDOFRuntimeConfig(LookatDOFGeometryConfig["EyeLeftRight"].MinValue, LookatDOFGeometryConfig["EyeLeftRight"].MaxValue), //init with geom defaults
		eyeSubRootBn_t_2:new LookatDOFRuntimeConfig(LookatDOFGeometryConfig["EyeUpDown"].MinValue, LookatDOFGeometryConfig["EyeUpDown"].MaxValue)
	};

	const orientationStatusReporter = new LookatOrientationStatusReporter(
		LookatDOFGeometryConfig["BaseLookatDOF"].DOFName,
		[LookatDOFGeometryConfig["BaseLookatDOF"].DOFName],
		[LookatDOFGeometryConfig["TopLookatDOF"].DOFName]
	);

	/**
	 *
	 * @param {LookatNodeRuntimeConfig} config
	 * @param {?LookatNodeTrackPolicy[]} parentTrackPolicies
	 * @return {?LookatNodeTrackPolicy}
	 */
	const getTrackPolicy = function(config, parentTrackPolicies){
		/** @type {TrackPolicyTrigger[]} */
		const triggers = [];

		if(config.TPTPMoveIfParentMoves && parentTrackPolicies != null && parentTrackPolicies.length > 0){
			const parentBasedTrigger = new TrackPolicyTriggerOnOtherNode();
			for (let i = 0; i < parentTrackPolicies.length; i++) {
				parentTrackPolicies[i].addListener(parentBasedTrigger);
			}
			triggers.push(parentBasedTrigger);
		}

		if(config.TPTDLimitInner != null){ //null or undefined (eqnull)
			//assume all present if any present
			triggers.push(new TrackPolicyTriggerDiscomfort(config.TPTDLimitInner, config.TPTDLimitOuter, config.TPTDAccumInner, config.TPTDAccumOuter, config.TPTDMoveImmediatelyPastOuter));
			triggers.push(new TrackPolicyTriggerMovementTerminated(config.TPTMTDeadZone, config.TPTMTDeadTime, config.TPTMTDeadVelocity));
		}else{
			triggers.push(new TrackPolicyTriggerAlways());
		}

		return new LookatNodeTrackPolicy(triggers);
	};

	/**
	 *
	 * @param {?BlinkDelegate} blinkDelegate
	 * @param {LookatNodeRuntimeConfig} config
	 * @return {?LookatBlinkManager}
	 */
	const getBlinkManager = function(blinkDelegate, config){
		if(blinkDelegate != null && config.BPTriggerDelta != null){
			return new LookatBlinkManager(blinkDelegate, config.BPTriggerDelta,
			config.BPRetriggerTimeSameTrajectory, config.BPRetriggerTimeCrossTrajectory,
			config.BPTrajectorySeparatorDelta, config.BPOnlyAtOrAfterWindupPhase);
		}else{
			return null;
		}
	};

	/**
	 *
	 * @param {LookatNodeRuntimeConfig} config
	 * @return {?LookatNodeTargetAdjuster}
	 */
	const getTargetAdjuster = function(config){
		if(config.TAUndershootDistance != null){ //null or undefined (eqnull)
			return new LookatNodeTargetAdjuster(config.TAUndershootDistance);
		}else{
			return null;
		}
	};


	/**
	 *
	 * @param {LookatNodeRuntimeConfig} config
	 * @return {?WorldTargetAdjuster}
	 */
	const getWorldTargetAdjuster = function(config){
		if(config.WTALeft != null || config.WTADown != null){ //null or undefined (eqnull)
			const left = config.WTALeft||0;
			const down = config.WTADown||0;
			const worldUp = new THREE.Vector3(0,0,1);
			return new WorldTargetAdjuster(left, down, worldUp);
		}else{
			return null;
		}
	};

	/**
	 *
	 * @param {LookatNodeRuntimeConfig} config
	 * @return {?LookatWindupPolicy}
	 */
	const getWindupPolicy = function(config){
		if(config.WPTargetDeltaToTriggerNewWindup != null){ //null or undefined (eqnull)
			return new LookatWindupPolicy(
				config.WPTargetDeltaToTriggerNewWindup,
				config.WPMaxAllowedTriggerSpeed,
				config.WPMinAllowedTriggerDistance,
				config.WPMaxAllowedTriggerDistance,
				config.WMWindupDistanceRatio,
				config.WPWindupMinDistance,
				config.WPWindupMaxDistance,
				config.WPOvershootDistanceRatio,
				config.WPOvershootMinDistance,
				config.WPOvershootMaxDistance
			);
		}else{
			return null;
		}
	};


	/**
	 * @return {MotionLookat}
	 */
	const initLookat = function(){
		/** @type {KinematicGroup} */
		const kinematicGroupProto = robotInfo.getKinematicInfo().getFullKinematicGroup();
		const dofAligner = robotInfo.getKinematicInfo().getDOFGlobalAlignment();

		let baseLookatNode, torsoLookatNode, trunkLookatNode;

		if(lookatConfig === LookatConfig.LEVEL_HEAD) {
			trunkLookatNode = new PlaneAlignmentWithRollLookatNode("TrunkLookatNode",
				new PlaneAlignmentWithRollLookatDOF(LookatDOFGeometryConfig["TrunkLookatDOF"].LookatDOFName,
					LookatDOFGeometryConfig["TrunkLookatDOF"].OrientDOFName,
					LookatDOFGeometryConfig["TrunkLookatDOF"].TiltDOFName,
					LookatDOFGeometryConfig["TrunkLookatDOF"].SwivelDOFName,
					LookatDOFGeometryConfig["TrunkLookatDOF"].OrientDOFMinForward,
					LookatDOFGeometryConfig["TrunkLookatDOF"].TiltDOFMinForward,
					LookatDOFGeometryConfig["TrunkLookatDOF"].DistanceAlongAxisToDOFPlane,
					LookatDOFGeometryConfig["TrunkLookatDOF"].AngleAbovePlane,
					lookatNodeRuntimeConfigs["TrunkLookatNode"].LHForbidTilt,
					lookatNodeRuntimeConfigs["TrunkLookatNode"].LHSolutionPolicy,
					LookatDOFGeometryConfig["TrunkLookatDOF"].SwingArmFactor
				),
				new RotationalLookatDOF(
					LookatDOFGeometryConfig["BaseLookatDOF"].LookatDOFName,
					LookatDOFGeometryConfig["BaseLookatDOF"].DOFName,
					LookatDOFGeometryConfig["BaseLookatDOF"].Forward
				)
			);
		}
		if(lookatConfig === LookatConfig.SQUARE_BASE) {
			baseLookatNode = new LookatNode("BaseLookatNode", [
				new RotationalLookatDOF(
					LookatDOFGeometryConfig["BaseLookatDOF"].LookatDOFName,
					LookatDOFGeometryConfig["BaseLookatDOF"].DOFName,
					LookatDOFGeometryConfig["BaseLookatDOF"].Forward
				)
			]);
			torsoLookatNode = new LookatNode("TorsoLookatNode", [
				new RotationalPlaneAlignmentLookatDOF(
					LookatDOFGeometryConfig["TorsoLookatDOF"].LookatDOFName,
					LookatDOFGeometryConfig["TorsoLookatDOF"].DOFName,
					LookatDOFGeometryConfig["TorsoLookatDOF"].PlaneNormal,
					LookatDOFGeometryConfig["TorsoLookatDOF"].DistanceAlongAxisToDOFPlane,
					LookatDOFGeometryConfig["TorsoLookatDOF"].AngleAbovePlane,
					true
				)
			]);
		}
		const topLookatNode = new LookatNode("TopLookatNode", [
			new RotationalLookatDOF(
				LookatDOFGeometryConfig["TopLookatDOF"].LookatDOFName,
				LookatDOFGeometryConfig["TopLookatDOF"].DOFName,
				LookatDOFGeometryConfig["TopLookatDOF"].Forward
			)
		]);
		const eyeLookatNode = new LookatNode("Eye",[
			new PlaneDisplacementLookatDOF(
				LookatDOFGeometryConfig["EyeLeftRight"].LookatDOFName,
				LookatDOFGeometryConfig["EyeLeftRight"].DOFName,
				LookatDOFGeometryConfig["EyeLeftRight"].CentralTransformName,
				LookatDOFGeometryConfig["EyeLeftRight"].Forward,
				LookatDOFGeometryConfig["EyeLeftRight"].PlaneNormal,
				LookatDOFGeometryConfig["EyeLeftRight"].InternalDistance,
				lookatDOFRuntimeConfigs["eyeSubRootBn_t"].min,
				lookatDOFRuntimeConfigs["eyeSubRootBn_t"].max
			),
			new PlaneDisplacementLookatDOF(
				LookatDOFGeometryConfig["EyeUpDown"].LookatDOFName,
				LookatDOFGeometryConfig["EyeUpDown"].DOFName,
				LookatDOFGeometryConfig["EyeUpDown"].CentralTransformName,
				LookatDOFGeometryConfig["EyeUpDown"].Forward,
				LookatDOFGeometryConfig["EyeUpDown"].PlaneNormal,
				LookatDOFGeometryConfig["EyeUpDown"].InternalDistance,
				lookatDOFRuntimeConfigs["eyeSubRootBn_t_2"].min,
				lookatDOFRuntimeConfigs["eyeSubRootBn_t_2"].max
			)
		]);

		const ancestorTrackPolicies = [];

		const lookatMotionNodes = [];

		if(lookatConfig === LookatConfig.LEVEL_HEAD){
			const trunkTrackPolicy = getTrackPolicy(lookatNodeRuntimeConfigs["TrunkLookatNode"], null);
			ancestorTrackPolicies.push(trunkTrackPolicy);

			lookatMotionNodes.push(
				new LookatMotionNode(trunkLookatNode, dofAligner,
					lookatNodeRuntimeConfigs["TrunkLookatNode"].acceleration,
					null,
					LookatMotionNode.LookStabilizationMode.UNTARGETED,
					trunkTrackPolicy,
					null,
					getTargetAdjuster(lookatNodeRuntimeConfigs["TrunkLookatNode"]),
					getWindupPolicy(lookatNodeRuntimeConfigs["TrunkLookatNode"]),
					getWorldTargetAdjuster(lookatNodeRuntimeConfigs["TrunkLookatNode"]))
			);
		}
		if(lookatConfig === LookatConfig.SQUARE_BASE){
			const baseTrackPolicy = getTrackPolicy(lookatNodeRuntimeConfigs["BaseLookatNode"], null);
			ancestorTrackPolicies.push(baseTrackPolicy);
			const torsoTrackPolicy = getTrackPolicy(lookatNodeRuntimeConfigs["TorsoLookatNode"], ancestorTrackPolicies);
			ancestorTrackPolicies.push(torsoTrackPolicy);


			lookatMotionNodes.push(
				new LookatMotionNode(baseLookatNode, dofAligner,
					lookatNodeRuntimeConfigs["BaseLookatNode"].acceleration,
					new OcularStabilizationTracker(baseLookatNode,dofAligner),
					LookatMotionNode.LookStabilizationMode.POINT_AUTO,
					baseTrackPolicy,
					null,
					getTargetAdjuster(lookatNodeRuntimeConfigs["BaseLookatNode"]),
					getWindupPolicy(lookatNodeRuntimeConfigs["BaseLookatNode"]),
					getWorldTargetAdjuster(lookatNodeRuntimeConfigs["BaseLookatNode"]))
			);
			lookatMotionNodes.push(
				new LookatMotionNode(torsoLookatNode, dofAligner,
					lookatNodeRuntimeConfigs["TorsoLookatNode"].acceleration,
					new DiskStabilizationTracker(torsoLookatNode,dofAligner,["bottomSection_r"]),
					LookatMotionNode.LookStabilizationMode.UNTARGETED,
					torsoTrackPolicy,
					null,
					getTargetAdjuster(lookatNodeRuntimeConfigs["TorsoLookatNode"]),
					getWindupPolicy(lookatNodeRuntimeConfigs["TorsoLookatNode"]),
					getWorldTargetAdjuster(lookatNodeRuntimeConfigs["TorsoLookatNode"]))
			);
		}

		const topTrackPolicy = getTrackPolicy(lookatNodeRuntimeConfigs["TopLookatNode"], ancestorTrackPolicies);
		ancestorTrackPolicies.push(topTrackPolicy);

		lookatMotionNodes.push(
			new LookatMotionNode(topLookatNode, dofAligner,
				lookatNodeRuntimeConfigs["TopLookatNode"].acceleration,
				new OcularStabilizationTracker(topLookatNode,dofAligner),
				LookatMotionNode.LookStabilizationMode.POINT_AUTO,
				topTrackPolicy,
				null,
				getTargetAdjuster(lookatNodeRuntimeConfigs["TopLookatNode"]),
				getWindupPolicy(lookatNodeRuntimeConfigs["TopLookatNode"]),
				getWorldTargetAdjuster(lookatNodeRuntimeConfigs["TopLookatNode"]))
		);

		const eyeTrackPolicy = getTrackPolicy(lookatNodeRuntimeConfigs["Eye"], ancestorTrackPolicies);
		ancestorTrackPolicies.push(eyeTrackPolicy);

		lookatMotionNodes.push(
			new LookatMotionNode(eyeLookatNode, dofAligner,
				lookatNodeRuntimeConfigs["Eye"].acceleration,
				new OcularStabilizationTracker(eyeLookatNode,dofAligner),
				LookatMotionNode.LookStabilizationMode.POINT_TARGET,
				eyeTrackPolicy,
				getBlinkManager(blinkDelegate, lookatNodeRuntimeConfigs["Eye"]),
				getTargetAdjuster(lookatNodeRuntimeConfigs["Eye"]),
				getWindupPolicy(lookatNodeRuntimeConfigs["Eye"]),
				getWorldTargetAdjuster(lookatNodeRuntimeConfigs["Eye"]))
		);

		return new MotionLookat(lookatMotionNodes, kinematicGroupProto);
	};

	let shouldOrientFully = true;
	let continuous = false;

	/** @type {Object<LookatEventType,LookatEventCallback[]>} */
	const eventHandlers = {};


	//using the params structure to get list of all dofs for a full, unconstrained lookat
	//we used to use lookat.getDOFs(), which is ground truth, but we don't want to init MotionLookat yet.
	//this will be the same as long as lookatDOFRuntimeConfigs is kept up to date with dofs used
	//by the lookat, which is required in other init stages anyway.
	/** @type {string[]} */
	const allDOFsFullLookat = Object.keys(lookatDOFRuntimeConfigs);

	/** @type {Pose} */
	let lookPose = new Pose("LookPose", allDOFsFullLookat);

	/** @type {MotionLookat} */
	this.motionLookat = null;

	/**
	 * @param {THREE.Vector3} target
	 * @param {MotionLookat} lookat
	 * @constructor
	 * @private
	 */
	const LookatInstance = function(target, lookat, multiTargetStatus){
		target = target.clone(); //make sure we have a cached copy
		/** @type {LookatMotionGenerator} */
		let mainLayerClip = null;
		/** @type {LookatMotionGenerator} */
		let lookatLayerClip = null;
		/** @type {LookatMultiLayerStatusManager} */
		const statusManager = multiTargetStatus;

		this.getTarget = function(){
			return target;
		};

		/**
		 * @param {THREE.Vector3|number[]} newTarget
		 */
		this.updateTarget = function(newTarget)
		{
			if(Array.isArray(newTarget)){
				target.set(newTarget[0], newTarget[1], newTarget[2]);
			}else{
				target.copy(newTarget);
			}
			statusManager.setTarget(target);
		};

		this.getBuilder = function(){
			return self;
		};

		this.getName = function(){
			return "lookat instance";
		};

		this.setClip = function(useMainClip, useLookatClip){
			mainLayerClip = useMainClip;
			lookatLayerClip = useLookatClip;
		};

		this.stop = function(){
			if (mainLayerClip)
			{
				stopClip(mainLayerClip, "default");
			}
			if (lookatLayerClip)
			{
				stopClip(lookatLayerClip, "lookat");
			}
		};

		/**
		 * @param {MotionGenerator} clip
		 * @param {string} layer
		 */
		const stopClip = function(clip, layer){
			/** @type {jibo.animate.Time} */
			const stopTime = timeline.getClock().currentTime();

			//if all clips are fully committed, we will not stop
			if(!clip.endsAfter(stopTime)){
				//stopTime is after clip is already over; cannot stop.  do nothing.
				slog.info("Ignoring stop on SingleLookat as it is already over");
				return;
			}

			//however we will not stop before any of the clips start!
			if(clip.getStartTime().isGreater(stopTime)){
				stopTime = clip.getStartTime();
				slog.info("Stopping called on lookat before it started, moving stopTime forward");
			}

			/** @type {string[]} */
			const dofsToStop = [];

			/** @type {number[]} */
			const possibleDOFs = clip.getDOFIndices();

			for(let i = 0; i < possibleDOFs.length; i++){
				if(clip.dofEndsAfter(possibleDOFs[i], stopTime)){
					dofsToStop.push(animUtils.dofIndicesToNames[possibleDOFs[i]]);
				}
			}

			//TODO: using zero-duration motion for now, might want to add explicit timeline stop() method

			/** @type {Pose} */
			const stopPose = new Pose("stop pose", dofsToStop);
			for(let d = 0; d < dofsToStop.length; d++){
				stopPose.set(dofsToStop[d], [0]);
			}

			/** @type {Motion} */
			const stopMotion = Motion.createFromPose(clip.getName()+"_stop", stopPose, 0);
			const stopClip = new SimpleMotionGenerator(animUtils, stopMotion, stopTime, robotInfo);
			timeline.add(stopClip, layer);
		};
	};

	/**
	 * We will keep the most recent status manager to see if we need to make a new MotionLookat
	 * (we don't if the last lookat is done or only using dofs that we are about to override)
	 * @type {LookatMultiLayerStatusManager}
	 */
	let mostRecentStatusManager = null;

	/**
	 * @param {THREE.Vector3|number[]} target
	 * @return {LookatInstance}
	 */
	this.startLookat = function(targetArg){
		let i;
		/** @type {THREE.Vector3} */
		let target = null;
		if(Array.isArray(targetArg)){
			target = new THREE.Vector3(targetArg[0], targetArg[1], targetArg[2]);
		}else{
			target = targetArg;
		}

		//var delay = (delayLookatStart !== undefined) ? delayLookatStart : 0;
		//var reactionTime = timeline.getReactionTime(animate.MODALITY_NAME, m);
		//var reactionTime = timeline.getReactionTime("MOTION", m);
		//delay = Math.max(delay, reactionTime);
		const startTime = timeline.getClock().currentTime();

		/** @type {boolean} */
		let mustInitLookat = false;
		if(self.motionLookat === null){
			//console.log("We will init lookat since it was null");
			mustInitLookat = true;
		}

		if(!mustInitLookat && mostRecentStatusManager !== null){
			const currentlyActiveDOFIndices = mostRecentStatusManager.getActiveDOFIndices(startTime);
			//if currentlyActiveDOFIndices has any DOFs NOT in our lookPose, we must make a new MotionLookat, because
			//we will not be fully overriding (removing) the existing instance, so we must let it continue unaffected
			//(if we do override all remaining dofs, we can re-use the MotionLookat)
			for(i = 0; i < currentlyActiveDOFIndices.length; i++){
				if(!lookPose.hasDOFIndex(currentlyActiveDOFIndices[i])){
					//we are missing an active dof!  need a new MotionLookat
					//console.log("We will init lookat since we are not overriding all joints, active:"+currentlyActiveDOFIndices+", ours:"+lookPose.getDOFIndices());
					mustInitLookat = true;
					break;
				}
			}
		}
		if(mustInitLookat === true){
			self.motionLookat = initLookat();
		}

		const lookat = self.motionLookat;

		let multiLayerLook = false;

		const lookatLayerPose = timeline.getCurrentState(["lookat"]).getPose();
		const defaultLayerDOFs = [];
		const lookatLayerDOFs = [];
		const allLookDOFs = lookPose.getDOFNames();
		for (i=0; i<allLookDOFs.length; i++)
		{
			if (lookatLayerPose.get(allLookDOFs[i]) !== null && multiLayerLook)
			{
				lookatLayerDOFs.push(allLookDOFs[i]);
			}
			else
			{
				defaultLayerDOFs.push(allLookDOFs[i]);
			}
		}

		const currentLayerState = timeline.getCurrentState(["default", "lookat"]);
		/** @type{Pose} */
		//var currentPose = timeline.getStateAtTime(animate.MODALITY_NAME, startTime);
		// transition from: the current "absolute" pose (combination of default and lookat layers)
		const currentPose = currentLayerState.getPose();
		/** @type{jibo.animate.Time} */
		const currentPoseTime = currentLayerState.getTime();

		/** @type {MotionGenerator} */
		let timelineClip = null;
		///** @type {BaseMotionGenerator} */
		//var lookatStaticLayerClip;

		/** @type {LookatMultiLayerStatusManager} */
		const layersStatusManager = new LookatMultiLayerStatusManager(animUtils, lookat, startTime, target, continuous, orientationStatusReporter);

		let preRender = false;

		if(preRender) {
			lookat.reset();
			//var startTime = Clock.currentTime();
			let time = startTime;
			const poses = [];
			const times = [];
			let remainingDistance = Number.MAX_VALUE;

			while (remainingDistance > 0.001) {
				slog(channel, "Creating lookat pose at time " + time.subtract(startTime) + " with remaining:" + remainingDistance);
				lookat.generatePose(currentPose, lookPose, target, time);
				remainingDistance = lookat.getDistanceRemaining();
				const p = new Pose("Pose " + time, lookPose.getDOFNames());
				p.setPose(lookPose);
				poses.push(p);
				times.push(time.subtract(startTime));
				currentPose.setPose(lookPose);
				time = time.add(1 / 30.0);
			}

			const lookRenderedMotion = Motion.createFromPoses("ToLook", poses, times, time.subtract(startTime));

			timelineClip = new SimpleMotionGenerator(animUtils, lookRenderedMotion, startTime, robotInfo);

			//if (lookatLayerDOFs.length > 0) {
			//	var preRenderedLookatStaticLayerMotion = Motion.createFromPose("lookat target static", poses[poses.length - 1], lookRenderedMotion.getDuration(), lookatLayerDOFs);
			//	lookatStaticLayerClip = new SimpleMotionGenerator(animUtils, preRenderedLookatStaticLayerMotion, startTime, robotInfo);
			//}
		}else{
			/////initialize the lookat with the current state///////
			lookat.reset();

			const fullSystemPose = timeline.getCurrentState().getPose();
			const initPose = fullSystemPose.getCopy();
			let dofName;

			for (i=0; i<lookatLayerDOFs.length; i++)
			{
				dofName = lookatLayerDOFs[i];
				if (shouldOrientFully)
				{
					initPose.set(dofName, currentPose.get(dofName)); // starting DOF value should be default + lookat layer
				}
				else
				{
					initPose.set(dofName, lookatLayerPose.get(dofName)); // starting DOF value should be lookat layer only
				}
				lookat.generatePoseIncremental(initPose, lookPose, target, currentPoseTime, initPose.getDOFIndexForName(dofName));
				initPose.set(dofName, fullSystemPose.get(dofName)); // reset DOF value to full system pose so children have correct current data
			}
			for (i=0; i<defaultLayerDOFs.length; i++)
			{
				dofName = defaultLayerDOFs[i];
				initPose.set(dofName, currentPose.get(dofName)); // starting DOF value should be default + lookat layer
				lookat.generatePoseIncremental(initPose, lookPose, target, currentPoseTime, initPose.getDOFIndexForName(dofName));
				initPose.set(dofName, fullSystemPose.get(dofName)); // reset DOF value to full system pose so children have correct current data
			}
			/////////////////      done init        ////////////////

			timelineClip = layersStatusManager.createGenerator(defaultLayerDOFs);


			//if (lookatLayerDOFs.length > 0) {
			//	lookat.getOptimalPose(currentPose, lookPose, target);
			//	var activeLookatStaticLayerMotion = Motion.createFromPose("lookat target static", lookPose, Number.MAX_VALUE, lookatLayerDOFs);
			//	lookatStaticLayerClip = new SimpleMotionGenerator(animUtils, activeLookatStaticLayerMotion, startTime, robotInfo);
			//}
		}

		/** @type {LookatInstance} */
		const lookatInstance = new LookatInstance(target, lookat, layersStatusManager);

		layersStatusManager.setHandlers(
			createStartedHandler(lookatInstance), createStoppedHandler(lookatInstance), createRemovedHandler(lookatInstance),
			createTargetReachedHandler(lookatInstance), createTargetSupersededHandler(lookatInstance)
		);

		// add the full lookat transition to the default layer
		timelineClip = timeline.add(timelineClip, "default");

		let lookLayerGenerator = null;
		if (lookatLayerDOFs.length > 0)
		{
			// add the static target lookat pose to the lookat layer, for future additive blending
			//timeline.add(lookatStaticLayerClip, "lookat");

			if (shouldOrientFully)
			{
				const zeroMotion = Motion.createFromPose("zero motion", robotInfo.getKinematicInfo().getDefaultPose().getCopy(), 1.0, lookatLayerDOFs);
				timeline.add(new SimpleMotionGenerator(animUtils, zeroMotion, startTime, robotInfo, lookatLayerDOFs), "default");
			}

			lookLayerGenerator = layersStatusManager.createGenerator(lookatLayerDOFs);
			timeline.add(lookLayerGenerator, "lookat");
		}

		lookatInstance.setClip(timelineClip, lookLayerGenerator);

		if (globalDelegate) {
			globalDelegate("ADDED", lookatInstance, {dofs: allLookDOFs});
		}

		mostRecentStatusManager = layersStatusManager;

		return lookatInstance;
	};

	/**
	 * Register an event listener
	 * @param {LookatEventType} eventName
	 * @param {LookatEventCallback} callback
	 */
	this.on = function(eventName, callback){
		/** @type {LookatEventCallback[]} */
		const handlersForType = eventHandlers[eventName];
		if(!handlersForType){
			handlersForType = [];
			eventHandlers[eventName] = handlersForType;
		}
		if(handlersForType.indexOf(callback)===-1){
			handlersForType.push(callback);
		}
	};

	/**
	 * Un-register an event listener
	 * @param {LookatEventType} eventName
	 * @param {LookatEventCallback} callback
	 */
	this.off = function(eventName, callback){
		/** @type {LookatEventCallback[]} */
		const handlersForType = eventHandlers[eventName];
		if(handlersForType){
			const index = handlersForType.indexOf(callback);
			if(index!==-1){
				handlersForType.splice(index, 1);
			}
		}
	};

	/**
	 * Set the DOFs to be used in the look-at/orient behavior.
	 *
	 * Commonly-used dof groups are defined in [animate.dofs]{@link jibo.animate.dofs}.
	 *
	 * @param {DOFSet|string[]} dofNames - names of dofs to use, null for all dofs.
	 */
	this.setDOFs = function(dofNames){
		if (!dofNames)
		{
			dofNames = allDOFsFullLookat;
		}
		else if (dofNames instanceof DOFSet)
		{
			dofNames = dofNames.getDOFs();
		}
		const validDOFs = allDOFsFullLookat;
		const newDOFs = [];
		for (let i=0; i<dofNames.length; i++)
		{
			if (validDOFs.indexOf(dofNames[i]) > -1)
			{
				newDOFs.push(dofNames[i]);
			}
		}
		lookPose = new Pose("LookPose", newDOFs);
	};

	/**
	 * @return {string[]}
	 */
	this.getDOFs = function(){
		return lookPose.getDOFNames().slice(0);
	};

	/**
	 * @param {boolean} orientFully
	 */
	this.setOrientFully = function(orientFully){
		shouldOrientFully = orientFully;
	};

	/**
	 * @param {boolean} isContinuous
	 */
	this.setContinuousMode = function(isContinuous){
		continuous = isContinuous;
	};

	/**
	 * @param {TransitionBuilder} transition
	 */
	this.setTransitionIn = function(newTransition){
		//TODO: cache for instances?
		transition = newTransition;
	};

	/**
	 * Get the setting for the overall structure of this lookat's IK.
	 * Set all config before first startLookat
	 * @return {LookatConfig}
	 */
	this.getLookatConfig = function(){
		return lookatConfig;
	};

	/**
	 * Set the setting for the overall structure of this lookat's IK.
	 * Set all config before first startLookat
	 * @param {LookatConfig} newLookatConfig
	 */
	this.setLookatConfig = function(newLookatConfig){
		lookatConfig = newLookatConfig;
	};

	/**
	 * Get the config for a single lookat node.  Returned object is not a copy (subsequent modifications will affect this builder) .
	 * Set all config before first startLookat
	 * @param {string} nodeName
	 * @return {LookatNodeRuntimeConfig}
	 */
	this.getLookatNodeConfig = function(nodeName){
		if(!lookatNodeRuntimeConfigs.hasOwnProperty(nodeName)){
			throw new Error("Cannot get config for unknown node: "+nodeName+" (valid nodes:"+Object.keys(lookatNodeRuntimeConfigs)+")");
		}else{
			return lookatNodeRuntimeConfigs[nodeName];
		}
	};

	/**
	 * Set the config for a single lookat node.  Object is not a copied (subsequent modifications will affect this builder).
	 * Set all config before first startLookat
	 * @param {string} nodeName
	 * @param {LookatNodeRuntimeConfig} config
	 */
	this.setLookatNodeConfig = function(nodeName, config){
		if(!lookatNodeRuntimeConfigs.hasOwnProperty(nodeName)){
			throw new Error("Cannot set config for unknown node: "+nodeName+" (valid nodes:"+Object.keys(lookatNodeRuntimeConfigs)+")");
		}else{
			lookatNodeRuntimeConfigs[nodeName] = config;
		}
	};

	/**
	 * Get the config for a single lookat dof.  Returned object is not a copy (subsequent modifications will affect this builder).
	 * Set all config before first startLookat
	 * @param {string} dofName
	 * @return {LookatDOFRuntimeConfig}
	 */
	this.getLookatDOFConfig = function(dofName){
		if(!lookatDOFRuntimeConfigs.hasOwnProperty(dofName)){
			throw new Error("Cannot get config for unknown DOF: "+dofName+" (valid DOFS:"+Object.keys(lookatDOFRuntimeConfigs)+")");
		}else{
			return lookatDOFRuntimeConfigs[dofName];
		}
	};

	/**
	 * Set the config for a single lookat dof.  Object is not a copied (subsequent modifications will affect this builder).
	 * Set all config before first startLookat
	 * @param {string} dofName
	 * @param {LookatDOFRuntimeConfig} config
	 */
	this.setLookatDOFConfig = function(dofName, config){
		if(!lookatDOFRuntimeConfigs.hasOwnProperty(dofName)){
			throw new Error("Cannot set config for unknown DOF: "+dofName+" (valid DOFS:"+Object.keys(lookatDOFRuntimeConfigs)+")");
		}else{
			lookatDOFRuntimeConfigs[dofName] = config;
		}
	};



	//var createImmediateSuccessHandler = function(lookatInstance){
	//	var hStarted = eventHandlers[LookatEventType.STARTED];
	//	var hStopped = eventHandlers[LookatEventType.STOPPED];
	//	var hTargetReached = eventHandlers[LookatEventType.TARGET_REACHED];
	//	if(hStarted || hStopped || hTargetReached){
	//		var startHandlers = null;
	//		var targetReachedHandlers = null;
	//		var stopHandlers = null;
	//		var i;
	//		if(hStarted) {
	//			startHandlers = hStarted.slice(0);
	//		}
	//		if(hStopped) {
	//			stopHandlers = hStopped.slice(0);
	//		}
	//		if(hTargetReached) {
	//			targetReachedHandlers = hTargetReached.slice(0);
	//		}
	//
	//		return function() {
	//			if(startHandlers){
	//				for(i = 0; i < startHandlers.length; i++){
	//					startHandlers[i](LookatEventType.STARTED, lookatInstance, {});
	//				}
	//			}
	//			if(targetReachedHandlers){
	//				for(i = 0; i < targetReachedHandlers.length; i++){
	//					targetReachedHandlers[i](LookatEventType.TARGET_REACHED, lookatInstance, {});
	//				}
	//			}
	//			if(stopHandlers){
	//				for(i = 0; i < stopHandlers.length; i++){
	//					stopHandlers[i](LookatEventType.STOPPED, lookatInstance, {});
	//				}
	//			}
	//		};
	//	}
	//};

	//map between timeline events and lookat events
	const createStartedHandler = function(lookatInstance){
		const h = eventHandlers[LookatEventType.STARTED];
		if(globalDelegate || h) {
			let startHandlers = null;
			if (h) {
				startHandlers = h.slice(0);
			}
			return function () {
				if (globalDelegate) {
					globalDelegate(LookatEventType.STARTED, lookatInstance, {});
				}
				if (startHandlers) {
					for (let i = 0; i < startHandlers.length; i++) {
						startHandlers[i](LookatEventType.STARTED, lookatInstance, {});
					}
				}
			};
		}else{
			return null;
		}
	};

	const createTargetReachedHandler = function(lookatInstance){
		const h = eventHandlers[LookatEventType.TARGET_REACHED];
		if(globalDelegate || h) {
			let reachedHandlers = null;
			if (h) {
				reachedHandlers = h.slice(0);
			}
			return function (target) {
				if (globalDelegate) {
					globalDelegate(LookatEventType.TARGET_REACHED, lookatInstance, {target:target});
				}
				if (reachedHandlers) {
					for (let i = 0; i < reachedHandlers.length; i++) {
						reachedHandlers[i](LookatEventType.TARGET_REACHED, lookatInstance, {target:target});
					}
				}
			};
		}else{
			return null;
		}
	};

	const createTargetSupersededHandler = function(lookatInstance){
		const h = eventHandlers[LookatEventType.TARGET_SUPERSEDED];
		if(globalDelegate || h) {
			let supersededHandlers = null;
			if (h) {
				supersededHandlers = h.slice(0);
			}
			return function (target) {
				if (globalDelegate) {
					globalDelegate(LookatEventType.TARGET_SUPERSEDED, lookatInstance, {target:target});
				}
				if (supersededHandlers) {
					for (let i = 0; i < supersededHandlers.length; i++) {
						supersededHandlers[i](LookatEventType.TARGET_SUPERSEDED, lookatInstance, {target:target});
					}
				}
			};
		}else{
			return null;
		}
	};

	//map between timeline events and lookat events
	const createStoppedHandler = function(lookatInstance){
		const hStopped = eventHandlers[LookatEventType.STOPPED];
		if(globalDelegate || hStopped) {
			let stopHandlers = null;
			if(hStopped) {
				stopHandlers = hStopped.slice(0);
			}
			return function (interrupted) { //for single shot lookat, we're interrupted if we didn't complete, just as an animation
				if (globalDelegate) {
					globalDelegate(LookatEventType.STOPPED, lookatInstance, {interrupted: interrupted});
				}
				if(stopHandlers){
					for (let i = 0; i < stopHandlers.length; i++) {
						stopHandlers[i](LookatEventType.STOPPED, lookatInstance, {interrupted: interrupted});
					}
				}
			};
		}else{
			return null;
		}
	};

	//map between timeline events and lookat events
	const createRemovedHandler = function(lookatInstance){
		const hStopped = eventHandlers[LookatEventType.STOPPED];
		const hCancelled = eventHandlers[LookatEventType.CANCELLED];
		if(globalDelegate || hStopped || hCancelled) {
			let stopHandlers = null;
			let cancelHandlers = null;
			if(hStopped){
				stopHandlers = hStopped.slice(0);
			}
			if(hCancelled){
				cancelHandlers = hCancelled.slice(0);
			}
			return function (started, stopped) {
				let i;
				if(globalDelegate) {
					if (started && !stopped) { //if a clip is removed after start and before stop, we'll send a stop (interrupted) to the listeners
						globalDelegate(LookatEventType.STOPPED, lookatInstance, {interrupted: true});
					}
					if (!started) { //if it never started, then we'll send a cancel.
						globalDelegate(LookatEventType.CANCELLED, lookatInstance, {});
					}
				}
				if(stopHandlers) {
					if (started && !stopped) { //if a clip is removed after start and before stop, we'll send a stop (interrupted) to the listeners
						for ( i = 0; i < stopHandlers.length; i++) {
							stopHandlers[i](LookatEventType.STOPPED, lookatInstance, {interrupted: true});
						}
					}
				}
				if(cancelHandlers) {
					if (!started) { //if it never started, then we'll send a cancel.
						for ( i = 0; i < stopHandlers.length; i++) {
							cancelHandlers[i](LookatEventType.CANCELLED, lookatInstance, {});
						}
					}
				}
			};
		}else{
			return null;
		}
	};


};


SingleLookatBuilder.LookatDOFGeometryConfig = LookatDOFGeometryConfig;

SingleLookatBuilder.LookatConfig = LookatConfig;




export default SingleLookatBuilder;
