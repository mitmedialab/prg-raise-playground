export default RendererOutput;
declare class RendererOutput {
    private constructor();
    /**
     * @param {JiboKinematicInfo} kinematicInfo
     */
    setKinematicInfo(kinematicInfo: JiboKinematicInfo): void;
    kinematicInfo: any;
    /**
     * @param {RobotRenderer} renderer
     */
    addRenderer(renderer: RobotRenderer): void;
    /**
     * @param {RobotRenderer} renderer
     */
    removeRenderer(renderer: RobotRenderer): void;
    /**
     * @return {RobotRenderer[]}
     */
    getRenderers(): RobotRenderer[];
    /**
     * @param {Time} time
     * @param {Pose} pose
     * @param {Object} blackboard
     */
    handleOutput(time: Time, pose: Pose, blackboard: any): void;
    outputTime: Time;
    outputPose: any;
    update(): void;
    dispose(): void;
    renderers: any[];
}
