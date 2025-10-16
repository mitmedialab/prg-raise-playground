/**
 * @param {Clock} clock
 * @private
 * @constructor
 */
const RendererOutput = function(clock)
{
	/** @type {Clock} */
	this.clock = clock;
	/** @type {JiboKinematicInfo} */
	this.kinematicInfo = null;
	/** @type {RobotRenderer[]} */
	this.renderers = [];
	/** @type {Time} */
	this.outputTime = null;
	/** @type {Pose} */
	this.outputPose = null;
};

/**
 * @param {JiboKinematicInfo} kinematicInfo
 */
RendererOutput.prototype.setKinematicInfo = function(kinematicInfo)
{
	this.kinematicInfo = kinematicInfo;
};

/**
 * @param {RobotRenderer} renderer
 */
RendererOutput.prototype.addRenderer = function(renderer)
{
	this.renderers.push(renderer);
};

/**
 * @param {RobotRenderer} renderer
 */
RendererOutput.prototype.removeRenderer = function(renderer)
{
	const rendererIndex = this.renderers.indexOf(renderer);
	if (rendererIndex > -1)
	{
		this.renderers.splice(rendererIndex, 1);
	}
};

/**
 * @return {RobotRenderer[]}
 */
RendererOutput.prototype.getRenderers = function()
{
	return this.renderers.slice(0);
};

/**
 * @param {Time} time
 * @param {Pose} pose
 * @param {Object} blackboard
 */
RendererOutput.prototype.handleOutput = function(time, pose, blackboard) // eslint-disable-line no-unused-vars
{
	this.outputTime = time;
	this.outputPose = pose;
};

RendererOutput.prototype.update = function()
{
	if (this.kinematicInfo !== null && this.outputPose !== null)
	{
		const pose = this.outputPose;

		const dofValues = {};
		const dofNames = pose.getDOFNames();
		for (let dofIndex=0; dofIndex<dofNames.length; dofIndex++)
		{
			const dofValue = pose.get(dofNames[dofIndex], 0);
			dofValues[dofNames[dofIndex]] = dofValue;
		}

		for (let r=0; r<this.renderers.length; r++)
		{
			this.renderers[r].display(dofValues);
		}
	}
};

RendererOutput.prototype.dispose = function()
{
	for (let i=0; i<this.renderers.length; i++)
	{
		this.renderers[i].dispose();
	}
	this.renderers = [];
	this.kinematicInfo = null;
	this.outputPose = null;
};

export default RendererOutput;