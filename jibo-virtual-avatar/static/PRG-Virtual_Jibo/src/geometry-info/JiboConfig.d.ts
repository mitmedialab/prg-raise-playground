export default JiboConfig;
/**
 * @param {string} [baseGeometryURL] - base geometry config directory
 * @param {string} [robotVersion] - robot version identifier
 * @constructor
 */
declare function JiboConfig(baseGeometryURL?: string, robotVersion?: string): void;
declare class JiboConfig {
    constructor(baseGeometryURL?: string, robotVersion?: string);
    /**
     * @return {string}
     */
    getRobotURL: () => string;
    /**
     * @return {string}
     */
    getBodyGeometryURL: () => string;
    /**
     * @return {string}
     */
    getBodySkeletonURL: () => string;
    /**
     * @return {string}
     */
    getBodyKinematicsURL: () => string;
    /**
     * @return {string}
     */
    getFullGeometryURL: () => string;
    /**
     * @return {string}
     */
    getFullSkeletonURL: () => string;
    /**
     * @return {string}
     */
    getFullKinematicsURL: () => string;
    /**
     * @return {string}
     */
    getEyeGeometryURL: () => string;
    /**
     * @return {string}
     */
    getEyeSkeletonURL: () => string;
    /**
     * @return {string}
     */
    getEyeKinematicsURL: () => string;
    /**
     * @return {string}
     */
    getSceneInfoURL: () => string;
    /**
     * @return {string}
     */
    getDOFGroupsURL: () => string;
    /**
     * @return {string}
     */
    getLimitsURL: () => string;
    /**
     * @return {string}
     */
    getDefaultNormalMap: () => string;
}
