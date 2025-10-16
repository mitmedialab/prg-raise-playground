
"use strict";

// Import all required modules
import JiboConfig from "./geometry-info/JiboConfig.js";
import RobotInfo from "./geometry-info/RobotInfo.js";
import EyeKinematicsHelper from "./geometry-info/EyeKinematicsHelper.js";
import AnimateImpl from "./animation-animate/AnimateImpl.js";
import VisualizeImpl from "./animation-visualize/VisualizeImpl.js";
import TimelineBuilder from "./animation-macros/TimelineBuilder.js";

// Core modules
import FileTools from "./ifr-core/FileTools.js";
import Time from "./ifr-core/Time.js";
import Clock from "./ifr-core/Clock.js";
import SLog from "./ifr-core/SLog.js";

// Motion modules
import Pose from "./ifr-motion/base/Pose.js";

// Body modules
import MotionInterface from "./animation-body/MotionInterface.js";
import BodyVelocityOutput from "./animation-body/BodyVelocityOutput.js";
import BodyTrajectoryOutput from "./animation-body/BodyTrajectoryOutput.js";
import BodyPositionOutput from "./animation-body/BodyPositionOutput.js";
import BodyPosVelOutput from "./animation-body/BodyPosVelOutput.js";
import BodyPosVelComboOutput from "./animation-body/BodyPosVelComboOutput.js";
import MotionServiceOutput from "./animation-body/MotionServiceOutput.js";
import MotionLog from "./animation-body/MotionLog.js";
import LEDOutput from "./animation-body/LEDOutput.js";

// UI modules
import Bakery from "./ifr-core/Bakery.js";
import JSONBaker from "./ifr-core/JSONBaker.js";

// Proto modules
import SampleCombiner from "./animation-animate/timeline/SampleCombiner.js";
import RenderPlugin from "./animation-visualize/RenderPlugin.js";

// Graphics modules
import AnchoredTargetVisualizer from "./ifr-visualizer/AnchoredTargetVisualizer.js";
import GLTextOverlayPool from "./ifr-visualizer/GLTextOverlayPool.js";
import GLLinePool from "./ifr-visualizer/GLLinePool.js";
import GLSpherePool from "./ifr-visualizer/GLSpherePool.js";

// Additional modules
import AuxOutput from "./animation-animate/timeline/AuxOutput.js";
import MouseCoordinateWrangler from "./ifr-visualizer/MouseCoordinateWrangler.js";
import MouseTargetPositioner from "./ifr-visualizer/MouseTargetPositioner.js";
import TrajectoryControllerSim from "./ifr-motion/feedback/TrajectoryControllerSim.js";
import PosVelControllerSim from "./ifr-motion/feedback/PosVelControllerSim.js";

// Three.js
import THREE from "@jibo/three";

let animationUtilities;

if (typeof global !== 'undefined' && global._animationutilities_singleton) {
	animationUtilities = global._animationutilities_singleton;
} else {
	animationUtilities = {
		JiboConfig,
		RobotInfo,
		EyeKinematicsHelper,
		animate: AnimateImpl,
		visualize: VisualizeImpl,
		TimelineBuilder,
		
		// Core object
		core: {
			FileTools,
			Time,
			Clock,
			slog: SLog
		},
		
		// Top-level aliases (for backward compatibility)
		Time,
		Clock,
		slog: SLog,
		
		// Motion interface
		MotionInterface,
		
		// Motion object
		motion: {
			Pose
		},
		
		// Body object
		body: {
			BodyVelocityOutput,
			BodyTrajectoryOutput,
			BodyPositionOutput,
			BodyPosVelOutput,
			BodyPosVelComboOutput,
			MotionServiceOutput,
			MotionLog
		},
		
		// UI object
		ui: {
			Bakery,
			JSONBaker
		},
		
		// Base classes used for defining client subclasses
		protos: {
			SampleCombiner,
			RenderPlugin
		},
		
		// Classes to help with graphical display/interfaces
		graphics: {
			AnchoredTargetVisualizer,
			GLTextOverlayPool,
			GLLinePool,
			GLSpherePool
		},
		
		// Individual exports
		LEDOutput,
		AuxOutput,
		MouseCoordinateWrangler,
		MouseTargetPositioner,
		TrajectoryControllerSim,
		PosVelControllerSim,
		
		// Three.js (must use the same three instance when adding geometry)
		THREE
	};
	
	// Initialize default logging channels (same as before)
	animationUtilities.slog.setPrintChannels([
		"ERROR",
		"WARN",
		"ATTENTION",
		"BODY_INTERFACE",
		//"INFO",
		"ACCEL_PLANNER",
		"CALIBRATION",
		//"LOOKAT",
		"MODEL_LOADING",
		//"MOUSE_COORD_WRANGLER",
		"RENDER_PLUGIN"
		//"UI_TARGET"
	]);
	
	// Store as singleton for backward compatibility
	if (typeof global !== 'undefined') {
		global._animationutilities_singleton = animationUtilities;
	}
}

// Export the complete animation utilities object
export default animationUtilities;

// Named exports for more flexible importing
export {
	JiboConfig,
	RobotInfo,
	EyeKinematicsHelper,
	AnimateImpl as animate,
	VisualizeImpl as visualize,
	TimelineBuilder,
	FileTools,
	Time,
	Clock,
	SLog as slog,
	Pose,
	MotionInterface,
	LEDOutput,
	AuxOutput,
	THREE
};
