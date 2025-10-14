export default RobotInfo;
export type RobotInfoCreated = (robotInfo: RobotInfo) => any;
declare class RobotInfo {
    protected constructor();
    private getKinematicInfo;
    private getConfig;
    /**
     * Returns the names of all of the DOFs in the robot's body.
     * @method jibo.animate.RobotInfo#getBodyDOFNames
     * @return {string[]}
     */
    getBodyDOFNames(): string[];
    /**
     * Returns the names of all of the DOFs in the robot's eye/face.
     * @method jibo.animate.RobotInfo#getEyeDOFNames
     * @return {string[]}
     */
    getEyeDOFNames(): string[];
    /**
     * Returns the full set of DOF names for the robot.
     * @method jibo.animate.RobotInfo#getDOFNames
     * @return {string[]}
     */
    getDOFNames(): string[];
    private getEyeScreenInfo;
    /**
     * Returns a DOFInfo report for the specified DOF.
     * @method jibo.animate.RobotInfo#getDOFInfo
     * @param {string} dofName DOF to return a DOFInfo report for.
     * @return {jibo.animate.DOFInfo}
     */
    getDOFInfo(dofName: string): jibo.animate.DOFInfo;
    /**
     * Returns a map with the default values for all of the robot's DOFs.
     * @method jibo.animate.RobotInfo#getDefaultDOFValues
     * @return {Object.<string, Object>}
     */
    getDefaultDOFValues(): {
        [x: string]: any;
    };
    /**
     * Returns the full set of DOFSet names for the robot.
     * @method jibo.animate.RobotInfo#getDOFSetNames
     * @return {string[]} Names of DOFSets.
     */
    getDOFSetNames(): string[];
    /**
     * Returns the DOFSet specified by the given name.
     * @method jibo.animate.RobotInfo#getDOFSet
     * @param {string} dofSetName - Name of DOFSet to get.
     * @return {jibo.animate.DOFSet} DOFSet or null if not found.
     */
    getDOFSet(dofSetName: string): jibo.animate.DOFSet;
}
