import animate from "../animation-animate/AnimateImpl.js";
import MotionTimeline from "../animation-animate/timeline/MotionTimeline.js";
import SimpleLayerCombiner from "../animation-animate/timeline/SimpleLayerCombiner.js";
import ScaleSampleCombiner from "../animation-animate/timeline/ScaleSampleCombiner.js";
import AddSampleCombiner from "../animation-animate/timeline/AddSampleCombiner.js";
import MixedSampleCombiner from "../animation-animate/timeline/MixedSampleCombiner.js";
import RendererOutput from "../animation-visualize/RendererOutput.js";
import Clock from "../ifr-core/Clock.js";
import TimerTools from "../ifr-core/TimerTools.js";

/** @type {MotionTimeline[]} */
const timelineList = [];
/** @type {Array} */
const updateHandleList = [];

/**
 * @param {MotionTimeline} timeline
 * @param {number} updateIntervalMillis
 * @param {Object[]} updateList
 */
const createUpdateLoop = function(timeline, updateIntervalMillis, updateList)
{
	const updateHandle = TimerTools.setInterval(function()
	{
		for (let i=0; i<updateList.length; i++)
		{
			updateList[i].update();
		}
	}, updateIntervalMillis);
	timelineList.push(timeline);
	updateHandleList.push(updateHandle);
};

/**
 * @param {MotionTimeline} timeline
 */
const disposeUpdateLoop = function(timeline)
{
	const timelineIndex = timelineList.indexOf(timeline);
	if (timelineIndex > -1)
	{
		TimerTools.clearInterval(updateHandleList[timelineIndex]);
		timelineList.splice(timelineIndex, 1);
		updateHandleList.splice(timelineIndex, 1);
	}
};

const TimelineBuilder = {

	/**
	 * @param {RobotInfo} robotInfo - kinematics/config info
	 * @param cb - callback to receive the newly-created Timeline instance
	 * @param {number} [updateIntervalMillis] - timeline will auto-update with the given delay
	 * @param {*} [useTimer] - expected to support setInterval, and have setInterval return an object that supports .stop()
	 *
	 * @return {MotionTimeline} the newly-created Timeline instance
	 */
	createTimeline: function(robotInfo, cb, updateIntervalMillis, useTimer)
	{
		if(useTimer !== undefined){
			TimerTools.setInterval = function(callback, intervalTimeMillis){
				return useTimer.setInterval(callback, intervalTimeMillis, false);
			};
		}

		updateIntervalMillis = (updateIntervalMillis !== undefined) ? updateIntervalMillis : 20;

		// create motion timeline
		const layerCombiner = new SimpleLayerCombiner(robotInfo);
		const motionTimeline = new MotionTimeline("Motion Timeline", robotInfo, Clock, layerCombiner, animate.MODALITY_NAME);

		// configure default layer
		motionTimeline.createLayer("default");
		layerCombiner.addSampleCombiner("default", null);

		// configure lookat layer
		motionTimeline.createLayer("lookat", [robotInfo.getDOFSet("BODY").getDOFs()[0]]);
		layerCombiner.addSampleCombiner("lookat", new AddSampleCombiner());

		// configure additive posture layer
		motionTimeline.createLayer("posture", robotInfo.getDOFSet("BODY").plus("EYE_ROOT").plus("OVERLAY_ROOT").getDOFs());
		layerCombiner.addSampleCombiner("posture", new AddSampleCombiner());

		// configure additive beat layer
		const additiveDOFSet = robotInfo.getDOFSet("BODY").plus("EYE_ROOT").plus("OVERLAY_ROOT");
		const deformerDOFSet = robotInfo.getDOFSet("EYE_DEFORM").plus("OVERLAY_DEFORM").plus("EYE_COLOR");
		motionTimeline.createLayer("beat", additiveDOFSet.plus(deformerDOFSet).getDOFs());
		const beatCombiner = new MixedSampleCombiner(robotInfo);
		beatCombiner.addCombiner(additiveDOFSet.getDOFs(), new AddSampleCombiner());
		const scaleCombiner = new ScaleSampleCombiner(robotInfo, robotInfo.getKinematicInfo().getDefaultPose().getCopy(), null, deformerDOFSet.getDOFs());
		beatCombiner.addCombiner(deformerDOFSet.getDOFs(), scaleCombiner);
		layerCombiner.addSampleCombiner("beat", beatCombiner);

		// configure blink layer
		const blinkDOFs = robotInfo.getDOFSet("EYE_DEFORM").getDOFs();
		motionTimeline.createLayer("blink", blinkDOFs);
		const blinkCombiner = new ScaleSampleCombiner(robotInfo, robotInfo.getKinematicInfo().getDefaultPose().getCopy(), null, blinkDOFs);
		layerCombiner.addSampleCombiner("blink", blinkCombiner);

		// add renderer output
		const rendererOutput = new RendererOutput(Clock);
		rendererOutput.setKinematicInfo(robotInfo.getKinematicInfo());
		motionTimeline.addOutput(rendererOutput);

		// create the update loop
		const updateList = [motionTimeline, rendererOutput];
		createUpdateLoop(motionTimeline, updateIntervalMillis, updateList);

		if (cb)
		{
			cb(motionTimeline);
		}

		return motionTimeline;
	},

	/**
	 * connect a WebGL renderer to the timeline
	 * @param {MotionTimeline} timeline
	 * @param {RobotRenderer} renderer
	 */
	connectRenderer: function(timeline, renderer)
	{
		const outputs = timeline.getOutputs();
		for (let i=0; i<outputs.length; i++)
		{
			if (outputs[i] instanceof RendererOutput)
			{
				outputs[i].addRenderer(renderer);
				break;
			}
		}
	},

	/**
	 * disconnect a WebGL renderer from the timeline
	 * @param {MotionTimeline} timeline
	 * @param {RobotRenderer} renderer
	 */
	disconnectRenderer: function(timeline, renderer)
	{
		const outputs = timeline.getOutputs();
		for (let i=0; i<outputs.length; i++)
		{
			if (outputs[i] instanceof RendererOutput)
			{
				outputs[i].removeRenderer(renderer);
				break;
			}
		}
	},

	/**
	 * dispose the timeline and stop all timeline-related computation.
	 * optionally, dispose of all timeline outputs as well.
	 * @param {MotionTimeline} timeline
	 * @param {boolean} disposeOutputs - if true, dispose of all installed timeline outputs
	 */
	disposeTimeline: function(timeline, disposeOutputs)
	{
		disposeUpdateLoop(timeline);

		if (disposeOutputs === true)
		{
			const outputs = timeline.getOutputs();
			for (let i=0; i<outputs.length; i++)
			{
				if (outputs[i].dispose !== undefined)
				{
					outputs[i].dispose();
				}
			}
		}
	}

};

export default TimelineBuilder;
